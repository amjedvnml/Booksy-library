# 🚀 Vercel Deployment Guide - Booksy Library API

Complete guide to deploy your backend API to Vercel as a serverless function.

---

## 📋 **Prerequisites**

1. ✅ Vercel account (free): https://vercel.com/signup
2. ✅ GitHub repository with your code
3. ✅ MongoDB Atlas database (already set up)
4. ✅ All environment variables ready

---

## 🔧 **Files Added for Vercel**

### **1. vercel.json** - Vercel Configuration
```json
{
  "version": 2,
  "builds": [
    { "src": "server.js", "use": "@vercel/node" }
  ],
  "routes": [
    { "src": "/(.*)", "dest": "server.js" }
  ]
}
```

**What it does:**
- Tells Vercel to use Node.js runtime
- Routes all requests to server.js
- Configures serverless deployment

### **2. .vercelignore** - Files to Exclude
- Excludes node_modules, .env, logs
- Similar to .gitignore but for Vercel

### **3. Modified server.js**
- Added `module.exports = app` for serverless
- Conditional app.listen() for local dev only

---

## 🚀 **Deployment Methods**

### **Method 1: Deploy via Vercel Dashboard (Recommended for First Time)**

#### **Step 1: Push to GitHub**
```bash
git add .
git commit -m "feat: Add Vercel deployment configuration"
git push origin devs/backend
```

#### **Step 2: Import to Vercel**
1. Go to https://vercel.com/new
2. Click "Import Git Repository"
3. Select your GitHub repository: `Booksy-library`
4. Configure project:
   - **Framework Preset:** Other
   - **Root Directory:** `back-end`
   - **Build Command:** (leave empty)
   - **Output Directory:** (leave empty)

#### **Step 3: Add Environment Variables**
Click "Environment Variables" and add:

```env
MONGODB_URI=mongodb+srv://amjedvnml_db_user:booksydbsetup@booksydb.9u2oz7m.mongodb.net/booksy?retryWrites=true&w=majority&appName=booksydb
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_12345
JWT_EXPIRE=7d
NODE_ENV=production
```

**Important:** Add each variable individually:
- Name: `MONGODB_URI`, Value: `your_connection_string`
- Name: `JWT_SECRET`, Value: `your_secret`
- etc.

#### **Step 4: Deploy**
1. Click "Deploy"
2. Wait 1-2 minutes
3. Get your URL: `https://your-project.vercel.app`

---

### **Method 2: Deploy via Vercel CLI**

#### **Step 1: Install Vercel CLI**
```bash
npm install -g vercel
```

#### **Step 2: Login to Vercel**
```bash
vercel login
```

#### **Step 3: Deploy**
```bash
# Navigate to backend folder
cd back-end

# Deploy
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? (select your account)
# - Link to existing project? No
# - What's your project name? booksy-library-api
# - In which directory is your code located? ./
# - Want to override settings? No
```

#### **Step 4: Add Environment Variables**
```bash
vercel env add MONGODB_URI
# Paste your MongoDB connection string
# Select Production, Preview, Development

vercel env add JWT_SECRET
# Paste your JWT secret
# Select Production, Preview, Development

vercel env add JWT_EXPIRE
# Enter: 7d
# Select Production, Preview, Development

vercel env add NODE_ENV
# Enter: production
# Select Production only
```

#### **Step 5: Deploy to Production**
```bash
vercel --prod
```

---

## 🔍 **Testing Your Deployment**

### **1. Health Check**
```bash
curl https://your-project.vercel.app/api/health
```

Expected response:
```json
{
  "status": "success",
  "message": "Server is running smoothly! 🚀",
  "timestamp": "2025-10-16T...",
  "database": "Connected"
}
```

### **2. Register User**
```bash
curl -X POST https://your-project.vercel.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'
```

### **3. Get All Books**
```bash
curl https://your-project.vercel.app/api/books
```

---

## ⚙️ **Vercel Dashboard Configuration**

### **Settings → Environment Variables**
Add all your .env variables here:
- `MONGODB_URI`
- `JWT_SECRET`
- `JWT_EXPIRE`
- `NODE_ENV`

**Environments:**
- ✅ Production (live site)
- ✅ Preview (PR deployments)
- ✅ Development (local vercel dev)

### **Settings → Domains**
Add custom domain (optional):
1. Click "Add Domain"
2. Enter your domain: `api.yourdomain.com`
3. Configure DNS records as instructed

---

## 🔄 **Automatic Deployments**

Once connected to GitHub:
- ✅ **Push to main** → Deploys to Production
- ✅ **Push to other branches** → Creates Preview deployment
- ✅ **Pull Requests** → Automatic preview URLs

```bash
git push origin devs/backend
# Vercel automatically creates preview URL
# Check GitHub PR for deployment link
```

---

## 🐛 **Troubleshooting**

### **Issue 1: "Cannot find module"**
**Solution:** Ensure all dependencies are in `dependencies`, not `devDependencies`
```bash
npm install --save express mongoose cors dotenv bcryptjs jsonwebtoken
```

### **Issue 2: "Database connection failed"**
**Solution:** 
- Check MongoDB Atlas IP whitelist
- Add `0.0.0.0/0` to allow all IPs (for serverless)
- Go to: MongoDB Atlas → Network Access → Add IP Address → Allow Access from Anywhere

