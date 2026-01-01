# PathForge Deployment Options (All Free)

## Quick Comparison

| Platform | Limit | Setup | FastAPI Support | Recommendation |
|----------|-------|-------|---|---|
| **PythonAnywhere** | ✅ Unlimited | 10 min | ✅✅ Excellent | **🏆 BEST** |
| **Replit** | ❌ Limited | 5 min | ✅ Good | If under limit |
| **Render** | ❌ Limited | 10 min | ✅ Good | Needs payment |
| **Railway** | ❌ Limited | 10 min | ✅ Good | Needs payment |
| **Vercel** (backend) | ❌ Serverless issues | Complex | ⚠️ Problems | Not recommended |

---

## 🏆 RECOMMENDED: PythonAnywhere

**Best for:** Production-ready, unlimited, truly free

1. Go to https://www.pythonanywhere.com
2. Sign up (free account)
3. Clone repo → Set up web app → Deploy
4. URL: `https://yourusername.pythonanywhere.com`

👉 **See [PYTHONANYWHERE_DEPLOYMENT.md](PYTHONANYWHERE_DEPLOYMENT.md) for full setup**

---

## Alternative: Koyeb (New, Free Tier)

If PythonAnywhere doesn't work, try **Koyeb**:

```powershell
# Install Koyeb CLI
npm install -g @koyeb/cli

# Login
koyeb auth login

# Deploy
koyeb service create pathforge-backend \
  --git https://github.com/DhanushPadarthi/Pathforge1 \
  --git-branch main \
  --buildpack python \
  --env-file backend/.env
```

---

## Frontend (Already Set Up)

Your frontend is ready on **Vercel**:
```powershell
# Update environment with backend URL
echo "NEXT_PUBLIC_API_URL=https://yourusername.pythonanywhere.com" > frontend/.env.production

# Deploy
vercel deploy --prod
```

---

## Full Deployment Checklist

- [ ] Choose platform (PythonAnywhere recommended)
- [ ] Deploy backend
- [ ] Get backend URL (e.g., https://yourname.pythonanywhere.com)
- [ ] Update `frontend/.env.production` with backend URL
- [ ] Deploy frontend to Vercel: `vercel deploy --prod`
- [ ] Test: Visit frontend URL → Try login/features
- [ ] Backend should respond with user/roadmap data

---

## Architecture

```
┌─────────────────────────────────────┐
│       Vercel (Frontend)             │
│  https://yourapp.vercel.app         │
│  Next.js + React Bootstrap          │
└────────────────┬────────────────────┘
                 │
                 │ API calls
                 │ (NEXT_PUBLIC_API_URL)
                 │
┌────────────────▼────────────────────┐
│   PythonAnywhere (Backend)          │
│  https://yourname.pythonanywhere.com│
│  FastAPI + MongoDB                  │
└─────────────────────────────────────┘
```

---

## Environment Variables

**Backend (PythonAnywhere):**
```
MONGODB_URL = mongodb+srv://...
GROQ_API_KEY = gsk_...
FIREBASE_CREDENTIALS_PATH = /path/to/creds.json
SECRET_KEY = random_secret_key
CORS_ORIGINS = ["https://yourapp.vercel.app"]
```

**Frontend (Vercel):**
```
NEXT_PUBLIC_API_URL = https://yourname.pythonanywhere.com
```

---

## Testing

Once deployed:

```powershell
# Test backend is live
curl https://yourusername.pythonanywhere.com/docs

# Test frontend → backend connection
# Visit frontend URL → Try signing up/logging in
```

