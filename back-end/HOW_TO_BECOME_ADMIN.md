# 👑 How to Become Admin - User Role Management

## 🎯 **Your Situation:**
- ✅ Account registered: `amjedvnml@gmail.com`
- 📊 Current role: `user`
- 🎯 Desired role: `admin`

---

## ⚡ **Quick Solution - Run the Script:**

### **Step 1: Make Sure You're in Backend Folder**
```bash
cd back-end
```

### **Step 2: Run the Admin Upgrade Script**
```bash
node makeAdmin.js amjedvnml@gmail.com
```

**Expected Output:**
```
✅ MongoDB Connected
🔧 Making user admin...
📧 Target email: amjedvnml@gmail.com

📧 Email: amjedvnml@gmail.com
👤 Name: Your Name
🎭 Current Role: user

✅ SUCCESS! User upgraded to admin!
🎭 New Role: admin

🎉 You can now access admin features!
```

### **Step 3: Logout and Login Again**
1. Logout from your frontend
2. Login again with same credentials
3. Your role will now be `admin`! 🎉

---

## 🔐 **Understanding User Roles:**

### **Three Role Types:**

```
1. user       ← Default role (regular library member)
   ↓ Can:
   - Browse books
   - Borrow books (max 5)
   - Return books
   - View their borrowed books

2. librarian  ← Library staff
   ↓ Can:
   - Everything a user can do +
   - Add new books
   - Update book information
   - View all borrowed books
   - Mark books as returned

3. admin      ← Full control (you want this!)
   ↓ Can:
   - Everything librarian can do +
   - Delete books
   - Manage users
   - View all system data
   - Full CRUD operations
```

---

## 📝 **Alternative Methods:**

### **Method 1: Using Script (Recommended - Easiest)**
```bash
node makeAdmin.js amjedvnml@gmail.com
```
✅ **Pros:** Quick, safe, automated
❌ **Cons:** Requires terminal access

---

### **Method 2: MongoDB Atlas Dashboard**

1. **Go to:** https://cloud.mongodb.com/
2. **Navigate to:** Database → Browse Collections
3. **Select:** `booksy` database → `users` collection
4. **Find your user:** Filter by email `amjedvnml@gmail.com`
5. **Edit document:**
   - Find the `role` field
   - Change from `"user"` to `"admin"`
6. **Save changes**

✅ **Pros:** Visual interface, no code needed
❌ **Cons:** Requires MongoDB Atlas access

---

### **Method 3: MongoDB Compass (Local Tool)**

1. **Download:** https://www.mongodb.com/products/compass
2. **Connect:** Use your MongoDB URI from `.env`
3. **Navigate:** `booksy` database → `users` collection
4. **Find user:** Search for `amjedvnml@gmail.com`
5. **Edit:** Change `role` from `"user"` to `"admin"`
6. **Save**

✅ **Pros:** User-friendly GUI
❌ **Cons:** Requires downloading software

---

### **Method 4: Mongoose Shell**

```javascript
// Create a file: upgradeToAdmin.js
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    const user = await User.findOne({ email: 'amjedvnml@gmail.com' });
    user.role = 'admin';
    await user.save();
    console.log('✅ User is now admin!');
    process.exit(0);
  });
```

Then run:
```bash
node upgradeToAdmin.js
```

---

## 🧪 **Verify Your Admin Status:**

### **Method 1: Check via API**

```bash
# Login first to get your token
curl -X POST https://booksy-library-backend.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"amjedvnml@gmail.com","password":"your_password"}'

# Use the token to get your profile
curl https://booksy-library-backend.vercel.app/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "name": "Your Name",
    "email": "amjedvnml@gmail.com",
    "role": "admin",  ← Should say "admin" now!
    ...
  }
}
```

---

### **Method 2: Check in Frontend**

After logging in, check your user object in browser console:
```javascript
// Should show role: "admin"
console.log(currentUser.role);
```

---

## 🎯 **What Changes After Becoming Admin:**

### **Before (user role):**
```javascript
// API calls you can make:
GET  /api/books              ✅ View books
POST /api/books/:id/borrow   ✅ Borrow books
POST /api/books/:id/return   ✅ Return books
GET  /api/auth/me            ✅ View profile

// Restricted:
POST   /api/books            ❌ Cannot add books
PUT    /api/books/:id        ❌ Cannot edit books
DELETE /api/books/:id        ❌ Cannot delete books
```

