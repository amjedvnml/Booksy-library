// ============================================
// BOOK CONTROLLER - HANDLES ALL BOOK OPERATIONS
// ============================================
// Controllers contain the business logic for handling requests
// They interact with models (database) and send responses

const Book = require('../models/Book');

// ============================================
// @desc    Get all books
// @route   GET /api/books
// @access  Public
// ============================================
exports.getBooks = async (req, res, next) => {
    try {
        // -------- FILTERING --------
        // Copy req.query to manipulate it
        const reqQuery = { ...req.query };
        
        // Fields to exclude from filtering
        const removeFields = ['select', 'sort', 'page', 'limit'];
        removeFields.forEach(param => delete reqQuery[param]);
        
        // Create query string for advanced filtering
        let queryStr = JSON.stringify(reqQuery);
        
        // Add MongoDB operators ($gt, $gte, $lt, $lte, $in)
        // Example: ?pages[gte]=100 becomes { pages: { $gte: 100 } }
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
        
        // -------- BUILD QUERY --------
        let query = Book.find(JSON.parse(queryStr));
        
        // -------- SELECT FIELDS --------
        // Example: ?select=title,author (only return these fields)
        if (req.query.select) {
            const fields = req.query.select.split(',').join(' ');
            query = query.select(fields);
        }
        
        // -------- SORT --------
        // Example: ?sort=-createdAt (descending) or ?sort=title (ascending)
        if (req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy);
        } else {
            query = query.sort('-createdAt'); // Default: newest first
        }
        
        // -------- PAGINATION --------
        const page = parseInt(req.query.page, 10) || 1; // Current page
        const limit = parseInt(req.query.limit, 10) || 10; // Books per page
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const total = await Book.countDocuments(JSON.parse(queryStr));
        
        query = query.skip(startIndex).limit(limit);
        
        // -------- POPULATE --------
        // Replace user ID with actual user data
        query = query.populate({
            path: 'addedBy',
            select: 'name email'
        });
        
        // -------- EXECUTE QUERY --------
        const books = await query;
        
        // -------- PAGINATION RESULT --------
        const pagination = {};
        
        if (endIndex < total) {
            pagination.next = {
                page: page + 1,
                limit
            };
        }
        
        if (startIndex > 0) {
            pagination.prev = {
                page: page - 1,
                limit
            };
        }
        
        // -------- SEND RESPONSE --------
        res.status(200).json({
            success: true,
            count: books.length,
            total,
            pagination,
            data: books
        });
        
    } catch (error) {
        next(error); // Pass to error handler middleware
    }
};

// ============================================
// @desc    Get single book
// @route   GET /api/books/:id
// @access  Public
// ============================================
exports.getBook = async (req, res, next) => {
    try {
        const book = await Book.findById(req.params.id).populate({
            path: 'addedBy',
            select: 'name email'
        });
        
        // Check if book exists
        if (!book) {
            return res.status(404).json({
                success: false,
                message: `Book not found with id of ${req.params.id}`
            });
        }
        
        res.status(200).json({
            success: true,
            data: book
        });
        
    } catch (error) {
        // Handle invalid ObjectId format
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: 'Invalid book ID format'
            });
        }
        next(error);
    }
};

// ============================================
// @desc    Create new book
// @route   POST /api/books
// @access  Private (Librarian/Admin)
// ============================================
exports.createBook = async (req, res, next) => {
    try {
        // Debug logging
        console.log('🔍 CREATE BOOK - Debug Info:');
        console.log('- req.user exists?', !!req.user);
        console.log('- req.user type:', typeof req.user);
        console.log('- req.user value:', JSON.stringify(req.user));
        console.log('- req.headers.authorization:', req.headers.authorization ? 'Present' : 'Missing');
        console.log('- req.body:', req.body);
        
        // Check if user exists (should be set by protect middleware)
        if (!req.user) {
            console.log('❌ CREATE BOOK - req.user is undefined!');
            return res.status(401).json({
                success: false,
                message: 'User not authenticated. Please login and try again.'
            });
        }
        
        // Check if req.user has id property
        if (!req.user.id && !req.user._id) {
            console.log('❌ CREATE BOOK - req.user has no id property!');
            console.log('req.user keys:', Object.keys(req.user));
            return res.status(401).json({
                success: false,
                message: 'User authentication data is incomplete.'
            });
        }
        
        // Add user who created the book (try both .id and ._id)
        const userId = req.user.id || req.user._id;
        console.log('✅ Using user ID:', userId);
        req.body.addedBy = userId;
        
        // Create book in database
        console.log('💾 Creating book in database...');
        const book = await Book.create(req.body);
        console.log('✅ Book created successfully:', book._id);
        
        res.status(201).json({
            success: true,
            message: 'Book created successfully',
            data: book
        });
        
    } catch (error) {
        console.error('❌ CREATE BOOK ERROR:', error.message);
        console.error('Error stack:', error.stack);
        
        // Handle duplicate ISBN error
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'A book with this ISBN already exists'
            });
        }
        
        // Handle validation errors
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: 'Validation Error',
                errors: messages
            });
        }
        
        // Return detailed error information
        return res.status(500).json({
            success: false,
            message: error.message || 'Server error creating book',
            error: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};

// ============================================
// @desc    Update book
// @route   PUT /api/books/:id
// @access  Private (Librarian/Admin)
// ============================================
exports.updateBook = async (req, res, next) => {
    try {
        let book = await Book.findById(req.params.id);
        
        if (!book) {
            return res.status(404).json({
                success: false,
                message: `Book not found with id of ${req.params.id}`
            });
        }
        
        // Update book
        book = await Book.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,              // Return updated document
                runValidators: true     // Run schema validators
            }
        );
        
        res.status(200).json({
            success: true,
            message: 'Book updated successfully',
            data: book
        });
        
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: 'Invalid book ID format'
            });
        }
        next(error);
    }
};

