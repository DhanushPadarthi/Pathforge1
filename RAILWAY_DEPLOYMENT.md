# Deploying PathForge Backend to Railway

Railway is the recommended platform for FastAPI applications. It provides:
- ✅ Native ASGI/FastAPI support (no serverless complications)
- ✅ Zero-config deployment from Git
- ✅ Built-in environment variables and secrets management
- ✅ Free tier with $5/month credit (sufficient for this project)
- ✅ Auto-scaling and proper async handling

## Setup Steps

### 1. Create Railway Account
Visit https://railway.app and sign up with GitHub

### 2. Install Railway CLI
```powershell
npm install -g @railway/cli
# or: winget install Railway.Railway
```

### 3. Login to Railway
```powershell
railway login
```

### 4. Initialize Railway Project
```powershell
cd d:\projects\PATHFORGE1
railway init --name pathforge-backend
```

### 5. Link to Backend Directory
```powershell
cd backend
railway link  # Select the project you just created
```

### 6. Add Environment Variables
```powershell
railway variables set MONGODB_URL="your_mongodb_connection_string"
railway variables set GROQ_API_KEY="your_groq_key"
railway variables set FIREBASE_CREDENTIALS_PATH="/path/to/credentials.json"
railway variables set SECRET_KEY="your_secret_key"
railway variables set CORS_ORIGINS="['http://localhost:3000', 'https://your-frontend.vercel.app']"
```

### 7. Deploy
```powershell
railway up
```

Railway will:
- Detect the Python project (pyproject.toml or requirements.txt)
- Install dependencies
- Start the FastAPI server automatically
- Provide a public URL immediately

## Verify Deployment

After deployment, Railway will show you the service URL. Test it:

```powershell
# Replace with your actual Railway URL
curl https://pathforge-backend-production.up.railway.app/docs
```

You should see the FastAPI Swagger UI.

## Update Frontend

Once Railway backend is deployed, update the frontend:

1. Get the Railway backend URL from the dashboard
2. Update `.env.production`:
```
NEXT_PUBLIC_API_URL=https://pathforge-backend-production.up.railway.app
```

3. Redeploy frontend to Vercel:
```powershell
cd frontend
vercel deploy --prod
```

## Why Railway Over Vercel for Backend?

| Feature | Vercel | Railway |
|---------|--------|---------|
| ASGI Support | ❌ No (serverless limitation) | ✅ Yes (native) |
| FastAPI | ⚠️ Complex workarounds | ✅ Works out-of-box |
| Async/await | 🔄 Requires Mangum wrapper | ✅ Native support |
| Setup Complexity | High | Low |
| Cold Starts | 🐌 ~5s+ (serverless) | ⚡ ~1s (container) |
| Cost | $20/month (hobby) | Free tier ($5/mo credit) |

## Monitoring & Logs

```powershell
# View real-time logs
railway logs -f

# View environment variables
railway variables list

# Restart service
railway restart
```

## Next Steps

1. ✅ Set up Railway account and CLI
2. ✅ Deploy backend to Railway
3. ✅ Verify backend is working with `/docs` endpoint
4. ✅ Update frontend with Railway backend URL
5. ✅ Deploy frontend to Vercel
6. ✅ Test end-to-end integration
