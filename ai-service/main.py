from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
import chromadb
import time
import os
import torch

# Initialize FastAPI Application
app = FastAPI(
    title="CMS Idea AI Engine (RAG & XAI Architecture)",
    description="Vector DB Semantic Search and Explainable Auto-Categorization.",
    version="3.0.0"
)

print("Initializing AI Engine, Vector Database, and LLM...")

# Automatically use Metal Performance Shaders (MPS) on Apple Silicon, fallback to CPU
device_str = "mps" if torch.backends.mps.is_available() else "cpu"

# 1. Setup Encoding Model for RAG
model = SentenceTransformer('all-MiniLM-L6-v2', device=device_str)

# 2. Setup Generative LLM explicitly (Bypassing pipeline wrapper issues)
print("Loading Generative LLM (Google Flan-T5-Base). This might take a moment...")
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

class CheckPayload(BaseModel):
    content: str

class CategorizePayload(BaseModel):
    content: str

# --- API ENDPOINTS ---

@app.get("/")
def health_check():
    """Health check endpoint to verify system status."""
    return {
        "status": "online",
        "engine": "FastAPI + ChromaDB + SentenceTransformers + Flan-T5 explicitly loaded",
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
def check_semantic_duplicate(data: CheckPayload):
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

@app.post("/api/v1/ai/categorize")
def explainable_auto_categorization(data: CategorizePayload):
    """
    XAI Endpoint: Automatically categorizes an idea and provides a logical explanation.
    Uses explicit Tokenizer and Generation mapping.
    """
    start_time = time.time()
    allowed_categories = "IT Infrastructure, Campus Facilities, Curriculum Enhancement, Student Services"
    
    try:
        # Prompt 1: Force the LLM to choose a category
        cat_prompt = f"Classify the following university idea into exactly one of these categories: {allowed_categories}.\n\nIdea: {data.content}\n\nCategory:"
        
        # Explicit Generation Process
        cat_inputs = tokenizer(cat_prompt, return_tensors="pt").to(device_str)
        cat_outputs = llm_model.generate(**cat_inputs, max_new_tokens=15)
        predicted_category = tokenizer.decode(cat_outputs[0], skip_special_tokens=True).strip()
        
        # Fallback if the LLM hallucinates outside the list
        valid_categories = [c.strip().lower() for c in allowed_categories.split(",")]
        if not any(cat in predicted_category.lower() for cat in valid_categories):
            predicted_category = "General / Uncategorized"

        # Prompt 2: Force the LLM to explain ITS reasoning
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