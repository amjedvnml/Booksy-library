# 🎓 BACKEND MASTERY - PART 2: ADVANCED CONCEPTS

## 9️⃣ **DATABASE QUERIES & OPERATORS**

### **MongoDB Query Operators:**

#### **Comparison Operators:**

```javascript
// $eq - Equals
Book.find({ genre: { $eq: 'Fiction' } })
// Same as: Book.find({ genre: 'Fiction' })

// $ne - Not equals
Book.find({ genre: { $ne: 'Fiction' } })
// Find all books NOT in Fiction genre

// $gt - Greater than
Book.find({ pages: { $gt: 300 } })
// Books with more than 300 pages

// $gte - Greater than or equal
Book.find({ publishedYear: { $gte: 2000 } })
// Books published in 2000 or later

// $lt - Less than
Book.find({ pages: { $lt: 200 } })
// Books with less than 200 pages

// $lte - Less than or equal
Book.find({ pages: { $lte: 500 } })
// Books with 500 pages or less

// $in - In array
Book.find({ genre: { $in: ['Fiction', 'Mystery', 'Thriller'] } })
// Books in any of these genres

// $nin - Not in array
Book.find({ genre: { $nin: ['Horror', 'Romance'] } })
// Books NOT in these genres
```

#### **Logical Operators:**

```javascript
// $and - All conditions must be true
Book.find({
    $and: [
        { genre: 'Fiction' },
        { pages: { $gte: 200 } },
        { available: true }
    ]
})
// Fiction books with 200+ pages that are available

// $or - At least one condition must be true
Book.find({
    $or: [
        { genre: 'Fiction' },
        { genre: 'Mystery' }
    ]
})
// Books that are Fiction OR Mystery

// $nor - All conditions must be false
Book.find({
    $nor: [
        { genre: 'Horror' },
        { pages: { $lt: 100 } }
    ]
})
// Books that are NOT Horror AND NOT less than 100 pages

// $not - Negates condition
Book.find({
    pages: { $not: { $gte: 500 } }
})
// Books with less than 500 pages (same as $lt: 500)
```

#### **Array Operators:**

```javascript
// $all - Array contains all specified elements
User.find({
    'currentBorrowedBooks.book': { $all: ['book1', 'book2'] }
})
// Users who borrowed both book1 AND book2

// $elemMatch - Array element matches all conditions
User.find({
    currentBorrowedBooks: {
        $elemMatch: {
            borrowDate: { $gte: new Date('2025-01-01') },
            dueDate: { $lte: new Date('2025-12-31') }
        }
    }
})
// Users with borrowed books in 2025

// $size - Array has specific length
User.find({
    'currentBorrowedBooks': { $size: 3 }
})
// Users with exactly 3 borrowed books
```

#### **Existence & Type Operators:**

```javascript
// $exists - Field exists
Book.find({ isbn: { $exists: true } })
// Books that have an ISBN

Book.find({ isbn: { $exists: false } })
// Books without ISBN

// $type - Field is of specific type
Book.find({ pages: { $type: 'number' } })
// Books where pages is a number

User.find({ email: { $type: 'string' } })
// Users where email is a string
```

#### **Text Search:**

```javascript
// $text - Full-text search
Book.find({ $text: { $search: 'harry potter' } })
// Searches in indexed text fields (title, author, description)

// $regex - Regular expression
Book.find({ title: { $regex: /harry/i } })
// Case-insensitive search for "harry" in title
// i = case insensitive
```

### **Query Chaining:**

```javascript
// Find + Select + Sort + Limit + Skip + Populate
const books = await Book.find({ available: true })  // Filter
    .select('title author isbn')                    // Only these fields
    .sort('-createdAt')                             // Newest first
    .skip(10)                                       // Skip first 10
    .limit(5)                                       // Return only 5
    .populate('addedBy', 'name email');             // Include user data

// Same query, different syntax
const books = await Book
    .find({ available: true })
    .select('title author isbn')
    .sort({ createdAt: -1 })  // -1 = descending, 1 = ascending
    .skip(10)
    .limit(5)
    .populate({
        path: 'addedBy',
        select: 'name email'
    });
```

### **Aggregation Pipeline:**

Aggregation = Complex data processing in MongoDB

