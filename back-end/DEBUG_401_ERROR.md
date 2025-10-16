# 🔍 Debugging 401 "Invalid Credentials" Error

## ✅ **Good News:**
CORS is fixed! Your frontend can now communicate with the backend. The 401 error is a **normal authentication error**.

---

## ❌ **The Error:**
```
Status: 401 Unauthorized
Error: Invalid credentials
```

---

## 🎯 **What This Means:**

The backend is working correctly, but one of these is happening:
1. **User doesn't exist** in the database
2. **Password is incorrect**
3. **Email is incorrect**

---

## 🔍 **Troubleshooting Steps:**

### **Step 1: Check if User Exists**

You need to **register a user first** before logging in!

#### **Option A: Register via Frontend**
1. Go to your registration page
2. Create a new account with:
   - Name: Test User
   - Email: test@example.com
   - Password: test123456
   - Phone: (optional)
   - Address: (optional)

#### **Option B: Register via API (Postman/curl)**

```bash
curl -X POST https://booksy-library-backend.vercel.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "test123456"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Registration successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "name": "Test User",
    "email": "test@example.com",
    "role": "user",
    "membershipNumber": "MEM..."
  }
}
```

---

### **Step 2: Login with Same Credentials**

After registration, login with the **exact same email and password**:

```javascript
// From your frontend:
await login({
  email: "test@example.com",
  password: "test123456"
});
```

---

### **Step 3: Check Password Requirements**

Your backend validates:
- ✅ Password must be at least **6 characters**
- ✅ Password is **case-sensitive**
- ✅ No special requirements (for now)

---

## 🐛 **Common Mistakes:**

### **1. Typo in Email/Password**
```javascript
// Wrong:
email: "test@example.com"
password: "test12345"  // ❌ Missing a digit

// Correct:
email: "test@example.com"
password: "test123456"  // ✅ Matches registration
```

---

### **2. User Not Registered**
```
Error: Invalid credentials
```
**Solution:** Register first, then login!

---

### **3. Wrong Email Format**
```javascript
// Wrong:
email: "test"  // ❌ Not a valid email

// Correct:
email: "test@example.com"  // ✅ Valid email
```

---

### **4. Password Too Short**
```javascript
// Wrong:
password: "test"  // ❌ Only 4 characters

// Correct:
password: "test123"  // ✅ At least 6 characters
```

---

## 🧪 **Testing Backend Authentication:**

### **Test 1: Health Check (Should Work)**
```bash
curl https://booksy-library-backend.vercel.app/api/health
```

**Expected:** 200 OK ✅

---

### **Test 2: Register New User**
```bash
curl -X POST https://booksy-library-backend.vercel.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Expected:** 201 Created with token ✅

---

### **Test 3: Login with Same User**
```bash
curl -X POST https://booksy-library-backend.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Expected:** 200 OK with token ✅

---

### **Test 4: Login with Wrong Password**
```bash
curl -X POST https://booksy-library-backend.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "wrongpassword"
  }'
```

**Expected:** 401 Unauthorized ❌ (This is correct behavior!)

---

## 📊 **Backend Login Flow:**

```
1. User submits email + password
   ↓
2. Backend finds user by email
   ↓
3. User not found? → 401 "Invalid credentials"
   ↓
4. User found → Check if account locked
   ↓
5. Account locked? → 423 "Account locked"
   ↓
6. Compare password with hashed password
   ↓
7. Password doesn't match? → 401 "Invalid credentials"
   ↓
8. Password matches! → Generate JWT token
   ↓
9. Return token + user data → 200 OK ✅
```

---

## 🔐 **How Passwords Work:**

### **Registration:**
```javascript
// Frontend sends:
{ email: "test@example.com", password: "test123456" }

// Backend stores:
{
  email: "test@example.com",
  password: "$2a$10$kL3X7m9..." // Hashed password (bcrypt)
}
```

### **Login:**
```javascript
// Frontend sends:
{ email: "test@example.com", password: "test123456" }

// Backend compares:
bcrypt.compare("test123456", "$2a$10$kL3X7m9...")
// → Returns true if match, false if not
```

---

## 🎯 **Check Your Frontend Code:**

### **Make Sure You're Sending Both Fields:**

```javascript
// ✅ Correct:
const credentials = {
  email: emailInput,
  password: passwordInput
};
await login(credentials);

// ❌ Wrong - Missing password:
const credentials = {
  email: emailInput
};
await login(credentials);
```

---

### **Check for Empty Strings:**

```javascript
// Before submitting:
if (!email || !password) {
  alert("Please enter email and password");
  return;
}

if (password.length < 6) {
  alert("Password must be at least 6 characters");
  return;
}
```

---

## 🔍 **Debug with Console Logs:**

Add this to your frontend login function:

```javascript
const handleLogin = async (e) => {
  e.preventDefault();
  
  // Debug logs
  console.log('📧 Email:', email);
  console.log('🔒 Password:', password ? '***' + password.slice(-3) : 'empty');
  console.log('📏 Password length:', password?.length);
  
  try {
    const response = await login({ email, password });
    console.log('✅ Login success:', response);
  } catch (error) {
    console.error('❌ Login failed:', error);
    console.error('Error details:', error.response?.data);
  }
};
```

---

## 🎓 **Understanding 401 vs Other Errors:**

| Status | Meaning | Common Cause |
|--------|---------|--------------|
| 400 | Bad Request | Missing email/password |
| 401 | Unauthorized | Wrong credentials |
| 423 | Locked | Too many failed attempts |
| 500 | Server Error | Backend crash |

---

## ✅ **Solution Checklist:**

- [ ] **Register a user first** (if you haven't)
- [ ] **Use the exact same email and password** you registered with
- [ ] **Check password is at least 6 characters**
- [ ] **Verify email format is correct** (has @ and domain)
- [ ] **Make sure both fields are filled** in the form
- [ ] **Check for typos** in email/password
- [ ] **Try registering a new user** and logging in immediately

---

## 🧪 **Quick Test:**

### **Step-by-Step Test:**

1. **Register:**
   ```javascript
   // In browser console on your frontend:
   fetch('https://booksy-library-backend.vercel.app/api/auth/register', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({
       name: 'Test User',
       email: 'test123@example.com',
       password: 'test123456'
     })
   })
   .then(r => r.json())
   .then(d => console.log('Register:', d));
   ```

2. **Login with same credentials:**
   ```javascript
   fetch('https://booksy-library-backend.vercel.app/api/auth/login', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({
       email: 'test123@example.com',
       password: 'test123456'
     })
   })
   .then(r => r.json())
   .then(d => console.log('Login:', d));
   ```

---

## 🎯 **Most Likely Issue:**

**You're trying to login with a user that doesn't exist in the database yet!**

**Solution:** Register first, then login with those credentials.

---

## 📝 **Test Credentials for Development:**

Create a test account:
```
Email: admin@booksy.com
Password: admin123456
```

Then use these to login from your frontend.

---

## 🚀 **If Everything Else Fails:**

Share with me:
1. The exact email you're using
2. The password length (not the actual password!)
3. Whether you've successfully registered this user
4. Any error messages from the browser console

---

**TL;DR:** The 401 error is normal - it means the user doesn't exist or password is wrong. Register a user first, then login with those exact credentials! ✅
