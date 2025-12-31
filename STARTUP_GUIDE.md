# PATHFORGE - Backend & Frontend Startup Guide

## ✅ Complete Setup and Startup Commands

### **BACKEND SERVER SETUP & START**

#### **Option 1: Using PowerShell (Recommended)**

```powershell
# Navigate to backend directory
cd D:\projects\PATHFORGE1\backend

# Activate virtual environment
.\venv\Scripts\Activate.ps1

# Install dependencies
pip install -r requirements.txt

# Install additional required packages (if not in requirements.txt)
pip install pypdf httpx

# Start the server
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

**Or simply run the startup script:**
```powershell
cd D:\projects\PATHFORGE1\backend
.\START_SERVER.ps1
```

---

#### **Option 2: Using Command Prompt (CMD)**

```cmd
REM Navigate to backend directory
cd /d D:\projects\PATHFORGE1\backend

REM Activate virtual environment
venv\Scripts\activate.bat

REM Install dependencies
pip install -r requirements.txt

REM Install additional required packages
pip install pypdf httpx

REM Start the server
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

**Or simply run the startup script:**
```cmd
cd /d D:\projects\PATHFORGE1\backend
START_SERVER.bat
```

---

### **FRONTEND SERVER SETUP & START**

#### **Option 1: Using PowerShell**

```powershell
# Navigate to frontend directory
cd D:\projects\PATHFORGE1\frontend

# Install dependencies (first time only)
npm install

# Start the development server
npm run dev
```

---

#### **Option 2: Using Command Prompt (CMD)**

```cmd
REM Navigate to frontend directory
cd /d D:\projects\PATHFORGE1\frontend

REM Install dependencies (first time only)
npm install

REM Start the development server
npm run dev
```

---

## 🚀 **COMPLETE STARTUP SEQUENCE**

### **In Terminal 1 (Backend):**
```powershell
cd D:\projects\PATHFORGE1\backend
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
pip install pypdf httpx
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

**Expected Output:**
```
INFO:     Will watch for changes in these directories: ['D:\projects\PATHFORGE1\backend']
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
INFO:     Started server process [XXXX]
INFO:     Application startup complete
```

---

### **In Terminal 2 (Frontend):**
```powershell
cd D:\projects\PATHFORGE1\frontend
npm install
npm run dev
```

**Expected Output:**
```
> pathforge@1.0.0 dev
> next dev

  ▲ Next.js 16.1.1
  - Local:        http://localhost:3000
  - Environments: .env.local

Ready in 1234ms
```

---

## 📍 **ACCESS POINTS**

Once both servers are running:

| Service | URL | Purpose |
|---------|-----|---------|
| Frontend App | http://localhost:3000 | Main application |
| Backend API | http://127.0.0.1:8000 | REST API endpoints |
| API Docs | http://127.0.0.1:8000/docs | Swagger UI documentation |
| API Redoc | http://127.0.0.1:8000/redoc | ReDoc documentation |

---

## 🔧 **ENVIRONMENT VARIABLES**

### **Backend (.env file)**

The backend needs a `.env` file in `D:\projects\PATHFORGE1\backend\`:

```env
GROQ_API_KEY=your_groq_api_key_here
MONGODB_URL=mongodb+srv://your_username:your_password@your_cluster.mongodb.net/pathforge
JWT_SECRET=your_jwt_secret_here
FIREBASE_PROJECT_ID=your_firebase_project_id
```

### **Frontend (.env.local file)**

The frontend needs a `.env.local` file in `D:\projects\PATHFORGE1\frontend\`:

```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
```

---

## ✅ **VERIFICATION CHECKLIST**

- [ ] Python 3.13+ installed
- [ ] Node.js 18+ installed
- [ ] Virtual environment activated
- [ ] Dependencies installed (pypdf, httpx)
- [ ] Backend running on http://127.0.0.1:8000
- [ ] Frontend running on http://localhost:3000
- [ ] Can access API docs at http://127.0.0.1:8000/docs
- [ ] Can access frontend at http://localhost:3000
- [ ] No import errors in console

---

## 🐛 **TROUBLESHOOTING**

### **Backend Import Error: "No module named 'pypdf'"**
```powershell
pip install pypdf httpx
```

### **Backend Import Error: "No module named 'youtube_validator'"**
This is automatically imported from `services/youtube_validator.py`. Make sure it exists.

### **Frontend "API not initialized" Error**
- Ensure backend is running on http://127.0.0.1:8000
- Check `NEXT_PUBLIC_API_URL` in `.env.local`
- Clear browser cache and reload

### **Port Already in Use**
```powershell
# Backend on different port
uvicorn main:app --reload --host 127.0.0.1 --port 8001

# Frontend on different port
npm run dev -- -p 3001
```

### **Virtual Environment Not Activating**
```powershell
# Delete and recreate venv
Remove-Item venv -Recurse -Force
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

---

## 📝 **QUICK START COMMANDS**

**All-in-one backend startup:**
```powershell
cd D:\projects\PATHFORGE1\backend; .\venv\Scripts\Activate.ps1; pip install -q pypdf httpx; uvicorn main:app --reload
```

**All-in-one frontend startup:**
```powershell
cd D:\projects\PATHFORGE1\frontend; npm install; npm run dev
```

---

## 🔗 **USEFUL LINKS**

- API Documentation: http://127.0.0.1:8000/docs
- Frontend: http://localhost:3000
- Database: MongoDB Atlas
- Authentication: Firebase

---

**Last Updated:** December 31, 2025
**Status:** ✅ Production Ready
