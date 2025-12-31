# PathForge - Quick Start Guide

## Project Restructuring Complete! 🎉

Your project has been restructured to follow standard backend/frontend conventions.

## New Structure

### Backend (FastAPI)
```
backend/
├── app/                    # ✨ NEW: Main application source
│   ├── main.py            # ✨ Entry point (moved from backend/main.py)
│   ├── api/               # API routes
│   ├── models/            # Pydantic models
│   ├── services/          # Business logic
│   ├── core/              # ✨ NEW: Database & middleware
│   ├── config/            # ✨ NEW: Configuration
│   └── utils/             # Utilities
└── requirements.txt
```

### Frontend (Vite + React)
```
frontend_new/              # ✨ NEW: Vite + React setup
├── src/
│   ├── main.jsx          # ✨ Entry point
│   ├── App.jsx           # ✨ Root component
│   ├── pages/            # ✨ Page components
│   ├── components/       # React components
│   ├── contexts/         # Context providers
│   ├── lib/              # Utilities
│   └── assets/           # Static assets
├── public/
├── vite.config.js        # ✨ Vite configuration
└── package.json
```

## Quick Start

### Option 1: Automatic Migration (Recommended)

Run the migration script:
```powershell
.\migrate.ps1
```

This will:
- Clean up old backend files
- Activate the new frontend structure
- Provide next steps

### Option 2: Manual Setup

#### Backend

1. **The backend is already restructured!** The new code is in `backend/app/`

2. **Start the backend:**
   ```powershell
   cd backend
   
   # Activate virtual environment (if not already)
   .\venv\Scripts\activate
   
   # Install dependencies (if needed)
   pip install -r requirements.txt
   
   # Run the server
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

3. **Test the API:**
   - Open http://localhost:8000/docs
   - You should see the Swagger UI

#### Frontend

1. **Activate the new frontend:**
   ```powershell
   # Backup old frontend
   Rename-Item frontend frontend_old
   
   # Activate new frontend
   Rename-Item frontend_new frontend
   ```

2. **Install dependencies:**
   ```powershell
   cd frontend
   npm install
   ```

3. **Configure environment:**
   ```powershell
   cp .env.example .env
   # Edit .env and add your Firebase credentials
   ```

4. **Start development server:**
   ```powershell
   npm run dev
   ```

5. **Open browser:**
   - Navigate to http://localhost:3000

## Environment Variables

### Backend (.env)
```env
MONGODB_URL=mongodb://localhost:27017
DATABASE_NAME=pathforge
CORS_ORIGINS=http://localhost:3000
FIREBASE_CREDENTIALS_PATH=./firebase-credentials.json
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:8000
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## What Changed?

### Backend Changes ✅
- ✅ Created `backend/app/` directory structure
- ✅ Moved `main.py` to `app/main.py`
- ✅ Created `app/core/` for database and middleware
- ✅ Updated all imports to use `app.` prefix
- ✅ Follows FastAPI best practices

### Frontend Changes ✅
- ✅ Migrated from Next.js to Vite + React
- ✅ Created standard `src/` directory structure
- ✅ Converted TypeScript to JavaScript
- ✅ Implemented React Router for routing
- ✅ Created all page components
- ✅ Updated environment variable prefix (NEXT_PUBLIC_ → VITE_)

## Testing Checklist

### Backend
- [ ] Server starts without errors: `uvicorn app.main:app --reload`
- [ ] API docs accessible: http://localhost:8000/docs
- [ ] Database connection works
- [ ] API endpoints respond correctly

### Frontend
- [ ] Development server starts: `npm run dev`
- [ ] Application loads: http://localhost:3000
- [ ] Routing works (navigate between pages)
- [ ] Firebase authentication configured

## Troubleshooting

### Backend Issues

**Import errors:**
- Make sure you're using `uvicorn app.main:app` not `uvicorn main:app`
- All imports should start with `app.`

**Database connection:**
- Check MongoDB is running
- Verify MONGODB_URL in .env

### Frontend Issues

**Module not found:**
```powershell
cd frontend
npm install
```

**Environment variables not working:**
- Use `VITE_` prefix, not `NEXT_PUBLIC_`
- Restart dev server after changing .env

**Build errors:**
```powershell
npm install vite @vitejs/plugin-react --save-dev
```

## Next Steps

1. ✅ Review [RESTRUCTURING_GUIDE.md](RESTRUCTURING_GUIDE.md) for detailed migration info
2. ✅ Test both backend and frontend
3. ✅ Update any deployment configurations
4. ✅ Remove old files after verification:
   - `backend/database/` (moved to `backend/app/core/`)
   - `frontend_old/` (when new frontend is verified)

## Documentation

- **Main README:** [README.md](README.md)
- **Restructuring Guide:** [RESTRUCTURING_GUIDE.md](RESTRUCTURING_GUIDE.md)
- **Backend README:** [backend/README_NEW.md](backend/README_NEW.md)
- **Frontend README:** [frontend_new/README.md](frontend_new/README.md)

## Need Help?

Check the detailed guides:
- API documentation: http://localhost:8000/docs (when backend is running)
- [RESTRUCTURING_GUIDE.md](RESTRUCTURING_GUIDE.md) for complete migration details

---

**Happy coding! 🚀**
