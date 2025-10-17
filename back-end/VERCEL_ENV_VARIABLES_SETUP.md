# 🔐 Vercel Environment Variables Setup

## 🎯 **Critical for Production:**

Your backend needs these environment variables to work on Vercel:

---

## 📋 **Required Environment Variables:**

### **1. JWT_SECRET**
```
Variable Name: JWT_SECRET
Value: your_super_secret_jwt_key_change_this_in_production_12345
Environment: Production, Preview, Development
```

**Purpose:** Used to sign and verify JWT tokens for authentication

**Without it:** Token verification fails → `req.user` becomes undefined → 500 errors

---

### **2. MONGO_URI**
```
Variable Name: MONGO_URI
Value: mongodb+srv://booksyAdmin:Aa112233@booksydb.9u2oz7m.mongodb.net/booksy?retryWrites=true&w=majority
Environment: Production, Preview, Development
```

**Purpose:** Connects to MongoDB Atlas database

**Without it:** Database operations fail → can't find users → crashes

---

### **3. FRONTEND_URL**
```
Variable Name: FRONTEND_URL
Value: https://booksy-library.vercel.app
Environment: Production, Preview, Development
```

**Purpose:** CORS configuration - allows frontend to make requests

**Without it:** Frontend requests blocked by CORS policy

---

### **4. NODE_ENV** (Optional)
```
Variable Name: NODE_ENV
Value: production
Environment: Production
```

**Purpose:** Tells app it's running in production mode

---

## 🔧 **How to Set Environment Variables in Vercel:**

### **Method 1: Via Vercel Dashboard (Recommended)**

#### **Step 1: Go to Project Settings**
1. Visit: https://vercel.com/dashboard
2. Click on your **backend project**
3. Click **"Settings"** tab at the top

---

#### **Step 2: Navigate to Environment Variables**
1. Click **"Environment Variables"** in left sidebar
2. You'll see a form to add variables

---

#### **Step 3: Add Each Variable**

For each variable:

1. **Name:** `JWT_SECRET`
2. **Value:** `your_super_secret_jwt_key_change_this_in_production_12345`
3. **Environment:** Select all 3:
   - ✅ Production
   - ✅ Preview
   - ✅ Development
4. Click **"Save"**

Repeat for:
- `MONGO_URI`
- `FRONTEND_URL`
- `NODE_ENV`

---

#### **Step 4: Redeploy** ⚠️

**Important:** After adding environment variables, you must redeploy!

**Option A: Automatic (Recommended)**
```bash
# Push any small change to trigger redeploy
git commit --allow-empty -m "trigger redeploy for env vars"
git push origin devs/backend
```

**Option B: Manual**
1. Go to **Deployments** tab
2. Find latest deployment
3. Click **"..."** menu
4. Click **"Redeploy"**

---

### **Method 2: Via Vercel CLI**

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Set variables
vercel env add JWT_SECRET
# Paste value when prompted
# Select: Production, Preview, Development

vercel env add MONGO_URI
# Paste value when prompted

vercel env add FRONTEND_URL
# Paste value when prompted

# Redeploy
vercel --prod
```

---

## ✅ **Verify Environment Variables:**

### **Check if Variables are Set:**

1. Go to Vercel Dashboard
2. Project → Settings → Environment Variables
3. You should see:
   ```
   JWT_SECRET                [Hidden]       Production, Preview, Development
   MONGO_URI                 [Hidden]       Production, Preview, Development
   FRONTEND_URL              https://...    Production, Preview, Development
   NODE_ENV                  production     Production
   ```

---

### **Test in Serverless Function:**

Add this temporary endpoint to test:

```javascript
// In server.js (remove after testing)
app.get('/api/test-env', (req, res) => {
    res.json({
        JWT_SECRET_exists: !!process.env.JWT_SECRET,
        MONGO_URI_exists: !!process.env.MONGO_URI,
        FRONTEND_URL_exists: !!process.env.FRONTEND_URL,
        NODE_ENV: process.env.NODE_ENV,
        // Never log actual secrets!
    });
});
```

Visit: `https://booksy-library-backend.vercel.app/api/test-env`

**Expected:**
```json
{
  "JWT_SECRET_exists": true,
  "MONGO_URI_exists": true,
  "FRONTEND_URL_exists": true,
  "NODE_ENV": "production"
}
```

---

## 🚨 **Common Mistakes:**

