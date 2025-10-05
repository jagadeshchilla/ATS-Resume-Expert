import axios from 'axios';
import { AnalysisResult } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

// Separate instance for JSON requests
const jsonApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const analyzeResume = async (
  jobDescription: string,
  resumeFile: File,
  analysisType: string,
  apiKey?: string
): Promise<AnalysisResult> => {
  const formData = new FormData();
  formData.append('job_description', jobDescription);
  formData.append('resume_file', resumeFile);
  formData.append('analysis_type', analysisType);
  
  // Add API key if provided
  if (apiKey) {
    formData.append('api_key', apiKey);
  }

  try {
    const response = await api.post<AnalysisResult>('/analyze-resume', formData, {
      params: { analysis_type: analysisType }
    });
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.detail || 'Failed to analyze resume');
    } else if (error.request) {
      throw new Error('No response from server. Please ensure the backend is running.');
    } else {
      throw new Error('Error setting up the request');
    }
  }
};

export const validateApiKey = async (apiKey: string): Promise<{valid: boolean, message: string}> => {
  try {
    const response = await jsonApi.post('/validate-api-key', { api_key: apiKey });
    return response.data;
  } catch (error: any) {
    if (error.response) {
      return {
        valid: false,
        message: error.response.data.message || 'Invalid API key'
      };
    } else {
      return {
        valid: false,
        message: 'Error validating API key'
      };
    }
  }
};

export const getPromptCategories = async () => {
  try {
    const response = await jsonApi.get('/prompt-categories');
    return response.data;
  } catch (error) {
    console.error('Error fetching prompt categories:', error);
    throw error;
  }
};

export const healthCheck = async () => {
  try {
    const response = await jsonApi.get('/health');
    return response.data;
  } catch (error) {
    console.error('Health check failed:', error);
    throw error;
  }
};
