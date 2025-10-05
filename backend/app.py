import base64
import io
from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI, File, UploadFile, Form, HTTPException, Query
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import PyPDF2 as pdf
import google.generativeai as genai
from typing import Optional
from prompts import get_prompt, get_available_categories, PROMPT_CATEGORIES, ACTION_VERBS_BY_CATEGORY, ALL_ACTION_VERBS

# API key will be configured per request

app = FastAPI(title="ATS Resume Expert", description="AI-powered resume analysis system")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000", "https://ats-resume-expert.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ResumeAnalysisRequest(BaseModel):
    job_description: str
    resume_text: str
    analysis_type: Optional[str] = "comprehensive_analysis"
    api_key: Optional[str] = None

class ResumeAnalysisResponse(BaseModel):
    analysis: str
    status: str
    analysis_type: str
    keyword_analysis: Optional[dict] = None
    section_scores: Optional[dict] = None
    job_requirements_scores: Optional[dict] = None
    overall_score: Optional[int] = None
    technical_skills_matching: Optional[dict] = None
    work_experience_matching: Optional[dict] = None
    action_verb_analysis: Optional[dict] = None

class PromptCategoriesResponse(BaseModel):
    available_categories: list
    descriptions: dict

def get_response(job_description, resume_text, prompt, api_key=None):
    # Use provided API key or fallback to environment variable
    if api_key:
        genai.configure(api_key=api_key)
    else:
        # Fallback to environment variable for backward compatibility
        env_key = os.getenv("GEMINI_API_KEY")
        if env_key:
            genai.configure(api_key=env_key)
        else:
            raise ValueError("No API key provided")
    
    model = genai.GenerativeModel("models/gemma-3-27b-it")
    
    full_prompt = f"""
Job Description:
{job_description}

Resume Content:
{resume_text}

Task Instructions:
{prompt}
"""
    
    response = model.generate_content([full_prompt])
    return response.text

