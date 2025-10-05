import React, { useState } from 'react';
import FileUpload from './FileUpload';
import { analyzeResume } from '../api/atsApi';
import { AnalysisResult, ANALYSIS_CATEGORIES } from '../types';

interface InputPanelProps {
  onAnalysisComplete: (result: AnalysisResult) => void;
  onError: (error: string) => void;
  onLoadingChange: (loading: boolean) => void;
  isLoading: boolean;
}

const InputPanel: React.FC<InputPanelProps> = ({
  onAnalysisComplete,
  onError,
  onLoadingChange,
  isLoading
}) => {
  const [jobDescription, setJobDescription] = useState('');
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [analysisType, setAnalysisType] = useState('comprehensive_analysis');

  const handleJobDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setJobDescription(e.target.value);
  };

  const handleResumeFileChange = (file: File | null) => {
    setResumeFile(file);
  };

  const handleAnalysisTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setAnalysisType(e.target.value);
  };

  const handleSubmit = async () => {
    if (!jobDescription.trim()) {
      onError('Please enter a job description');
      return;
    }

    if (!resumeFile) {
      onError('Please upload a resume file');
      return;
    }

    try {
      onLoadingChange(true);
      onError('');
      const result = await analyzeResume(jobDescription, resumeFile, analysisType);
      onAnalysisComplete(result);
    } catch (error: any) {
      onError(error.message || 'Failed to analyze resume');
    } finally {
      onLoadingChange(false);
    }
  };

  const isFormValid = jobDescription.trim() && resumeFile;

  return (
    <div className="input-panel">
      <div>
        <h2 className="section-header">Job Description</h2>
        <p className="section-description">
          Paste the job description or requirements you want to match against
        </p>
        <textarea
          className="form-textarea"
          rows={8}
          placeholder="Paste the job description here..."
          value={jobDescription}
          onChange={handleJobDescriptionChange}
          style={{
            width: '100%',
            padding: '12px 16px',
            border: '1px solid var(--color-border-medium)',
            borderRadius: 'var(--radius-md)',
            fontSize: '14px',
            fontFamily: 'inherit',
            resize: 'vertical',
            backgroundColor: 'var(--color-white)'
          }}
        />
      </div>

      <div>
        <h2 className="section-header">Resume Upload</h2>
        <p className="section-description">
          Upload your resume in PDF format for analysis
        </p>
        <FileUpload
          onFileChange={handleResumeFileChange}
          acceptedFileTypes=".pdf"
        />
      </div>

      <div className="form-group">
        <label className="form-label">Analysis Type</label>
        <select
          className="form-select"
          value={analysisType}
          onChange={handleAnalysisTypeChange}
        >
          {ANALYSIS_CATEGORIES.map((category) => (
            <option key={category.value} value={category.value}>
              {category.label}
            </option>
          ))}
        </select>
        <p className="section-description" style={{ marginTop: '8px' }}>
          {ANALYSIS_CATEGORIES.find(c => c.value === analysisType)?.description}
        </p>
      </div>

      <button
        className="btn btn-primary btn-full-width"
        onClick={handleSubmit}
        disabled={!isFormValid || isLoading}
      >
        {isLoading ? (
          <>
            <span className="loading-spinner"></span>
            Analyzing...
          </>
        ) : (
          'Analyze Resume'
        )}
      </button>
    </div>
  );
};

export default InputPanel;
