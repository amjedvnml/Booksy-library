// ============================================
// MAIN SERVER FILE - THE HEART OF YOUR BACKEND
// ============================================
// This file starts your server and connects everything together

// -------- 1. IMPORT DEPENDENCIES --------
const express = require('express');      // Web framework for building APIs
const cors = require('cors');            // Allows frontend to make requests
const dotenv = require('dotenv');        // Loads environment variables from .env
const connectDB = require('./config/db'); // Our database connection function

// -------- 2. LOAD ENVIRONMENT VARIABLES --------
dotenv.config(); // Reads .env file and makes variables available via process.env

// -------- 3. CREATE EXPRESS APP --------
const app = express(); // Creates an instance of an Express application
const PORT = process.env.PORT || 5000; // Get port from .env or use 5000 as default

// -------- 4. CONNECT TO DATABASE --------
// For local development, connect immediately
if (process.env.NODE_ENV !== 'production') {
    connectDB(); // Establish connection to MongoDB
}

// For serverless (Vercel), connect on first request
app.use(async (req, res, next) => {
    if (process.env.NODE_ENV === 'production') {
        try {
            await connectDB();
        } catch (error) {
            console.error('Database connection failed:', error);
            return res.status(503).json({
                success: false,
                message: 'Database temporarily unavailable'
            });
        }
    }
    next();
});

// -------- 5. MIDDLEWARE --------
// Middleware = functions that run BEFORE your route handlers
// Think of them as security guards checking everyone before they enter

// CORS Middleware - Allows requests from different origins (your frontend)
app.use(cors());

// JSON Parser Middleware - Converts incoming JSON data to JavaScript objects
app.use(express.json());

// Custom Logger Middleware (for learning purposes)
app.use((req, res, next) => {
    console.log(`📨 ${req.method} ${req.url} - ${new Date().toLocaleTimeString()}`);
    next(); // Pass control to next middleware/route
});

// -------- 6. ROUTES / API ENDPOINTS --------

// Import route files
const bookRoutes = require('./routes/books');
const authRoutes = require('./routes/auth');

// Root route - Just to test if server is running
app.get('/', (req, res) => {
    res.json({ 
        message: 'Welcome to Booksy Library API',
        version: '1.0.0',
        endpoints: {
            books: '/api/books',
            auth: '/api/auth',
            health: '/api/health'
        },
        documentation: 'https://github.com/amjedvnml/Booksy-library'
    });
});

// Health check route - Used to verify server is alive
app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'Server is running smoothly! 🚀',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        database: 'Connected'
    });
});

// Mount routers
// All routes in bookRoutes will be prefixed with /api/books
app.use('/api/books', bookRoutes);
// All routes in authRoutes will be prefixed with /api/auth
app.use('/api/auth', authRoutes);

// -------- 7. ERROR HANDLING MIDDLEWARE --------
// This catches any errors that occur in your routes

// 404 Handler - For routes that don't exist
app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found`
    });
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error('❌ Error:', err.message);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error',
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});

// -------- 8. START SERVER --------
// For local development
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
        console.log(`📍 Access server at: http://localhost:${PORT}`);
    });
}

// -------- 9. EXPORT FOR VERCEL SERVERLESS --------
// Vercel uses this export to handle requests
module.exports = app;

// ============================================
// DEEP DIVE EXPLANATIONS:
// ============================================
//
// 1. EXPRESS APP FLOW:
//    Request → Middleware Chain → Route Handler → Response
//    Each middleware can:
//    - Modify req/res objects
//    - End the request-response cycle
//    - Call next() to pass to next middleware
//
// 2. MIDDLEWARE ORDER MATTERS!
//    app.use(cors())         ← Must come before routes
//    app.use(express.json()) ← Must parse JSON before using req.body
//    app.get('/route')       ← Your routes
//    app.use(errorHandler)   ← Error handlers come last
//
// 3. THE 'next' FUNCTION:
//    - Passes control to next middleware
//    - Without calling next(), request hangs!
//    - next(error) skips to error handler
//
// 4. ASYNC/AWAIT IN ROUTES:
//    app.get('/books', async (req, res) => {
//        const books = await Book.find(); // Wait for database
//        res.json(books);
//    });
//
// 5. STATUS CODES:
//    200 = OK
//    201 = Created
//    400 = Bad Request
//    401 = Unauthorized
//    404 = Not Found
//    500 = Server Error
// ============================================