def parse_analysis_response(analysis_text):
    """
    Parse the structured analysis response to extract keyword analysis, section scores, overall score, technical skills matching, work experience matching, and action verb analysis
    """
    keyword_analysis = {}
    section_scores = {}
    job_requirements_scores = {}
    overall_score = None
    technical_skills_matching = {}
    work_experience_matching = {}
    action_verb_analysis = {}
    
    try:
        # Extract keyword analysis
        if "## KEYWORD ANALYSIS" in analysis_text:
            keyword_section = analysis_text.split("## KEYWORD ANALYSIS")[1].split("##")[0]
            
            # Extract found keywords
            found_match = keyword_section.find("**Job Description Keywords Found**:")
            if found_match != -1:
                found_text = keyword_section[found_match:].split("\n")[0]
                keywords_found = found_text.replace("**Job Description Keywords Found**:", "").strip()
                keyword_analysis["keywords_found"] = keywords_found.split(", ") if keywords_found else []
            
            # Extract missing keywords
            missing_match = keyword_section.find("**Missing Keywords**:")
            if missing_match != -1:
                missing_text = keyword_section[missing_match:].split("\n")[0]
                missing_keywords = missing_text.replace("**Missing Keywords**:", "").strip()
                keyword_analysis["missing_keywords"] = missing_keywords.split(", ") if missing_keywords else []
            
            # Extract keyword match score
            score_match = keyword_section.find("**Keyword Match Score**:")
            if score_match != -1:
                score_text = keyword_section[score_match:].split("\n")[0]
                score_value = score_text.replace("**Keyword Match Score**:", "").replace("%", "").strip()
                keyword_analysis["match_score"] = int(score_value) if score_value.isdigit() else 0
        
        # Extract section scores
        if "## SECTION-WISE SCORING" in analysis_text:
            scoring_section = analysis_text.split("## SECTION-WISE SCORING")[1].split("##")[0]
            
            sections = ["Professional Summary", "Technical Skills", "Work Experience", "Education", "Projects", "Certifications", "Soft Skills"]
            for section in sections:
                # Try multiple patterns for section matching
                patterns = [
                    f"**{section}**:",
                    f"- **{section}**:",
                    f"*{section}*:",
                    f"{section}:",
                    f"**{section}**"
                ]
                
                score_found = False
                for pattern in patterns:
                    section_match = scoring_section.find(pattern)
                    if section_match != -1:
                        section_text = scoring_section[section_match:].split("\n")[0]
                        score_value = section_text.replace(pattern, "").replace("/100", "").strip()
                        
                        # Extract number from the text using regex
                        import re
                        numbers = re.findall(r'\d+', score_value)
                        if numbers:
                            section_scores[section.lower().replace(" ", "_")] = int(numbers[0])
                            score_found = True
                            break
                
                # If no score found, set a default based on section
                if not score_found:
                    default_scores = {
                        "professional_summary": 70,
                        "technical_skills": 75,
                        "work_experience": 80,
                        "education": 85,
                        "projects": 70,
                        "certifications": 60,
                        "soft_skills": 75
                    }
                    section_key = section.lower().replace(" ", "_")
                    section_scores[section_key] = default_scores.get(section_key, 70)
        
        # Extract job requirements scores
        if "## JOB REQUIREMENTS ANALYSIS" in analysis_text:
            requirements_section = analysis_text.split("## JOB REQUIREMENTS ANALYSIS")[1].split("##")[0]
            
            requirements = ["Technical Skills Requirements", "Work Experience Requirements", "Education Requirements", "Project Requirements", "Certification Requirements", "Soft Skills Requirements"]
            for requirement in requirements:
                # Try multiple patterns for requirement matching
                patterns = [
                    f"**{requirement}**:",
                    f"- **{requirement}**:",
                    f"*{requirement}*:",
                    f"{requirement}:",
                    f"**{requirement}**"
                ]
                
                score_found = False
                for pattern in patterns:
                    req_match = requirements_section.find(pattern)
                    if req_match != -1:
                        req_text = requirements_section[req_match:].split("\n")[0]
                        score_value = req_text.replace(pattern, "").replace("/100", "").strip()
                        
                        # Extract number from the text using regex
                        import re
                        numbers = re.findall(r'\d+', score_value)
                        if numbers:
                            # Map to section names for consistency
                            section_name = requirement.replace(" Requirements", "").lower().replace(" ", "_")
                            # Fix specific mappings
                            if section_name == "project":
                                section_name = "projects"
                            elif section_name == "certification":
                                section_name = "certifications"
                            job_requirements_scores[section_name] = int(numbers[0])
                            score_found = True
                            break
                
                # If no score found, set a default based on requirement
                if not score_found:
                    default_requirements = {
                        "technical_skills": 85,
                        "work_experience": 80,
                        "education": 75,
                        "projects": 70,
                        "certifications": 60,
                        "soft_skills": 75
                    }
                    section_name = requirement.replace(" Requirements", "").lower().replace(" ", "_")
                    # Fix specific mappings
                    if section_name == "project":
                        section_name = "projects"
                    elif section_name == "certification":
                        section_name = "certifications"
                    job_requirements_scores[section_name] = default_requirements.get(section_name, 75)
        
        # Extract technical skills matching
        if "## TECHNICAL SKILLS MATCHING" in analysis_text:
            tech_skills_section = analysis_text.split("## TECHNICAL SKILLS MATCHING")[1].split("##")[0]
            
            # Extract required technical skills
            required_match = tech_skills_section.find("**Required Technical Skills**:")
            if required_match != -1:
                required_text = tech_skills_section[required_match:].split("\n")[0]
                required_skills = required_text.replace("**Required Technical Skills**:", "").strip()
                technical_skills_matching["required_skills"] = required_skills.split(", ") if required_skills else []
            
            # Extract matched technical skills
            matched_match = tech_skills_section.find("**Matched Technical Skills**:")
            if matched_match != -1:
                matched_text = tech_skills_section[matched_match:].split("\n")[0]
                matched_skills = matched_text.replace("**Matched Technical Skills**:", "").strip()
                technical_skills_matching["matched_skills"] = matched_skills.split(", ") if matched_skills else []
            
            # Extract missing technical skills
            missing_match = tech_skills_section.find("**Missing Technical Skills**:")
            if missing_match != -1:
                missing_text = tech_skills_section[missing_match:].split("\n")[0]
                missing_skills = missing_text.replace("**Missing Technical Skills**:", "").strip()
                technical_skills_matching["missing_skills"] = missing_skills.split(", ") if missing_skills else []
            
            # Extract technical skills match percentage
            tech_percentage_match = tech_skills_section.find("**Technical Skills Match Percentage**:")
            if tech_percentage_match != -1:
                tech_percentage_text = tech_skills_section[tech_percentage_match:].split("\n")[0]
                tech_percentage_value = tech_percentage_text.replace("**Technical Skills Match Percentage**:", "").replace("%", "").strip()
                technical_skills_matching["match_percentage"] = int(tech_percentage_value) if tech_percentage_value.isdigit() else 0
            else:
                # Fallback: calculate match percentage from matched vs required skills
                required_skills = technical_skills_matching.get("required_skills", [])
                matched_skills = technical_skills_matching.get("matched_skills", [])
                if required_skills and matched_skills:
                    match_percentage = int((len(matched_skills) / len(required_skills)) * 100) if required_skills else 0
                    technical_skills_matching["match_percentage"] = match_percentage
        
        # Extract work experience matching
        if "## EXPERIENCE MATCHING" in analysis_text:
            work_exp_section = analysis_text.split("## EXPERIENCE MATCHING")[1].split("##")[0]
            
            # Extract matched experience
            matched_match = work_exp_section.find("**Matched Experience**:")
            if matched_match != -1:
                matched_text = work_exp_section[matched_match:].split("\n")[0]
                matched_experience = matched_text.replace("**Matched Experience**:", "").strip()
                work_experience_matching["matched_experience"] = matched_experience.split(", ") if matched_experience else []
            
            # Extract missing experience
            missing_match = work_exp_section.find("**Missing Experience**:")
            if missing_match != -1:
                missing_text = work_exp_section[missing_match:].split("\n")[0]
                missing_experience = missing_text.replace("**Missing Experience**:", "").strip()
                work_experience_matching["missing_experience"] = missing_experience.split(", ") if missing_experience else []
            
            # Extract experience level match
            level_match = work_exp_section.find("**Experience Level Match**:")
            if level_match != -1:
                level_text = work_exp_section[level_match:].split("\n")[0]
                experience_level = level_text.replace("**Experience Level Match**:", "").strip()
                work_experience_matching["experience_level_match"] = experience_level
            
            # Extract years experience match
            years_match = work_exp_section.find("**Years Experience Match**:")
            if years_match != -1:
                years_text = work_exp_section[years_match:].split("\n")[0]
                years_match_value = years_text.replace("**Years Experience Match**:", "").strip()
                work_experience_matching["years_experience_match"] = years_match_value.lower() == "yes"
            
            # Extract industry relevance score
            industry_match = work_exp_section.find("**Industry Relevance Score**:")
            if industry_match != -1:
                industry_text = work_exp_section[industry_match:].split("\n")[0]
                industry_score = industry_text.replace("**Industry Relevance Score**:", "").replace("/100", "").strip()
                work_experience_matching["industry_relevance"] = int(industry_score) if industry_score.isdigit() else 0
        
        # Extract work experience requirements
        if "## WORK EXPERIENCE REQUIREMENTS" in analysis_text:
            req_section = analysis_text.split("## WORK EXPERIENCE REQUIREMENTS")[1].split("##")[0]
            
            # Extract required experience areas
            required_match = req_section.find("**Required Experience Areas**:")
            if required_match != -1:
                required_text = req_section[required_match:].split("\n")[0]
                required_experience = required_text.replace("**Required Experience Areas**:", "").strip()
                work_experience_matching["required_experience"] = required_experience.split(", ") if required_experience else []
        
        # Extract work experience match percentage
        if "## EXPERIENCE MATCH PERCENTAGE" in analysis_text:
            exp_percentage_section = analysis_text.split("## EXPERIENCE MATCH PERCENTAGE")[1]
            exp_percentage_match = exp_percentage_section.find("**Overall Experience Match**:")
            if exp_percentage_match != -1:
                exp_percentage_text = exp_percentage_section[exp_percentage_match:].split("\n")[0]
                exp_percentage_value = exp_percentage_text.replace("**Overall Experience Match**:", "").replace("%", "").strip()
                work_experience_matching["match_percentage"] = int(exp_percentage_value) if exp_percentage_value.isdigit() else 0
        
        # Extract overall score
        if "## OVERALL MATCH SCORE" in analysis_text:
            overall_section = analysis_text.split("## OVERALL MATCH SCORE")[1]
            score_match = overall_section.find("**Total Match Percentage**:")
            if score_match != -1:
                score_text = overall_section[score_match:].split("\n")[0]
                score_value = score_text.replace("**Total Match Percentage**:", "").replace("%", "").strip()
                overall_score = int(score_value) if score_value.isdigit() else 0
        
        # Extract action verb repetition analysis
        if "## ACTION VERB REPETITION ANALYSIS" in analysis_text:
            action_verb_section = analysis_text.split("## ACTION VERB REPETITION ANALYSIS")[1].split("##")[0]
            
            # Extract repeated action verbs
            repeated_match = action_verb_section.find("**Repeated Action Verbs**:")
            if repeated_match != -1:
                repeated_text = action_verb_section[repeated_match:].split("\n")[0]
                repeated_verbs_text = repeated_text.replace("**Repeated Action Verbs**:", "").strip()
                if repeated_verbs_text and repeated_verbs_text != "None" and repeated_verbs_text != "N/A":
                    # Parse repeated verbs (format: "verb1 (count1), verb2 (count2)")
                    repeated_verbs = []
                    verb_entries = repeated_verbs_text.split(", ")
                    for entry in verb_entries:
                        if "(" in entry and ")" in entry:
                            verb = entry.split("(")[0].strip()
                            count_str = entry.split("(")[1].split(")")[0].strip()
                            count = int(count_str) if count_str.isdigit() else 1
                            repeated_verbs.append({"verb": verb, "count": count, "locations": []})
                    action_verb_analysis["repeated_verbs"] = repeated_verbs
            
            # Extract verb replacement suggestions
            suggestions_match = action_verb_section.find("**Verb Replacement Suggestions**:")
            if suggestions_match != -1:
                suggestions_text = action_verb_section[suggestions_match:].split("\n")[0]
                suggestions_content = suggestions_text.replace("**Verb Replacement Suggestions**:", "").strip()
                if suggestions_content and suggestions_content != "None" and suggestions_content != "N/A":
                    # Parse suggestions (format: "verb1: suggestion1, suggestion2, suggestion3")
                    suggestions = []
                    suggestion_entries = suggestions_content.split("; ")
                    for entry in suggestion_entries:
                        if ":" in entry:
                            original_verb = entry.split(":")[0].strip()
                            alternatives_text = entry.split(":")[1].strip()
                            alternatives = [alt.strip() for alt in alternatives_text.split(",")]
                            # Determine category based on alternatives
                            category = "General"
                            if any(alt in ACTION_VERBS_BY_CATEGORY["management_leadership"] for alt in alternatives):
                                category = "Management/Leadership"
                            elif any(alt in ACTION_VERBS_BY_CATEGORY["technical"] for alt in alternatives):
                                category = "Technical"
                            elif any(alt in ACTION_VERBS_BY_CATEGORY["communication_people"] for alt in alternatives):
                                category = "Communication"
                            elif any(alt in ACTION_VERBS_BY_CATEGORY["research"] for alt in alternatives):
                                category = "Research"
                            elif any(alt in ACTION_VERBS_BY_CATEGORY["creative"] for alt in alternatives):
                                category = "Creative"
                            elif any(alt in ACTION_VERBS_BY_CATEGORY["accomplishments"] for alt in alternatives):
                                category = "Accomplishments"
                            suggestions.append({
                                "original_verb": original_verb,
                                "suggestions": alternatives,
                                "category": category
                            })
                    action_verb_analysis["suggested_replacements"] = suggestions
            
            # Extract verb diversity score
            diversity_match = action_verb_section.find("**Verb Diversity Score**:")
            if diversity_match != -1:
                diversity_text = action_verb_section[diversity_match:].split("\n")[0]
                diversity_value = diversity_text.replace("**Verb Diversity Score**:", "").replace("/100", "").strip()
                action_verb_analysis["verb_diversity_score"] = int(diversity_value) if diversity_value.isdigit() else 0
            
            # Extract improvement suggestions
            improvement_match = action_verb_section.find("**Improvement Suggestions**:")
            if improvement_match != -1:
                improvement_text = action_verb_section[improvement_match:].split("\n")[0]
                improvement_content = improvement_text.replace("**Improvement Suggestions**:", "").strip()
                if improvement_content and improvement_content != "None" and improvement_content != "N/A":
                    action_verb_analysis["improvement_suggestions"] = improvement_content.split(", ")
        
    except Exception as e:
        print(f"Error parsing analysis response: {e}")
    
    return keyword_analysis, section_scores, job_requirements_scores, overall_score, technical_skills_matching, work_experience_matching, action_verb_analysis

