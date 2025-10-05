import React, { useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler
} from 'chart.js';
import { Doughnut, Radar } from 'react-chartjs-2';
import { AnalysisResult } from '../types';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler
);

interface SkillsVisualizationProps {
  analysisResult: AnalysisResult | null;
  isLoading: boolean;
}

const SkillsVisualization: React.FC<SkillsVisualizationProps> = ({
  analysisResult,
  isLoading
}) => {
  // Extract match score from comprehensive analysis with improved consistency
  const extractMatchScore = (analysis: string): number => {
    // Look for "Total Match Percentage" or "Overall Match Score" first (most reliable)
    const totalMatchMatch = analysis.match(/(?:Total Match Percentage|Overall Match Score|Overall Match).*?(\d+)%/i);
    if (totalMatchMatch) {
      return parseInt(totalMatchMatch[1]);
    }
    
    // Look for "Overall Match" pattern
    const overallMatchMatch = analysis.match(/Overall Match.*?(\d+)%/i);
    if (overallMatchMatch) {
      return parseInt(overallMatchMatch[1]);
    }
    
    // Look for percentage patterns but be more selective
    const percentageMatch = analysis.match(/(\d+)%/g);
    if (percentageMatch) {
      const percentages = percentageMatch.map(match => parseInt(match.replace('%', '')));
      // Filter out obviously wrong percentages (too low or too high)
      const validPercentages = percentages.filter(p => p >= 20 && p <= 100);
      if (validPercentages.length > 0) {
        // Use the highest valid percentage, but be more consistent
        return Math.max(...validPercentages);
      }
    }
    
    // Look for "match" keyword with numbers
    const matchScoreMatch = analysis.match(/match.*?(\d+)/i);
    if (matchScoreMatch) {
      return parseInt(matchScoreMatch[1]);
    }
    
    // Default fallback
    return 75;
  };

  // Extract section scores from analysis result
  const extractSectionScores = (analysisResult: AnalysisResult | null) => {
    if (!analysisResult?.section_scores) {
      return {
        technical_skills: 75,
        work_experience: 80,
        education: 85,
        projects: 70,
        certifications: 60,
        soft_skills: 80
      };
    }
    
    // If all scores are 0, use fallback values
    const scores = analysisResult.section_scores;
    const allZero = Object.values(scores).every(score => score === 0 || score === undefined);
    
    if (allZero) {
      console.warn("All section scores are 0, using fallback values");
      return {
        technical_skills: 75,
        work_experience: 80,
        education: 85,
        projects: 70,
        certifications: 60,
        soft_skills: 80
      };
    }
    
    return scores;
  };

  // Memoize score calculations to prevent unnecessary recalculations
  const { matchScore, techSkillsMatchPercentage, sectionScores } = useMemo(() => {
    // Get match score from comprehensive analysis - prioritize structured data
    const matchScore = analysisResult ? 
      (analysisResult.overall_score || 
       (analysisResult.keyword_analysis?.match_score && analysisResult.keyword_analysis.match_score > 0 ? 
        analysisResult.keyword_analysis.match_score : 
        extractMatchScore(analysisResult.analysis))) : 75;
    
    // Get technical skills match percentage with fallback calculation
    const techSkillsMatchPercentage = (() => {
      if (analysisResult?.technical_skills_matching?.match_percentage) {
        return analysisResult.technical_skills_matching.match_percentage;
      }
      
      // Fallback: calculate match percentage from matched vs required skills
      if (analysisResult?.technical_skills_matching?.required_skills && 
          analysisResult?.technical_skills_matching?.matched_skills) {
        const requiredCount = analysisResult.technical_skills_matching.required_skills.length;
        const matchedCount = analysisResult.technical_skills_matching.matched_skills.length;
        if (requiredCount > 0) {
          return Math.round((matchedCount / requiredCount) * 100);
        }
      }
      
      // If no technical skills data available, use a reasonable default based on overall score
      return analysisResult?.overall_score ? Math.max(60, analysisResult.overall_score - 10) : 75;
    })();
    
    // Extract section scores
    const sectionScores = extractSectionScores(analysisResult);
    
    return { matchScore, techSkillsMatchPercentage, sectionScores };
  }, [analysisResult]);


  const doughnutData = {
    labels: ['Match', 'Gap'],
    datasets: [
      {
        data: [matchScore, 100 - matchScore],
        backgroundColor: [
          'rgba(16, 185, 129, 0.8)',
          'rgba(239, 68, 68, 0.8)',
        ],
        borderColor: [
          'rgba(16, 185, 129, 1)',
          'rgba(239, 68, 68, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Create radar chart data based on actual analysis results
  const radarData = useMemo(() => {
    // Use real job requirements scores from backend if available
    const getJobRequirements = () => {
      if (analysisResult?.job_requirements_scores) {
        return {
          technical_skills: analysisResult.job_requirements_scores.technical_skills || 85,
          work_experience: analysisResult.job_requirements_scores.work_experience || 80,
          education: analysisResult.job_requirements_scores.education || 75,
          projects: analysisResult.job_requirements_scores.projects || 70,
          certifications: analysisResult.job_requirements_scores.certifications || 60,
          soft_skills: analysisResult.job_requirements_scores.soft_skills || 75
        };
      }
      
      // Fallback: Calculate based on analysis data
      const baseRequirements = {
        technical_skills: 85,
        work_experience: 80,
        education: 75,
        projects: 70,
        certifications: 60,
        soft_skills: 75
      };

      // Adjust based on actual analysis if available
      if (analysisResult?.technical_skills_matching?.match_percentage) {
        const techMatch = analysisResult.technical_skills_matching.match_percentage;
        baseRequirements.technical_skills = Math.max(75, Math.min(95, techMatch + 20));
      }

      if (analysisResult?.work_experience_matching?.match_percentage) {
        const workMatch = analysisResult.work_experience_matching.match_percentage;
        baseRequirements.work_experience = Math.max(70, Math.min(90, workMatch + 15));
      }

      return baseRequirements;
    };

    const jobRequirements = getJobRequirements();
    const yourProfile = [
      sectionScores.technical_skills || 0,
      sectionScores.work_experience || 0,
      sectionScores.education || 0,
      sectionScores.projects || 0,
      sectionScores.certifications || 0,
      sectionScores.soft_skills || 0
    ];

    const jobReqs = [
      jobRequirements.technical_skills,
      jobRequirements.work_experience,
      jobRequirements.education,
      jobRequirements.projects,
      jobRequirements.certifications,
      jobRequirements.soft_skills
    ];

    return {
      labels: ['Technical Skills', 'Work Experience', 'Education', 'Projects', 'Certifications', 'Soft Skills'],
      datasets: [
        {
          label: 'Your Profile',
          data: yourProfile,
          backgroundColor: 'rgba(59, 130, 246, 0.2)',
          borderColor: 'rgba(59, 130, 246, 1)',
          borderWidth: 2,
          pointBackgroundColor: 'rgba(59, 130, 246, 1)',
        },
        {
          label: 'Job Requirements',
          data: jobReqs,
          backgroundColor: 'rgba(16, 185, 129, 0.2)',
          borderColor: 'rgba(16, 185, 129, 1)',
          borderWidth: 2,
          pointBackgroundColor: 'rgba(16, 185, 129, 1)',
        },
      ],
    };
  }, [analysisResult, sectionScores]);

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
    },
  };

  const radarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        beginAtZero: true,
        max: 100,
      },
    },
  };

  if (isLoading) {
    return (
      <div className="skills-visualization">
        <div className="visualization-header">
          <h2>Skills Visualization</h2>
          <p>Visual representation of your skills and match score</p>
        </div>
        <div className="loading-state">
          <div className="loading-spinner-large"></div>
          <p>Loading visualizations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="skills-visualization">
      <div className="visualization-header">
        <h2>Skills Visualization</h2>
        <p>Visual representation of your skills and match score</p>
      </div>

      <div className="visualization-grid">

        <div className="chart-container">
          <div className="chart-header">
            <h3>Job Match Score</h3>
            <p>Overall compatibility with the job requirements</p>
          </div>
          <div className="chart-wrapper">
            <Doughnut data={doughnutData} options={doughnutOptions} />
          </div>
          <div className="match-score">
            <span className="score-value">{matchScore}%</span>
            <span className="score-label">Match</span>
          </div>
        </div>

        <div className="chart-container">
          <div className="chart-header">
            <h3>Technical Skills Match</h3>
            <p>Percentage of required technical skills found in resume</p>
          </div>
          <div className="chart-wrapper">
            <Doughnut data={{
              labels: ['Matched', 'Missing'],
              datasets: [
                {
                  data: [techSkillsMatchPercentage, 100 - techSkillsMatchPercentage],
                  backgroundColor: [
                    'rgba(16, 185, 129, 0.8)',
                    'rgba(239, 68, 68, 0.8)',
                  ],
                  borderColor: [
                    'rgba(16, 185, 129, 1)',
                    'rgba(239, 68, 68, 1)',
                  ],
                  borderWidth: 1,
                },
              ],
            }} options={doughnutOptions} />
          </div>
          <div className="match-score">
            <span className="score-value">{techSkillsMatchPercentage}%</span>
            <span className="score-label">Tech Match</span>
          </div>
        </div>

        <div className="chart-container full-width">
          <div className="chart-header">
            <h3>Profile Analysis</h3>
            <p>Your resume scores vs estimated job requirements based on analysis</p>
          </div>
          <div className="chart-wrapper">
            <Radar data={radarData} options={radarOptions} />
          </div>
        </div>

      </div>
    </div>
  );
};

export default SkillsVisualization;