```javascript
// Example: Get statistics by genre
const genreStats = await Book.aggregate([
    // Stage 1: Match (filter documents)
    {
        $match: { available: true }
    },
    
    // Stage 2: Group by genre
    {
        $group: {
            _id: '$genre',                    // Group by genre field
            count: { $sum: 1 },               // Count documents
            totalPages: { $sum: '$pages' },   // Sum all pages
            avgPages: { $avg: '$pages' },     // Average pages
            maxPages: { $max: '$pages' },     // Maximum pages
            minPages: { $min: '$pages' }      // Minimum pages
        }
    },
    
    // Stage 3: Sort by count (descending)
    {
        $sort: { count: -1 }
    },
    
    // Stage 4: Limit to top 5
    {
        $limit: 5
    }
]);

// Result:
// [
//   { _id: 'Fiction', count: 150, totalPages: 45000, avgPages: 300, ... },
//   { _id: 'Mystery', count: 80, totalPages: 24000, avgPages: 300, ... },
//   ...
// ]
```

### **Advanced Aggregation Operators:**

```javascript
// $project - Select/transform fields
await Book.aggregate([
    {
        $project: {
            title: 1,
            author: 1,
            isLongBook: { $gte: ['$pages', 500] },  // Add computed field
            titleLength: { $strLenCP: '$title' }     // String length
        }
    }
]);

// $lookup - Join collections (like SQL JOIN)
await User.aggregate([
    {
        $lookup: {
            from: 'books',                    // Collection to join
            localField: 'currentBorrowedBooks.book',  // Field in users
            foreignField: '_id',              // Field in books
            as: 'borrowedBookDetails'         // Output field name
        }
    }
]);

// $unwind - Deconstruct array field
await User.aggregate([
    { $unwind: '$currentBorrowedBooks' },  // Split array into documents
    { $group: { _id: '$currentBorrowedBooks.book', count: { $sum: 1 } } }
]);
```

---

## 🔟 **ERROR HANDLING PATTERNS**

### **Types of Errors:**

#### **1. Validation Errors**
```javascript
// User sends invalid data
exports.createBook = async (req, res, next) => {
    try {
        const book = await Book.create(req.body);
        res.status(201).json({ success: true, data: book });
    } catch (error) {
        if (error.name === 'ValidationError') {
            // Extract validation error messages
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: 'Validation Error',
                errors: messages
            });
        }
        next(error); // Pass to global error handler
    }
};
```

#### **2. Duplicate Key Errors**
```javascript
// Trying to create user with existing email
try {
    await User.create({ email: 'existing@example.com' });
} catch (error) {
    if (error.code === 11000) {
        // MongoDB duplicate key error code
        const field = Object.keys(error.keyValue)[0];
        return res.status(400).json({
            success: false,
            message: `${field} already exists`
        });
    }
}
```

#### **3. Cast Errors**
```javascript
// Invalid ObjectId format
try {
    const book = await Book.findById('invalid_id_format');
} catch (error) {
    if (error.name === 'CastError') {
        return res.status(400).json({
            success: false,
            message: 'Invalid ID format'
        });
    }
}
```

#### **4. Not Found Errors**
```javascript
// Resource doesn't exist
const book = await Book.findById(req.params.id);
if (!book) {
    return res.status(404).json({
        success: false,
        message: `Book not found with id of ${req.params.id}`
    });
}
```

### **Custom Error Class:**

```javascript
// utils/ErrorResponse.js
class ErrorResponse extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}

module.exports = ErrorResponse;

// Usage in controller:
const ErrorResponse = require('../utils/ErrorResponse');

exports.getBook = async (req, res, next) => {
    const book = await Book.findById(req.params.id);
    
    if (!book) {
        return next(
            new ErrorResponse(`Book not found with id of ${req.params.id}`, 404)
        );
    }
    
    res.status(200).json({ success: true, data: book });
};

// Global error handler in server.js:
app.use((err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;
    
    // Log for dev
    console.error(err);
    
    // Mongoose bad ObjectId
    if (err.name === 'CastError') {
        const message = 'Resource not found';
        error = new ErrorResponse(message, 404);
    }
    
    // Mongoose duplicate key
    if (err.code === 11000) {
        const message = 'Duplicate field value entered';
        error = new ErrorResponse(message, 400);
    }
    
    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map(val => val.message);
        error = new ErrorResponse(message, 400);
    }
    
    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || 'Server Error'
    });
});
```

### **Async Error Handler Wrapper:**

```javascript
// middleware/async.js
const asyncHandler = fn => (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next);

module.exports = asyncHandler;

// Usage - No more try/catch blocks!
const asyncHandler = require('../middleware/async');

exports.getBooks = asyncHandler(async (req, res, next) => {
    const books = await Book.find();
    res.status(200).json({ success: true, data: books });
    // Errors automatically caught and passed to error handler
});
```

---