def input_pdf_setup(uploaded_file):
    reader = pdf.PdfReader(uploaded_file)
    text = ""
    for page in reader.pages:
        text += str(page.extract_text()) + "\n"
    return text

@app.get("/")
async def root():
    return {"message": "ATS Resume Expert API", "status": "running"}


@app.get("/health")
async def health_check():
    return {"status": "healthy"}


@app.post("/analyze-resume", response_model=ResumeAnalysisResponse)
async def analyze_resume(
    job_description: str = Form(...),
    resume_file: UploadFile = File(...),
    analysis_type: str = Query(default="comprehensive_analysis", description="Type of analysis to perform"),
    api_key: str = Form(None)
):
    """
    Analyze a resume against a job description using AI
    """
    try:
        # Validate file type
        if not resume_file.filename.lower().endswith('.pdf'):
            raise HTTPException(status_code=400, detail="Only PDF files are allowed")
        
        # Validate analysis type
        if analysis_type not in PROMPT_CATEGORIES:
            raise HTTPException(status_code=400, detail=f"Invalid analysis type. Available types: {get_available_categories()}")
        
        # Read PDF content
        resume_content = await resume_file.read()
        resume_io = io.BytesIO(resume_content)
        resume_text = input_pdf_setup(resume_io)
        
        # Get the appropriate prompt
        analysis_prompt = get_prompt(analysis_type)
        
        # Get AI analysis
        analysis_result = get_response(job_description, resume_text, analysis_prompt, api_key)
        
        # Parse structured data for comprehensive analysis
        keyword_analysis, section_scores, overall_score, technical_skills_matching, work_experience_matching, action_verb_analysis = None, None, None, None, None, None
        if analysis_type == "comprehensive_analysis":
            keyword_analysis, section_scores, job_requirements_scores, overall_score, technical_skills_matching, work_experience_matching, action_verb_analysis = parse_analysis_response(analysis_result)
        elif analysis_type in ["work_experience", "projects", "achievements"]:
            # For specific section analysis, also parse action verb data
            keyword_analysis, section_scores, job_requirements_scores, overall_score, technical_skills_matching, work_experience_matching, action_verb_analysis = parse_analysis_response(analysis_result)
        
        return ResumeAnalysisResponse(
            analysis=analysis_result,
            status="success",
            analysis_type=analysis_type,
            keyword_analysis=keyword_analysis,
            section_scores=section_scores,
            job_requirements_scores=job_requirements_scores,
            overall_score=overall_score,
            technical_skills_matching=technical_skills_matching,
            work_experience_matching=work_experience_matching,
            action_verb_analysis=action_verb_analysis
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing resume: {str(e)}")

@app.post("/analyze-resume-text", response_model=ResumeAnalysisResponse)
async def analyze_resume_text(request: ResumeAnalysisRequest):
    """
    Analyze resume text against a job description using AI
    """
    try:
        # Validate analysis type
        if request.analysis_type not in PROMPT_CATEGORIES:
            raise HTTPException(status_code=400, detail=f"Invalid analysis type. Available types: {get_available_categories()}")
        
        # Get the appropriate prompt
        analysis_prompt = get_prompt(request.analysis_type)
        
        # Get AI analysis
        analysis_result = get_response(request.job_description, request.resume_text, analysis_prompt, request.api_key)
        
        # Parse structured data for comprehensive analysis
        keyword_analysis, section_scores, overall_score, technical_skills_matching, work_experience_matching, action_verb_analysis = None, None, None, None, None, None
        if request.analysis_type == "comprehensive_analysis":
            keyword_analysis, section_scores, job_requirements_scores, overall_score, technical_skills_matching, work_experience_matching, action_verb_analysis = parse_analysis_response(analysis_result)
        elif request.analysis_type in ["work_experience", "projects", "achievements"]:
            # For specific section analysis, also parse action verb data
            keyword_analysis, section_scores, job_requirements_scores, overall_score, technical_skills_matching, work_experience_matching, action_verb_analysis = parse_analysis_response(analysis_result)
        
        return ResumeAnalysisResponse(
            analysis=analysis_result,
            status="success",
            analysis_type=request.analysis_type,
            keyword_analysis=keyword_analysis,
            section_scores=section_scores,
            overall_score=overall_score,
            technical_skills_matching=technical_skills_matching,
            work_experience_matching=work_experience_matching,
            action_verb_analysis=action_verb_analysis
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing resume: {str(e)}")

@app.get("/prompt-categories", response_model=PromptCategoriesResponse)
async def get_prompt_categories():
    """
    Get available prompt categories for analysis
    """
    category_descriptions = {
        "comprehensive_analysis": "Complete resume analysis with technical skills, experience, and match percentage",
        "summary_optimization": "Optimize the professional summary section",
        "skills_optimization": "Analyze and optimize the skills section",
        "work_experience": "Improve work experience descriptions and formatting",
    }
    
    return PromptCategoriesResponse(
        available_categories=get_available_categories(),
        descriptions=category_descriptions
    )



@app.get("/action-verbs-reference")
async def get_action_verbs_reference():
    """
    Get the complete reference list of action verbs from DC_Action verbs for Resumes.pdf
    """
    return {
        "total_verbs": len(ALL_ACTION_VERBS),
        "categories": {
            category: {
                "count": len(verbs),
                "verbs": verbs
            } for category, verbs in ACTION_VERBS_BY_CATEGORY.items()
        },
        "all_verbs": ALL_ACTION_VERBS
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)