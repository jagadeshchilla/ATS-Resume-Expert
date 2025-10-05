"""
AI Prompts for ATS Resume Expert System
This file contains all the prompts used for resume analysis and optimization.
"""

# Main resume analysis prompt with keyword checking and section-wise scoring
RESUME_ANALYSIS_PROMPT = """
You are a senior recruiter with 15 years of experience specializing in Software Engineering roles including Full-Stack Developer, Frontend Developer, Backend Developer, DevOps Engineer, Cloud Engineer, and Mobile Developer. Your task is to conduct a comprehensive technical and cultural fit assessment between the candidate's resume and the provided job description.

**IMPORTANT**: This is a resume analysis tool only. Do NOT provide interview recommendations, interview questions, or suggestions for what to ask in interviews. Focus exclusively on resume analysis and matching assessment.

**ANALYSIS REQUIREMENTS:**

1. **Keyword Analysis**: 
   - Extract all relevant keywords from the job description
   - Check which keywords appear in the resume
   - Identify missing keywords that should be added
   - Provide keyword match percentage

2. **Section-wise Scoring** (Rate each section 0-100):
   - Professional Summary: Score based on relevance and impact
   - Technical Skills: Score based on job requirements match
   - Work Experience: Score based on relevance and achievements
   - Education: Score based on degree relevance and certifications
   - Projects: Score based on technical depth and relevance
   - Certifications: Score based on job requirements alignment
   - Soft Skills: Score based on job requirements

3. **Technical Skills Matching Analysis**:
   - Extract all technical skills mentioned in the job description
   - Identify technical skills present in the resume
   - Calculate technical skills match percentage
   - List matched technical skills
   - List missing critical technical skills
   - Provide technical skills gap analysis

4. **Work Experience Matching Analysis**:
   - Extract work experience requirements from the job description
   - Analyze work experience in the resume
   - Compare experience levels (Junior/Mid/Senior/Lead)
   - Assess years of experience match
   - Evaluate industry relevance
   - Calculate work experience match percentage

5. **Comprehensive Analysis**:
   - Technical Skills Assessment: Detailed evaluation of programming languages, frameworks, and technical competencies
   - Experience Level Analysis: Determine if the candidate meets the required experience level (Junior/Mid/Senior/Lead)
   - Project Portfolio Review: Assess the quality and relevance of past projects and achievements
   - Soft Skills Evaluation: Communication, teamwork, leadership potential
   - Career Trajectory: Analysis of career growth and potential for this role
   - Red Flags: Any concerns or gaps that need attention
   - Strengths: What makes this candidate exceptional for this position
   - Improvement Areas: Specific areas the candidate should develop
   - Overall Match Percentage: Overall compatibility score (0-100%)
   
   **IMPORTANT**: Do NOT include interview recommendations, interview questions, or suggestions for what to ask in interviews. Focus only on resume analysis and matching assessment.

**OUTPUT FORMAT**:
Provide your analysis in the following structured format:

## KEYWORD ANALYSIS
**Job Description Keywords Found**: [List keywords found in resume]
**Missing Keywords**: [List important keywords missing from resume]
**Keyword Match Score**: [X]%

## SECTION-WISE SCORING
- **Professional Summary**: [X]/100
- **Technical Skills**: [X]/100
- **Work Experience**: [X]/100
- **Education**: [X]/100
- **Projects**: [X]/100
- **Certifications**: [X]/100
- **Soft Skills**: [X]/100

## TECHNICAL SKILLS MATCHING
**Required Technical Skills**: [List all technical skills from job description]
**Matched Technical Skills**: [List technical skills found in resume]
**Missing Technical Skills**: [List critical technical skills missing from resume]
**Technical Skills Match Percentage**: [X]%

## WORK EXPERIENCE REQUIREMENTS
**Required Experience Areas**: [List specific experience areas from job description]
**Required Years of Experience**: [X] years
**Required Industry Experience**: [List industry requirements]
**Required Role Experience**: [List specific role requirements]

## RESUME EXPERIENCE ANALYSIS
**Total Years of Experience**: [X] years
**Relevant Experience Areas**: [List relevant experience from resume]
**Industry Experience**: [List industry experience from resume]
**Role Experience**: [List role experience from resume]

## EXPERIENCE MATCHING
**Matched Experience**: [List experience that matches job requirements]
**Missing Experience**: [List critical missing experience]
**Experience Level Match**: [Junior/Mid/Senior/Lead - how well does experience level match]
**Years Experience Match**: [Yes/No - does years of experience meet requirements]
**Industry Relevance Score**: [X]/100

## EXPERIENCE MATCH PERCENTAGE
**Overall Experience Match**: [X]%

## COMPREHENSIVE ANALYSIS
[Detailed analysis following the requirements above]

## OVERALL MATCH SCORE
**Total Match Percentage**: [X]%
"""

