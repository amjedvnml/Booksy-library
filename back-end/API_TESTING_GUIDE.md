# 🧪 API TESTING GUIDE FOR BOOKSY LIBRARY

## 📋 Table of Contents
1. [Testing Tools](#testing-tools)
2. [Authentication Flow](#authentication-flow)
3. [All API Endpoints](#all-api-endpoints)
4. [Test Scenarios](#test-scenarios)

---

## 🛠️ Testing Tools

### Option 1: **Thunder Client** (VS Code Extension)
- Install from VS Code extensions
- GUI interface
- Easy to use

### Option 2: **Postman**
- Download from postman.com
- Industry standard
- Team collaboration features

### Option 3: **cURL** (Command Line)
- Built into Windows/Mac/Linux
- Quick testing
- Scriptable

### Option 4: **REST Client** (VS Code Extension)
- Test APIs directly in .http files
- Version control friendly

---

## 🔐 Authentication Flow

### Step 1: Register a New User

**Endpoint:** `POST http://localhost:5000/api/auth/register`

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "555-0100"
}
```

**Expected Response (201 Created):**
```json
{
  "success": true,
  "message": "Registration successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "671234567890abcdef123456",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "membershipNumber": "LIB2025123456"
  }
}
```

**💡 SAVE THE TOKEN!** You'll need it for protected routes.

---

### Step 2: Login

**Endpoint:** `POST http://localhost:5000/api/auth/login`

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "671234567890abcdef123456",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "membershipNumber": "LIB2025123456",
    "avatar": "default-avatar.jpg"
  }
}
```

---

## 📚 All API Endpoints

### 🌍 PUBLIC ENDPOINTS (No Token Required)

#### 1. Health Check
```
GET http://localhost:5000/api/health
```

#### 2. Get All Books
```
GET http://localhost:5000/api/books
```

**Query Parameters (Optional):**
- `?page=1&limit=10` - Pagination
- `?sort=-createdAt` - Sort (- for descending)
- `?genre=Fiction` - Filter by genre
- `?available=true` - Only available books
- `?select=title,author` - Select specific fields

**Examples:**
```
GET http://localhost:5000/api/books?page=1&limit=5
GET http://localhost:5000/api/books?genre=Fiction&available=true
GET http://localhost:5000/api/books?sort=-title&select=title,author,isbn
```

#### 3. Get Single Book
```
GET http://localhost:5000/api/books/:id
```

Example:
```
GET http://localhost:5000/api/books/671234567890abcdef123456
```

#### 4. Search Books
```
GET http://localhost:5000/api/books/search/:query
```

Example:
```
GET http://localhost:5000/api/books/search/harry potter
```

#### 5. Get Books by Genre
```
GET http://localhost:5000/api/books/genre/:genre
```

Example:
```
GET http://localhost:5000/api/books/genre/Fiction
```

---

### 🔒 PROTECTED ENDPOINTS (Require Token)

**How to send token:**

In **Headers**, add:
```
Authorization: Bearer YOUR_TOKEN_HERE
```

Example:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3MTIzNDU2Nzg5MGFiY2RlZjEyMzQ1NiIsImlhdCI6MTcyOTAxMjM0NSwiZXhwIjoxNzI5NjE3MTQ1fQ.abc123xyz789
```

---

#### 6. Get Current User Profile
```
GET http://localhost:5000/api/auth/me
```

**Headers:**
```
Authorization: Bearer YOUR_TOKEN
```

---

#### 7. Update Profile
```
PUT http://localhost:5000/api/auth/updateprofile
```

**Headers:**
```
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json
```

**Body:**
```json
{
  "name": "John Updated Doe",
  "phone": "555-9999",
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001"
  }
}
```

---

#### 8. Update Password
```
PUT http://localhost:5000/api/auth/updatepassword
```

**Headers:**
```
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json
```

**Body:**
```json
{
  "currentPassword": "password123",
  "newPassword": "newpassword456"
}
```

---

#### 9. Get Borrowed Books
```
GET http://localhost:5000/api/auth/borrowed
```

**Headers:**
```
Authorization: Bearer YOUR_TOKEN
```

---

#### 10. Get Borrow History
```
GET http://localhost:5000/api/auth/history
```

