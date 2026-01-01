# Deploy to Replit (Completely Free)

Replit is the **easiest free option** for Python/FastAPI:
- ✅ **Completely free** (no payment required)
- ✅ Simple one-click import from GitHub
- ✅ Automatic deployment and public URL
- ✅ Built-in environment variable management
- ✅ Works with FastAPI

## Setup (Super Easy)

### 1. Go to Replit
Visit https://replit.com

### 2. Create New Replit
- Click **Create** → **Import from GitHub**
- Paste: `https://github.com/DhanushPadarthi/Pathforge1`
- Click **Import**

### 3. Create .replit File
Replit needs to know how to run the backend. Create:

**`.replit`** (in root):
```
run = "cd backend && python -m uvicorn main:app --host 0.0.0.0 --port 8000"
```

### 4. Add Environment Variables
In Replit sidebar:
- Click **Secrets** (lock icon)
- Add each variable:
  - `MONGODB_URL` = your_connection_string
  - `GROQ_API_KEY` = your_key
  - `FIREBASE_CREDENTIALS_PATH` = path/to/creds
  - `SECRET_KEY` = generate_random_key
  - `CORS_ORIGINS` = '["http://localhost:3000"]'

### 5. Run
Click **Run** button → Replit starts your server

### 6. Get Public URL
Replit gives you a public URL like:
```
https://pathforge1.replit.dev
```

Test:
```powershell
curl https://pathforge1.replit.dev/docs
```

---

## Why Replit for Free Deployment?

| Service | Free | Payment | FastAPI | Ease |
|---------|------|---------|---------|------|
| Render | ❌ | Required | ✅ | Easy |
| Railway | ❌ | Required | ✅ | Easy |
| Fly.io | ❌ | Required | ✅ | Medium |
| **Replit** | **✅** | **None** | **✅** | **Super Easy** |
| PythonAnywhere | ✅ | Optional | ✅ | Medium |

---

## Update Frontend

Once Replit backend is live:

```powershell
cd frontend
# Update .env.production with Replit URL
echo "NEXT_PUBLIC_API_URL=https://pathforge1.replit.dev" > .env.production
vercel deploy --prod
```

---

## Keep Server Alive (Optional)

Replit puts free apps to sleep after inactivity. Use an **uptime monitor**:

- **Pingdom** (free)
- **Uptime Robot** (free)
- **Better Uptime** (free tier)

Set it to ping your Replit URL every 5 minutes to keep it awake.

