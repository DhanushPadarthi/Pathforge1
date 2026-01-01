# Quick Render CLI Deployment

## Install Render CLI

```powershell
npm install -g @render/render
# or
yarn global add @render/render
```

## Login to Render

```powershell
render login
```

## Create Web Service from CLI

```powershell
render create web \
  --name pathforge-backend \
  --repo DhanushPadarthi/Pathforge1 \
  --branch main \
  --build-command "pip install -r backend/requirements.txt" \
  --start-command "cd backend && uvicorn main:app --host 0.0.0.0 --port \$PORT" \
  --environment python3
```

## Set Environment Variables

```powershell
render env set MONGODB_URL "your_mongodb_url" -s pathforge-backend
render env set GROQ_API_KEY "your_groq_key" -s pathforge-backend
render env set FIREBASE_CREDENTIALS_PATH "/path/to/creds" -s pathforge-backend
render env set SECRET_KEY "your_secret_key" -s pathforge-backend
render env set CORS_ORIGINS '["http://localhost:3000"]' -s pathforge-backend
render env set PYTHONUNBUFFERED "1" -s pathforge-backend
```

## Deploy

```powershell
render deploy -s pathforge-backend
```

## Check Logs

```powershell
render logs -s pathforge-backend --follow
```

## Get Service URL

```powershell
render service get pathforge-backend
```

Then test:
```powershell
curl https://pathforge-backend.onrender.com/docs
```

---

**Alternative: Deploy via GitHub (Easier)**

Just set up once in Render dashboard, then every git push auto-deploys:

```powershell
cd d:\projects\PATHFORGE1
git push origin main
```

Render watches your repo and deploys automatically!
