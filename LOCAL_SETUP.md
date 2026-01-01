# PathForge - Local Development Setup

This guide will help you run PathForge with local MongoDB and everything on your machine.

## Prerequisites

- Node.js 18+ (for frontend)
- Python 3.11+ (for backend)
- MongoDB Community Edition (local)
- Git

---

## Backend Setup (FastAPI + Local MongoDB)

### 1. Install MongoDB Locally

**Windows:**
```powershell
# Download from: https://www.mongodb.com/try/download/community
# Run the installer
# MongoDB runs as a Windows Service by default
```

**macOS:**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt-get install -y mongodb
sudo systemctl start mongodb
```

### 2. Verify MongoDB is Running

```powershell
# Open MongoDB Compass or use mongo shell
mongosh
```

You should see: `>` prompt (MongoDB is running)

### 3. Setup Backend

```powershell
cd d:\projects\PATHFORGE1\backend

# Create virtual environment
python -m venv venv

# Activate it
.\venv\Scripts\Activate.ps1

# Install dependencies
pip install -r requirements.txt
```

### 4. Configure Environment

Create `.env` file in `backend/`:

```env
# Local MongoDB
MONGODB_URL=mongodb://localhost:27017
DATABASE_NAME=pathforge

# Firebase (for authentication)
FIREBASE_CREDENTIALS_PATH=./firebase-credentials.json

# Groq API (for AI features)
GROQ_API_KEY=your_groq_api_key

# JWT
SECRET_KEY=your_secret_key_min_32_chars
ALGORITHM=HS256

# CORS
CORS_ORIGINS=http://localhost:3000

# Development
ENVIRONMENT=development
```

### 5. Run Backend

```powershell
# In backend directory
python main.py
```

You should see:
```
INFO:     Uvicorn running on http://127.0.0.1:8000
```

Visit: http://127.0.0.1:8000/docs (Swagger UI with all endpoints)

---

## Frontend Setup (Next.js)

### 1. Install Dependencies

```powershell
cd d:\projects\PATHFORGE1\frontend

npm install
```

### 2. Configure Environment

Create `.env.local` in `frontend/`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 3. Run Frontend

```powershell
npm run dev
```

You should see:
```
Local:        http://localhost:3000
```

Visit: http://localhost:3000

---

## Full Local Development Flow

**Terminal 1 - Backend:**
```powershell
cd d:\projects\PATHFORGE1\backend
.\venv\Scripts\Activate.ps1
python main.py
```

**Terminal 2 - Frontend:**
```powershell
cd d:\projects\PATHFORGE1\frontend
npm run dev
```

**Terminal 3 - MongoDB (if not running as service):**
```powershell
mongod  # Starts MongoDB
```

Now you have:
- ✅ Backend: http://localhost:8000
- ✅ Frontend: http://localhost:3000
- ✅ Database: MongoDB on localhost:27017
- ✅ Everything local - no cloud dependencies!

---

## MongoDB Compass (UI)

For easier MongoDB management:

1. Download: https://www.mongodb.com/products/compass
2. Connect to: `mongodb://localhost:27017`
3. View databases, collections, and data visually

---

## Troubleshooting

**Backend fails to start:**
```powershell
# Check if MongoDB is running
mongosh
# Should show > prompt
```

**Frontend can't connect to backend:**
- Ensure backend is running on port 8000
- Check `.env.local` has correct `NEXT_PUBLIC_API_URL`
- Check CORS in backend (should include http://localhost:3000)

**Port already in use:**
```powershell
# Find what's using port 8000
netstat -ano | findstr :8000

# Kill the process
taskkill /PID <PID> /F
```

---

## Project Structure

```
PATHFORGE1/
├── backend/              # FastAPI backend
│   ├── main.py          # Entry point
│   ├── api/routes/      # All API endpoints
│   ├── database/        # MongoDB connection
│   ├── models/          # Data models
│   ├── services/        # Business logic
│   ├── requirements.txt  # Python dependencies
│   └── .env             # Local config (copy from .env.example)
│
├── frontend/            # Next.js frontend
│   ├── app/            # Pages and layouts
│   ├── components/     # React components
│   ├── lib/            # Utilities and API client
│   ├── package.json    # JS dependencies
│   └── .env.local      # Local config
│
└── README.md           # Project documentation
```

---

## Next Steps

1. ✅ Install MongoDB locally
2. ✅ Start MongoDB service
3. ✅ Setup backend with Python venv
4. ✅ Setup frontend with npm
5. ✅ Run both in separate terminals
6. ✅ Visit http://localhost:3000 and start developing!

All code is local. All data is local. No cloud dependencies except optional Groq API.

