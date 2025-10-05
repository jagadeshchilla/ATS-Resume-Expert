import React from 'react';

const Loader: React.FC = () => {
  return (
    <div style={{ display: 'inline-block' }}>
      <div className="loading">
        <svg width="64px" height="48px">
          <polyline 
            points="0.157 23.954, 14 23.954, 21.843 48, 43 0, 50 24, 64 24" 
            id="back"
            fill="none"
            stroke="#ff4d5033"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <polyline 
            points="0.157 23.954, 14 23.954, 21.843 48, 43 0, 50 24, 64 24" 
            id="front"
            fill="none"
            stroke="#ff4d4f"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="48, 144"
            strokeDashoffset="192"
            className="loader-animation"
          />
        </svg>
      </div>
    </div>
  );
};

export default Loader;
