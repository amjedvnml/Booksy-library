# 🔗 Frontend URL Configuration - Quick Reference

## 🎯 **Where to Add Frontend URL:**

### **1. Local Development (.env file):**

```env
FRONTEND_URL=http://localhost:3000
```

**Change based on your frontend:**
- React: `http://localhost:3000`
- Vite: `http://localhost:5173`
- Next.js: `http://localhost:3000`
- Angular: `http://localhost:4200`

---

### **2. Production (Vercel Dashboard):**

1. Go to: https://vercel.com/dashboard
2. Select your backend project
3. Settings → Environment Variables
4. Add new variable:
   ```
   Name: FRONTEND_URL
   Value: https://your-frontend-app.vercel.app
   ```
5. Save & Redeploy

---

## ✅ **What's Already Configured:**

Your backend (`server.js`) now has CORS configured to accept requests from:

```javascript
✅ process.env.FRONTEND_URL  // Your production frontend
✅ http://localhost:3000      // React dev server
✅ http://localhost:5173      // Vite dev server  
✅ http://localhost:4200      // Angular dev server
✅ Postman/curl/mobile apps   // No origin requests
```

---

## 🚀 **Testing:**

### **From Frontend (Browser Console):**
```javascript
fetch('http://localhost:5000/api/health')
  .then(res => res.json())
  .then(data => console.log('✅ Connected:', data));
```

### **From React Component:**
```javascript
useEffect(() => {
  fetch('http://localhost:5000/api/health')
    .then(res => res.json())
    .then(data => console.log(data));
}, []);
```

---

## 📋 **Current Configuration:**

### **Local (.env):**
```env
FRONTEND_URL=http://localhost:3000  ← Change if different port
```

### **Production (Add to Vercel when deploying frontend):**
```env
FRONTEND_URL=https://your-frontend-app.vercel.app
```

---

## 🎉 **That's It!**

- ✅ CORS configured in `server.js`
- ✅ Environment variable added to `.env`
- ✅ Ready for local development
- ✅ Ready for production (just add URL to Vercel)

**No CORS errors! 🎊**

---

**Full guide:** See `CORS_FRONTEND_SETUP.md` for detailed explanation.