// ============================================
// @desc    Delete book
// @route   DELETE /api/books/:id
// @access  Private (Admin only)
// ============================================
exports.deleteBook = async (req, res, next) => {
    try {
        const book = await Book.findById(req.params.id);
        
        if (!book) {
            return res.status(404).json({
                success: false,
                message: `Book not found with id of ${req.params.id}`
            });
        }
        
        // Check if book is currently borrowed
        if (book.borrowedCount > 0) {
            return res.status(400).json({
                success: false,
                message: 'Cannot delete book that is currently borrowed'
            });
        }
        
        await book.deleteOne();
        
        res.status(200).json({
            success: true,
            message: 'Book deleted successfully',
            data: {}
        });
        
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: 'Invalid book ID format'
            });
        }
        next(error);
    }
};

// ============================================
// @desc    Search books by text
// @route   GET /api/books/search/:query
// @access  Public
// ============================================
exports.searchBooks = async (req, res, next) => {
    try {
        const searchQuery = req.params.query;
        
        // Text search across title, author, description
        const books = await Book.find({
            $text: { $search: searchQuery }
        }).select('title author isbn genre available coverImage');
        
        res.status(200).json({
            success: true,
            count: books.length,
            data: books
        });
        
    } catch (error) {
        next(error);
    }
};

// ============================================
// @desc    Get books by genre
// @route   GET /api/books/genre/:genre
// @access  Public
// ============================================
exports.getBooksByGenre = async (req, res, next) => {
    try {
        const books = await Book.findByGenre(req.params.genre);
        
        res.status(200).json({
            success: true,
            count: books.length,
            data: books
        });
        
    } catch (error) {
        next(error);
    }
};

// ============================================
// @desc    Borrow a book
// @route   POST /api/books/:id/borrow
// @access  Private (User)
// ============================================
exports.borrowBook = async (req, res, next) => {
    try {
        const book = await Book.findById(req.params.id);
        
        if (!book) {
            return res.status(404).json({
                success: false,
                message: 'Book not found'
            });
        }
        
        // Check if book is available
        if (book.availableCopies <= 0) {
            return res.status(400).json({
                success: false,
                message: 'No copies available for borrowing'
            });
        }
        
        // Check if user can borrow
        const User = require('../models/User');
        const user = await User.findById(req.user.id);
        const canBorrow = user.canBorrow();
        
        if (!canBorrow.allowed) {
            return res.status(400).json({
                success: false,
                message: canBorrow.reason
            });
        }
        
        // Borrow the book (using instance method)
        await book.borrowBook();
        
        // Add to user's borrowed books
        user.currentBorrowedBooks.push({
            book: book._id,
            borrowDate: Date.now()
        });
        await user.save();
        
        res.status(200).json({
            success: true,
            message: 'Book borrowed successfully',
            data: {
                book,
                dueDate: user.currentBorrowedBooks[user.currentBorrowedBooks.length - 1].dueDate
            }
        });
        
    } catch (error) {
        next(error);
    }
};

// ============================================
// @desc    Return a book
// @route   POST /api/books/:id/return
// @access  Private (User)
// ============================================
exports.returnBook = async (req, res, next) => {
    try {
        const book = await Book.findById(req.params.id);
        
        if (!book) {
            return res.status(404).json({
                success: false,
                message: 'Book not found'
            });
        }
        
        // Return the book (using instance method)
        await book.returnBook();
        
        // Remove from user's borrowed books
        const User = require('../models/User');
        const user = await User.findById(req.user.id);
        
        const borrowedIndex = user.currentBorrowedBooks.findIndex(
            item => item.book.toString() === book._id.toString()
        );
        
        if (borrowedIndex === -1) {
            return res.status(400).json({
                success: false,
                message: 'You have not borrowed this book'
            });
        }
        
        // Move to history
        const borrowedItem = user.currentBorrowedBooks[borrowedIndex];
        user.borrowHistory.push({
            book: book._id,
            borrowDate: borrowedItem.borrowDate,
            returnDate: Date.now()
        });
        
        user.currentBorrowedBooks.splice(borrowedIndex, 1);
        await user.save();
        
        res.status(200).json({
            success: true,
            message: 'Book returned successfully',
            data: book
        });
        
    } catch (error) {
        next(error);
    }
};

