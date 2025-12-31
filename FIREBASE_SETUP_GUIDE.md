# 🔥 Firebase Setup Guide for PathForge

This guide will walk you through setting up Firebase **authentication only** for PathForge. We use MongoDB GridFS for file storage, so you don't need Firebase Storage.

---

## 📋 What We're Setting Up

- ✅ **Firebase Authentication** - Email/Password & Google Sign-In
- ❌ **Firebase Storage** - NOT NEEDED (using MongoDB GridFS)
- ❌ **Firestore** - NOT NEEDED (using MongoDB)

---

## Step 1: Create Firebase Project

### 1.1 Go to Firebase Console
1. Visit [Firebase Console](https://console.firebase.google.com/)
2. Sign in with your Google account

### 1.2 Create New Project
1. Click **"Add project"** or **"Create a project"**
2. Enter project name: `PathForge` (or your preferred name)
3. Click **Continue**
4. **Google Analytics:** You can disable it for now (optional)
5. Click **Create project**
6. Wait for project creation (takes ~30 seconds)
7. Click **Continue** when ready

---

## Step 2: Enable Authentication

### 2.1 Setup Authentication Methods
1. In the left sidebar, click **"Build"** → **"Authentication"**
2. Click **"Get started"**
3. Go to **"Sign-in method"** tab
4. Enable the following providers:

#### Enable Email/Password:
1. Click on **"Email/Password"**
2. Toggle **"Enable"** to ON
3. Keep **"Email link (passwordless sign-in)"** OFF for now
4. Click **"Save"**

#### Enable Google Sign-In:
1. Click on **"Google"**
2. Toggle **"Enable"** to ON
3. Enter **"Project support email"** (your email)
4. Click **"Save"**

---

## Step 3: Get Backend Credentials (Admin SDK)

### 3.1 Generate Service Account Key
1. In the left sidebar, click the **⚙️ (Settings icon)** → **"Project settings"**
2. Go to the **"Service accounts"** tab
3. Click **"Generate new private key"** button
4. A popup will appear - Click **"Generate key"**
5. A JSON file will download automatically (keep it safe!)

### 3.2 Save the Credentials File
1. Rename the downloaded file to: **`firebase-credentials.json`**
2. Move it to: **`d:\projects\PATHFORGE1\backend\`**
3. **IMPORTANT:** Never commit this file to Git (it's already in .gitignore)

The file should look like this:
```json
{
  "type": "service_account",
  "project_id": "your-project-id",
  "private_key_id": "...",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com",
  "client_id": "...",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "..."
}
```

---

## Step 4: Get Frontend Credentials (Web App Config)

### 4.1 Register Web App
1. In **"Project settings"** page (⚙️ icon)
2. Scroll down to **"Your apps"** section
3. Click the **"</>"** (Web) icon to add a web app
4. Enter app nickname: **`PathForge Web`**
5. **Do NOT** check "Also set up Firebase Hosting" (we'll use Vercel)
6. Click **"Register app"**

### 4.2 Copy Configuration
You'll see a code snippet like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456"
};
```

### 4.3 Save for Frontend Setup
**Copy these values** - you'll need them for the Next.js frontend `.env.local` file:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
```

Click **"Continue to console"**

---

## Step 5: ✅ Done! Skip Storage & Firestore

**You're done with Firebase setup!** 

We DON'T need to set up:
- ❌ Firebase Storage (using MongoDB GridFS instead)
- ❌ Firestore (using MongoDB instead)

This keeps your project simpler and completely free!

---

## Step 6: Verify Backend Setup

### 7.1 Check Backend File Location
Ensure `firebase-credentials.json` is here:
```
d:\projects\PATHFORGE1\backend\firebase-credentials.json
```

### 7.2 Verify .env File
Open `d:\projects\PATHFORGE1\backend\.env` and check:
```env
FIREBASE_CREDENTIALS_PATH=./firebase-credentials.json
```

### 7.3 Test Backend
Restart the FastAPI server:
```bash
cd backend
uvicorn main:app --reload
```

If no errors appear and you see:
```
✓ Connected to MongoDB successfully!
INFO:     Application startup complete.
```

**Firebase Admin SDK is working!** ✅

---

## Step 8: Frontend Setup (Coming Next)

When we create the Next.js frontend, you'll need to create:

**File:** `frontend/.env.local`
```env
NEXT_PUBLIC_API_URL=http://localhost:8000

NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

---

## 🔒 Security Best Practices

### ✅ DO:
- Keep `firebase-credentials.json` secure and never commit to Git
- Use environment variables for sensitive data
- Restrict API keys to specific domains in production

### ❌ DON'T:
- Share service account credentials publicly
- Commit `.env` files to version control

### 💡 MongoDB GridFS Benefits:
- ✅ Resume files stored securely in MongoDB
- ✅ No external storage service needed
- ✅ Completely free with MongoDB
- ✅ Better integration with your existing database

---

## 📝 Quick Reference

### Files You Should Have:
7
**Backend:**
- ✅ `backend/firebase-credentials.json` (from Step 3)
- ✅ `backend/.env` (already exists)

**Frontend (coming soon):**
- 🔜 `frontend/.env.local` (will create with Step 4 values)

---

## 🆘 Troubleshooting

### Error: "Could not find firebase-credentials.json"
**Solution:** Ensure the file is in `backend/` folder and named exactly `firebase-credentials.json`

### Error: "Invalid credentiaAuthentication settings and ensure users are enabled

---

## ✅ Checklist

- [ ] Created Firebase project
- [ ] Enabled Email/Password authentication
- [ ] Enabled Google authentication
- [ ] Downloaded service account credentials
- [ ] Saved as `firebase-credentials.json` in backend folder
- [ ] Copied web app config for frontend
- [ ] Tested backend (no Firebase errors on startup)

**Note:** You do NOT need Firebase Storage or Firestore - we use MongoDB for everything except authentication!d folder
- [ ] Copied web app config for frontend
- [ ] Enabled Firebase Storage
- [ ] Updated Storage security rules
- [ ] Tested backend (no Firebase errors on startup)

---

## 🎯 Next Steps

Once you have:
1. ✅ `firebase-credentials.json` in backend folder
2. ✅ Firebase web config saved for frontend
3. ✅ Backend running without errors

**You're ready to proceed with frontend development!** 🚀

---

**Need Help?** 
- Firebase Documentation: https://firebase.google.com/docs
- Firebase Console: https://console.firebase.google.com/
