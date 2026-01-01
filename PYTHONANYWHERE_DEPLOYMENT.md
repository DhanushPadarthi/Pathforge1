# Deploy to PythonAnywhere (Completely Free - No Limits)

PythonAnywhere is the **best free Python hosting**:
- ✅ **Completely free** (no payment, no limits)
- ✅ Designed specifically for Python/FastAPI
- ✅ One-click GitHub sync
- ✅ Built-in MySQL/PostgreSQL
- ✅ Environment variables management

## Setup

### 1. Create Account
Visit https://www.pythonanywhere.com
- Sign up with email or GitHub
- Choose **free account**

### 2. Clone Your Repository
In PythonAnywhere console:
```bash
git clone https://github.com/DhanushPadarthi/Pathforge1.git
cd Pathforge1
```

### 3. Create Python Web App
1. Go to **Web** tab
2. Click **Add a new web app**
3. Choose **Python 3.11** (or latest)
4. Choose **FastAPI**
5. PythonAnywhere creates `/var/www/yourusername_pythonanywhere_com_wsgi.py`

### 4. Configure WSGI File
Edit the WSGI file PythonAnywhere created:

```python
# /var/www/yourusername_pythonanywhere_com_wsgi.py
import sys
import os

# Add your project path
path = '/home/yourusername/Pathforge1'
if path not in sys.path:
    sys.path.insert(0, path)

os.chdir(path + '/backend')
sys.path.insert(0, path + '/backend')

from main import app

# Wrap ASGI with WSGI for PythonAnywhere
from asgiref.wsgi import WsgiToAsgi
application = WsgiToAsgi(app)
```

### 5. Set Environment Variables
1. Go to **Web** → **WSGI configuration file**
2. Or in **Environment variables** section add:
   - `MONGODB_URL`
   - `GROQ_API_KEY`
   - `FIREBASE_CREDENTIALS_PATH`
   - `SECRET_KEY`

### 6. Install Dependencies
In PythonAnywhere console:
```bash
cd Pathforge1/backend
pip install -r requirements.txt
```

### 7. Reload Web App
Go to **Web** tab → Click **Reload** button

### 8. Get Your URL
Your app is live at:
```
https://yourusername.pythonanywhere.com
```

Test it:
```powershell
curl https://yourusername.pythonanywhere.com/docs
```

---

## Why PythonAnywhere?

| Feature | Replit | PythonAnywhere | Heroku |
|---------|--------|---|--------|
| **Free** | ✅ (limited) | ✅ (unlimited) | ❌ |
| **Python** | ✅ | ✅✅ | ✅ |
| **FastAPI** | ✅ | ✅✅ | ✅ |
| **Payment Required** | ❌ | ❌ | ✅ |
| **No Limits** | ❌ | ✅ | N/A |

---

## Update Frontend

Once PythonAnywhere backend is live:

```powershell
cd frontend

# Update environment
echo "NEXT_PUBLIC_API_URL=https://yourusername.pythonanywhere.com" > .env.production

# Deploy to Vercel
vercel deploy --prod
```

---

## PythonAnywhere Features

✅ **Web Consoles** - Run Python code directly
✅ **Task Scheduler** - Run jobs on schedule
✅ **Static Files** - Serve CSS/JS/images
✅ **MySQL/PostgreSQL** - Database support
✅ **SSL/HTTPS** - Free HTTPS
✅ **Custom Domain** - Use your own domain
✅ **Scheduled Tasks** - Cron jobs

---

## Pro Tip: Keep Server Awake

PythonAnywhere free tier can go to sleep. Add scheduled task:

1. **Web** → **Add a new web app**
2. Create a task to ping your app every hour:
```bash
curl https://yourusername.pythonanywhere.com/
```

This keeps it running 24/7!

