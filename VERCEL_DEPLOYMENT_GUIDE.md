# 🚀 PathForge Vercel Deployment Guide

## Overview
Your project is configured to deploy **BOTH backend (FastAPI) and frontend (Next.js)** to Vercel as monorepo projects.

---

## 📋 Deployment Order

### **Step 1: Deploy Backend FIRST** 🔧

#### 1.1 Create `backend/vercel.json` (NEW FILE)

Create a new file at `backend/vercel.json`:

```json
{
  "version": 2,
  "buildCommand": "pip install -r requirements.txt",
  "builds": [
    {
      "src": "main.py",
      "use": "@vercel/python"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "main.py"
    }
  ],
  "env": {
    "PYTHON_VERSION": "3.11"
  }
}
```

#### 1.2 Create `backend/wsgi.py` (NEW FILE)

```python
from main import app

def handler(request):
    return app(request)
```

Or for Vercel, use this `backend/api/index.py`:

```python
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from main import app

# Vercel expects this
export = app
```

#### 1.3 Set Vercel Environment Variables

In Vercel Dashboard → Settings → Environment Variables, add:

```
MONGODB_URL = your-mongodb-connection-string
GROQ_API_KEY = your-groq-api-key
FIREBASE_CREDENTIALS_PATH = path-to-firebase-json
CORS_ORIGINS = https://your-frontend.vercel.app,http://localhost:3000
```

#### 1.4 Deploy Backend

```bash
cd backend
vercel deploy --prod
```

**Get Backend URL from Vercel Dashboard** (e.g., `https://pathforge-api.vercel.app`)

---

### **Step 2: Deploy Frontend SECOND** 🎨

#### 2.1 Update Environment Variables

Create `frontend/.env.production`:

```env
NEXT_PUBLIC_API_URL=https://pathforge-api.vercel.app
```

Or set in Vercel Dashboard:
```
NEXT_PUBLIC_API_URL = https://pathforge-api.vercel.app
```

#### 2.2 Update vercel.json

Update root `vercel.json`:

```json
{
  "projects": {
    "frontend": {
      "settings": {
        "buildCommand": "npm run build",
        "devCommand": "npm run dev",
        "outputDirectory": ".next"
      }
    },
    "backend": {
      "settings": {
        "buildCommand": "pip install -r requirements.txt",
        "startCommand": "uvicorn main:app --host 0.0.0.0 --port $PORT"
      }
    }
  },
  "env": [
    {
      "key": "MONGODB_URL",
      "value": "@mongodb-url"
    },
    {
      "key": "GROQ_API_KEY",
      "value": "@groq-api-key"
    },
    {
      "key": "FIREBASE_CREDENTIALS_PATH",
      "value": "@firebase-credentials"
    },
    {
      "key": "NEXT_PUBLIC_API_URL",
      "value": "@backend-api-url"
    },
    {
      "key": "CORS_ORIGINS",
      "value": "https://your-frontend.vercel.app,http://localhost:3000"
    }
  ]
}
```

#### 2.3 Deploy Frontend

```bash
cd frontend
vercel deploy --prod
```

---

## 🔑 Environment Variables Checklist

### Backend (`backend/.env`)
```
MONGODB_URL=mongodb+srv://user:password@cluster.mongodb.net/pathforge
GROQ_API_KEY=your-groq-api-key
FIREBASE_CREDENTIALS_PATH=./firebase-credentials.json
CORS_ORIGINS=https://pathforge.vercel.app,http://localhost:3000
PORT=8000
```

### Frontend (`frontend/.env.production`)
```
NEXT_PUBLIC_API_URL=https://pathforge-api.vercel.app
```

---

## ⚠️ Common Issues & Solutions

### Issue #1: CORS Errors
**Problem:** Frontend can't connect to backend
**Solution:**
```python
# backend/main.py - Already configured
origins = os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")
app.add_middleware(CORSMiddleware, allow_origins=origins)
```

### Issue #2: Environment Variables Not Loaded
**Problem:** `NEXT_PUBLIC_API_URL` undefined
**Solution:**
```bash
# Vercel Dashboard → Project Settings → Environment Variables
# Add: NEXT_PUBLIC_API_URL = https://your-backend-url.vercel.app
```

### Issue #3: Backend Can't Find Firebase Credentials
**Problem:** Firebase initialization fails
**Solution:**
```bash
# Upload firebase-credentials.json to Vercel or use secrets
# Set FIREBASE_CREDENTIALS_PATH to correct location
```

---

## 🧪 Testing Deployment

### Test Backend
```bash
curl https://pathforge-api.vercel.app/api/health
# Should return 200 OK
```

### Test Frontend Connection
1. Open https://pathforge.vercel.app
2. Go to browser DevTools Console
3. Check: `process.env.NEXT_PUBLIC_API_URL`
4. Should show your backend URL

---

## 📊 Deployment Status Tracker

```
BACKEND SETUP:
[ ] Create backend/vercel.json
[ ] Create backend/api/index.py or wsgi.py
[ ] Add MONGODB_URL to Vercel secrets
[ ] Add GROQ_API_KEY to Vercel secrets
[ ] Add FIREBASE_CREDENTIALS_PATH
[ ] Add CORS_ORIGINS
[ ] Deploy backend
[ ] Get backend URL from Vercel

FRONTEND SETUP:
[ ] Update vercel.json with backend URL
[ ] Create frontend/.env.production
[ ] Set NEXT_PUBLIC_API_URL
[ ] Test build locally: npm run build
[ ] Deploy frontend
[ ] Test frontend → backend connection
[ ] Verify all features work
```

---

## 🎯 Current Status

| Component | Status | Next Action |
|-----------|--------|-------------|
| Backend Code | ✅ Ready | Create `backend/vercel.json` |
| Frontend Code | ✅ Ready | Update `.env.production` |
| Vercel Config | ✅ Updated | Deploy backend first |
| Environment Vars | ⚠️ Incomplete | Add all secrets to Vercel |

---

## 📞 Quick Reference

**Backend URL:** `https://pathforge-api.vercel.app` (after deployment)
**Frontend URL:** `https://pathforge.vercel.app` (after deployment)
**API Base:** `https://pathforge-api.vercel.app/api`

---

## ✅ Final Checklist Before Deploy

- [ ] All environment variables set in Vercel Dashboard
- [ ] MongoDB connection string works
- [ ] Groq API key is valid
- [ ] Firebase credentials uploaded/configured
- [ ] Frontend .env.production has correct API URL
- [ ] CORS origins include frontend URL
- [ ] Local testing passed (npm run build)
- [ ] Git repo is clean (no secrets in code)
- [ ] Backend dependencies in requirements.txt
- [ ] Python version matches (3.11)

---

**Status:** Ready for deployment! 🚀
