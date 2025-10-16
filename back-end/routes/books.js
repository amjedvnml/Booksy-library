// ============================================
// BOOK ROUTES - API ENDPOINTS FOR BOOKS
// ============================================
// Defines all routes/endpoints related to books

const express = require('express');
const router = express.Router();

// Import controller functions
const {
    getBooks,
    getBook,
    createBook,
    updateBook,
    deleteBook,
    searchBooks,
    getBooksByGenre,
    borrowBook,
    returnBook,
    getBookStats
} = require('../controllers/bookController');

// Import middleware
const { protect, authorize } = require('../middleware/auth');

// ============================================
// PUBLIC ROUTES - No authentication required
// ============================================

// @route   GET /api/books
// @desc    Get all books (with filtering, sorting, pagination)
// @access  Public
router.get('/', getBooks);

// @route   GET /api/books/:id
// @desc    Get single book by ID
// @access  Public
router.get('/:id', getBook);

// @route   GET /api/books/search/:query
// @desc    Search books by text
// @access  Public
router.get('/search/:query', searchBooks);

// @route   GET /api/books/genre/:genre
// @desc    Get books by genre
// @access  Public
router.get('/genre/:genre', getBooksByGenre);

// ============================================
// PROTECTED ROUTES - Require authentication
// ============================================

// @route   POST /api/books
// @desc    Create new book
// @access  Private (Librarian/Admin only)
router.post('/', protect, authorize('librarian', 'admin'), createBook);

// @route   PUT /api/books/:id
// @desc    Update book
// @access  Private (Librarian/Admin only)
router.put('/:id', protect, authorize('librarian', 'admin'), updateBook);

// @route   DELETE /api/books/:id
// @desc    Delete book
// @access  Private (Admin only)
router.delete('/:id', protect, authorize('admin'), deleteBook);

// ============================================
// BORROWING ROUTES
// ============================================

// @route   POST /api/books/:id/borrow
// @desc    Borrow a book
// @access  Private (Any authenticated user)
router.post('/:id/borrow', protect, borrowBook);

// @route   POST /api/books/:id/return
// @desc    Return a book
// @access  Private (Any authenticated user)
router.post('/:id/return', protect, returnBook);

// ============================================
// ADMIN ROUTES
// ============================================

// @route   GET /api/books/stats
// @desc    Get book statistics
// @access  Private (Admin only)
router.get('/stats', protect, authorize('admin'), getBookStats);

// Export router
module.exports = router;

// ============================================
// DEEP DIVE - EXPRESS ROUTER:
// ============================================
//
// WHAT IS express.Router()?
// - Mini express application
// - Modular route handlers
// - Can have its own middleware
// - Mounted in main app
//
// WHY USE ROUTER?
// - Organize routes by resource (books, users, etc.)
// - Keep server.js clean
// - Easier to maintain
// - Can be tested independently
//
// ============================================
// DEEP DIVE - ROUTE STRUCTURE:
// ============================================
//
// BASIC ROUTE:
// router.get('/path', handlerFunction);
//
// WITH MIDDLEWARE:
// router.get('/path', middleware1, middleware2, handler);
//
// WITH PARAMETERS:
// router.get('/books/:id', handler);
// Access via: req.params.id
//
// WITH QUERY STRINGS:
// GET /books?genre=Fiction&available=true
// Access via: req.query.genre, req.query.available
//
// WITH REQUEST BODY:
// POST /books
// Body: { title: "Book", author: "Author" }
// Access via: req.body.title, req.body.author
//
// ============================================
// DEEP DIVE - ROUTE PARAMETERS:
// ============================================
//
// URL PARAMETERS (:param):
// router.get('/books/:id', ...)
// /books/123 → req.params.id = '123'
//
// MULTIPLE PARAMETERS:
// router.get('/users/:userId/books/:bookId', ...)
// /users/1/books/5 → req.params = { userId: '1', bookId: '5' }
//
// OPTIONAL PARAMETERS:
// router.get('/books/:id?', ...)
// Works for /books and /books/123
//
// REGEX PARAMETERS:
// router.get('/books/:id(\\d+)', ...)
// Only matches if id is numeric
//
// ============================================
// DEEP DIVE - MIDDLEWARE EXECUTION ORDER:
// ============================================
//
// Example:
// router.post('/', middleware1, middleware2, handler);
//
// Execution Flow:
// 1. Request arrives
// 2. middleware1 runs
//    - Can modify req/res
//    - Calls next()
// 3. middleware2 runs
//    - Can modify req/res
//    - Calls next()
// 4. handler runs
//    - Sends response
// 5. Response sent to client
//
// If middleware doesn't call next():
// - Chain stops
// - Must send response
// - Example: Authentication fails
//
// ============================================
// DEEP DIVE - ROUTE CHAINING:
// ============================================
//
// Instead of:
// router.get('/books', getBooks);
// router.post('/books', createBook);
//
// Use route chaining:
// router.route('/books')
//     .get(getBooks)
//     .post(protect, createBook);
//
// Benefits:
// - Less repetition
// - Cleaner code
// - Single path definition
//
// ============================================
// DEEP DIVE - ROUTE ORGANIZATION:
// ============================================
//
// OPTION 1: By HTTP Method
// routes/
//   books.js       (All book routes)
//   users.js       (All user routes)
//   auth.js        (All auth routes)
//
// OPTION 2: By Feature
// routes/
//   books/
//     index.js     (Public routes)
//     admin.js     (Admin routes)
//     borrow.js    (Borrowing routes)
//
// OPTION 3: By Version
// routes/
//   v1/
//     books.js
//     users.js
//   v2/
//     books.js
//     users.js
//
// ============================================
// DEEP DIVE - ROUTE MOUNTING:
// ============================================
//
// In server.js:
// const bookRoutes = require('./routes/books');
// app.use('/api/books', bookRoutes);
//
// This means:
// - All routes in books.js are prefixed with /api/books
// - router.get('/') becomes /api/books
// - router.get('/:id') becomes /api/books/:id
// - router.post('/') becomes /api/books
//
// Example:
// // In routes/books.js
// router.get('/');        // Becomes: GET /api/books
// router.get('/:id');     // Becomes: GET /api/books/:id
// router.post('/');       // Becomes: POST /api/books
//
// ============================================
// DEEP DIVE - REST API CONVENTIONS:
// ============================================
//
// RESOURCE: Books
//
// GET /api/books
//   → Get all books (List)
//
// GET /api/books/:id
//   → Get single book (Read)
//
// POST /api/books
//   → Create new book (Create)
//
// PUT /api/books/:id
//   → Update entire book (Update)
//
// PATCH /api/books/:id
//   → Update partial book (Partial Update)
//
// DELETE /api/books/:id
//   → Delete book (Delete)
//
// NESTED RESOURCES:
// GET /api/users/:userId/books
//   → Get books by specific user
//
// POST /api/books/:id/borrow
//   → Borrow a book (Action)
//
// ============================================
// DEEP DIVE - API VERSIONING:
// ============================================
//
// WHY VERSION APIs?
// - Breaking changes without affecting old clients
// - Support multiple app versions
// - Gradual migration
//
// METHOD 1: URL Path
// /api/v1/books
// /api/v2/books
//
// METHOD 2: Query Parameter
// /api/books?version=1
// /api/books?version=2
//
// METHOD 3: Header
// Accept: application/vnd.api.v1+json
//
// METHOD 4: Subdomain
// v1.api.example.com/books
// v2.api.example.com/books
//
// BEST PRACTICE: URL Path (Method 1)
// - Clear and explicit
// - Easy to route
// - Self-documenting
// ============================================
