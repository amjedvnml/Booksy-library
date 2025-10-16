# 📚 Booksy Library - Backend API

A complete RESTful API for a library management system built with Node.js, Express, MongoDB, and JWT authentication.

![Node.js](https://img.shields.io/badge/Node.js-v18+-green)
![Express](https://img.shields.io/badge/Express-v5.1.0-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-v8.19.1-brightgreen)
![JWT](https://img.shields.io/badge/JWT-v9.0.2-orange)

---

## 🚀 Features

### 👤 **User Management**
- ✅ User registration with email validation
- ✅ Secure login with JWT authentication
- ✅ Password hashing with bcrypt
- ✅ Role-based access control (User, Librarian, Admin)
- ✅ Profile management
- ✅ Password change functionality
- ✅ Account security (login attempts, account lockout)

### 📖 **Book Management**
- ✅ CRUD operations for books
- ✅ Book search and filtering
- ✅ Genre categorization
- ✅ Pagination support
- ✅ Book availability tracking
- ✅ Multiple copies management

### 📚 **Borrowing System**
- ✅ Borrow books (max 5 per user)
- ✅ Return books
- ✅ Automatic due date calculation (14 days)
- ✅ Borrow history tracking
- ✅ Overdue book detection
- ✅ Current borrowed books listing

### 🔐 **Security**
- ✅ JWT token authentication
- ✅ Password hashing (bcrypt)
- ✅ Protected routes with middleware
- ✅ Role-based authorization
- ✅ CORS enabled
- ✅ Environment variables for secrets

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **Node.js** | JavaScript runtime |
| **Express.js** | Web framework |
| **MongoDB** | NoSQL database |
| **Mongoose** | ODM for MongoDB |
| **JWT** | Authentication tokens |
| **bcryptjs** | Password hashing |
| **dotenv** | Environment variables |
| **cors** | Cross-origin resource sharing |
| **nodemon** | Development auto-restart |

---

## 📋 Prerequisites

Before you begin, ensure you have:

- [Node.js](https://nodejs.org/) v18 or higher
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account (or local MongoDB)
- [Git](https://git-scm.com/)
- Code editor (VS Code recommended)

---

## ⚙️ Installation

### 1. Clone the repository
```bash
git clone https://github.com/amjedvnml/Booksy-library.git
cd Booksy-library/back-end
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables
```bash
# Copy the example env file
cp .env.example .env

# Edit .env with your configuration
```

Update `.env` with your values:
```env
MONGODB_URI=mongodb+srv://your_username:your_password@cluster.mongodb.net/booksy
PORT=5000
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRE=7d
NODE_ENV=development
```

### 4. Start the server

**Development mode (with auto-restart):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

Server will run on `http://localhost:5000`

---

## 📡 API Endpoints

### 🔓 **Public Routes**

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/books` | Get all books |
| GET | `/api/books/:id` | Get single book |
| GET | `/api/books/search/:query` | Search books |
| GET | `/api/books/genre/:genre` | Get books by genre |

### 🔒 **Protected Routes (Require Authentication)**

| Method | Endpoint | Description | Role |
|--------|----------|-------------|------|
| GET | `/api/auth/me` | Get current user | Any |
| PUT | `/api/auth/updateprofile` | Update profile | Any |
| PUT | `/api/auth/updatepassword` | Change password | Any |
| GET | `/api/auth/borrowed` | Get borrowed books | Any |
| GET | `/api/auth/history` | Get borrow history | Any |
| POST | `/api/books` | Create new book | Librarian/Admin |
| PUT | `/api/books/:id` | Update book | Librarian/Admin |
| DELETE | `/api/books/:id` | Delete book | Admin |
| POST | `/api/books/:id/borrow` | Borrow book | Any |
| POST | `/api/books/:id/return` | Return book | Any |
| GET | `/api/books/stats` | Get statistics | Admin |

---

## 🧪 Testing the API

### **Option 1: REST Client (VS Code)**
1. Install "REST Client" extension
2. Open `api-tests.http`
3. Click "Send Request" above any endpoint

### **Option 2: Postman**
1. Import collection from `postman_collection.json` (if available)
2. Set environment variables
3. Test endpoints

### **Option 3: cURL**
```bash
# Health check
curl http://localhost:5000/api/health

# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'

# Get all books
curl http://localhost:5000/api/books

# Get profile (requires token)
curl http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 📂 Project Structure

```
back-end/
├── config/
│   └── db.js                    # Database connection
├── controllers/
│   ├── authController.js        # Authentication logic
│   └── bookController.js        # Book operations
├── middleware/
│   └── auth.js                  # JWT verification
├── models/
│   ├── Book.js                  # Book schema
│   └── User.js                  # User schema
├── routes/
│   ├── auth.js                  # Auth endpoints
│   └── books.js                 # Book endpoints
├── .env.example                 # Environment template
├── .gitignore                   # Git ignore rules
├── API_TESTING_GUIDE.md         # Testing documentation
├── BACKEND_MASTERY_GUIDE.md     # Learning guide
├── api-tests.http               # REST Client tests
├── package.json                 # Dependencies
├── README.md                    # This file
└── server.js                    # Entry point
```

---

## 🔧 Configuration

### **Environment Variables**

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://...` |
| `PORT` | Server port | `5000` |
| `JWT_SECRET` | JWT signing secret | `random_string_32+_chars` |
| `JWT_EXPIRE` | Token expiration | `7d` |
| `NODE_ENV` | Environment | `development` or `production` |

### **Generating Secure JWT_SECRET**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## 📖 Documentation

- **[API Testing Guide](./API_TESTING_GUIDE.md)** - Complete guide to test all endpoints
- **[Backend Mastery Guide](./BACKEND_MASTERY_GUIDE.md)** - Learn backend concepts in-depth
- **[Backend Mastery Part 2](./BACKEND_MASTERY_PART2.md)** - Advanced topics
- **[Quick Start](./QUICK_START.md)** - Get started quickly

---

## 🧩 API Response Format

### **Success Response**
```json
{
  "success": true,
  "data": { ... }
}
```

### **Error Response**
```json
{
  "success": false,
  "message": "Error message here"
}
```

### **Paginated Response**
```json
{
  "success": true,
  "count": 10,
  "total": 150,
  "pagination": {
    "next": { "page": 2, "limit": 10 },
    "prev": { "page": 1, "limit": 10 }
  },
  "data": [ ... ]
}
```

---

## 🔐 Authentication Flow

1. **Register/Login** → Receive JWT token
2. **Store token** in localStorage/cookie
3. **Send token** in Authorization header:
   ```
   Authorization: Bearer YOUR_TOKEN_HERE
   ```
4. **Server verifies** token on protected routes
5. **Token expires** after 7 days (configurable)

---

## 👥 User Roles

| Role | Permissions |
|------|-------------|
| **User** | Browse books, borrow, return, view profile |
| **Librarian** | All user permissions + create/update books |
| **Admin** | All permissions + delete books, view statistics |

---

## 🐛 Troubleshooting

### **Server won't start**
- Check if MongoDB connection string is correct
- Verify all environment variables are set
- Ensure port 5000 is not in use

### **Database connection fails**
- Check MongoDB Atlas IP whitelist
- Verify username/password in connection string
- Test connection in MongoDB Compass

### **401 Unauthorized errors**
- Token might be expired (login again)
- Check Authorization header format: `Bearer <token>`
- Ensure token is valid and not corrupted

### **500 Internal Server Error**
- Check server logs for detailed error
- Verify database is accessible
- Check if all required fields are provided

---

## 🚀 Deployment

### **Deploying to Heroku**
```bash
# Install Heroku CLI
# Login to Heroku
heroku login

# Create app
heroku create booksy-library-api

# Set environment variables
heroku config:set MONGODB_URI=your_connection_string
heroku config:set JWT_SECRET=your_secret
heroku config:set NODE_ENV=production

# Deploy
git push heroku main
```

### **Deploying to Railway**
1. Connect GitHub repository
2. Add environment variables
3. Deploy automatically on push

### **Deploying to Digital Ocean**
1. Create Droplet
2. Install Node.js
3. Clone repository
4. Set up PM2 for process management
5. Configure Nginx as reverse proxy

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 📝 License

This project is licensed under the ISC License.

---

## 👨‍💻 Author

**Amjed**
- GitHub: [@amjedvnml](https://github.com/amjedvnml)

---

## 🙏 Acknowledgments

- [Express.js Documentation](https://expressjs.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [JWT.io](https://jwt.io/)
- [MongoDB University](https://university.mongodb.com/)

---

## 📞 Support

If you have questions or need help:
- Open an issue on GitHub
- Check the documentation in `/docs`
- Review the learning guides

---

**Built with ❤️ for learning backend development**