## 1️⃣1️⃣ **API DESIGN BEST PRACTICES**

### **RESTful URL Naming:**

```javascript
✅ GOOD:
GET    /api/books              // Get all books
GET    /api/books/123          // Get specific book
POST   /api/books              // Create book
PUT    /api/books/123          // Update book
DELETE /api/books/123          // Delete book
POST   /api/books/123/borrow   // Action on book

❌ BAD:
GET    /api/getAllBooks
GET    /api/getBook?id=123
POST   /api/createBook
POST   /api/updateBook
POST   /api/deleteBook
GET    /api/borrowBook?id=123
```

### **URL Naming Conventions:**

```javascript
✅ Use nouns (not verbs):
/api/books    NOT    /api/getBooks
/api/users    NOT    /api/fetchUsers

✅ Use plurals:
/api/books    NOT    /api/book
/api/users    NOT    /api/user

✅ Use kebab-case:
/api/borrowed-books    NOT    /api/borrowedBooks
/api/user-profiles     NOT    /api/userProfiles

✅ Nested resources:
/api/users/123/books           // Books by user 123
/api/books/456/reviews         // Reviews for book 456

✅ Use query params for filtering:
/api/books?genre=Fiction&available=true
/api/books?sort=-createdAt&limit=10
```

### **Response Format Consistency:**

```javascript
// Always use same structure

// Success Response:
{
    "success": true,
    "data": { ... }  // Single object
}

{
    "success": true,
    "count": 10,
    "data": [ ... ]  // Array
}

// Error Response:
{
    "success": false,
    "error": "Error message here"
}

// With pagination:
{
    "success": true,
    "count": 5,
    "pagination": {
        "next": { "page": 2, "limit": 5 },
        "prev": { "page": 1, "limit": 5 }
    },
    "data": [ ... ]
}
```

### **Versioning:**

```javascript
// Method 1: URL Path (Recommended)
/api/v1/books
/api/v2/books

// In server.js:
app.use('/api/v1/books', booksRoutesV1);
app.use('/api/v2/books', booksRoutesV2);

// Method 2: Header
Accept: application/vnd.api.v1+json

// Method 3: Query Parameter
/api/books?version=1
```

### **Pagination Standards:**

```javascript
// Request:
GET /api/books?page=2&limit=10

// Response:
{
    "success": true,
    "count": 10,
    "total": 156,
    "pagination": {
        "currentPage": 2,
        "totalPages": 16,
        "next": {
            "page": 3,
            "limit": 10
        },
        "prev": {
            "page": 1,
            "limit": 10
        }
    },
    "data": [ ... ]
}
```

---

## 1️⃣2️⃣ **SECURITY BEST PRACTICES**

### **Environment Variables:**

```javascript
// ❌ NEVER DO THIS:
const SECRET_KEY = 'my_secret_key_123';
const DB_PASSWORD = 'password123';

// ✅ ALWAYS USE .ENV:
// .env file:
JWT_SECRET=8a7sd9f87asd98f7asd98f7asd98f7
DB_PASSWORD=complex_password_here

// In code:
const secretKey = process.env.JWT_SECRET;
const dbPassword = process.env.DB_PASSWORD;

// .gitignore:
.env
.env.local
.env.production
```

### **Input Validation & Sanitization:**

```javascript
// Install express-validator
npm install express-validator

// In routes:
const { body, validationResult } = require('express-validator');

router.post('/register',
    [
        body('email').isEmail().normalizeEmail(),
        body('password').isLength({ min: 6 }),
        body('name').trim().escape()
    ],
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        // Proceed with registration...
    }
);
```

### **Rate Limiting:**

```javascript
// Install express-rate-limit
npm install express-rate-limit

// In server.js:
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests, please try again later'
});

// Apply to all routes
app.use('/api/', limiter);

// Or specific routes
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5 // Only 5 login attempts per 15 minutes
});

app.use('/api/auth/login', authLimiter);
```

### **Security Headers (Helmet):**

```javascript
// Install helmet
npm install helmet

// In server.js:
const helmet = require('helmet');

app.use(helmet());

// Helmet sets these headers:
// X-DNS-Prefetch-Control
// X-Frame-Options
// Strict-Transport-Security
// X-Download-Options
// X-Content-Type-Options
// X-XSS-Protection
```

### **CORS Configuration:**

```javascript
// Install cors
npm install cors

// Basic usage:
app.use(cors());

// Production configuration:
const corsOptions = {
    origin: 'https://yourdomain.com', // Only allow your frontend
    credentials: true,                // Allow cookies
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Multiple origins:
const whitelist = ['https://yourdomain.com', 'https://admin.yourdomain.com'];
const corsOptions = {
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    }
};
```

