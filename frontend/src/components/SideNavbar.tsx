import React from 'react';

interface Section {
  id: string;
  label: string;
  icon: React.ReactNode;
}

interface SideNavbarProps {
  sections: Section[];
  activeSection: string;
  onSectionChange: (section: string) => void;
  onBackToUpload: () => void;
}

const SideNavbar: React.FC<SideNavbarProps> = ({
  sections,
  activeSection,
  onSectionChange,
  onBackToUpload
}) => {
  return (
    <nav className="side-navbar">
      <div className="side-navbar-header">
        <button className="back-button" onClick={onBackToUpload}>
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Upload
        </button>
      </div>

      <div className="side-navbar-content">
        <div className="nav-section">
          <h3>Analysis Sections</h3>
          <ul className="nav-list">
            {sections.map((section) => (
              <li key={section.id}>
                <button
                  className={`nav-item ${activeSection === section.id ? 'active' : ''}`}
                  onClick={() => onSectionChange(section.id)}
                >
                  <span className="nav-icon">{section.icon}</span>
                  <span className="nav-label">{section.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>

      </div>

      <div className="side-navbar-footer">
        <div className="nav-info">
          <p>ATS Resume Expert</p>
          <p className="nav-version">v1.0</p>
        </div>
      </div>
    </nav>
  );
};

export default SideNavbar;