### **Mistake 1: Not Redeploying After Adding Variables**
```
❌ Add env var → Try immediately → Still fails
✅ Add env var → Redeploy → Works!
```

**Solution:** Always redeploy after adding environment variables

---

### **Mistake 2: Wrong Environment Selected**
```
❌ Only select "Production"
✅ Select "Production, Preview, Development"
```

**Solution:** Select all three environments for consistency

---

### **Mistake 3: Typo in Variable Name**
```
❌ JWT_SECERT (typo)
✅ JWT_SECRET (correct)
```

**Solution:** Copy-paste variable names from your .env file

---

### **Mistake 4: Trailing Spaces in Value**
```
❌ "my_secret " (space at end)
✅ "my_secret" (no spaces)
```

**Solution:** Trim whitespace from values

---

### **Mistake 5: Exposing Secrets in Code**
```javascript
❌ console.log('JWT_SECRET:', process.env.JWT_SECRET);
✅ console.log('JWT_SECRET exists:', !!process.env.JWT_SECRET);
```

**Solution:** Never log actual secret values

---

## 🔍 **Debugging Environment Variables:**

### **If Variables Don't Work:**

1. **Check Vercel Logs:**
   - Dashboard → Functions → View Logs
   - Look for: "JWT_SECRET is undefined"

2. **Check Variable Names:**
   - Must match exactly: `JWT_SECRET` not `jwt_secret`

3. **Check Environments:**
   - Make sure Production is selected

4. **Check Deployment:**
   - New deployment must be created after adding variables

5. **Check Code:**
   - Using `process.env.JWT_SECRET` (not `process.env['JWT SECRET']`)

---

## 📝 **Your Current .env File:**

From your local `.env`:
```
MONGO_URI=mongodb+srv://booksyAdmin:Aa112233@booksydb.9u2oz7m.mongodb.net/booksy?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_12345
PORT=5000
FRONTEND_URL=https://booksy-library.vercel.app
```

**Copy these exact values to Vercel!**

---

## ⚡ **Quick Setup Checklist:**

- [ ] Go to Vercel Dashboard
- [ ] Open backend project
- [ ] Click Settings → Environment Variables
- [ ] Add `JWT_SECRET` to all environments
- [ ] Add `MONGO_URI` to all environments
- [ ] Add `FRONTEND_URL` to all environments
- [ ] Add `NODE_ENV=production` to Production only
- [ ] Click Save for each variable
- [ ] Redeploy (push to GitHub or manual redeploy)
- [ ] Wait 2-3 minutes for deployment
- [ ] Test creating a book
- [ ] ✅ Should work!

---

## 🎯 **Why This Fixes the 500 Error:**

### **Current Problem:**
```javascript
// In Vercel (without JWT_SECRET):
const decoded = jwt.verify(token, process.env.JWT_SECRET);
// process.env.JWT_SECRET is undefined
// jwt.verify fails
// Exception thrown
// req.user never gets set
// Controller tries to access req.user.id
// ❌ Cannot read property 'id' of undefined
```

### **After Adding JWT_SECRET:**
```javascript
// In Vercel (with JWT_SECRET):
const decoded = jwt.verify(token, process.env.JWT_SECRET);
// process.env.JWT_SECRET = "your_super_secret..."
// ✅ Token verified successfully
// decoded = { id: '67...', iat: 1234567890 }
// req.user = User.findById(decoded.id)
// ✅ User found and set
// Controller: req.body.addedBy = req.user.id
// ✅ Works perfectly!
```

---

## 🔐 **Security Best Practices:**

### **DO:**
- ✅ Use long, random JWT secrets (32+ characters)
- ✅ Different secrets for dev/staging/production
- ✅ Store secrets only in Vercel dashboard
- ✅ Never commit .env files to Git
- ✅ Rotate secrets periodically

### **DON'T:**
- ❌ Use simple secrets like "secret" or "12345"
- ❌ Share secrets in chat/email
- ❌ Commit secrets to GitHub
- ❌ Log secrets to console
- ❌ Use same secret across multiple projects

---

## 🚀 **Next Steps:**

1. **Add all environment variables to Vercel**
2. **Redeploy the backend**
3. **Test creating a book**
4. **Check Vercel logs** (should see debug output)
5. **Verify it works** ✅

---

**The most likely fix for your 500 error is adding JWT_SECRET to Vercel!**