# Resume optimization prompts
RESUME_SUMMARY_PROMPT = """
You are a professional resume writer. Analyze the resume and job description to create an impactful professional summary that:
1. Highlights the most relevant skills and experience for the job
2. Uses strong action verbs and quantifiable achievements
3. Is 3-4 sentences long and tailored to the specific role
4. Emphasizes unique value proposition
5. Includes relevant keywords from the job description
"""

SKILLS_OPTIMIZATION_PROMPT = """
You are a resume optimization expert. Analyze the resume and job description to:
1. Identify missing skills that should be added based on the job requirements
2. Suggest reordering of skills to prioritize job-relevant ones
3. Recommend specific technical skills, tools, and certifications
4. Ensure skills section matches the job description keywords
5. Provide suggestions for skill formatting and presentation
"""

WORK_EXPERIENCE_PROMPT = """
You are a senior recruiter specializing in work experience analysis. Analyze the work experience section against the job description to provide comprehensive experience matching analysis.

**ANALYSIS REQUIREMENTS:**

1. **Experience Requirements Extraction**:
   - Extract all work experience requirements from the job description
   - Identify required years of experience, industry experience, and specific role experience
   - Note any specific technologies, methodologies, or domain expertise required

2. **Resume Experience Analysis**:
   - Analyze all work experiences listed in the resume
   - Identify relevant experiences that match job requirements
   - Calculate total years of relevant experience
   - Assess industry relevance and domain expertise

3. **Experience Matching Assessment**:
   - Compare resume experience with job requirements
   - Identify matched experiences and skills
   - Highlight missing experience areas
   - Assess experience level alignment (Junior/Mid/Senior/Lead)

4. **Experience Gap Analysis**:
   - Identify critical experience gaps
   - Suggest how to bridge experience gaps
   - Recommend emphasizing transferable skills
   - Provide strategies to highlight relevant experience

5. **Experience Optimization Recommendations**:
   - Suggest improvements to experience descriptions
   - Recommend adding quantifiable achievements
   - Suggest reordering experiences by relevance
   - Provide specific examples of enhanced bullet points

**OUTPUT FORMAT**:
Provide your analysis in the following structured format:

## WORK EXPERIENCE REQUIREMENTS
**Required Experience Areas**: [List specific experience areas from job description]
**Required Years of Experience**: [X] years
**Required Industry Experience**: [List industry requirements]
**Required Role Experience**: [List specific role requirements]

## RESUME EXPERIENCE ANALYSIS
**Total Years of Experience**: [X] years
**Relevant Experience Areas**: [List relevant experience from resume]
**Industry Experience**: [List industry experience from resume]
**Role Experience**: [List role experience from resume]

## EXPERIENCE MATCHING
**Matched Experience**: [List experience that matches job requirements]
**Missing Experience**: [List critical missing experience]
**Experience Level Match**: [Junior/Mid/Senior/Lead - how well does experience level match]
**Years Experience Match**: [Yes/No - does years of experience meet requirements]
**Industry Relevance Score**: [X]/100

## EXPERIENCE GAP ANALYSIS
[Detailed analysis of experience gaps and how to address them]

## OPTIMIZATION RECOMMENDATIONS
[Specific recommendations for improving work experience section]

## EXPERIENCE MATCH PERCENTAGE
**Overall Experience Match**: [X]%
"""

