import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { AnalysisResult } from '../types';
import Loader from './Loader';

interface AnalysisSectionProps {
  section: string;
  analysisResult: AnalysisResult | null;
  isLoading: boolean;
  onRunAnalysis: () => void;
}

const AnalysisSection: React.FC<AnalysisSectionProps> = ({
  section,
  analysisResult,
  isLoading,
  onRunAnalysis
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (analysisResult?.analysis) {
      try {
        await navigator.clipboard.writeText(analysisResult.analysis);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy text:', err);
      }
    }
  };

  const getSectionTitle = (section: string) => {
    const titles: Record<string, string> = {
      'comprehensive_analysis': 'Comprehensive Analysis',
      'keyword_analysis': 'Keyword Analysis',
      'technical_skills': 'Technical Skills Analysis',
      'work_experience': 'Work Experience Analysis',
      'skills_optimization': 'Skills Analysis',
      'leadership': 'Leadership Analysis',
      'action_verbs': 'Action Verbs Analysis',
      'tailor': 'Resume Tailoring'
    };
    return titles[section] || 'Analysis';
  };

  const getSectionDescription = (section: string) => {
    const descriptions: Record<string, string> = {
      'comprehensive_analysis': 'Complete resume analysis with technical skills, experience, and match percentage',
      'keyword_analysis': 'Analysis of keyword matching between resume and job description',
      'technical_skills': 'Detailed analysis of technical skills and proficiency',
      'work_experience': 'Analysis of work experience relevance and achievements',
      'skills_optimization': 'Analyze and optimize the skills section for better ATS compatibility',
      'leadership': 'Identify and highlight leadership qualities',
      'action_verbs': 'Improve action verbs and detect repetitions',
      'tailor': 'Tailor resume content to specific job requirements'
    };
    return descriptions[section] || 'Detailed analysis of this section';
  };

  const renderSpecialSection = () => {
    if (!analysisResult) return null;

    switch (section) {
      case 'keyword_analysis':
        if (analysisResult.keyword_analysis) {
          return (
            <div className="keyword-analysis">
              <div className="keyword-section">
                <h3>Keywords Found in Resume</h3>
                <div className="keyword-list">
                  {analysisResult.keyword_analysis.keywords_found?.map((keyword, index) => (
                    <span key={index} className="keyword-tag found">{keyword}</span>
                  ))}
                </div>
              </div>
              <div className="keyword-section">
                <h3>Missing Keywords</h3>
                <div className="keyword-list">
                  {analysisResult.keyword_analysis.missing_keywords?.map((keyword, index) => (
                    <span key={index} className="keyword-tag missing">{keyword}</span>
                  ))}
                </div>
              </div>
              <div className="keyword-score">
                <h3>Keyword Match Score</h3>
                <div className="score-display">
                  <span className="score-value">{analysisResult.keyword_analysis.match_score || 0}%</span>
                </div>
              </div>
            </div>
          );
        }
        break;


      case 'technical_skills':
        if (analysisResult.technical_skills_matching) {
          const techMatching = analysisResult.technical_skills_matching;
          return (
            <div className="technical-skills-matching">
              <div className="tech-skills-header">
                <h3>Technical Skills Matching</h3>
                <div className="tech-match-percentage">
                  <span className="tech-percentage-value">{techMatching.match_percentage || 0}%</span>
                  <span className="tech-percentage-label">Match</span>
                </div>
              </div>
              
              <div className="tech-skills-grid">
                <div className="tech-skills-section">
                  <h4>Required Technical Skills</h4>
                  <div className="tech-skills-list">
                    {techMatching.required_skills?.map((skill, index) => (
                      <span key={index} className="tech-skill-tag required">{skill}</span>
                    ))}
                  </div>
                </div>
                
                <div className="tech-skills-section">
                  <h4>Matched Technical Skills</h4>
                  <div className="tech-skills-list">
                    {techMatching.matched_skills?.map((skill, index) => (
                      <span key={index} className="tech-skill-tag matched">{skill}</span>
                    ))}
                  </div>
                </div>
                
                <div className="tech-skills-section">
                  <h4>Missing Technical Skills</h4>
                  <div className="tech-skills-list">
                    {techMatching.missing_skills?.map((skill, index) => (
                      <span key={index} className="tech-skill-tag missing">{skill}</span>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="tech-skills-summary">
                <div className="summary-stats">
                  <div className="stat-item">
                    <span className="stat-value">{techMatching.required_skills?.length || 0}</span>
                    <span className="stat-label">Required</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-value">{techMatching.matched_skills?.length || 0}</span>
                    <span className="stat-label">Matched</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-value">{techMatching.missing_skills?.length || 0}</span>
                    <span className="stat-label">Missing</span>
                  </div>
                </div>
              </div>
            </div>
          );
        }
        break;

      case 'work_experience':
        if (analysisResult.work_experience_matching) {
          const workExpMatching = analysisResult.work_experience_matching;
          return (
            <div className="work-experience-matching">
              <div className="work-exp-header">
                <h3>Work Experience Matching</h3>
                <div className="work-exp-match-percentage">
                  <span className="work-exp-percentage-value">{workExpMatching.match_percentage || 0}%</span>
                  <span className="work-exp-percentage-label">Match</span>
                </div>
              </div>
              
              <div className="work-exp-grid">
                <div className="work-exp-section">
                  <h4>Required Experience Areas</h4>
                  <div className="work-exp-list">
                    {workExpMatching.required_experience?.map((exp, index) => (
                      <span key={index} className="work-exp-tag required">{exp}</span>
                    ))}
                  </div>
                </div>
                
                <div className="work-exp-section">
                  <h4>Matched Experience</h4>
                  <div className="work-exp-list">
                    {workExpMatching.matched_experience?.map((exp, index) => (
                      <span key={index} className="work-exp-tag matched">{exp}</span>
                    ))}
                  </div>
                </div>
                
                <div className="work-exp-section">
                  <h4>Missing Experience</h4>
                  <div className="work-exp-list">
                    {workExpMatching.missing_experience?.map((exp, index) => (
                      <span key={index} className="work-exp-tag missing">{exp}</span>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="work-exp-assessment">
                <div className="assessment-grid">
                  <div className="assessment-item">
                    <h4>Experience Level Match</h4>
                    <div className="assessment-value">
                      <span className={`level-badge ${workExpMatching.experience_level_match?.toLowerCase() || 'unknown'}`}>
                        {workExpMatching.experience_level_match || 'Not Specified'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="assessment-item">
                    <h4>Years Experience Match</h4>
                    <div className="assessment-value">
                      <span className={`years-match ${workExpMatching.years_experience_match ? 'match' : 'no-match'}`}>
                        {workExpMatching.years_experience_match ? '✓ Yes' : '✗ No'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="assessment-item">
                    <h4>Industry Relevance</h4>
                    <div className="assessment-value">
                      <span className="industry-score">{workExpMatching.industry_relevance || 0}/100</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="work-exp-summary">
                <div className="summary-stats">
                  <div className="stat-item">
                    <span className="stat-value">{workExpMatching.required_experience?.length || 0}</span>
                    <span className="stat-label">Required</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-value">{workExpMatching.matched_experience?.length || 0}</span>
                    <span className="stat-label">Matched</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-value">{workExpMatching.missing_experience?.length || 0}</span>
                    <span className="stat-label">Missing</span>
                  </div>
                </div>
              </div>

              {/* Action Verb Analysis Section */}
              {analysisResult.action_verb_analysis && (
                <div className="action-verb-analysis">
                  <div className="action-verb-header">
                    <h3>Action Verb Analysis</h3>
                    <div className="verb-diversity-score">
                      <span className="diversity-score-value">{analysisResult.action_verb_analysis.verb_diversity_score || 0}</span>
                      <span className="diversity-score-label">Diversity Score</span>
                    </div>
                  </div>
                  
                  {analysisResult.action_verb_analysis.repeated_verbs && analysisResult.action_verb_analysis.repeated_verbs.length > 0 && (
                    <div className="repeated-verbs-section">
                      <h4>Repeated Action Verbs</h4>
                      <div className="repeated-verbs-list">
                        {analysisResult.action_verb_analysis.repeated_verbs.map((verbData, index) => (
                          <div key={index} className="repeated-verb-item">
                            <span className="verb-name">{verbData.verb}</span>
                            <span className="verb-count">({verbData.count} times)</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {analysisResult.action_verb_analysis.suggested_replacements && analysisResult.action_verb_analysis.suggested_replacements.length > 0 && (
                    <div className="verb-suggestions-section">
                      <h4>Verb Replacement Suggestions</h4>
                      <div className="verb-suggestions-list">
                        {analysisResult.action_verb_analysis.suggested_replacements.map((suggestion, index) => (
                          <div key={index} className="verb-suggestion-item">
                            <div className="original-verb">
                              <span className="verb-label">Instead of:</span>
                              <span className="verb-name">{suggestion.original_verb}</span>
                              <span className="verb-category">{suggestion.category}</span>
                            </div>
                            <div className="suggested-verbs">
                              <span className="suggestion-label">Try:</span>
                              {suggestion.suggestions.map((altVerb, altIndex) => (
                                <span key={altIndex} className="suggested-verb">{altVerb}</span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {analysisResult.action_verb_analysis.improvement_suggestions && analysisResult.action_verb_analysis.improvement_suggestions.length > 0 && (
                    <div className="improvement-suggestions-section">
                      <h4>Improvement Suggestions</h4>
                      <ul className="improvement-list">
                        {analysisResult.action_verb_analysis.improvement_suggestions.map((suggestion, index) => (
                          <li key={index} className="improvement-item">{suggestion}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        }
        break;


      default:
        return null;
    }
    return null;
  };

  return (
    <div className="analysis-section">
      <div className="section-header">
        <div className="section-title">
          <h2>{getSectionTitle(section)}</h2>
          <p>{getSectionDescription(section)}</p>
        </div>
        
        <div className="section-actions">
          {analysisResult && (
            <button className="copy-btn" onClick={handleCopy}>
              {copied ? (
                <>
                  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Copied!
                </>
              ) : (
                <>
                  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copy
                </>
              )}
            </button>
          )}
          
          <button
            className="btn btn-primary"
            onClick={onRunAnalysis}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="loading-spinner"></span>
                Analyzing...
              </>
            ) : (
              <>
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Run Analysis
              </>
            )}
          </button>
        </div>
      </div>

      <div className="section-content">
        {isLoading && (
          <div className="loading-state">
            <Loader />
            <p>Analyzing {getSectionTitle(section).toLowerCase()}...</p>
          </div>
        )}

        {!isLoading && !analysisResult && (
          <div className="empty-state">
            <svg className="empty-state-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3>No Analysis Yet</h3>
            <p>Click "Run Analysis" to analyze this section of your resume</p>
          </div>
        )}

        {!isLoading && analysisResult && (
          <div className="analysis-results">
            {renderSpecialSection() || (
              <div className="results-content">
                {section === 'comprehensive_analysis' ? (
                  <ReactMarkdown>{analysisResult.analysis}</ReactMarkdown>
                ) : (
                  analysisResult.analysis
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalysisSection;