// ============================================
// @desc    Get book statistics
// @route   GET /api/books/stats
// @access  Private (Admin)
// ============================================
exports.getBookStats = async (req, res, next) => {
    try {
        const stats = await Book.aggregate([
            {
                // Group all books
                $group: {
                    _id: null,
                    totalBooks: { $sum: 1 },
                    totalCopies: { $sum: '$quantity' },
                    borrowedCopies: { $sum: '$borrowedCount' },
                    availableBooks: {
                        $sum: { $cond: ['$available', 1, 0] }
                    },
                    avgPages: { $avg: '$pages' }
                }
            }
        ]);
        
        // Books by genre
        const genreStats = await Book.aggregate([
            {
                $group: {
                    _id: '$genre',
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { count: -1 }
            }
        ]);
        
        res.status(200).json({
            success: true,
            data: {
                overall: stats[0] || {},
                byGenre: genreStats
            }
        });
        
    } catch (error) {
        next(error);
    }
};

// ============================================
// DEEP DIVE - ASYNC/AWAIT & ERROR HANDLING:
// ============================================
//
// WHY ASYNC/AWAIT?
// - Database operations take time (network call)
// - "async" marks function as asynchronous
// - "await" pauses execution until promise resolves
// - Makes asynchronous code look synchronous
//
// EXAMPLE WITHOUT ASYNC/AWAIT:
// Book.findById(id).then(book => {
//     res.json(book);
// }).catch(error => {
//     res.status(500).json({ error });
// });
//
// SAME WITH ASYNC/AWAIT:
// try {
//     const book = await Book.findById(id);
//     res.json(book);
// } catch (error) {
//     res.status(500).json({ error });
// }
//
// ============================================
// DEEP DIVE - MONGOOSE QUERY METHODS:
// ============================================
//
// FIND:
// Book.find() - Returns array of all books
// Book.find({ genre: 'Fiction' }) - Filter
// Book.findOne({ isbn: '123' }) - Returns single document
// Book.findById(id) - Find by MongoDB _id
//
// CREATE:
// Book.create(data) - Create new document
// new Book(data).save() - Alternative way
//
// UPDATE:
// Book.findByIdAndUpdate(id, data, options)
// Book.updateOne({ _id: id }, data)
// Book.updateMany({ genre: 'Fiction' }, data)
//
// DELETE:
// Book.findByIdAndDelete(id)
// book.deleteOne() - On document instance
// Book.deleteMany({ year: { $lt: 2000 } })
//
// QUERY CHAINING:
// Book.find({ available: true })
//     .select('title author')
//     .sort('-createdAt')
//     .limit(10)
//     .populate('addedBy')
//     .exec();
//
// ============================================
// DEEP DIVE - QUERY OPTIONS:
// ============================================
//
// SELECT:
// .select('title author') - Include only these
// .select('-password') - Exclude password
//
// SORT:
// .sort('title') - Ascending
// .sort('-createdAt') - Descending
// .sort({ title: 1, year: -1 }) - Multiple fields
//
// LIMIT & SKIP:
// .limit(10) - Return only 10 documents
// .skip(20) - Skip first 20 documents
// Pagination: page 3, 10 per page = skip(20).limit(10)
//
// POPULATE:
// .populate('addedBy') - Replace ID with full document
// .populate({ path: 'addedBy', select: 'name' })
//
// ============================================
// DEEP DIVE - MONGODB OPERATORS:
// ============================================
//
// COMPARISON:
// $eq - Equal
// $ne - Not equal
// $gt - Greater than
// $gte - Greater than or equal
// $lt - Less than
// $lte - Less than or equal
// $in - In array
// $nin - Not in array
//
// LOGICAL:
// $and - All conditions true
// $or - At least one condition true
// $not - Negates condition
// $nor - All conditions false
//
// EXAMPLES:
// { pages: { $gte: 100, $lte: 500 } }
// { genre: { $in: ['Fiction', 'Mystery'] } }
// { $or: [{ available: true }, { quantity: { $gt: 5 } }] }
//
// ============================================
// DEEP DIVE - HTTP STATUS CODES:
// ============================================
//
// 2xx SUCCESS:
// 200 OK - Request succeeded
// 201 Created - Resource created
// 204 No Content - Succeeded but no response body
//
// 4xx CLIENT ERRORS:
// 400 Bad Request - Invalid syntax/data
// 401 Unauthorized - Authentication required
// 403 Forbidden - No permission
// 404 Not Found - Resource doesn't exist
// 409 Conflict - Duplicate/conflicting data
//
// 5xx SERVER ERRORS:
// 500 Internal Server Error - Server crashed
// 503 Service Unavailable - Server down
// ============================================
