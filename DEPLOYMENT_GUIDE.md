# 🎓 IIITB Buddy — Complete Deployment Guide
### 100% FREE — Powered by Google Gemini AI

---

## 📁 Project Structure

```
iiitbhopal-assistant/
├── backend/              ← Node.js server (Render - FREE)
│   ├── src/
│   │   ├── server.js    ← Express API server
│   │   ├── scraper.js   ← Scrapes IIIT Bhopal site + static knowledge
│   │   ├── rag.js       ← TF-IDF based retrieval
│   │   └── claude.js    ← Google Gemini AI (FREE)
│   ├── package.json
│   ├── render.yaml
│   └── .env.example
└── frontend/             ← Static HTML (Vercel - FREE)
    ├── index.html
    └── vercel.json
```

---

## 💰 Cost Breakdown

| Service | Plan | Cost |
|---------|------|------|
| Render (backend) | Free | ₹0 |
| Vercel (frontend) | Free | ₹0 |
| Google Gemini API | Free tier | ₹0 |
| **TOTAL** | | **₹0/month** |

**Gemini Free Tier limits:** 15 req/min, 1500 req/day — plenty for freshers!

---

## 🚀 STEP-BY-STEP DEPLOYMENT

### STEP 1: Get Google Gemini API Key (FREE)

1. Go to https://aistudio.google.com/app/apikey
2. Sign in with your Google account
3. Click **"Create API Key"**
4. Select **"Create API key in new project"**
5. Copy the key (starts with `AIza...`)
6. ✅ That's it — no billing setup needed!

---

### STEP 2: Push to GitHub

```bash
cd iiitbhopal-assistant

git init
git add .
git commit -m "IIITB Buddy - AI Assistant for Freshers"

# Create a new repo on github.com, then:
git remote add origin https://github.com/YOUR_USERNAME/iiitbhopal-assistant.git
git push -u origin main
```

---

### STEP 3: Deploy Backend on Render (FREE)

1. Go to https://render.com → Sign up with GitHub (free)
2. Click **"New +"** → **"Web Service"**
3. Connect GitHub → Select your repo
4. Set these settings:
   - **Root Directory:** `backend`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** Free
5. Add Environment Variable:
   - **Key:** `GEMINI_API_KEY`
   - **Value:** `AIza...your-key-here`
6. Click **"Create Web Service"**
7. Wait ~3 minutes for deployment
8. **Copy your Render URL** → e.g. `https://iiitbhopal-assistant.onrender.com`

---

### STEP 4: Update Frontend with Your Backend URL

Open `frontend/index.html`, find this line (~line 280):

```javascript
: 'https://YOUR-RENDER-APP-NAME.onrender.com'; // ← UPDATE THIS
```

Replace with your actual Render URL:

```javascript
: 'https://iiitbhopal-assistant-abc.onrender.com';
```

---

### STEP 5: Deploy Frontend on Vercel (FREE)

**Option A — Vercel CLI:**
```bash
npm install -g vercel
cd frontend
vercel
# Follow prompts → Done!
```

**Option B — Vercel Dashboard:**
1. Go to https://vercel.com → Sign up with GitHub
2. **"Add New Project"** → Import your repo
3. Set **Root Directory** to `frontend`
4. Click **Deploy**

✅ You get a URL like: `https://iiitbhopal-buddy.vercel.app`

---

### STEP 6: Share with Freshers! 🎉

```
https://iiitbhopal-buddy.vercel.app
```

Freshers open the link → chat instantly.
**No login. No API key. Completely free.**

---

## 🔧 Local Testing

```bash
cd backend
cp .env.example .env
# Add your GEMINI_API_KEY to .env
npm install
npm start
# Backend at http://localhost:3001

# Open frontend/index.html in browser
# (set BACKEND_URL to http://localhost:3001 in index.html)
```

Test your backend is working:
```
http://localhost:3001/health
```

---

## 🆕 Adding New Knowledge

Edit `backend/src/scraper.js` → `STATIC_KNOWLEDGE` array:

```javascript
{
  source: "IIIT Bhopal Events 2025",
  text: `Your new information here...`
}
```

Commit & push → Render auto-redeploys.

---

## 🛡️ Security

- Gemini API key stored ONLY on Render (env variable)
- Frontend never exposes the key
- Students just use the chat — zero access to backend secrets

---

Made with ❤️ for IIIT Bhopal Freshers — 100% Free!
