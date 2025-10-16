# 🚨 URGENT: Fix CORS Error on Vercel Production

## ❌ **The Error:**
```
Access to fetch at 'https://booksy-library-backend.vercel.app/api/auth/login' 
from origin 'https://booksy-library.vercel.app' 
has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present
```

---

## 🔍 **Root Cause:**

Your **backend on Vercel** doesn't have the `FRONTEND_URL` environment variable set, so it's blocking requests from your frontend.

---

## ✅ **Solution: Add Environment Variable to Vercel**

### **Step 1: Go to Vercel Dashboard**

1. Open: https://vercel.com/dashboard
2. Find and click on your **backend project**: `booksy-library-backend` or similar

---

### **Step 2: Add Environment Variable**

1. Click **Settings** (in the top menu)
2. Click **Environment Variables** (in the left sidebar)
3. Click **Add New** button
4. Fill in the form:

```
Name:  FRONTEND_URL
Value: https://booksy-library.vercel.app
```

5. Select environments:
   - ✅ Production
   - ✅ Preview
   - ✅ Development

6. Click **Save**

---

### **Step 3: Redeploy Backend**

**Option A: Automatic (Recommended)**
```bash
# In your backend folder, make a small change and push
cd back-end
git add .
git commit -m "fix: Trigger redeploy for CORS fix"
git push origin devs/backend
```

**Option B: Manual Redeploy**
1. Go to your backend project in Vercel
2. Click **Deployments** tab
3. Find the latest deployment
4. Click the **⋮** (three dots) menu
5. Click **Redeploy**
6. Confirm

---

## 🎯 **Visual Guide:**

### **1. Find Your Backend Project:**
```
Vercel Dashboard → Projects → booksy-library-backend
```

### **2. Navigate to Settings:**
```
Project → Settings → Environment Variables
```

### **3. Add Variable:**
```
┌─────────────────────────────────────────┐
│ Add New Environment Variable            │
├─────────────────────────────────────────┤
│ Name:  FRONTEND_URL                     │
│ Value: https://booksy-library.vercel.app│
│                                          │
│ Environments:                            │
│ ☑ Production                            │
│ ☑ Preview                               │
│ ☑ Development                           │
│                                          │
│        [Cancel]  [Save]                 │
└─────────────────────────────────────────┘
```

---

## 🧪 **After Redeployment:**

### **Test the Fix:**

1. Open your frontend: https://booksy-library.vercel.app
2. Try to login
3. Open DevTools Console (F12)
4. Should see successful API response! ✅

### **Or test directly:**

```javascript
// In browser console on your frontend:
fetch('https://booksy-library-backend.vercel.app/api/health')
  .then(res => res.json())
  .then(data => console.log('✅ CORS Fixed!', data))
  .catch(err => console.error('❌ Still blocked:', err));
```

---

## 📋 **Complete Environment Variables on Vercel:**

Your backend should have these environment variables:

```
MONGODB_URI     = mongodb+srv://amjedvnml_db_user:booksydbsetup@...
JWT_SECRET      = your_super_secret_jwt_key_change_this_in_production_12345
JWT_EXPIRE      = 7d
NODE_ENV        = production
FRONTEND_URL    = https://booksy-library.vercel.app  ← ADD THIS!
```

---

## ⚡ **Why This Happens:**

1. **Local `.env` file** - Only used for local development, NOT deployed to Vercel
2. **Vercel Environment Variables** - Must be set separately in Vercel dashboard
3. **CORS Configuration** - Backend checks `process.env.FRONTEND_URL` to allow requests

```javascript
// In server.js (already configured):
const allowedOrigins = [
    process.env.FRONTEND_URL,  // ← This is undefined on Vercel right now!
    'http://localhost:3000',
    // ...
];
```

---

## 🐛 **Troubleshooting:**

### **Error Still Occurs After Adding Variable?**

**Solution:** Make sure you **redeployed** after adding the variable!
- Environment variables only take effect after redeployment
- Use git push or manual redeploy

---

### **How to Verify Variable is Set:**

1. Go to Vercel → Your Backend Project
2. Settings → Environment Variables
3. You should see:
   ```
   FRONTEND_URL: https://booksy-library.vercel.app (Production, Preview, Development)
   ```

---

### **Check Deployment Logs:**

1. Vercel Dashboard → Your Backend Project
2. Deployments → Latest Deployment
3. Click on it → View Function Logs
4. Look for any errors

---

## 🚀 **Quick Action Checklist:**

- [ ] Go to Vercel Dashboard
- [ ] Open backend project settings
- [ ] Add `FRONTEND_URL` environment variable
- [ ] Value: `https://booksy-library.vercel.app`
- [ ] Save
- [ ] Redeploy (git push or manual)
- [ ] Wait 2-3 minutes for deployment
- [ ] Test login from frontend
- [ ] Should work! ✅

---

## 📝 **Commands to Run:**

```bash
# Navigate to backend folder
cd back-end

# Create empty commit to trigger redeploy
git commit --allow-empty -m "fix: Trigger Vercel redeploy for CORS"

# Push to GitHub (triggers auto-deploy)
git push origin devs/backend
```

---

## 🎓 **Understanding the Flow:**

### **Before Fix:**
```
Frontend (booksy-library.vercel.app)
    ↓ Request
Backend (booksy-library-backend.vercel.app)
    ↓ Check CORS
    ❌ FRONTEND_URL = undefined
    ❌ Origin not in allowed list
    ❌ Block request (CORS error)
```

### **After Fix:**
```
Frontend (booksy-library.vercel.app)
    ↓ Request
Backend (booksy-library-backend.vercel.app)
    ↓ Check CORS
    ✅ FRONTEND_URL = https://booksy-library.vercel.app
    ✅ Origin matches allowed list
    ✅ Allow request (CORS headers added)
    ✅ Return data
```

---

## 🎉 **Expected Result:**

After fixing, you should see:
```javascript
// In Network tab (DevTools):
Status: 200 OK
Response Headers:
  Access-Control-Allow-Origin: https://booksy-library.vercel.app
  Access-Control-Allow-Credentials: true
```

And your login should work! ✅

---

## 📚 **Related Documentation:**

- `CORS_FRONTEND_SETUP.md` - Complete CORS guide
- `FRONTEND_URL_SETUP.md` - Quick reference

---

## 💡 **Pro Tip:**

For future deployments, always remember:
1. **Backend changes** → Need environment variables in Vercel
2. **Frontend changes** → Just deploy, no extra config needed
3. **.env files** → Never deployed, only for local development

---

**Go to Vercel now and add that environment variable!** 🚀

**Estimated fix time:** 2-3 minutes ⏱️