# Comprehensive list of action verbs from DC_Action verbs for Resumes.pdf
ACTION_VERBS_BY_CATEGORY = {
    "management_leadership": [
        "administered", "analyzed", "appointed", "approved", "assigned", "attained", "authorized", 
        "chaired", "considered", "consolidated", "contracted", "controlled", "converted", 
        "coordinated", "decided", "delegated", "developed", "directed", "eliminated", "emphasized", 
        "enforced", "enhanced", "established", "executed", "generated", "handled", "headed", 
        "hired", "hosted", "improved", "incorporated", "increased", "initiated", "inspected", 
        "instituted", "led", "managed", "merged", "motivated", "organized", "originated", 
        "overhauled", "oversaw", "planned", "presided", "prioritized", "produced", "recommended", 
        "reorganized", "replaced", "restored", "reviewed", "scheduled", "streamlined", 
        "strengthened", "supervised", "terminated"
    ],
    "communication_people": [
        "addressed", "advertised", "arbitrated", "arranged", "articulated", "authored", 
        "clarified", "collaborated", "communicated", "composed", "condensed", "conferred", 
        "consulted", "contacted", "conveyed", "convinced", "corresponded", "debated", 
        "defined", "described", "developed", "directed", "discussed", "drafted", "edited", 
        "elicited", "enlisted", "explained", "expressed", "formulated", "furnished", 
        "incorporated", "influenced", "interacted", "interpreted", "interviewed", "involved", 
        "joined", "judged", "lectured", "listened", "marketed", "mediated", "moderated", 
        "negotiated", "observed", "outlined", "participated", "persuaded", "presented", 
        "promoted", "proposed", "publicized", "reconciled", "recruited", "referred", 
        "reinforced", "reported", "resolved", "responded", "solicited", "specified", 
        "spoke", "suggested", "summarized", "synthesized", "translated", "wrote"
    ],
    "research": [
        "analyzed", "clarified", "collected", "compared", "conducted", "critiqued", 
        "detected", "determined", "diagnosed", "evaluated", "examined", "experimented", 
        "explored", "extracted", "formulated", "gathered", "identified", "inspected", 
        "interpreted", "interviewed", "invented", "investigated", "located", "measured", 
        "organized", "researched", "searched", "solved", "summarized", "surveyed", 
        "systematized", "tested"
    ],
    "technical": [
        "adapted", "assembled", "built", "calculated", "computed", "conserved", 
        "constructed", "converted", "debugged", "designed", "determined", "developed", 
        "engineered", "fabricated", "fortified", "installed", "maintained", "operated", 
        "overhauled", "printed", "programmed", "rectified", "regulated", "remodeled", 
        "repaired", "replaced", "restored", "solved", "specialized", "standardized", 
        "studied", "upgraded", "utilized"
    ],
    "teaching": [
        "adapted", "advised", "clarified", "coached", "communicated", "conducted", 
        "coordinated", "critiqued", "developed", "enabled", "encouraged", "evaluated", 
        "explained", "facilitated", "focused", "guided", "individualized", "informed", 
        "instilled", "instructed", "motivated", "persuaded", "set goals", "simulated", 
        "stimulated", "taught", "tested", "trained", "transmitted", "tutored"
    ],
    "financial_data": [
        "administered", "adjusted", "allocated", "analyzed", "appraised", "assessed", 
        "audited", "balanced", "calculated", "computed", "conserved", "corrected", 
        "determined", "developed", "estimated", "forecasted", "managed", "marketed", 
        "measured", "planned", "programmed", "projected", "reconciled", "reduced", 
        "researched", "retrieved"
    ],
    "creative": [
        "acted", "adapted", "began", "combined", "conceptualized", "condensed", "created", 
        "customized", "designed", "developed", "directed", "displayed", "drew", 
        "entertained", "established", "fashioned", "formulated", "founded", "illustrated", 
        "initiated", "instituted", "integrated", "introduced", "invented", "modeled", 
        "modified", "originated", "performed", "photographed", "planned", "revised", 
        "revitalized", "shaped", "solved"
    ],
    "helping": [
        "adapted", "advocated", "aided", "answered", "arranged", "assessed", "assisted", 
        "cared for", "clarified", "coached", "collaborated", "contributed", "cooperated", 
        "counseled", "demonstrated", "diagnosed", "educated", "encouraged", "ensured", 
        "expedited", "facilitated", "familiarized", "furthered", "guided", "helped", 
        "insured", "intervened", "motivated", "provided", "referred", "rehabilitated", 
        "presented", "resolved", "simplified", "supplied", "supported", "volunteered"
    ],
    "organization_detail": [
        "approved", "arranged", "cataloged", "categorized", "charted", "classified", 
        "coded", "collected", "compiled", "corresponded", "distributed", "executed", 
        "filed", "generated", "implemented", "incorporated", "inspected", "logged", 
        "maintained", "monitored", "obtained", "operated", "ordered", "organized", 
        "prepared", "processed", "provided", "purchased", "recorded", "registered", 
        "reserved", "responded", "reviewed", "routed", "scheduled", "screened", 
        "set up", "submitted", "supplied", "standardized", "systematized", "updated", 
        "validated", "verified"
    ],
    "accomplishments": [
        "achieved", "completed", "expanded", "exceeded", "improved", "pioneered", 
        "reduced", "resolved", "restored", "spearheaded", "succeeded", "surpassed", 
        "transformed", "won"
    ]
}

# Get all action verbs as a flat list
ALL_ACTION_VERBS = []
for category_verbs in ACTION_VERBS_BY_CATEGORY.values():
    ALL_ACTION_VERBS.extend(category_verbs)

# Prompt categories for different analysis types
PROMPT_CATEGORIES = {
    "comprehensive_analysis": RESUME_ANALYSIS_PROMPT,
    "summary_optimization": RESUME_SUMMARY_PROMPT,
    "skills_optimization": SKILLS_OPTIMIZATION_PROMPT,
    "work_experience": WORK_EXPERIENCE_PROMPT,
}

def get_prompt(category: str) -> str:
    """
    Get a specific prompt by category
    
    Args:
        category: The prompt category to retrieve
        
    Returns:
        The prompt string for the specified category
    """
    return PROMPT_CATEGORIES.get(category, RESUME_ANALYSIS_PROMPT)

def get_available_categories() -> list:
    """
    Get list of available prompt categories
    
    Returns:
        List of available prompt category names
    """
    return list(PROMPT_CATEGORIES.keys())
