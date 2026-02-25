from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer
import chromadb

app = FastAPI(
    title="SNPP AI Microservice",
    description="Sentiment Analysis and Semantic Deduplication using Vector DB"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 1. INITIALIZE AI MODEL (First run will download ~80MB)
print("Loading AI Model...")
model = SentenceTransformer('all-MiniLM-L6-v2')

# 2. INITIALIZE VECTOR DATABASE (ChromaDB runs in-memory)
print("Initializing Vector DB...")
chroma_client = chromadb.Client()
collection = chroma_client.create_collection(name="university_ideas")

class IdeaRequest(BaseModel):
    id: str
    text: str

class CheckDuplicateRequest(BaseModel):
    text: str

@app.post("/api/v1/ideas")
async def add_idea_to_vectordb(request: IdeaRequest):
    """
    This API receives ideas already stored by the Spring Boot service,
    converts them into vector embeddings, and stores them in ChromaDB
    for future semantic comparison.
    """
    vector = model.encode(request.text).tolist()
    
    collection.add(
        embeddings=[vector],
        documents=[request.text],
        ids=[request.id]
    )
    return {"message": "Idea embedded and saved to Vector DB successfully"}

@app.post("/api/v1/check-duplicate")
async def check_duplicate(request: CheckDuplicateRequest):
    query_vector = model.encode(request.text).tolist()
    
    if collection.count() == 0:
        return {
            "is_duplicate": False,
            "similar_ideas": [],
            "debug": "Database is empty"
        }

    results = collection.query(
        query_embeddings=[query_vector],
        n_results=1
    )
    
    similar_ideas = []
    is_duplicate = False
    debug_best_match = None
    
    if results['documents'] and len(results['documents'][0]) > 0:
        distance = results['distances'][0][0]
        matched_text = results['documents'][0][0]
        matched_id = results['ids'][0][0]
        
        # Expose raw distance score for easier inspection and threshold tuning
        debug_best_match = {
            "id": matched_id,
            "text": matched_text,
            "distance_score": round(distance, 4)
        }
        
        # Loosen the similarity threshold to 1.1
        if distance < 1.1:
            is_duplicate = True
            similar_ideas.append(debug_best_match)

    return {
        "is_duplicate": is_duplicate,
        "similar_ideas": similar_ideas,
        "debug_best_match": debug_best_match
    }