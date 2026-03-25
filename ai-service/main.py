from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer
import chromadb
import time
import os
import torch

# Initialize FastAPI Application
app = FastAPI(
    title="CMS Idea AI Engine (RAG Architecture)",
    description="Vector Database powered Semantic Search & Deduplication for Idea Management System.",
    version="2.0.0"
)

print("Initializing AI Engine & Vector Database...")

# 1. Setup AI Model
# Automatically use Metal Performance Shaders (MPS) on Apple Silicon, fallback to CPU
device = "mps" if torch.backends.mps.is_available() else "cpu"
model = SentenceTransformer('all-MiniLM-L6-v2', device=device)

# 2. Setup Vector Database (ChromaDB)
# Creates a persistent directory to store vectors permanently on disk
db_path = os.path.join(os.getcwd(), "vector_store")
chroma_client = chromadb.PersistentClient(path=db_path)

# Create or get the collection for storing ideas using Cosine Similarity space
collection = chroma_client.get_or_create_collection(
    name="cms_ideas",
    metadata={"hnsw:space": "cosine"}
)

print(f"System Ready! Running on: {device.upper()}")
print(f"Current Ideas in VectorDB: {collection.count()}")

# --- DATA MODELS ---
class IdeaPayload(BaseModel):
    idea_id: str
    content: str
    category: str = "general"

class CheckPayload(BaseModel):
    content: str

# --- API ENDPOINTS ---

@app.get("/")
def health_check():
    """Health check endpoint to verify system status."""
    return {
        "status": "online",
        "engine": "FastAPI + ChromaDB + SentenceTransformers",
        "device": device,
        "total_ideas_indexed": collection.count()
    }

@app.post("/api/v1/ai/ideas")
def store_idea_in_vector_db(data: IdeaPayload):
    """
    Vectorizes a new idea and stores it permanently in ChromaDB.
    The Main Java Backend should call this endpoint upon a successful idea submission.
    """
    try:
        # 1. Convert text to a dense vector embedding
        embedding = model.encode(data.content).tolist()
        
        # 2. Store in Vector Database
        collection.add(
            embeddings=[embedding],
            documents=[data.content],
            metadatas=[{"category": data.category}],
            ids=[data.idea_id]
        )
        return {
            "status": "success", 
            "message": f"Idea {data.idea_id} successfully vectorized and stored."
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to store idea: {str(e)}")

@app.post("/api/v1/ai/check-duplicate")
def check_semantic_duplicate(data: CheckPayload):
    """
    RAG Search: Queries the VectorDB to find the most semantically similar existing idea.
    Returns duplication status based on a predefined similarity threshold.
    """
    start_time = time.time()
    
    # Handle edge case: Empty database
    if collection.count() == 0:
        return {
            "is_duplicate": False, 
            "highest_similarity_score": 0.0,
            "message": "Vector Database is empty. Safe to submit."
        }

    try:
        # 1. Encode the incoming query
        query_embedding = model.encode(data.content).tolist()
        
        # 2. Query VectorDB for the top 1 most similar match
        results = collection.query(
            query_embeddings=[query_embedding],
            n_results=1,
            include=["documents", "distances", "metadatas"]
        )
        
        processing_time_ms = round((time.time() - start_time) * 1000, 2)
        
        # ChromaDB Cosine Space: Distance = 1 - Cosine Similarity.
        distance = results["distances"][0][0]
        similarity_score = 1 - distance
        
        # Define strictness threshold
        SIMILARITY_THRESHOLD = 0.60
        is_duplicate = similarity_score >= SIMILARITY_THRESHOLD
        
        return {
            "is_duplicate": is_duplicate,
            "highest_similarity_score": round(similarity_score, 4),
            "most_similar_idea": results["documents"][0][0],
            "matched_idea_id": results["ids"][0][0],
            "matched_category": results["metadatas"][0][0].get("category", "unknown"),
            "processing_time_ms": processing_time_ms,
            "threshold_used": SIMILARITY_THRESHOLD
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"RAG Engine Search Error: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)