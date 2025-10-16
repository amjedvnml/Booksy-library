# 🌐 Adding Frontend URL to Backend (CORS Configuration)

## 🎯 **What You Need to Do:**

Your frontend needs permission to make requests to your backend API. This is configured using **CORS (Cross-Origin Resource Sharing)**.

---

## ✅ **Already Done For You:**

I've updated your backend with proper CORS configuration! Here's what changed:

---

## 📝 **Step 1: Add Frontend URL to Environment Variables**

### **Local Development (.env file):**

Add this line to your `.env` file:

```env
FRONTEND_URL=http://localhost:3000
```

**Change the port based on your frontend:**
- React (create-react-app): `http://localhost:3000`
- Vite: `http://localhost:5173`
- Next.js: `http://localhost:3000`
- Angular: `http://localhost:4200`

### **Your Current .env File:**

```env
# Database
MONGODB_URI=mongodb+srv://amjedvnml_db_user:booksydbsetup@booksydb.9u2oz7m.mongodb.net/booksy?retryWrites=true&w=majority&appName=booksydb

# Server
PORT=5000

# Frontend URL (👈 ADDED THIS)
FRONTEND_URL=http://localhost:3000

# Authentication
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_12345
JWT_EXPIRE=7d

# Environment
NODE_ENV=development
```

---

## 📝 **Step 2: Add Frontend URL to Vercel (Production)**

When your frontend is deployed, you need to add the production URL to Vercel:

### **Option A: Vercel Dashboard**

1. Go to https://vercel.com/dashboard
2. Select your **backend project**: `booksy-library-backend`
3. Go to **Settings** → **Environment Variables**
4. Click **Add New**
5. Add:
   - **Name:** `FRONTEND_URL`
   - **Value:** `https://your-frontend-app.vercel.app` (your deployed frontend URL)
   - **Environment:** Production, Preview, Development (select all)
6. Click **Save**
7. **Redeploy** your backend (it will automatically redeploy on next push)

### **Option B: When You Deploy Frontend to Vercel**

If your frontend URL will be something like:
```
https://booksy-library.vercel.app
```

Then add this to Vercel environment variables:
```
FRONTEND_URL=https://booksy-library.vercel.app
```

---

## 🔧 **How CORS is Now Configured (server.js):**

```javascript
// CORS Configuration - Updated for you!
const corsOptions = {
    origin: function (origin, callback) {
        // List of allowed origins (your frontend URLs)
        const allowedOrigins = [
            process.env.FRONTEND_URL,        // Your production frontend
            'http://localhost:3000',         // React/Next.js dev
            'http://localhost:5173',         // Vite dev
            'http://localhost:4200',         // Angular dev
            'http://127.0.0.1:3000',        // Alternative localhost
            'http://127.0.0.1:5173',        // Alternative localhost
        ].filter(Boolean);

        // Allow requests with no origin (Postman, curl, mobile apps)
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,                       // Allow cookies & auth headers
    optionsSuccessStatus: 200,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
```

---

## 🎯 **What This Does:**

### **Allowed Origins:**
- ✅ Your production frontend (from `FRONTEND_URL` env variable)
- ✅ `localhost:3000` (React, Next.js development)
- ✅ `localhost:5173` (Vite development)
- ✅ `localhost:4200` (Angular development)
- ✅ Requests with no origin (Postman, curl, mobile apps)

### **Security Features:**
- ✅ Only specified URLs can access your API
- ✅ Credentials (cookies, auth tokens) are allowed
- ✅ Only specific HTTP methods allowed
- ✅ Only specific headers allowed

---

## 📋 **Quick Setup Checklist:**

### **For Local Development:**

1. **Update `.env` file:**
   ```env
   FRONTEND_URL=http://localhost:3000
   ```
   *(Change port to match your frontend)*

2. **Start backend:**
   ```bash
   npm run dev
   ```

3. **Start frontend:**
   ```bash
   cd ../frontend
   npm run dev
   ```

4. **Test API call from frontend:**
   ```javascript
   fetch('http://localhost:5000/api/health')
     .then(res => res.json())
     .then(data => console.log(data));
   ```

### **For Production (Vercel):**

1. **Deploy Frontend First:**
   - Deploy your frontend to Vercel
   - Get the URL: `https://your-frontend-app.vercel.app`

2. **Add to Backend Vercel Settings:**
   - Go to backend project in Vercel
   - Settings → Environment Variables
   - Add: `FRONTEND_URL = https://your-frontend-app.vercel.app`

3. **Redeploy Backend:**
   ```bash
   git add .
   git commit -m "update: CORS configuration"
   git push origin devs/backend
   ```

