# Project Restructuring Guide

This document outlines the restructuring of PathForge into a standard backend/frontend architecture.

## Overview

The project has been reorganized to follow industry-standard conventions:

### Backend Structure (Python/FastAPI)

```
backend/
├── app/                     # Main application source
│   ├── main.py             # Application entry point
│   ├── __init__.py
│   ├── api/                # API route definitions
│   │   ├── __init__.py
│   │   ├── middleware.py   # [MOVED TO core/]
│   │   └── routes/         # Route modules
│   │       ├── auth.py
│   │       ├── users.py
│   │       ├── roadmaps.py
│   │       ├── resources.py
│   │       ├── skills.py
│   │       ├── files.py
│   │       ├── analytics.py
│   │       └── admin.py
│   ├── models/             # Database models & schemas
│   │   ├── __init__.py
│   │   ├── user.py
│   │   ├── roadmap.py
│   │   ├── resource.py
│   │   └── skill.py
│   ├── services/           # Business logic services
│   │   ├── __init__.py
│   │   ├── ai_service.py
│   │   ├── resume_parser.py
│   │   ├── gridfs_service.py
│   │   └── email_service.py
│   ├── core/               # Core functionality
│   │   ├── __init__.py
│   │   ├── database.py     # [MOVED FROM database/connection.py]
│   │   └── middleware.py   # [MOVED FROM api/middleware.py]
│   ├── config/             # Configuration logic
│   │   └── __init__.py
│   └── utils/              # Utility functions
│       ├── __init__.py
│       └── helpers.py
├── requirements.txt        # Python dependencies
├── .env                    # Environment variables
├── .env.example
└── README.md

DEPRECATED (old structure):
├── database/               # → Moved to app/core/database.py
├── api/middleware.py       # → Moved to app/core/middleware.py
└── main.py                 # → Moved to app/main.py
```

### Frontend Structure (Vite + React)

```
frontend/
├── src/                    # Frontend source code
│   ├── main.jsx           # Entry point (NEW)
│   ├── App.jsx            # Main component (NEW)
│   ├── App.css
│   ├── index.css
│   ├── assets/            # Images and styles
│   ├── components/        # React components
│   │   ├── Header.jsx
│   │   ├── ErrorBoundary.jsx
│   │   └── StarRating.jsx
│   ├── contexts/          # Context providers
│   │   ├── AuthContext.jsx
│   │   └── ToastContext.jsx
│   ├── lib/               # Utilities & config
│   │   ├── api.js
│   │   ├── firebase.js
│   │   └── types.js
│   └── pages/             # Page components (NEW)
│       ├── Login.jsx
│       ├── Register.jsx
│       ├── Dashboard.jsx
│       ├── Onboarding.jsx
│       ├── Profile.jsx
│       ├── Roadmap.jsx
│       ├── RoadmapDetail.jsx
│       ├── NewRoadmap.jsx
│       ├── Skills.jsx
│       ├── Analytics.jsx
│       └── Admin.jsx
├── public/                 # Static assets
├── index.html             # HTML template (NEW)
├── vite.config.js         # Vite configuration (NEW)
├── package.json           # Node dependencies
├── .env.example
└── README.md

DEPRECATED (old Next.js structure):
├── app/                   # → Converted to src/pages/
├── next.config.js         # → Replaced with vite.config.js
└── layout.tsx             # → Integrated into App.jsx
```

## Migration Steps

### Backend Migration

1. **Created new structure:**
   - `backend/app/` directory as main source folder
   - `backend/app/core/` for database and middleware
   - `backend/app/config/` for configuration

2. **Moved files:**
   - `backend/main.py` → `backend/app/main.py`
   - `backend/database/connection.py` → `backend/app/core/database.py`
   - `backend/api/middleware.py` → `backend/app/core/middleware.py`
   - Copied `api/`, `models/`, `services/`, `utils/` to `app/`

3. **Updated imports:**
   - All imports now use `app.` prefix
   - `from database.connection` → `from app.core.database`
   - `from models.` → `from app.models.`
   - `from services.` → `from app.services.`
   - `from utils.` → `from app.utils.`

4. **Entry point:**
   - Run with: `uvicorn app.main:app --reload`

### Frontend Migration

1. **Changed framework:**
   - Migrated from Next.js to Vite + React
   - Converted TypeScript (.tsx) to JavaScript (.jsx)

2. **Created new structure:**
   - `frontend/src/` as main source folder
   - `frontend/src/main.jsx` as entry point
   - `frontend/src/App.jsx` as root component
   - `frontend/src/pages/` for page components
   - `frontend/public/` for static assets

3. **Key changes:**
   - Next.js `app/` directory → React Router `pages/`
   - `next.config.js` → `vite.config.js`
   - `NEXT_PUBLIC_` env vars → `VITE_` env vars
   - Server-side rendering → Client-side rendering

4. **Routing:**
   - Next.js file-based routing → React Router
   - All routes defined in `App.jsx`

5. **Entry point:**
   - Run with: `npm run dev`

## To Complete Migration

### Backend

1. **Remove old structure:**
   ```bash
   # After verifying new structure works
   Remove-Item -Recurse backend/database
   Remove-Item -Recurse backend/api  # (old copy)
   Remove-Item -Recurse backend/models  # (old copy)
   Remove-Item -Recurse backend/services  # (old copy)
   Remove-Item -Recurse backend/utils  # (old copy)
   Remove-Item backend/main.py  # (old file)
   ```

2. **Update startup scripts:**
   - Update any scripts to use `uvicorn app.main:app`
   - Update test configurations if needed

### Frontend

1. **Replace old frontend:**
   ```bash
   # After testing new structure
   Rename-Item frontend frontend_old
   Rename-Item frontend_new frontend
   ```

2. **Install dependencies:**
   ```bash
   cd frontend
   npm install
   ```

3. **Update environment variables:**
   - Copy `.env.example` to `.env`
   - Replace `NEXT_PUBLIC_` with `VITE_` prefix
   - Update API URLs if changed

4. **Convert remaining components:**
   - Review and update any TypeScript-specific code
   - Update imports to use new structure
   - Test all routes and components

## Testing

### Backend
```bash
cd backend
# Activate virtual environment
uvicorn app.main:app --reload
# Visit http://localhost:8000/docs
```

### Frontend
```bash
cd frontend
npm install
npm run dev
# Visit http://localhost:3000
```

## Benefits of New Structure

### Backend
- ✅ Follows FastAPI best practices
- ✅ Clear separation of concerns
- ✅ Easier to scale and maintain
- ✅ Standard Python package structure
- ✅ Better IDE support and autocomplete

### Frontend
- ✅ Faster development with Vite
- ✅ Simpler routing with React Router
- ✅ No server-side complexity
- ✅ Standard React structure
- ✅ Better build performance
- ✅ Hot module replacement (HMR)

## Notes

- The new backend structure is in `backend/app/`
- The new frontend structure is in `frontend_new/`
- Old files remain for reference until migration is verified
- All imports have been updated in the new structure
- Environment variables need to be updated for frontend

## Next Steps

1. Test the new backend structure
2. Test the new frontend structure
3. Migrate any remaining components
4. Update deployment configurations
5. Remove old structures after verification
