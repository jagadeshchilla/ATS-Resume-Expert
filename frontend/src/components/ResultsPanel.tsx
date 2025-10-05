import React, { useState } from 'react';
import { AnalysisResult } from '../types';
import Loader from './Loader';

interface ResultsPanelProps {
  result: AnalysisResult | null;
  isLoading: boolean;
  error: string | null;
}

const ResultsPanel: React.FC<ResultsPanelProps> = ({ result, isLoading, error }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (result?.analysis) {
      try {
        await navigator.clipboard.writeText(result.analysis);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy text:', err);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="results-panel">
        <div className="empty-state">
          <Loader />
          <h3 className="empty-state-title">Analyzing Resume...</h3>
          <p className="empty-state-description">
            Please wait while we analyze your resume against the job description
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="results-panel">
        <div className="alert alert-error">
          <svg
            width="20"
            height="20"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{error}</span>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="results-panel">
        <div className="empty-state">
          <svg
            className="empty-state-icon"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h3 className="empty-state-title">No Analysis Yet</h3>
          <p className="empty-state-description">
            Upload a job description and resume to get started with AI-powered analysis
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="results-panel">
      <div className="results-container">
        <div className="results-header">
          <h2 className="results-title">Analysis Results</h2>
          <button className="copy-btn" onClick={handleCopy}>
            {copied ? (
              <>
                <svg
                  width="16"
                  height="16"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Copied!
              </>
            ) : (
              <>
                <svg
                  width="16"
                  height="16"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
                Copy
              </>
            )}
          </button>
        </div>
        <div className="results-content">
          {result.analysis}
        </div>
      </div>
    </div>
  );
};

export default ResultsPanel;
