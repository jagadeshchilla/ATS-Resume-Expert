import React from 'react';
import styled from 'styled-components';

interface Section {
  id: string;
  label: string;
  icon: React.ReactNode;
}

interface SideNavbarProps {
  sections: Section[];
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const SideNavbar: React.FC<SideNavbarProps> = ({
  sections,
  activeSection,
  onSectionChange
}) => {
  return (
    <StyledNavbar>
      {/* Mobile Navigation Bar */}
      <MobileNavContainer>
        {/* Mobile Navigation Buttons */}
        <div className="mobile-nav-buttons">
          {sections.map((section) => (
            <button
              key={section.id}
              className={`nav-button ${activeSection === section.id ? 'active' : ''}`}
              onClick={() => onSectionChange(section.id)}
              title={section.label}
            >
              {section.icon}
            </button>
          ))}
        </div>
      </MobileNavContainer>

      {/* Desktop Sidebar */}
      <DesktopSidebar>
        <div className="sidebar-content">
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

        <div className="sidebar-footer">
          <div className="nav-info">
            <p>ATS Resume Expert</p>
            <p className="nav-version">v1.0</p>
          </div>
        </div>
      </DesktopSidebar>
    </StyledNavbar>
  );
};

// Styled Components
const StyledNavbar = styled.div`
  /* Base styles */
`;

const MobileNavContainer = styled.div`
  display: none;
  
  @media (max-width: 768px) {
    display: block;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: var(--color-white);
    border-top: 1px solid var(--color-border-light);
    padding: 8px 16px;
    box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.1);
    z-index: 1000;
  }

  .mobile-nav-buttons {
    display: flex;
    justify-content: space-around;
    align-items: center;
    gap: 8px;
    padding: 8px 0;
  }

  .nav-button {
    outline: 0 !important;
    border: 0 !important;
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background-color: transparent;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--color-text-secondary);
    transition: all ease-in-out 0.3s;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
    touch-action: manipulation;
    position: relative;

    &:hover {
      background-color: var(--color-light-gray);
      transform: translateY(-2px);
    }

    &:active {
      transform: translateY(-1px);
    }

    &.active {
      background-color: var(--color-primary-blue);
      color: var(--color-white);
      transform: translateY(-2px);
      
      &::after {
        content: '';
        position: absolute;
        bottom: -4px;
        left: 50%;
        transform: translateX(-50%);
        width: 6px;
        height: 6px;
        background-color: var(--color-primary-blue);
        border-radius: 50%;
      }
    }

    svg {
      font-size: 20px;
      width: 20px;
      height: 20px;
    }
  }
`;

const DesktopSidebar = styled.div`
  display: block;
  width: 280px;
  background-color: var(--color-white);
  border-right: 1px solid var(--color-border-light);
  display: flex;
  flex-direction: column;
  box-shadow: var(--shadow-sm);

  @media (max-width: 768px) {
    display: none;
  }

  .sidebar-content {
    flex: 1;
    padding: var(--spacing-lg);
    overflow-y: auto;
  }

  .nav-section {
    margin-bottom: var(--spacing-lg);
  }

  .nav-section h3 {
    font-size: 14px;
    font-weight: 600;
    color: var(--color-text-muted);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: var(--spacing-sm);
  }

  .nav-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .nav-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    background-color: transparent;
    border: none;
    border-radius: var(--radius-md);
    font-size: 14px;
    color: var(--color-text-primary);
    cursor: pointer;
    transition: all 0.2s ease;
    width: 100%;
    text-align: left;
    margin-bottom: 4px;
    -webkit-tap-highlight-color: transparent;
    touch-action: manipulation;
    min-height: 44px;

    &:hover {
      background-color: var(--color-light-gray);
      transform: translateX(4px);
    }

    &:active {
      transform: translateX(2px);
    }

    &.active {
      background-color: var(--color-primary-light);
      color: var(--color-primary);
      font-weight: 500;
      transform: translateX(6px);
    }
  }

  .nav-icon {
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
  }

  .nav-label {
    flex: 1;
    font-weight: 500;
  }

  .sidebar-footer {
    padding: var(--spacing-lg);
    border-top: 1px solid var(--color-border-light);
  }

  .nav-info {
    text-align: center;
  }

  .nav-info p {
    font-size: 12px;
    color: var(--color-text-muted);
    margin: 0;
  }

  .nav-version {
    font-weight: 500;
  }
`;

export default SideNavbar;
