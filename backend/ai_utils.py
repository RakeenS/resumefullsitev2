from typing import List
import openai
from pydantic import BaseModel
import os
from dotenv import load_dotenv

load_dotenv()

# Initialize OpenAI client
openai.api_key = os.getenv("OPENAI_API_KEY")

class ResumeData(BaseModel):
    job_title: str
    experience: str
    skills: List[str]
    education: str

def generate_optimized_content(data: ResumeData) -> dict:
    """
    Generate optimized resume content using OpenAI's GPT model.
    """
    try:
        # Create a prompt for the AI
        prompt = f"""
        As an expert resume writer, optimize the following resume content:

        Job Title: {data.job_title}

        Experience:
        {data.experience}

        Skills:
        {', '.join(data.skills)}

        Education:
        {data.education}

        Please provide:
        1. An optimized version of the experience section with strong action verbs and quantifiable achievements
        2. Additional relevant skills that might be valuable for this role
        3. A professional summary

        Format the response in clear sections.
        """

        # Call OpenAI API
        response = openai.ChatCompletion.create(
            model="gpt-4",  # or "gpt-3.5-turbo" depending on your needs
            messages=[
                {"role": "system", "content": "You are an expert resume writer who helps optimize resumes for maximum impact."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=1000
        )

        # Extract and structure the response
        ai_content = response.choices[0].message.content

        # Parse the AI response (you might want to add more sophisticated parsing)
        sections = ai_content.split("\n\n")
        
        return {
            "success": True,
            "content": {
                "experience": sections[0] if len(sections) > 0 else "",
                "suggestedSkills": sections[1].split(", ") if len(sections) > 1 else [],
                "summary": sections[2] if len(sections) > 2 else ""
            }
        }

    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }

def analyze_job_market(skills: List[str]) -> dict:
    """
    Analyze job market trends for given skills.
    """
    try:
        prompt = f"""
        Analyze the job market for a candidate with the following skills:
        {', '.join(skills)}

        Please provide:
        1. Top industries hiring for these skills
        2. Suggested additional skills to learn
        3. Estimated salary range
        """

        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a job market analyst providing insights based on current trends."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=500
        )

        return {
            "success": True,
            "analysis": response.choices[0].message.content
        }

    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }
