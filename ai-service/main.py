import time
import json
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

# --- Vector DB & Embeddings ---
import chromadb
from sentence_transformers import SentenceTransformer

# --- Groq AI (Llama 3) ---
from groq import Groq

# ==========================================
# 1. INITIALIZATION & CONFIGURATION
# ==========================================
print("🚀 Initializing Unideas AI Engine (Groq Llama-3 Edition)...")

app = FastAPI(title="Unideas AI Services", version="4.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ⚠️ ĐIỀN API KEY CỦA GROQ VÀO ĐÂY (BẮT ĐẦU BẰNG gsk_...)
GROQ_API_KEY = "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".strip()

# Khởi tạo Groq Client
groq_client = Groq(api_key=GROQ_API_KEY)
AI_MODEL = "llama-3.3-70b-versatile"

print("Loading ChromaDB Vector Store...")
chroma_client = chromadb.PersistentClient(path="./chroma_db")
vector_collection = chroma_client.get_or_create_collection(name="unideas_collection")

print("Loading Multilingual Embedding Model (SentenceTransformers)...")
embedding_model = SentenceTransformer('sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2')

# ==========================================
# 2. DATA MODELS (DTOs)
# ==========================================
class TextPayload(BaseModel):
    content: str

class IdeaPayload(BaseModel):
    idea_id: str
    content: str
    category: str

# ==========================================
# 3. CORE AI ENDPOINTS
# ==========================================

# ---------------------------------------------------------
# LAYER 1: TOXICITY MODERATION (Powered by Groq Llama-3)
# ---------------------------------------------------------
@app.post("/api/v1/moderate")
def check_toxicity(data: TextPayload):
    start_time = time.time()
    try:
        mod_prompt = f"""You are a university content moderator. 
Task: Classify the following text as 'Toxic' or 'Safe'.
Rules:
- Complaints about facilities, wifi, internet, sockets, or university services are strictly 'Safe'.
- Constructive criticism and negative feedback are 'Safe'.
- Only profanity, slurs, racism, personal attacks, and hate speech are 'Toxic'.

Text: '{data.content}'
Output EXACTLY ONE WORD (Safe or Toxic). Do not output any other text."""
        
        chat_completion = groq_client.chat.completions.create(
            messages=[{"role": "user", "content": mod_prompt}],
            model=AI_MODEL,
            temperature=0, # Set to 0 for maximum strictness/logic
            max_tokens=5
        )
        
        verdict = chat_completion.choices[0].message.content.strip().lower()
        processing_time_ms = round((time.time() - start_time) * 1000, 2)

        if "toxic" in verdict:
            return {
                "status": "rejected", 
                "score": 0.99,
                "reason": "Content violates community guidelines.",
                "processing_time_ms": processing_time_ms
            }
            
        return {"status": "approved", "score": 0.01, "processing_time_ms": processing_time_ms}
        
    except Exception as e:
        print(f"Moderation Error: {str(e)}")
        return {"status": "approved", "score": 0.0, "processing_time_ms": 0.0, "error": str(e)}

# ---------------------------------------------------------
# LAYER 2: SEMANTIC DUPLICATE DETECTION 
# ---------------------------------------------------------
DUPLICATE_THRESHOLD = 0.78 

@app.post("/api/v1/ai/check-duplicate")
def check_duplicate(data: TextPayload):
    start_time = time.time()
    try:
        if vector_collection.count() == 0:
            return {"is_duplicate": False, "highest_similarity_score": 0.0}

        query_embedding = embedding_model.encode(data.content).tolist()
        results = vector_collection.query(query_embeddings=[query_embedding], n_results=1)
        
        if not results['distances'] or not results['distances'][0]:
            return {"is_duplicate": False, "highest_similarity_score": 0.0}

        distance = results['distances'][0][0]
        similarity_score = 1.0 - distance
        is_dup = bool(similarity_score > DUPLICATE_THRESHOLD)
        most_similar_idea = results['documents'][0][0] if is_dup else ""
        processing_time_ms = round((time.time() - start_time) * 1000, 2)

        return {
            "is_duplicate": is_dup,
            "highest_similarity_score": round(similarity_score, 4),
            "most_similar_idea": most_similar_idea,
            "processing_time_ms": processing_time_ms
        }
    except Exception as e:
        print(f"Duplicate Check Error: {str(e)}")
        return {"is_duplicate": False, "highest_similarity_score": 0.0}

# ---------------------------------------------------------
# LAYER 3: OUT-OF-DISTRIBUTION (OOD) DETECTION
# ---------------------------------------------------------
OOD_THRESHOLD = 0. 

UNIVERSITY_ANCHORS = [
    "academic curriculum, exams, grades, learning materials",
    "campus facilities, buildings, parking, canteen, classrooms",
    "IT infrastructure, wifi, computers, software, network",
    "student mental health, well-being, psychology, counseling",
    "extracurricular activities, clubs, sports, student events",
    "industry collaboration, internships, career, jobs, unemployment",
    "sustainability, green campus, environment"
]
anchor_embeddings = embedding_model.encode(UNIVERSITY_ANCHORS)

@app.post("/api/v1/ai/check-ood")
def check_ood(data: TextPayload):
    start_time = time.time()
    try:
        input_embedding = embedding_model.encode(data.content)
        similarities = embedding_model.similarity(input_embedding, anchor_embeddings)[0]
        max_similarity = float(max(similarities))
        is_ood = bool(max_similarity < OOD_THRESHOLD)
        processing_time_ms = round((time.time() - start_time) * 1000, 2)

        return {
            "is_out_of_distribution": is_ood,
            "domain_relevance_score": round(max_similarity, 4),
            "reason": "Irrelevant context detected." if is_ood else "Relevant context.",
            "processing_time_ms": processing_time_ms
        }
    except Exception as e:
        print(f"OOD Check Error: {str(e)}")
        return {"is_out_of_distribution": False, "domain_relevance_score": 1.0}

# ---------------------------------------------------------
# LAYER 4: EXPLAINABLE AUTO-CATEGORIZATION (Groq JSON Mode)
# ---------------------------------------------------------
ALLOWED_CATEGORIES = "Student Support Services, Mental Health & Wellbeing, Library & Learning Resources, Industry Collaboration, Other Suggestions, Curriculum Enhancement, Extracurricular Activities, Campus Facilities, IT Infrastructure"

@app.post("/api/v1/ai/categorize")
def auto_categorize(data: TextPayload):
    start_time = time.time()
    try:
        cat_prompt = f"""You are an expert university administrator. Classify the following idea into EXACTLY ONE of these categories: [{ALLOWED_CATEGORIES}].

MAPPING RULES:
- Jobs, career, unemployment, companies, internships -> Industry Collaboration
- Stress, psychology, burnout, therapy, emotional issues -> Mental Health & Wellbeing
- Generic student help, advice, administration -> Student Support Services
- Books, studying spaces, research materials -> Library & Learning Resources
- Courses, subjects, teaching quality, exams -> Curriculum Enhancement
- Clubs, sports, student events -> Extracurricular Activities
- Buildings, parking, food, physical spaces, sockets -> Campus Facilities
- Wifi, computers, software, network -> IT Infrastructure

Idea: '{data.content}'

You MUST respond in valid JSON format with exactly two keys:
"assigned_category": (The exact English name from the list above),
"ai_explanation": (A short, professional English sentence explaining the logical connection between the idea and the chosen department. Do not simply repeat the idea.)."""

        # Groq hỗ trợ Response Format JSON cực mạnh
        chat_completion = groq_client.chat.completions.create(
            messages=[{"role": "user", "content": cat_prompt}],
            model=AI_MODEL,
            temperature=0,
            response_format={"type": "json_object"}
        )
        
        result_json = json.loads(chat_completion.choices[0].message.content)
        
        predicted_category = result_json.get("assigned_category", "Other Suggestions")
        explanation = result_json.get("ai_explanation", "Analyzed by Llama-3 AI.")
        
        valid_categories = [c.strip().lower() for c in ALLOWED_CATEGORIES.split(",")]
        if not any(cat in predicted_category.lower() for cat in valid_categories):
            predicted_category = "Other Suggestions"

        processing_time_ms = round((time.time() - start_time) * 1000, 2)

        return {
            "assigned_category": predicted_category,
            "ai_explanation": explanation,
            "processing_time_ms": processing_time_ms
        }
    except Exception as e:
        print(f"Categorization Error: {str(e)}")
        raise HTTPException(status_code=503, detail=f"AI Service unavailable: {str(e)}")

# ---------------------------------------------------------
# UTILITY: STORE VECTOR 
# ---------------------------------------------------------
@app.post("/api/v1/ai/ideas")
def store_idea_vector(idea: IdeaPayload):
    try:
        embedding = embedding_model.encode(idea.content).tolist()
        vector_collection.add(
            ids=[str(idea.idea_id)],
            embeddings=[embedding],
            documents=[idea.content],
            metadatas=[{"category": idea.category}]
        )
        return {"message": f"Successfully indexed Idea {idea.idea_id} into VectorDB."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    print("\n✅ SYSTEM READY! Groq Llama-3 Microservice is online.")
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)