### **After (admin role):**
```javascript
// Everything unlocked! 🎉
GET    /api/books            ✅ View books
POST   /api/books            ✅ Add new books
PUT    /api/books/:id        ✅ Edit books
DELETE /api/books/:id        ✅ Delete books
POST   /api/books/:id/borrow ✅ Borrow books
POST   /api/books/:id/return ✅ Return books
GET    /api/auth/me          ✅ View profile
// + All admin features!
```

---

## 🔧 **Troubleshooting:**

### **Error: "User not found"**

**Problem:** Email doesn't match exactly

**Solution:**
```bash
# Make sure email is lowercase and exact
node makeAdmin.js amjedvnml@gmail.com

# Not:
node makeAdmin.js Amjedvnml@gmail.com  # ❌ Capital A
node makeAdmin.js amjedvnml@gmail      # ❌ Missing .com
```

---

### **Error: "MongoDB Connection Error"**

**Problem:** `.env` file not loaded or wrong connection string

**Solution:**
```bash
# Check .env file exists
ls .env

# Verify MONGODB_URI is set
cat .env | grep MONGODB_URI
```

---

### **Script runs but role doesn't change in app**

**Problem:** Frontend is using old token

**Solution:**
1. Logout from your app
2. Clear browser cache (Ctrl + Shift + R)
3. Login again
4. New token will have admin role ✅

---

## 📊 **The makeAdmin.js Script Explained:**

```javascript
// 1. Load environment variables
require('dotenv').config();

// 2. Connect to MongoDB
await mongoose.connect(process.env.MONGODB_URI);

// 3. Find user by email
const user = await User.findOne({ email: 'amjedvnml@gmail.com' });

// 4. Update role
user.role = 'admin';

// 5. Save to database
await user.save();

// 6. Done! ✅
```

**Safe operations:**
- ✅ Only updates the `role` field
- ✅ Doesn't touch password or other data
- ✅ Validates email exists first
- ✅ Shows confirmation message

---

## 🎓 **Making Other Users Admin/Librarian:**

### **Make Another User Admin:**
```bash
node makeAdmin.js other-user@example.com
```

### **Make User a Librarian:**

Create `makeLibrarian.js`:
```javascript
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    const email = process.argv[2];
    const user = await User.findOne({ email });
    user.role = 'librarian';
    await user.save();
    console.log('✅ User is now librarian!');
    process.exit(0);
  });
```

Then run:
```bash
node makeLibrarian.js user@example.com
```

---

## 🔐 **Security Best Practices:**

### **1. Limit Admin Accounts**
- Only give admin role to trusted users
- Use librarian role for staff
- Most users should stay as regular users

### **2. Don't Share Admin Credentials**
- Each admin should have their own account
- Don't share passwords

### **3. Monitor Admin Actions**
- Keep track of who has admin access
- Regular audit of user roles

---

## 📋 **Quick Command Reference:**

```bash
# Make user admin
node makeAdmin.js amjedvnml@gmail.com

# Check if script exists
ls makeAdmin.js

# Make sure you're in backend folder
pwd
# Should show: .../back-end

# Run with default email (amjedvnml@gmail.com)
node makeAdmin.js
```

---

## ✅ **Success Checklist:**

After running the script:

- [ ] Script shows "✅ SUCCESS! User upgraded to admin!"
- [ ] Logout from your frontend
- [ ] Clear browser cache
- [ ] Login again
- [ ] Check user profile - should show role: "admin"
- [ ] Test admin features (add/edit/delete books)
- [ ] All admin actions now work! 🎉

---

## 🎉 **What You Can Do as Admin:**

### **Book Management:**
- ✅ Add new books to the library
- ✅ Edit book details (title, author, genre, etc.)
- ✅ Delete books from the system
- ✅ Update book quantities

### **User Management:**
- ✅ View all users
- ✅ See who borrowed which books
- ✅ Manage user roles

### **System Access:**
- ✅ Full CRUD operations
- ✅ Access to all API endpoints
- ✅ No restrictions! 🚀

---

## 🚀 **Ready to Become Admin?**

**Run this command now:**
```bash
cd back-end
node makeAdmin.js amjedvnml@gmail.com
```

**Then:**
1. Logout
2. Login again
3. You're now an admin! 👑

---

**Questions? Issues? Check the script output for error messages!** 🛠️