### **SQL Injection Prevention:**

```javascript
// MongoDB with Mongoose is safe by default!
// Mongoose escapes queries automatically

// ❌ Direct string concatenation (vulnerable):
db.collection.find(`{ email: '${userInput}' }`); // DON'T DO THIS!

// ✅ Using Mongoose (safe):
User.find({ email: userInput }); // Mongoose escapes automatically
```

### **XSS Prevention:**

```javascript
// Install xss-clean
npm install xss-clean

// In server.js:
const xss = require('xss-clean');
app.use(xss()); // Sanitizes user input

// Also use Content Security Policy:
app.use(helmet.contentSecurityPolicy({
    directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"]
    }
}));
```

### **Password Security Checklist:**

```javascript
✅ Hash passwords (bcrypt/argon2)
✅ Min 8 characters length
✅ Never log passwords
✅ Use HTTPS in production
✅ Implement password reset
✅ Add account lockout (5 attempts)
✅ Don't send passwords in URLs
✅ Use secure JWT secrets
✅ Expire tokens (7 days max)
✅ Rotate secrets regularly
```

---

## 1️⃣3️⃣ **PERFORMANCE OPTIMIZATION**

### **Database Indexing:**

```javascript
// In model:
userSchema.index({ email: 1 });          // Single field index
userSchema.index({ role: 1, isActive: 1 }); // Compound index
bookSchema.index({ title: 'text', author: 'text' }); // Text index

// Query performance:
// Without index: O(n) - scans all documents
// With index: O(log n) - uses B-tree

// Check indexes in MongoDB:
db.books.getIndexes();

// Analyze query performance:
Book.find({ email: 'test@example.com' }).explain('executionStats');
```

### **Query Optimization:**

```javascript
// ❌ BAD: Select all fields
const users = await User.find();

// ✅ GOOD: Select only needed fields
const users = await User.find().select('name email');

// ❌ BAD: N+1 query problem
const books = await Book.find();
for (let book of books) {
    book.author = await User.findById(book.addedBy); // N queries!
}

// ✅ GOOD: Use populate
const books = await Book.find().populate('addedBy', 'name email'); // 1 query!

// ❌ BAD: Loading all documents
const books = await Book.find(); // Could be millions!

// ✅ GOOD: Use pagination
const books = await Book.find().limit(10).skip(0);
```

### **Caching:**

```javascript
// Install redis
npm install redis

// In server.js:
const redis = require('redis');
const client = redis.createClient();

// Middleware for caching:
const cache = (req, res, next) => {
    const key = req.originalUrl;
    
    client.get(key, (err, data) => {
        if (err) throw err;
        
        if (data !== null) {
            // Cache hit - return cached data
            res.json(JSON.parse(data));
        } else {
            // Cache miss - continue to route handler
            // Store original res.json
            const originalJson = res.json.bind(res);
            
            // Override res.json to cache the response
            res.json = (body) => {
                client.setex(key, 3600, JSON.stringify(body)); // Cache for 1 hour
                originalJson(body);
            };
            
            next();
        }
    });
};

// Usage:
router.get('/books', cache, getBooks);
```

### **Compression:**

```javascript
// Install compression
npm install compression

// In server.js:
const compression = require('compression');
app.use(compression());

// Reduces response size by ~70%!
```

---

## 📚 **SUMMARY - WHAT YOU'VE LEARNED**

### **Core Concepts:**
✅ HTTP request-response cycle
✅ REST API principles
✅ CRUD operations
✅ Middleware architecture
✅ Authentication (JWT)
✅ Authorization (RBAC)
✅ Password hashing (bcrypt)
✅ Database modeling (Mongoose)
✅ Error handling
✅ Security best practices

### **Technical Skills:**
✅ Node.js & Express.js
✅ MongoDB & Mongoose
✅ JWT authentication
✅ RESTful API design
✅ MVC architecture
✅ Async/await patterns
✅ Error handling strategies

### **Next Steps:**
📖 Build more complex features
📖 Learn testing (Jest, Mocha)
📖 Implement WebSockets (real-time)
📖 Add file uploads (multer)
📖 Deploy to production (Heroku, AWS, Digital Ocean)
📖 Learn Docker & containerization
📖 Explore microservices architecture
📖 Study GraphQL as API alternative

---

**You are now a BACKEND DEVELOPER! 🎉**

Keep practicing, keep building, keep learning! 🚀

