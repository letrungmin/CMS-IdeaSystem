from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer, util
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
import chromadb
import time
import os
import torch

# Initialize FastAPI Application
app = FastAPI(
    title="CMS Idea AI Engine (RAG, XAI & OOD Architecture)",
    description="Vector DB Semantic Search, Explainable AI, and Out-of-Distribution Detection.",
    version="4.0.0"
)

print("Initializing AI Engine, Vector Database, and LLM...")

# Automatically use Metal Performance Shaders (MPS) on Apple Silicon, fallback to CPU
device_str = "mps" if torch.backends.mps.is_available() else "cpu"

# 1. Setup Encoding Model for RAG & OOD
model = SentenceTransformer('all-MiniLM-L6-v2', device=device_str)

# --- OOD DOMAIN ANCHORS INITIALIZATION ---
print("Encoding OOD Domain Anchors...")
DOMAIN_ANCHORS = [
    "university campus facilities, classrooms, and buildings",
    "student academic curriculum, exams, and educational courses",
    "information technology infrastructure, library wifi, and software",
    "student services, psychological counseling, health, and wellbeing",
    "university administration, campus events, and school policies"
]
# Pre-compute anchor embeddings at startup for lightning-fast OOD checks
anchor_embeddings = model.encode(DOMAIN_ANCHORS, convert_to_tensor=True)

# 2. Setup Generative LLM explicitly for XAI
print("Loading Generative LLM (Google Flan-T5-Base)...")
tokenizer = AutoTokenizer.from_pretrained("google/flan-t5-base")
llm_model = AutoModelForSeq2SeqLM.from_pretrained("google/flan-t5-base").to(device_str)

# 3. Setup Vector Database (ChromaDB)
db_path = os.path.join(os.getcwd(), "vector_store")
chroma_client = chromadb.PersistentClient(path=db_path)

collection = chroma_client.get_or_create_collection(
    name="cms_ideas",
    metadata={"hnsw:space": "cosine"}
)

print(f"System Ready! Running on: {device_str.upper()}")

# --- DATA MODELS ---
class IdeaPayload(BaseModel):
    idea_id: str
    content: str
    category: str = "general"

class TextPayload(BaseModel):
    content: str

# --- API ENDPOINTS ---

@app.get("/")
def health_check():
    """Health check endpoint to verify system status."""
    return {
        "status": "online",
        "engine": "FastAPI + ChromaDB + SentenceTransformers + Flan-T5",
        "device": device_str
    }

@app.post("/api/v1/ai/ideas")
def store_idea_in_vector_db(data: IdeaPayload):
    """Vectorizes a new idea and stores it permanently in ChromaDB."""
    try:
        embedding = model.encode(data.content).tolist()
        collection.add(
            embeddings=[embedding],
            documents=[data.content],
            metadatas=[{"category": data.category}],
            ids=[data.idea_id]
        )
        return {"status": "success", "message": f"Idea {data.idea_id} successfully stored."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to store idea: {str(e)}")

@app.post("/api/v1/ai/check-duplicate")
def check_semantic_duplicate(data: TextPayload):
    """RAG Search: Queries the VectorDB to find the most semantically similar existing idea."""
    start_time = time.time()
    if collection.count() == 0:
        return {"is_duplicate": False, "highest_similarity_score": 0.0, "message": "Database is empty."}

    try:
        query_embedding = model.encode(data.content).tolist()
        results = collection.query(
            query_embeddings=[query_embedding],
            n_results=1,
            include=["documents", "distances", "metadatas"]
        )
        
        processing_time_ms = round((time.time() - start_time) * 1000, 2)
        distance = results["distances"][0][0]
        similarity_score = 1 - distance
        
        SIMILARITY_THRESHOLD = 0.60
        is_duplicate = similarity_score >= SIMILARITY_THRESHOLD
        
        return {
            "is_duplicate": is_duplicate,
            "highest_similarity_score": round(similarity_score, 4),
            "most_similar_idea": results["documents"][0][0],
            "matched_idea_id": results["ids"][0][0],
            "processing_time_ms": processing_time_ms
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Search Error: {str(e)}")

@app.post("/api/v1/ai/check-ood")
def detect_out_of_distribution(data: TextPayload):
    """
    OOD Detection: Calculates semantic distance between the input and core university domains.
    Flags inputs that are completely unrelated to university contexts (Spam/Trolls).
    """
    start_time = time.time()
    try:
        # Encode the incoming text
        query_embedding = model.encode(data.content, convert_to_tensor=True)
        
        # Calculate cosine similarity against all domain anchors
        cosine_scores = util.cos_sim(query_embedding, anchor_embeddings)[0]
        
        # Get the highest similarity score to ANY valid university domain
        max_relevance_score = cosine_scores.max().item()
        
        # Threshold for Out-of-Distribution (Usually between 0.20 and 0.30)
        OOD_THRESHOLD = 0.25
        is_ood = max_relevance_score < OOD_THRESHOLD
        
        processing_time_ms = round((time.time() - start_time) * 1000, 2)
        
        reason = "Input is completely unrelated to university domains." if is_ood else "Input aligns with university context."
        
        return {
            "is_out_of_distribution": is_ood,
            "domain_relevance_score": round(max_relevance_score, 4),
            "threshold": OOD_THRESHOLD,
            "reason": reason,
            "processing_time_ms": processing_time_ms
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"OOD Detection Error: {str(e)}")

@app.post("/api/v1/ai/categorize")
def explainable_auto_categorization(data: TextPayload):
    """XAI Endpoint: Automatically categorizes an idea and provides a logical explanation."""
    start_time = time.time()
    allowed_categories = "IT Infrastructure, Campus Facilities, Curriculum Enhancement, Student Services"
    
    try:
        cat_prompt = f"Classify the following university idea into exactly one of these categories: {allowed_categories}.\n\nIdea: {data.content}\n\nCategory:"
        cat_inputs = tokenizer(cat_prompt, return_tensors="pt").to(device_str)
        cat_outputs = llm_model.generate(**cat_inputs, max_new_tokens=15)
        predicted_category = tokenizer.decode(cat_outputs[0], skip_special_tokens=True).strip()
        
        valid_categories = [c.strip().lower() for c in allowed_categories.split(",")]
        if not any(cat in predicted_category.lower() for cat in valid_categories):
            predicted_category = "General / Uncategorized"

        exp_prompt = f"Briefly explain why the idea '{data.content}' is classified as '{predicted_category}'."
        exp_inputs = tokenizer(exp_prompt, return_tensors="pt").to(device_str)
        exp_outputs = llm_model.generate(**exp_inputs, max_new_tokens=60)
        explanation = tokenizer.decode(exp_outputs[0], skip_special_tokens=True).strip()

        processing_time_ms = round((time.time() - start_time) * 1000, 2)

        return {
            "assigned_category": predicted_category,
            "ai_explanation": explanation,
            "processing_time_ms": processing_time_ms
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Categorization Error: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)