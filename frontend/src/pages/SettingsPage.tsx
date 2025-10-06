import React, { useState, useEffect } from 'react';
import { validateApiKey } from '../api/atsApi';

const SettingsPage: React.FC = () => {
  const [apiKey, setApiKey] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [validationMessage, setValidationMessage] = useState('');
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    // Load saved API key from localStorage
    const savedApiKey = localStorage.getItem('gemini_api_key');
    if (savedApiKey) {
      setApiKey(savedApiKey);
      setIsValid(true);
    }
  }, []);

  const validateApiKeyHandler = async (key: string) => {
    if (!key.trim()) {
      setValidationMessage('');
      setIsValid(false);
      return;
    }

    setIsValidating(true);
    setValidationMessage('Validating API key...');

    try {
      const result = await validateApiKey(key);
      if (result.valid) {
        setValidationMessage('✅ API key is valid');
        setIsValid(true);
        localStorage.setItem('gemini_api_key', key);
      } else {
        setValidationMessage(`❌ ${result.message}`);
        setIsValid(false);
      }
    } catch (error) {
      setValidationMessage('❌ Error validating API key');
      setIsValid(false);
    } finally {
      setIsValidating(false);
    }
  };

  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setApiKey(value);
    
    // Clear validation message when user starts typing
    if (validationMessage) {
      setValidationMessage('');
    }
  };

  const handleSave = () => {
    if (apiKey.trim()) {
      localStorage.setItem('gemini_api_key', apiKey.trim());
      setValidationMessage('✅ API key saved successfully');
      setIsValid(true);
    }
  };

  const handleClear = () => {
    setApiKey('');
    setValidationMessage('');
    setIsValid(false);
    localStorage.removeItem('gemini_api_key');
  };

  return (
    <div className="settings-page">
      <div className="settings-container">
        <div className="settings-header">
          <h1 className="settings-title">Settings</h1>
          <p className="settings-subtitle">Configure your API settings for resume analysis</p>
        </div>

        <div className="settings-content">
          <div className="settings-section animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="section-header">
              <h2 className="section-title">Gemini API Configuration</h2>
              <p className="section-description">Enter your Google Gemini API key to enable AI-powered resume analysis</p>
            </div>

            <div className="api-key-section">
              <div className="input-group">
                <label htmlFor="api-key">API Key</label>
                <div className="input-wrapper">
                  <input
                    id="api-key"
                    type="password"
                    value={apiKey}
                    onChange={handleApiKeyChange}
                    placeholder="Enter your Gemini API key"
                    className={`api-key-input ${isValid ? 'valid' : ''}`}
                  />
                  <button
                    type="button"
                    className="validate-btn"
                    onClick={() => validateApiKeyHandler(apiKey)}
                    disabled={!apiKey.trim() || isValidating}
                  >
                    {isValidating ? (
                      <>
                        <span className="loading-spinner"></span>
                        Validating...
                      </>
                    ) : (
                      'Validate'
                    )}
                  </button>
                </div>
                {validationMessage && (
                  <div className={`validation-message ${isValid ? 'success' : 'error'} animate-fade-in`}>
                    {validationMessage}
                  </div>
                )}
              </div>

              <div className="api-key-actions">
                <button
                  className="btn btn-primary"
                  onClick={handleSave}
                  disabled={!apiKey.trim() || !isValid}
                >
                  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Save API Key
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={handleClear}
                >
                  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Clear
                </button>
              </div>
            </div>

            <div className="api-key-info">
              <h3>How to get your Gemini API key:</h3>
              <ol>
                <li>Go to <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer">Google AI Studio</a></li>
                <li>Sign in with your Google account</li>
                <li>Click "Create API Key"</li>
                <li>Copy the generated API key</li>
                <li>Paste it in the field above</li>
              </ol>
              <div className="security-note">
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span>Your API key is stored locally in your browser and never sent to our servers.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
