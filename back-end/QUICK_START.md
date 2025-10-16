# 🚀 QUICK START GUIDE - Your First API Tests

## ✅ **What's Already Running:**
- Server: http://localhost:5000
- Database: MongoDB Atlas (connected)
- Status: All systems operational! ✨

---

## 📝 **Step-by-Step Testing Guide**

### **Step 1: Test Health Check (Already Done! ✅)**

You just opened the browser and saw:
```json
{
  "status": "success",
  "message": "Server is running smoothly! 🚀",
  "timestamp": "...",
  "uptime": 123,
  "database": "Connected"
}
```

---

### **Step 2: Register Your First User** 

In `api-tests.http`, find line 22-32:

```http
### Register New User
POST {{baseUrl}}/api/auth/register
Content-Type: application/json

{
  "name": "Test User",
  "email": "test@example.com",
  "password": "password123",
  "phone": "555-1234"
}
```

**Click "Send Request" above the line `### Register New User`**

Expected Response:
```json
{
  "success": true,
  "message": "Registration successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "671234567890abcdef123456",
    "name": "Test User",
    "email": "test@example.com",
    "role": "user",
    "membershipNumber": "LIB2025123456"
  }
}
```

**🔑 IMPORTANT: Copy the `token` value!**

---

### **Step 3: Update Token Variable**

At the top of `api-tests.http` (line 9), replace:
```http
@token = YOUR_TOKEN_HERE
```

With your actual token:
```http
@token = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3MTIzNDU2Nzg5MGFiY2RlZjEyMzQ1NiIsImlhdCI6MTcyOTAxMjM0NSwiZXhwIjoxNzI5NjE3MTQ1fQ.abc123xyz789
```

---

### **Step 4: Get Your Profile**

Find line 43-45:
```http
### Get My Profile (Protected)
GET {{baseUrl}}/api/auth/me
Authorization: Bearer {{token}}
```

**Click "Send Request"**

Expected Response:
```json
{
  "success": true,
  "data": {
    "_id": "671234567890abcdef123456",
    "name": "Test User",
    "email": "test@example.com",
    "role": "user",
    "membershipNumber": "LIB2025123456",
    "currentBorrowedBooks": [],
    "borrowHistory": [],
    "createdAt": "2025-10-16T...",
    "updatedAt": "2025-10-16T..."
  }
}
```

---

### **Step 5: Create Your First Book**

**Note:** To create books, you need to be a librarian or admin. Let's do this:

#### Option A: Manually Change Role in MongoDB
1. Go to MongoDB Atlas → Collections → users
2. Find your user
3. Change `role: "user"` to `role: "librarian"`
4. Login again to get new token

#### Option B: Create Book via API (will fail - for learning!)

Find line 112-127:
```http
### Create New Book (Librarian/Admin Only)
POST {{baseUrl}}/api/books
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "title": "The Great Gatsby",
  "author": "F. Scott Fitzgerald",
  ...
}
```

**Click "Send Request"**

Expected Response (403 Forbidden):
```json
{
  "success": false,
  "message": "User role 'user' is not authorized to access this route"
}
```

**This is correct!** You're a regular user, not a librarian! 🎉

---

### **Step 6: Browse Books (Public)**

Find line 81:
```http
### Get All Books
GET {{baseUrl}}/api/books
```

**Click "Send Request"**

Expected Response:
```json
{
  "success": true,
  "count": 0,
  "total": 0,
  "pagination": {},
  "data": []
}
```

Empty because you haven't created any books yet!

---

## 🎓 **Understanding What Just Happened**

### **1. Registration:**
- Server received your data
- Validated email/password format
- Hashed password with bcrypt
- Saved user to MongoDB
- Generated JWT token
- Returned token + user data

### **2. Authentication:**
- You sent token in Authorization header
- `protect` middleware verified token
- Extracted user ID from token
- Fetched user from database
- Added user to `req.user`
- Controller accessed `req.user`

### **3. Authorization:**
- You tried to create a book
- `authorize('librarian', 'admin')` checked your role
- You're a "user", not "librarian"
- Request blocked with 403 Forbidden

---

## 🔥 **Next Challenges:**

### **Challenge 1: Make Yourself a Librarian**
1. Go to MongoDB Atlas
2. Change your user role to "librarian"
3. Login again (get new token)
4. Try creating a book

### **Challenge 2: Create 5 Books**
Create books in different genres:
- Fiction
- Mystery
- Science Fiction
- Biography
- Self-Help

### **Challenge 3: Test All Endpoints**
Go through `api-tests.http` and test:
- ✅ Health check
- ✅ Register
- ✅ Login
- ✅ Get profile
- ✅ Update profile
- ✅ Get all books
- ✅ Create book (as librarian)
- ✅ Search books
- ✅ Borrow book
- ✅ Return book

---

## 🐛 **Common Issues & Solutions:**

### **Issue 1: "Cannot connect to server"**
```
Solution:
- Check if server is running (look at terminal)
- Restart server: Ctrl+C, then npm run dev
```

### **Issue 2: "401 Unauthorized"**
```
Solution:
- Token expired - login again
- Token not set - update @token variable
- Token format wrong - should be "Bearer <token>"
```

### **Issue 3: "400 Bad Request"**
```
Solution:
- Check JSON syntax (commas, quotes)
- Verify required fields are included
- Check data types (string vs number)
```

### **Issue 4: "500 Internal Server Error"**
```
Solution:
- Look at terminal for error details
- Check database connection
- Verify environment variables in .env
```

---

## 📚 **Learning Resources:**

### **Files to Study:**
1. `server.js` - Entry point, see how everything connects
2. `models/User.js` - User schema, validation, methods
3. `models/Book.js` - Book schema, borrowing logic
4. `controllers/authController.js` - Authentication logic
5. `controllers/bookController.js` - Book operations
6. `middleware/auth.js` - How JWT works
7. `routes/auth.js` - API endpoints
8. `routes/books.js` - Book endpoints

### **Documentation:**
- `BACKEND_MASTERY_GUIDE.md` - Core concepts
- `BACKEND_MASTERY_PART2.md` - Advanced topics
- `API_TESTING_GUIDE.md` - Complete API reference

---

## 🎯 **Your Backend Journey:**

```
✅ Phase 1: Understanding (COMPLETED)
   - Request-response cycle
   - HTTP methods
   - Status codes
   - Middleware

✅ Phase 2: Authentication (COMPLETED)
   - User registration
   - Login with JWT
   - Password hashing
   - Protected routes

✅ Phase 3: Authorization (COMPLETED)
   - Role-based access
   - Librarian vs User
   - Protected operations

🔄 Phase 4: CRUD Operations (IN PROGRESS)
   - Create books
   - Read books
   - Update books
   - Delete books

🔜 Phase 5: Advanced Features (NEXT)
   - Borrowing system
   - Search functionality
   - Filtering & pagination
   - Statistics

🔜 Phase 6: Production Ready (FUTURE)
   - Error handling
   - Validation
   - Security hardening
   - Performance optimization
```

---

## 💪 **You're Doing AMAZING!**

You've built a production-quality backend API from scratch! 

Keep testing, keep learning, keep building! 🚀

**Need help?** Look at the terminal output - it shows every request coming in!

