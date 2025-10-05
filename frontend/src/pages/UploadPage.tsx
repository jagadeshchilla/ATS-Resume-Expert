import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FileUpload from '../components/FileUpload';
import Loader from '../components/Loader';

const UploadPage: React.FC = () => {
  const navigate = useNavigate();
  const [jobDescription, setJobDescription] = useState('');
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleJobDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setJobDescription(e.target.value);
  };

  const handleResumeFileChange = (file: File | null) => {
    setResumeFile(file);
  };

  const handleSubmit = async () => {
    if (!jobDescription.trim()) {
      setError('Please enter a job description');
      return;
    }

    if (!resumeFile) {
      setError('Please upload a resume file');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      
      // Store data in localStorage for dashboard
      localStorage.setItem('jobDescription', jobDescription);
      localStorage.setItem('resumeFileName', resumeFile.name);
      
      // Store the actual file for backend processing
      const reader = new FileReader();
      reader.onload = () => {
        localStorage.setItem('resumeFileData', reader.result as string);
        navigate('/dashboard');
      };
      reader.readAsDataURL(resumeFile);
    } catch (error: any) {
      setError(error.message || 'Failed to process files');
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = jobDescription.trim() && resumeFile;

  return (
    <div className="upload-page">
      <div className="upload-container">
        <div className="upload-header">
          <h1 className="upload-title">Upload Resume & Job Description</h1>
          <p className="upload-subtitle">Upload your resume and job description to get started with AI-powered analysis</p>
        </div>

        <div className="upload-form">
          <div className="form-section animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <h2 className="section-title">Job Description</h2>
            <p className="section-description">Paste the job description or requirements you want to match against</p>
            <textarea
              className="form-textarea"
              rows={8}
              placeholder="Paste the job description here..."
              value={jobDescription}
              onChange={handleJobDescriptionChange}
            />
          </div>

          <div className="form-section animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <h2 className="section-title">Resume Upload</h2>
            <p className="section-description">Upload your resume in PDF format for analysis</p>
            <FileUpload
              onFileChange={handleResumeFileChange}
              acceptedFileTypes=".pdf"
            />
          </div>


          {error && (
            <div className="alert alert-error animate-fade-in">
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {!isFormValid && (
            <div className="form-help">
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Please fill in both the job description and upload a resume to continue</span>
            </div>
          )}

          <button
            className={`btn btn-primary btn-large ${isFormValid ? 'btn-pulse' : ''}`}
            onClick={handleSubmit}
            disabled={!isFormValid || isLoading}
          >
            {isLoading ? (
              <>
                <Loader />
                Processing...
              </>
            ) : (
              <>
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                Continue to Analysis Dashboard
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadPage;
