from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer, util
import time
import torch

# Initialize FastAPI Application
app = FastAPI(
    title="CMS Idea AI Engine",
    description="Research-grade AI service for Semantic Deduplication and RAG",
    version="1.0.0"
)

# Load the Sentence Transformer Model globally so it only loads once on startup
print("Initializing AI Engine...")
print("Downloading/Loading 'all-MiniLM-L6-v2' model. This might take a moment on the first run...")

# Use MPS (Metal Performance Shaders) if available on Mac M-series, else CPU
device = "mps" if torch.backends.mps.is_available() else "cpu"
model = SentenceTransformer('all-MiniLM-L6-v2', device=device)

print(f"Model successfully loaded and running on: {device.upper()}")

# Define the input payload structure using Pydantic
class IdeaInput(BaseModel):
    new_idea: str
    existing_ideas: list[str]

@app.get("/")
def health_check():
    """Simple health check endpoint."""
    return {
        "status": "online", 
        "engine": "FastAPI + SentenceTransformers",
        "device": device
    }

@app.post("/api/v1/ai/check-duplicate")
def check_semantic_duplicate(data: IdeaInput):
    """
    Analyzes a new idea against a list of existing ideas to find semantic duplicates.
    Returns the similarity score and a boolean flag based on a predefined threshold.
    """
    start_time = time.time()
    
    if not data.existing_ideas:
        return {
            "is_duplicate": False, 
            "highest_similarity_score": 0.0, 
            "message": "The existing ideas list is empty."
        }

    try:
        # 1. Encode the new idea into a dense vector embedding
        new_idea_embedding = model.encode(data.new_idea, convert_to_tensor=True)
        
        # 2. Encode the list of existing ideas
        # (In a production RAG system, these would be pre-computed and fetched from a VectorDB)
        existing_embeddings = model.encode(data.existing_ideas, convert_to_tensor=True)
        
        # 3. Compute Cosine Similarity between the new idea and all existing ideas
        cosine_scores = util.cos_sim(new_idea_embedding, existing_embeddings)[0]
        
        # 4. Find the idea with the highest similarity score
        best_match_idx = cosine_scores.argmax().item()
        best_score = cosine_scores[best_match_idx].item()
        
        # Define the strictness threshold (e.g., 0.80 means 80% semantic similarity)
        SIMILARITY_THRESHOLD = 0.60
        is_duplicate = best_score >= SIMILARITY_THRESHOLD
        
        processing_time_ms = round((time.time() - start_time) * 1000, 2)
        
        return {
            "is_duplicate": is_duplicate,
            "highest_similarity_score": round(best_score, 4),
            "most_similar_idea": data.existing_ideas[best_match_idx],
            "processing_time_ms": processing_time_ms,
            "threshold_used": SIMILARITY_THRESHOLD
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI Engine Error: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    # Run the server on port 8000
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)