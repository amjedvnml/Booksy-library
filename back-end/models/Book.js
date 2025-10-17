// ============================================
// BOOK MODEL - DEFINES THE STRUCTURE OF A BOOK
// ============================================
// This file creates a schema (blueprint) for book documents in MongoDB

const mongoose = require('mongoose');

// -------- CREATE SCHEMA --------
// Schema = structure/rules for documents
const bookSchema = new mongoose.Schema(
    {
        // -------- BASIC INFORMATION --------
        title: {
            type: String,              // Data type: text
            required: [true, 'Please add a book title'],  // Must be provided
            trim: true,                // Remove whitespace from both ends
            maxlength: [200, 'Title cannot be more than 200 characters']
        },
        
        author: {
            type: String,
            required: [true, 'Please add an author name'],
            trim: true
        },
        
        isbn: {
            type: String,
            unique: true,              // No two books can have same ISBN
            sparse: true,              // Allows multiple null/undefined values (books without ISBN)
            trim: true,
            default: null              // Optional - books can exist without ISBN
        },
        
        // -------- DESCRIPTION --------
        description: {
            type: String,
            maxlength: [2000, 'Description cannot be more than 2000 characters']
        },
        
        // -------- PUBLICATION INFO --------
        publisher: {
            type: String,
            trim: true
        },
        
        publishedYear: {
            type: Number,
            min: [1000, 'Year must be at least 1000'],
            max: [new Date().getFullYear(), 'Year cannot be in the future']
        },
        
        // -------- PHYSICAL PROPERTIES --------
        pages: {
            type: Number,
            min: [1, 'Pages must be at least 1']
        },
        
        language: {
            type: String,
            default: 'English',        // Default value if not specified
            trim: true
        },
        
        // -------- CATEGORIZATION --------
        genre: {
            type: String,
            enum: [                    // Only these values allowed
                'Fiction',
                'Non-Fiction',
                'Science Fiction',
                'Mystery',
                'Romance',
                'Thriller',
                'Biography',
                'History',
                'Science',
                'Self-Help',
                'Fantasy',
                'Horror',
                'Poetry',
                'Children',
                'Other'
            ]
        },
        
        // -------- LIBRARY MANAGEMENT --------
        available: {
            type: Boolean,
            default: true              // New books are available by default
        },
        
        quantity: {
            type: Number,
            default: 1,
            min: [0, 'Quantity cannot be negative']
        },
        
        borrowedCount: {
            type: Number,
            default: 0,
            min: [0, 'Borrowed count cannot be negative']
        },
        
        // -------- MEDIA --------
        coverImage: {
            type: String,              // URL to cover image
            default: 'no-image.jpg'
        },
        
        // -------- PDF FILE --------
        hasPDF: {
            type: Boolean,
            default: false
        },
        
        pdfFileName: {
            type: String              // Original filename
        },
        
        pdfSize: {
            type: Number              // File size in bytes
        },
        
        pdfUrl: {
            type: String              // Cloud storage URL (S3, Cloudinary, etc.)
        },
        
        // -------- USER WHO ADDED --------
        addedBy: {
            type: mongoose.Schema.Types.ObjectId,  // Reference to User model
            ref: 'User'                // Links to User collection
        }
    },
    {
        // -------- SCHEMA OPTIONS --------
        timestamps: true,              // Automatically adds createdAt & updatedAt
        toJSON: { virtuals: true },    // Include virtual properties in JSON
        toObject: { virtuals: true }
    }
);

// -------- INDEXES --------
// Indexes make queries faster (like book index in real library)
bookSchema.index({ title: 'text', author: 'text', description: 'text' }); // Text search
bookSchema.index({ genre: 1, available: 1 }); // Sort by genre and availability

// -------- VIRTUAL PROPERTIES --------
// Virtuals are computed properties (not stored in database)
bookSchema.virtual('availableCopies').get(function() {
    return this.quantity - this.borrowedCount;
});

// -------- INSTANCE METHODS --------
// Methods you can call on a book document

// Borrow a book
bookSchema.methods.borrowBook = async function() {
    if (this.availableCopies <= 0) {
        throw new Error('No copies available');
    }
    this.borrowedCount += 1;
    this.available = this.availableCopies > 1;
    await this.save();
    return this;
};

// Return a book
bookSchema.methods.returnBook = async function() {
    if (this.borrowedCount <= 0) {
        throw new Error('No borrowed copies to return');
    }
    this.borrowedCount -= 1;
    this.available = true;
    await this.save();
    return this;
};

// -------- STATIC METHODS --------
// Methods you can call on the Book model itself

// Find books by genre
bookSchema.statics.findByGenre = function(genre) {
    return this.find({ genre, available: true });
};

// Search books by text
bookSchema.statics.searchBooks = function(searchTerm) {
    return this.find({ $text: { $search: searchTerm } });
};

// -------- MIDDLEWARE (HOOKS) --------
// Code that runs before/after certain operations

// Before saving
bookSchema.pre('save', function(next) {
    // Ensure availability is correct
    this.available = this.availableCopies > 0;
    next();
});

// Before removing
bookSchema.pre('remove', function(next) {
    console.log(`Deleting book: ${this.title}`);
    next();
});

// -------- CREATE AND EXPORT MODEL --------
// Model = collection in MongoDB
// 'Book' = collection name (MongoDB converts to 'books')
const Book = mongoose.model('Book', bookSchema);

module.exports = Book;

// ============================================
// DEEP DIVE - MONGOOSE SCHEMA TYPES:
// ============================================
//
// 1. STRING VALIDATIONS:
//    - required: Must have value
//    - trim: Remove whitespace
//    - maxlength/minlength: Character limits
//    - enum: Only specific values allowed
//    - match: Must match regex pattern
//    - lowercase/uppercase: Auto-convert case
//
// 2. NUMBER VALIDATIONS:
//    - min/max: Value range
//    - required: Must have value
//
// 3. BOOLEAN:
//    - true or false
//    - default: Default value
//
// 4. DATE:
//    - type: Date
//    - default: Date.now
//
// 5. OBJECTID:
//    - References another document
//    - Like a foreign key in SQL
//    - ref: 'User' links to User model
//
// 6. ARRAY:
//    - tags: [String]
//    - authors: [{ type: ObjectId, ref: 'Author' }]
//
// ============================================
// SCHEMA OPTIONS:
// ============================================
//
// timestamps: true
//    - Automatically adds:
//      * createdAt: Date
//      * updatedAt: Date
//
// toJSON: { virtuals: true }
//    - Include virtual properties when converting to JSON
//
// ============================================
// VIRTUALS:
// ============================================
//
// - Computed properties (not stored in DB)
// - Calculated on-the-fly when accessed
// - Example: fullName from firstName + lastName
// - Saves database space
//
// ============================================
// METHODS vs STATICS:
// ============================================
//
// INSTANCE METHODS:
//    const book = await Book.findById(id);
//    book.borrowBook(); ← Called on document instance
//
// STATIC METHODS:
//    Book.findByGenre('Fiction'); ← Called on Model
//
// ============================================
// MIDDLEWARE (HOOKS):
// ============================================
//
// pre('save'): Before document is saved
// post('save'): After document is saved
// pre('remove'): Before document is deleted
// pre('find'): Before query runs
//
// Use cases:
// - Hash passwords before saving
// - Update timestamps
// - Validate data
// - Clean up related documents
// ============================================
