# PathForge
**AI-forged learning roadmaps to your career**

PathForge is an AI-powered learning platform that helps students and fresh graduates build career-ready skills through personalized, deadline-based learning roadmaps.

## Features
- 🎯 Personalized learning roadmaps based on career goals
- 📄 Resume analysis and skill extraction
- 🤖 AI-powered skill gap analysis
- ⏰ Deadline-based resource scheduling
- 📊 Real-time progress tracking
- ✅ Sequential resource unlocking
- 📈 Module completion summaries

## Technology Stack

### Frontend
- **Framework:** React 18 with Vite
- **Routing:** React Router v6
- **Styling:** Bootstrap & React Bootstrap
- **Authentication:** Firebase Authentication
- **File Storage:** Firebase Storage
- **HTTP Client:** Axios

### Backend
- **Framework:** FastAPI (Python 3.10+)
- **Database:** MongoDB with Motor (async driver)
- **AI Integration:** OpenAI GPT, LangChain, Groq
- **Resume Parsing:** PyPDF2, python-docx, LangChain
- **File Storage:** GridFS (MongoDB)

## Project Structure
```
pathforge/
├── frontend/              # Vite + React application
│   ├── src/              # Source code
│   │   ├── main.jsx      # Entry point
│   │   ├── App.jsx       # Main component
│   │   ├── components/   # Reusable components
│   │   ├── pages/        # Page components
│   │   ├── contexts/     # React contexts
│   │   ├── lib/          # Utilities and configurations
│   │   └── assets/       # Static assets
│   ├── public/           # Public static files
│   ├── vite.config.js    # Vite configuration
│   └── package.json
│
├── backend/              # FastAPI application
│   ├── app/             # Main application source
│   │   ├── main.py      # Application entry point
│   │   ├── api/         # API route definitions
│   │   ├── models/      # Database models/schemas
│   │   ├── services/    # Business logic
│   │   ├── core/        # Core (database, middleware)
│   │   ├── config/      # Configuration
│   │   └── utils/       # Helper functions
│   └── requirements.txt
│
└── docs/                # Documentation
```

## Quick Start

### Prerequisites
- Node.js 18+ and npm
- Python 3.11+
- MongoDB Atlas account
- Firebase project
- OpenAI API key

### Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env.local
# Configure environment variables
npm run dev
```

### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Configure environment variables
uvicorn main:app --reload
```

## Environment Variables

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### Backend (.env)
```
MONGODB_URL=mongodb://localhost:27017/
DATABASE_NAME=pathforge
OPENAI_API_KEY=your_openai_api_key
FIREBASE_CREDENTIALS_PATH=./firebase-credentials.json
CORS_ORIGINS=http://localhost:3000
SECRET_KEY=your_secret_key_here
```

## Development

### Backend Status: ✅ COMPLETE
The FastAPI backend is fully implemented with all PRD requirements.

See [BACKEND_SUMMARY.md](BACKEND_SUMMARY.md) for complete details.

### Frontend Status: 🔜 COMING NEXT
Next.js frontend development will begin after backend testing.

### Running Tests
```bash
# Frontend
cd frontend && npm test

# Backend
cd backend && pytest
```

### Building for Production
```bash
# Frontend
cd frontend && npm run build

# Backend
cd backend && pip install -r requirements.txt
```

## API Documentation
Once the backend is running, visit:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Core User Flow
1. User logs in via Firebase Authentication
2. Uploads resume OR answers basic questions
3. AI analyzes current skills
4. System identifies skill gaps for target role
5. Deadline-based roadmap is generated
6. Resources are unlocked sequentially
7. User completes or skips resources
8. Progress is tracked in real-time
9. Module summaries are displayed upon completion

## Future Enhancements
- AI Mentor Chatbot
- AI Project Generator
- Trending Skills Analyzer

## License
MIT License

## Contributors
- Your Team

---
Built with ❤️ for students worldwide
