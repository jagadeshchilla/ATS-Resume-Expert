export interface ActionVerbAnalysis {
  repeated_verbs?: {
    verb: string;
    count: number;
    locations: string[];
  }[];
  suggested_replacements?: {
    original_verb: string;
    suggestions: string[];
    category: string;
  }[];
  verb_diversity_score?: number;
  improvement_suggestions?: string[];
}

export interface AnalysisResult {
  analysis: string;
  status: string;
  analysis_type: string;
  keyword_analysis?: {
    keywords_found?: string[];
    missing_keywords?: string[];
    match_score?: number;
  };
  section_scores?: {
    professional_summary?: number;
    technical_skills?: number;
    work_experience?: number;
    education?: number;
    projects?: number;
    certifications?: number;
    soft_skills?: number;
  };
  job_requirements_scores?: {
    technical_skills?: number;
    work_experience?: number;
    education?: number;
    projects?: number;
    certifications?: number;
    soft_skills?: number;
  };
  overall_score?: number;
  technical_skills_matching?: {
    required_skills?: string[];
    matched_skills?: string[];
    missing_skills?: string[];
    match_percentage?: number;
  };
  work_experience_matching?: {
    required_experience?: string[];
    matched_experience?: string[];
    missing_experience?: string[];
    experience_level_match?: string;
    years_experience_match?: boolean;
    industry_relevance?: number;
    match_percentage?: number;
  };
  action_verb_analysis?: ActionVerbAnalysis;
}

export interface AnalysisCategory {
  value: string;
  label: string;
  description: string;
}

export const ANALYSIS_CATEGORIES: AnalysisCategory[] = [
  {
    value: 'comprehensive_analysis',
    label: 'Comprehensive Analysis',
    description: 'Complete resume analysis with technical skills, experience, and match percentage'
  },
  {
    value: 'summary_optimization',
    label: 'Summary Optimization',
    description: 'Optimize the professional summary section'
  },
  {
    value: 'skills_optimization',
    label: 'Skills Optimization',
    description: 'Analyze and optimize the skills section'
  },
  {
    value: 'work_experience',
    label: 'Work Experience',
    description: 'Improve work experience descriptions and formatting'
  },
  {
    value: 'education',
    label: 'Education',
    description: 'Optimize education section and certifications'
  },
  {
    value: 'projects',
    label: 'Projects',
    description: 'Analyze and improve project descriptions'
  },
  {
    value: 'certifications',
    label: 'Certifications',
    description: 'Review and suggest relevant certifications'
  },
  {
    value: 'leadership',
    label: 'Leadership',
    description: 'Identify and highlight leadership qualities'
  },
  {
    value: 'quantify',
    label: 'Quantify Achievements',
    description: 'Add quantifiable metrics and achievements'
  },
  {
    value: 'action_verbs',
    label: 'Action Verbs',
    description: 'Improve action verbs and descriptions'
  },
  {
    value: 'bullet_points',
    label: 'Bullet Points',
    description: 'Optimize bullet point formatting and content'
  },
  {
    value: 'tailor',
    label: 'Tailor Resume',
    description: 'Tailor resume content to specific job requirements'
  },
  {
    value: 'data_analysis',
    label: 'Data Analysis',
    description: 'Focus on data analysis skills and projects'
  },
  {
    value: 'marketing',
    label: 'Marketing',
    description: 'Analyze marketing-related skills and experience'
  }
];
