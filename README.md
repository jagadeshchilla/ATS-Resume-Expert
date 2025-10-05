# ATS Resume Expert

An AI-powered Applicant Tracking System (ATS) that analyzes resumes against job descriptions using Google's Gemini AI. Features a clean, minimal white-themed interface with a split-screen dashboard for seamless resume analysis.

## 🎨 Design Features

- **Clean Minimal White Theme**: Professional design with subtle gray accents
- **Split Screen Layout**: Intuitive interface with input panel (40%) and results panel (60%)
- **No Authentication Required**: Simple, straightforward user experience
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Drag & Drop Upload**: Easy file upload with visual feedback
- **14 Analysis Types**: Comprehensive analysis options for different resume aspects

## 🏗️ Architecture

### Backend (FastAPI + Python)
- RESTful API with FastAPI
- Google Gemini AI integration for resume analysis
- PDF parsing with PyPDF2
- 14 specialized analysis prompts
- Action verbs database with 200+ professional verbs

### Frontend (React + TypeScript)
- Modern React 19 with TypeScript
- Clean component architecture
- Axios for API communication
- React Dropzone for file uploads
- CSS Variables for consistent theming

## 📋 Prerequisites

- Python 3.8+
- Node.js 14+
- Google Gemini API Key

## 🚀 Quick Start

### 1. Clone the Repository

```bash
cd ats
```

### 2. Backend Setup

```bash
cd backend

# Create virtual environment (optional but recommended)
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
echo "GEMINI_API_KEY=your_api_key_here" > .env

# Run the backend server
python app.py
```

The backend will run on `http://localhost:8000`

### 3. Frontend Setup

Open a new terminal:

```bash
cd frontend

# Install dependencies
npm install

# Run the development server
npm start
```

The frontend will open automatically at `http://localhost:3000`

## 📁 Project Structure

```
ats/
├── backend/
│   ├── app.py                          # Main FastAPI application
│   ├── prompts.py                      # AI prompts and action verbs
│   ├── requirements.txt                # Python dependencies
│   ├── test_api.py                     # API tests
│   ├── .env                           # Environment variables (create this)
│   └── instruction/                    # Reference images
│
├── frontend/
│   ├── public/                         # Static files
│   ├── src/
│   │   ├── api/
│   │   │   └── atsApi.ts              # Backend API integration
│   │   ├── components/
│   │   │   ├── Navbar.tsx             # Navigation bar
│   │   │   ├── InputPanel.tsx         # Left panel - inputs
│   │   │   ├── FileUpload.tsx         # File upload component
│   │   │   └── ResultsPanel.tsx       # Right panel - results
│   │   ├── types.ts                   # TypeScript types
│   │   ├── App.tsx                    # Main app component
│   │   ├── App.css                    # Application styles
│   │   ├── index.tsx                  # Entry point
│   │   └── index.css                  # Global styles
│   ├── .env                           # Environment variables
│   ├── package.json                   # Node dependencies
│   └── README.md                      # Frontend documentation
│
└── README.md                          # This file
```

## 🎯 Features

### Analysis Types

1. **Comprehensive Analysis** - Complete resume evaluation with match percentage
2. **Summary Optimization** - Professional summary enhancement
3. **Skills Optimization** - Skills section analysis and improvement
4. **Work Experience** - Work experience descriptions enhancement
5. **Education** - Education section optimization
6. **Projects** - Project descriptions improvement
7. **Certifications** - Certifications review and suggestions
8. **Leadership** - Leadership qualities identification
9. **Quantify Achievements** - Adding quantifiable metrics
10. **Action Verbs** - Action verbs improvement and repetition detection
11. **Bullet Points** - Bullet point formatting optimization
12. **Tailor Resume** - Job-specific resume tailoring
13. **Data Analysis** - Data analysis skills focus
14. **Marketing** - Marketing experience analysis

### Key Capabilities

- ✅ PDF resume upload and parsing
- ✅ Job description text input
- ✅ AI-powered analysis using Google Gemini
- ✅ Multiple analysis perspectives
- ✅ Action verb optimization with 200+ professional verbs
- ✅ Copy-to-clipboard functionality
- ✅ Real-time loading states
- ✅ Error handling and validation
- ✅ Responsive design

## 🎨 Design System

### Color Palette

| Color | Hex Code | Usage |
|-------|----------|-------|
| White | #FFFFFF | Main background |
| Off-white | #FAFAFA | Secondary backgrounds |
| Light Gray | #F9FAFB | Subtle accents |
| Primary Blue | #3B82F6 | Interactive elements |
| Success Green | #10B981 | Success states |
| Warning Orange | #F59E0B | Warnings |
| Error Red | #EF4444 | Errors |

### Typography

- **Font**: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI'
- **Base Size**: 16px
- **Line Height**: 1.5
- **Weights**: 300, 400, 500, 600, 700

### Spacing

- **Base Unit**: 8px
- **Scale**: 8px, 16px, 24px, 32px, 48px

## 🔌 API Endpoints

### Backend API

- `GET /` - API status
- `GET /health` - Health check
- `POST /analyze-resume` - Analyze resume with file upload
- `POST /analyze-resume-text` - Analyze resume with text input
- `POST /analyze-specific-section` - Analyze specific resume section
- `POST /analyze-action-verbs` - Enhanced action verb analysis
- `GET /prompt-categories` - Get available analysis categories
- `GET /action-verbs-reference` - Get action verbs database

## 🧪 Testing

### Backend Tests

```bash
cd backend
python test_api.py
```

### Frontend Tests

```bash
cd frontend
npm test
```

## 🔧 Configuration

### Backend Environment Variables

Create a `.env` file in the `backend` directory:

```env
GEMINI_API_KEY=your_google_gemini_api_key
```

### Frontend Environment Variables

Create a `.env` file in the `frontend` directory:

```env
REACT_APP_API_URL=http://localhost:8000
```

## 📦 Building for Production

### Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn app:app --host 0.0.0.0 --port 8000
```

### Frontend

```bash
cd frontend
npm run build
```

The production build will be in the `frontend/build` directory.

## 🚀 Deployment

### Backend Deployment Options

- **Heroku**: Use `Procfile` with `web: uvicorn app:app --host 0.0.0.0 --port $PORT`
- **AWS Lambda**: Use Mangum adapter
- **Docker**: Create a Dockerfile with Python and FastAPI
- **Railway/Render**: Direct deployment from Git

### Frontend Deployment Options

- **Vercel**: Connect GitHub repository
- **Netlify**: Drag and drop build folder
- **AWS S3 + CloudFront**: Static hosting
- **GitHub Pages**: Use `gh-pages` package

## 🤝 Contributing

This is a private project. For any issues or suggestions, please contact the development team.

## 📄 License

Proprietary - All rights reserved

## 🙏 Acknowledgments

- Google Gemini AI for resume analysis
- FastAPI for the backend framework
- React for the frontend framework
- DC Action Verbs for Resumes for the comprehensive verb database

## 📞 Support

For support, please contact the development team or create an issue in the repository.

---

**Built with ❤️ using FastAPI, React, and Google Gemini AI**