4. **Test from Production:**
   ```javascript
   fetch('https://booksy-library-backend.vercel.app/api/health')
     .then(res => res.json())
     .then(data => console.log(data));
   ```

---

## 🧪 **Testing CORS:**

### **Test 1: From Browser Console**

Open your frontend in browser, open DevTools Console, and run:

```javascript
// Test API call
fetch('http://localhost:5000/api/health')
  .then(res => res.json())
  .then(data => console.log('✅ CORS Working:', data))
  .catch(err => console.error('❌ CORS Error:', err));
```

**Expected Result:**
```json
{
  "status": "success",
  "message": "Server is running smoothly! 🚀",
  "database": "Connected"
}
```

---

### **Test 2: In Your React Component**

```javascript
import { useEffect } from 'react';

function App() {
  useEffect(() => {
    fetch('http://localhost:5000/api/health')
      .then(res => res.json())
      .then(data => {
        console.log('✅ Backend connected:', data);
      })
      .catch(err => {
        console.error('❌ Backend error:', err);
      });
  }, []);

  return <div>Check console for API test</div>;
}
```

---

## 🐛 **Troubleshooting:**

### **Error: "Access to fetch has been blocked by CORS policy"**

**Problem:** Your frontend URL is not in the allowed list.

**Solution:**
1. Check your frontend is running on `localhost:3000` or `localhost:5173`
2. Or update `FRONTEND_URL` in `.env` to match your frontend port
3. Restart backend: `npm run dev`

---

### **Error: "No 'Access-Control-Allow-Origin' header is present"**

**Problem:** CORS is not configured or backend not running.

**Solution:**
1. Make sure backend is running: `npm run dev`
2. Check `.env` file has `FRONTEND_URL` set
3. Try clearing browser cache (Ctrl + Shift + R)

---

### **Error: "Credentials flag is 'true', but no credentials..."**

**Problem:** Credentials mismatch in request.

**Solution:**
```javascript
// Add credentials to fetch call
fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  credentials: 'include',  // 👈 Add this
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ email, password })
});
```

---

## 🎓 **Understanding CORS:**

### **What is CORS?**
CORS = Cross-Origin Resource Sharing

- Browsers block requests from one domain to another for security
- Your frontend (`localhost:3000`) is a different "origin" than your backend (`localhost:5000`)
- CORS configuration tells the browser "it's okay, I allow this!"

### **Same Origin vs Cross-Origin:**

**Same Origin (No CORS needed):**
```
Frontend: https://myapp.com
Backend:  https://myapp.com/api
```

**Cross-Origin (CORS needed):**
```
Frontend: http://localhost:3000
Backend:  http://localhost:5000  ← Different port = Different origin!
```

---

## 🔒 **Security Best Practices:**

### **Development:**
```env
# Allow all localhost ports
FRONTEND_URL=http://localhost:3000
```

### **Production:**
```env
# Only allow your specific domain
FRONTEND_URL=https://booksy-library.vercel.app
```

### **Multiple Environments:**

If you have multiple frontend URLs (staging, production), you can set:

```javascript
// In server.js, the code already handles this:
const allowedOrigins = [
    process.env.FRONTEND_URL,           // Main frontend
    process.env.FRONTEND_URL_STAGING,   // Staging environment
    'http://localhost:3000',            // Local dev
].filter(Boolean);
```

Then in Vercel:
```
FRONTEND_URL=https://booksy-library.vercel.app
FRONTEND_URL_STAGING=https://booksy-library-staging.vercel.app
```

---

## 📚 **Summary:**

### **What You Need to Do:**

1. **Local Development:**
   - ✅ Already done! `FRONTEND_URL=http://localhost:3000` is in `.env`
   - Change port if your frontend uses different port

2. **Production:**
   - Deploy frontend first → Get URL
   - Add `FRONTEND_URL` to Vercel environment variables
   - Push backend changes → Auto redeploys

3. **Test:**
   - Make API call from frontend
   - Should work without CORS errors! ✅

---

## 🎉 **That's It!**

Your backend is now configured to accept requests from:
- ✅ Your local frontend (localhost:3000, localhost:5173, etc.)
- ✅ Your production frontend (when you add the URL)
- ✅ Testing tools (Postman, curl)

**No more CORS errors!** 🎊

---

## 🚀 **Next Steps:**

1. **Update `FRONTEND_URL` in `.env`** to match your frontend port
2. **Restart backend:** `npm run dev`
3. **Start frontend:** `npm run dev` (in frontend folder)
4. **Test API calls from frontend** - should work! ✅

When you deploy:
1. Deploy frontend → Get URL
2. Add URL to Vercel environment variables
3. Push backend changes
4. Test production API calls ✅

**All set! 🎉**
