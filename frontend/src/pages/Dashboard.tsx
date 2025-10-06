import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SideNavbar from '../components/SideNavbar';
import AnalysisSection from '../components/AnalysisSection';
import SkillsVisualization from '../components/SkillsVisualization';
import { analyzeResume } from '../api/atsApi';
import { AnalysisResult } from '../types';
import Loader from '../components/Loader';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('overview');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [jobDescription, setJobDescription] = useState('');
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  useEffect(() => {
    // Get data from localStorage
    const savedJobDescription = localStorage.getItem('jobDescription');
    const savedResumeFileName = localStorage.getItem('resumeFileName');
    const savedResumeFileData = localStorage.getItem('resumeFileData');

    if (!savedJobDescription || !savedResumeFileName || !savedResumeFileData) {
      navigate('/');
      return;
    }

    setJobDescription(savedJobDescription);
    
    // Convert base64 back to File object
    const byteCharacters = atob(savedResumeFileData.split(',')[1]);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const file = new File([byteArray], savedResumeFileName, { type: 'application/pdf' });
    setResumeFile(file);

    // Run comprehensive analysis automatically
    runComprehensiveAnalysis(savedJobDescription, file);
  }, [navigate]);

  const runComprehensiveAnalysis = async (jobDesc: string, resume: File) => {
    try {
      setIsLoading(true);
      setError('');
      
      // Get API key from localStorage
      const apiKey = localStorage.getItem('gemini_api_key');
      
      const result = await analyzeResume(jobDesc, resume, 'comprehensive_analysis', apiKey || undefined);
      setAnalysisResult(result);
    } catch (error: any) {
      setError(error.message || 'Failed to analyze resume');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
  };

  const sections = [
    { 
      id: 'overview', 
      label: 'Overview', 
      icon: (
        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    },
    { 
      id: 'comprehensive_analysis', 
      label: 'Comprehensive Report', 
      icon: (
        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },
    { 
      id: 'keyword_analysis', 
      label: 'Keyword Analysis', 
      icon: (
        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      )
    },
    { 
      id: 'technical_skills', 
      label: 'Technical Skills', 
      icon: (
        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )
    },
    { 
      id: 'work_experience', 
      label: 'Work Experience', 
      icon: (
        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6" />
        </svg>
      )
    }
  ];

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        <SideNavbar
          sections={sections}
          activeSection={activeSection}
          onSectionChange={handleSectionChange}
        />
        
        <div className="dashboard-content">
          <div className="dashboard-header">
            <h1>Resume Analysis Dashboard</h1>
            <p>Comprehensive AI-powered analysis of your resume against the job description</p>
          </div>

          {error && (
            <div className="alert alert-error">
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {isLoading && (
            <div className="loading-overlay">
              <Loader />
              <p>Analyzing resume...</p>
            </div>
          )}

          <div className="dashboard-main">
            {activeSection === 'overview' && (
              <div className="overview-section">
                <SkillsVisualization 
                  analysisResult={analysisResult}
                  isLoading={isLoading}
                />
                <div className="overview-summary">
                  <h2>Analysis Summary</h2>
                  <p>This dashboard provides comprehensive analysis of your resume against the job description. The analysis includes technical skills assessment, experience evaluation, and overall match percentage.</p>
                  
                  {analysisResult && (
                    <div className="analysis-complete">
                      <div className="complete-indicator">
                        <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Analysis Complete</span>
                      </div>
                      <p>Your comprehensive resume analysis is ready. Click on "Comprehensive Report" in the sidebar to view detailed results.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeSection === 'comprehensive_analysis' && (
              <AnalysisSection
                section="comprehensive_analysis"
                analysisResult={analysisResult}
                isLoading={isLoading}
                onRunAnalysis={() => runComprehensiveAnalysis(jobDescription, resumeFile!)}
              />
            )}

            {activeSection === 'keyword_analysis' && (
              <AnalysisSection
                section="keyword_analysis"
                analysisResult={analysisResult}
                isLoading={isLoading}
                onRunAnalysis={() => runComprehensiveAnalysis(jobDescription, resumeFile!)}
              />
            )}

            {activeSection === 'technical_skills' && (
              <AnalysisSection
                section="technical_skills"
                analysisResult={analysisResult}
                isLoading={isLoading}
                onRunAnalysis={() => runComprehensiveAnalysis(jobDescription, resumeFile!)}
              />
            )}

            {activeSection === 'work_experience' && (
              <AnalysisSection
                section="work_experience"
                analysisResult={analysisResult}
                isLoading={isLoading}
                onRunAnalysis={() => runComprehensiveAnalysis(jobDescription, resumeFile!)}
              />
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