### **Issue 3: "Environment variables not working"**
**Solution:**
- Check spelling in Vercel dashboard
- Redeploy after adding env vars
- Use Vercel dashboard, not .env file

### **Issue 4: "Function timeout"**
**Solution:**
- Vercel free tier: 10s timeout
- Optimize database queries
- Add indexes to MongoDB collections
- Use connection pooling

### **Issue 5: "CORS errors"**
**Solution:** Update CORS configuration in server.js:
```javascript
const corsOptions = {
    origin: [
        'http://localhost:3000',
        'https://yourdomain.com',
        'https://your-vercel-frontend.vercel.app'
    ],
    credentials: true
};
app.use(cors(corsOptions));
```

---

## 📊 **Vercel Limits (Free Tier)**

| Resource | Limit |
|----------|-------|
| **Deployments** | Unlimited |
| **Bandwidth** | 100 GB/month |
| **Function Execution** | 100 GB-hours |
| **Function Duration** | 10 seconds |
| **Functions per Deployment** | 12 |
| **Environment Variables** | Unlimited |

**For production apps:** Consider upgrading to Pro ($20/month)

---

## 🔒 **Security Checklist**

Before deploying:
- ✅ All secrets in Vercel env vars (not in code)
- ✅ .env excluded from Git (.gitignore)
- ✅ Strong JWT_SECRET (32+ characters)
- ✅ MongoDB IP whitelist configured
- ✅ CORS configured for your frontend only
- ✅ Rate limiting implemented (optional)
- ✅ Helmet middleware for security headers (optional)

---

## 🌐 **Update Frontend to Use Vercel API**

In your frontend `.env`:
```env
# Before (local)
VITE_API_URL=http://localhost:5000

# After (production)
VITE_API_URL=https://your-project.vercel.app
```

Or dynamically:
```javascript
const API_URL = import.meta.env.PROD 
    ? 'https://your-project.vercel.app'
    : 'http://localhost:5000';
```

---

## 📈 **Monitoring Your API**

### **Vercel Analytics**
1. Go to your project dashboard
2. Click "Analytics" tab
3. View:
   - Request count
   - Error rate
   - Response time
   - Most popular endpoints

### **Function Logs**
```bash
# View real-time logs
vercel logs

# View logs for specific deployment
vercel logs [deployment-url]
```

---

## 🚀 **Advanced: Custom Domain**

### **Step 1: Add Domain in Vercel**
1. Project Settings → Domains
2. Add domain: `api.yourdomain.com`

### **Step 2: Configure DNS**
Add CNAME record in your domain provider:
```
Type: CNAME
Name: api
Value: cname.vercel-dns.com
```

### **Step 3: Verify**
- Vercel automatically provisions SSL certificate
- Wait 1-2 minutes for DNS propagation
- Access: `https://api.yourdomain.com`

---

## 🔄 **Rollback Deployment**

If something breaks:
1. Go to project dashboard
2. Click "Deployments" tab
3. Find previous working deployment
4. Click "..." → "Promote to Production"

Or via CLI:
```bash
vercel rollback
```

---

## 📝 **Deployment Checklist**

Before deploying:
- ✅ All code committed to GitHub
- ✅ vercel.json created
- ✅ .vercelignore created
- ✅ server.js exports app
- ✅ Environment variables ready
- ✅ MongoDB allows Vercel IPs (0.0.0.0/0)
- ✅ Tested locally
- ✅ API documentation updated with new URL

After deploying:
- ✅ Test health check endpoint
- ✅ Test user registration
- ✅ Test authentication
- ✅ Test all CRUD operations
- ✅ Update frontend API URL
- ✅ Monitor logs for errors

---

## 💡 **Pro Tips**

1. **Environment-Specific URLs**
   - Production: `booksy-api.vercel.app`
   - Preview: `booksy-api-git-branch.vercel.app`

2. **Preview Deployments**
   - Every branch gets its own URL
   - Test features before merging

3. **Instant Rollbacks**
   - Previous deployments stay accessible
   - One-click rollback in dashboard

4. **Edge Network**
   - API deployed globally
   - Fast response times worldwide

5. **Auto-Scaling**
   - Handles traffic spikes automatically
   - No server management needed

---

## 🎯 **Next Steps**

After successful deployment:

1. **Update Frontend**
   - Point API calls to Vercel URL
   - Test all features

2. **Add Custom Domain**
   - Professional look: `api.yourdomain.com`
   - Free SSL certificate included

3. **Monitor Performance**
   - Check Vercel Analytics
   - Review function logs

4. **Set Up CI/CD**
   - Auto-deploy on git push
   - Preview deployments for PRs

5. **Consider Upgrades**
   - Pro plan for longer timeouts
   - More bandwidth and features

---

## 📚 **Resources**

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Node.js Functions](https://vercel.com/docs/functions/serverless-functions/runtimes/node-js)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Vercel CLI Reference](https://vercel.com/docs/cli)

---

## 🆘 **Need Help?**

- Vercel Community: https://github.com/vercel/vercel/discussions
- Discord: https://vercel.com/discord
- Check function logs: `vercel logs`
- Review deployment details in dashboard

---

**Your API is now serverless and globally distributed! 🌍🚀**

