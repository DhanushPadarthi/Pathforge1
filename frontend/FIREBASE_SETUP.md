# Firebase Setup Instructions

## Step 1: Get Firebase Web App Credentials

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **pathforge-37f7b**
3. Click the **⚙️ gear icon** next to "Project Overview"
4. Select **Project settings**
5. Scroll down to **"Your apps"** section
6. If you don't have a web app:
   - Click **"Add app"** button
   - Select **Web** icon (`</>`)
   - Enter app nickname: `PathForge Web`
   - Check **"Also set up Firebase Hosting"** (optional)
   - Click **Register app**
7. You'll see your Firebase configuration:

```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "pathforge-37f7b.firebaseapp.com",
  projectId: "pathforge-37f7b",
  storageBucket: "pathforge-37f7b.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdef123456"
};
```

## Step 2: Update .env.local

Copy the values from Firebase Console and paste them into your `.env.local` file:

```bash
# Backend API
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000

# Firebase Configuration (Replace with your actual values)
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=pathforge-37f7b.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=pathforge-37f7b
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=pathforge-37f7b.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=1234567890
NEXT_PUBLIC_FIREBASE_APP_ID=1:1234567890:web:abcdef123456
```

## Step 3: Restart Development Server

After updating `.env.local`:

```bash
# Stop the server (Ctrl+C)
# Then restart it
npm run dev
```

## Important Notes:

1. **Never commit `.env.local`** - It's already in `.gitignore`
2. The Firebase project ID should match your backend: `pathforge-37f7b`
3. Make sure Firebase Authentication is enabled:
   - Go to **Build** → **Authentication**
   - Click **Get started**
   - Enable **Email/Password** sign-in method
   - Enable **Google** sign-in method (optional)

## Troubleshooting:

**Error: "API key not valid"**
- Make sure you copied the correct API key from Firebase Console
- Ensure no extra spaces in the `.env.local` file
- Restart the dev server after changing environment variables

**Error: "Auth domain not authorized"**
- Go to Firebase Console → Authentication → Settings → Authorized domains
- Add `localhost` if not already there

**Error: "Firebase not initialized"**
- Check that all `NEXT_PUBLIC_FIREBASE_*` variables are set
- Restart the development server
