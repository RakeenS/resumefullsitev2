from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import openai

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ResumeRequest(BaseModel):
    job_title: str
    experience: str
    skills: list[str]
    education: str
    template_id: Optional[str] = None

@app.get("/")
async def read_root():
    return {"message": "Welcome to AI Resume Builder API"}

@app.post("/api/generate-content")
async def generate_resume_content(request: ResumeRequest):
    try:
        # This is a placeholder for the actual OpenAI integration
        # You'll need to add your OpenAI API key and implement the actual logic
        return {
            "success": True,
            "content": {
                "summary": "Professional summary will be generated here",
                "experience": "Experience details will be generated here",
                "skills": "Skills section will be generated here"
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/templates")
async def get_templates():
    # Placeholder for template data
    return {
        "templates": [
            {
                "id": "modern-1",
                "name": "Modern Professional",
                "description": "Clean and professional template with a modern design"
            },
            {
                "id": "creative-1",
                "name": "Creative Design",
                "description": "Stand out with this creative and unique template"
            }
        ]
    }
