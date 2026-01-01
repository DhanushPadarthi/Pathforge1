# Deploy to Fly.io (Free with $5/month credit)

Fly.io is perfect for FastAPI:
- ✅ **Completely free** with $5/month credit (more than enough)
- ✅ Native ASGI/FastAPI support
- ✅ Command-line deployment from PowerShell
- ✅ Auto-scaling and global edge network
- ✅ No trial expiration

## Setup

### 1. Install Fly CLI
```powershell
powershell -Command "iwr https://fly.io/install.ps1 -useb | iex"
```

### 2. Login
```powershell
flyctl auth login
```

### 3. Launch the App
```powershell
cd d:\projects\PATHFORGE1
flyctl launch --no-deploy
```

When prompted:
- **App name:** `pathforge-backend`
- **Region:** Pick closest to you (e.g., `iad` for US East)
- **Postgres database:** No
- **Redis cache:** No

### 4. Add Environment Variables
```powershell
flyctl secrets set MONGODB_URL="your_mongodb_url"
flyctl secrets set GROQ_API_KEY="your_groq_key"
flyctl secrets set FIREBASE_CREDENTIALS_PATH="path/to/creds"
flyctl secrets set SECRET_KEY="your_secret_key"
flyctl secrets set CORS_ORIGINS='["http://localhost:3000"]'
```

### 5. Deploy
```powershell
flyctl deploy
```

### 6. Test
```powershell
flyctl open /docs
# Or manually: https://pathforge-backend.fly.dev/docs
```

## View Logs
```powershell
flyctl logs
```

## Redeploy (after code changes)
```powershell
git push origin main
flyctl deploy
```

---

## Why Fly.io?

| Feature | Render | Railway | Fly.io |
|---------|--------|---------|--------|
| Free Tier | ❌ Trial only | ❌ Trial only | ✅ $5/mo credit |
| FastAPI | ✅ Good | ❌ Trial expired | ✅ Excellent |
| CLI Deploy | ⚠️ No | ❌ No | ✅ Yes |
| Setup Speed | Medium | Medium | Fast |
| Cost | Need card | Need card | Free + $5 credit |

---

## flyctl.toml (auto-created)

Check the generated `fly.toml` file to verify:
```toml
[build]
  builder = "paketobuildpacks"

[env]
  PORT = "8000"

[[services]]
  internal_port = 8000
  protocol = "tcp"
```

Edit if needed, then deploy!

