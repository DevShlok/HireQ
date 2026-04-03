from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(title="HireQ AI Service")

class ResumeParseRequest(BaseModel):
    text: str

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "ai-service"}

@app.post("/api/generate-questions")
def generate_questions(req: ResumeParseRequest):
    # Placeholder
    return {"questions": ["Tell me about yourself?", "What are your strengths?"]}