**Headers:**
```
Authorization: Bearer YOUR_TOKEN
```

---

### 📖 LIBRARIAN/ADMIN ENDPOINTS

To test these, you need to:
1. Create a user
2. Manually change their role in MongoDB to "librarian" or "admin"
3. Login to get a new token

#### 11. Create New Book
```
POST http://localhost:5000/api/books
```

**Headers:**
```
Authorization: Bearer YOUR_LIBRARIAN_TOKEN
Content-Type: application/json
```

**Body:**
```json
{
  "title": "The Great Gatsby",
  "author": "F. Scott Fitzgerald",
  "isbn": "978-0743273565",
  "description": "A classic American novel set in the Jazz Age",
  "publisher": "Scribner",
  "publishedYear": 1925,
  "pages": 180,
  "language": "English",
  "genre": "Fiction",
  "quantity": 5,
  "coverImage": "https://example.com/gatsby.jpg"
}
```

---

#### 12. Update Book
```
PUT http://localhost:5000/api/books/:id
```

**Headers:**
```
Authorization: Bearer YOUR_LIBRARIAN_TOKEN
Content-Type: application/json
```

**Body:**
```json
{
  "quantity": 10,
  "available": true
}
```

---

#### 13. Delete Book (Admin Only)
```
DELETE http://localhost:5000/api/books/:id
```

**Headers:**
```
Authorization: Bearer YOUR_ADMIN_TOKEN
```

---

#### 14. Borrow Book
```
POST http://localhost:5000/api/books/:id/borrow
```

**Headers:**
```
Authorization: Bearer YOUR_TOKEN
```

---

#### 15. Return Book
```
POST http://localhost:5000/api/books/:id/return
```

**Headers:**
```
Authorization: Bearer YOUR_TOKEN
```

---

#### 16. Get Book Statistics (Admin)
```
GET http://localhost:5000/api/books/stats
```

**Headers:**
```
Authorization: Bearer YOUR_ADMIN_TOKEN
```

---

## 🧪 Test Scenarios

### Scenario 1: Complete User Flow

1. **Register** a new user
2. **Login** to get token
3. **Get profile** to verify login
4. **Browse books** (public endpoint)
5. **Search** for a book
6. **View book details**

### Scenario 2: Book Management (Librarian)

1. **Register** a librarian account
2. **Change role** to "librarian" in database
3. **Login** with librarian account
4. **Create** several books
5. **Update** book quantities
6. **View** all books

### Scenario 3: Borrowing Flow

1. **Login** as user
2. **Find** an available book
3. **Borrow** the book
4. **Check** borrowed books list
5. **Return** the book
6. **Check** borrow history

---

## 📊 Expected HTTP Status Codes

| Code | Meaning | When It Occurs |
|------|---------|----------------|
| 200 | OK | Successful GET, PUT, DELETE |
| 201 | Created | Successful POST (create) |
| 400 | Bad Request | Invalid data sent |
| 401 | Unauthorized | Missing/invalid token |
| 403 | Forbidden | Valid token, but no permission |
| 404 | Not Found | Resource doesn't exist |
| 500 | Server Error | Backend crashed |

---

## 🔍 Debugging Tips

### If you get "Cannot connect":
- Check if server is running (look for green text in terminal)
- Verify URL: `http://localhost:5000` (not https)
- Check port number in .env

### If you get 401 Unauthorized:
- Check token is valid
- Token format: `Bearer <token>` (note the space)
- Token might be expired (login again)

### If you get 400 Bad Request:
- Check JSON syntax (commas, quotes)
- Verify required fields are included
- Check data types (string vs number)

### If you get 500 Server Error:
- Look at terminal output for error details
- Check database connection
- Verify all required environment variables

---

## 💡 Pro Tips

1. **Save your tokens** in Postman/Thunder Client environment variables
2. **Test error cases** (wrong password, missing fields, etc.)
3. **Check terminal output** for detailed error messages
4. **Use MongoDB Compass** to view database contents
5. **Test pagination** with different page/limit values

---

## 🎯 Quick Test Commands (cURL)

### Register:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"test123"}'
```

### Login:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

### Get Books:
```bash
curl http://localhost:5000/api/books
```

### Get Profile (replace TOKEN):
```bash
curl http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

**Happy Testing! 🚀**
