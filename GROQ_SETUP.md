# Setup Groq API for PathForge

This guide explains how to get your Groq API key and configure it for local development.

## What is Groq?

Groq provides fast, affordable AI inference. PathForge uses it for:
- ✅ Skill extraction from resumes
- ✅ Roadmap generation
- ✅ Learning recommendations
- ✅ Chatbot responses

## Step-by-Step Setup

### 1. Create Groq Account

1. Visit: https://console.groq.com/
2. Click **"Sign Up"** (or login if you have an account)
3. Use Google, GitHub, or email to sign up
4. Complete verification

### 2. Get Your API Key

1. Go to: https://console.groq.com/keys
2. Click **"Create API Key"**
3. Copy the generated key
4. Save it securely!

### 3. Add to .env

In `backend/.env`, add your actual Groq key:

```env
# Your actual key from console.groq.com
GROQ_API_KEY=your_actual_key_here
```

**DO NOT share your API key publicly!**

### 4. Test the Connection

Run the backend:
```powershell
cd backend
python main.py
```

Visit: http://localhost:8000/docs

Try the **`POST /api/resources/extract-resume-skills`** endpoint:
- Upload a PDF or text resume
- If successful, you'll see extracted skills, experience years, and job titles

## Free Tier Limits

Groq's free tier includes:
- ✅ **Free forever** - no payment required
- ✅ 14,400 requests per day
- ✅ Multiple fast models (Llama, Mistral, Gemma)
- ✅ Perfect for development!

## What Models Are Available?

PathForge uses: **`llama-3.3-70b-versatile`**

Other available models:
- `mixtral-8x7b-32768` - Fast, good for chat
- `gemma-7b-it` - Lightweight, good for simple tasks
- `llama-3.1-8b-instant` - Fast inference

## Troubleshooting

**"Invalid API key" error:**
- Check your key is correctly copied (no spaces)
- Regenerate the key at console.groq.com/keys
- Make sure `.env` is in the `backend/` directory

**"Rate limit exceeded":**
- You've hit the 14,400 requests/day limit
- Wait 24 hours, or upgrade to paid tier
- For testing, reduce API calls in your code

**"Connection timeout":**
- Check your internet connection
- Groq API might be temporarily down
- Verify GROQ_API_KEY is set in .env

## Local MongoDB + Groq = Complete Local Setup

Now you have:

1. ✅ **MongoDB** - Local database (no internet needed)
   - `MONGODB_URL=mongodb://localhost:27017`
   - Stored on your machine
   - Full data privacy

2. ✅ **Groq API** - Free AI services
   - Get your key from console.groq.com
   - Fast, affordable inference
   - No charge for development

3. ✅ **Frontend** - Next.js on localhost:3000
   - React components
   - Local development

4. ✅ **Backend** - FastAPI on localhost:8000
   - All routes working
   - Connected to MongoDB + Groq

## Running Everything

**Terminal 1 - MongoDB:**
```powershell
mongod
```

**Terminal 2 - Backend:**
```powershell
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
python main.py
```

**Terminal 3 - Frontend:**
```powershell
cd frontend
npm install
npm run dev
```

Visit: http://localhost:3000

## Next Steps

1. ✅ Create Groq account at https://console.groq.com
2. ✅ Get your API key from https://console.groq.com/keys
3. ✅ Add it to `backend/.env`
4. ✅ Test with `/api/resources/extract-resume-skills`
5. ✅ Build features!

