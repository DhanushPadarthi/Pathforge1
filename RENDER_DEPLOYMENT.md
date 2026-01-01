# Deploying PathForge Backend to Render

Render is perfect for FastAPI applications with:
- ✅ Native Python/FastAPI support
- ✅ Zero-config deployment from Git
- ✅ Free tier with generous resources
- ✅ Auto-scaling and environment variables
- ✅ PostgreSQL/MongoDB support
- ✅ No trial expiration issues

## Setup Steps

### 1. Create Render Account
1. Visit https://render.com
2. Sign up with GitHub (authorize the connection)

### 2. Create a New Web Service
1. Go to Dashboard → New → Web Service
2. Connect your GitHub repository: `DhanushPadarthi/Pathforge1`
3. Click "Connect" next to the repository

### 3. Configure the Service
Fill in these details:

**Name:** `pathforge-backend`

**Environment:** `Python 3`

**Build Command:**
```
pip install -r backend/requirements.txt
```

**Start Command:**
```
cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT
```

**Instance Type:** Free (sufficient for this project)

### 4. Add Environment Variables
Click "Advanced" → Add environment variables:

| Key | Value |
|-----|-------|
| `MONGODB_URL` | Your MongoDB connection string |
| `GROQ_API_KEY` | Your Groq API key |
| `FIREBASE_CREDENTIALS_PATH` | Path to Firebase credentials |
| `SECRET_KEY` | JWT secret (generate: `openssl rand -hex 32`) |
| `CORS_ORIGINS` | `["http://localhost:3000", "https://your-frontend.vercel.app"]` |
| `PYTHONUNBUFFERED` | `1` |

### 5. Deploy
Click "Create Web Service"

Render will:
- ✅ Auto-detect the Python project
- ✅ Install dependencies from requirements.txt
- ✅ Build and deploy automatically
- ✅ Provide a public URL
- ✅ Set up auto-redeploy on GitHub push

## Verify Deployment

After deployment completes (3-5 minutes):

```powershell
# Check Render dashboard for your URL, e.g.:
curl https://pathforge-backend.onrender.com/docs
```

You should see the FastAPI Swagger UI with all routes documented.

## Test Backend

```powershell
# Test health/root endpoint
curl https://pathforge-backend.onrender.com/

# Test with token
curl -X POST https://pathforge-backend.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'
```

## Update Frontend

Once Render backend URL is live:

1. Update `frontend/.env.production`:
```
NEXT_PUBLIC_API_URL=https://pathforge-backend.onrender.com
```

2. Redeploy frontend to Vercel:
```powershell
cd frontend
vercel deploy --prod
```

## Managing Deployment

### View Logs
- Dashboard → pathforge-backend → Logs tab

### Redeploy
- Dashboard → pathforge-backend → Deploy button
- Or: Push to GitHub (auto-redeploy)

### Update Environment Variables
- Dashboard → pathforge-backend → Environment tab

## Why Render Over Railway?

| Feature | Railway | Render |
|---------|---------|--------|
| Free Tier | Trial only | ✅ Unlimited |
| Credit Card | Not required | Required (but free) |
| FastAPI Support | ✅ Good | ✅ Excellent |
| ASGI Native | ✅ Yes | ✅ Yes |
| Setup Complexity | Medium | Low |
| Cold Starts | ~2-3s | ~2-3s |
| Cost | $7/month+ | Free (after trial) |

## Troubleshooting

**502 Bad Gateway?**
- Check Render logs for startup errors
- Ensure Procfile or start command is correct
- Verify environment variables are set

**CORS Errors?**
- Update CORS_ORIGINS to include your Vercel frontend URL
- Restart the service

**Slow Deployment?**
- First deploy takes 3-5 minutes
- Subsequent deploys take 1-2 minutes

## Next Steps

1. ✅ Create Render account with GitHub
2. ✅ Connect Pathforge1 repository
3. ✅ Deploy backend service
4. ✅ Verify `/docs` endpoint works
5. ✅ Update frontend environment variables
6. ✅ Deploy frontend to Vercel
7. ✅ Test full integration
