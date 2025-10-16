// ============================================
// USER MODEL - DEFINES THE STRUCTURE OF A USER
// ============================================
// This handles user authentication and profile data

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// -------- CREATE SCHEMA --------
const userSchema = new mongoose.Schema(
    {
        // -------- BASIC INFORMATION --------
        name: {
            type: String,
            required: [true, 'Please add a name'],
            trim: true,
            maxlength: [50, 'Name cannot be more than 50 characters']
        },
        
        email: {
            type: String,
            required: [true, 'Please add an email'],
            unique: true,              // No duplicate emails
            lowercase: true,           // Convert to lowercase
            trim: true,
            match: [                   // Email format validation
                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                'Please add a valid email'
            ]
        },
        
        password: {
            type: String,
            required: [true, 'Please add a password'],
            minlength: [6, 'Password must be at least 6 characters'],
            select: false              // Don't return password in queries by default
        },
        
        // -------- USER ROLE --------
        role: {
            type: String,
            enum: ['user', 'librarian', 'admin'],  // Three user types
            default: 'user'
        },
        
        // -------- PROFILE --------
        phone: {
            type: String,
            trim: true,
            match: [
                /^\+?[\d\s\-\(\)]+$/,
                'Please add a valid phone number'
            ]
        },
        
        address: {
            street: String,
            city: String,
            state: String,
            zipCode: String,
            country: {
                type: String,
                default: 'USA'
            }
        },
        
        avatar: {
            type: String,              // URL to profile picture
            default: 'default-avatar.jpg'
        },
        
        // -------- LIBRARY MEMBERSHIP --------
        membershipNumber: {
            type: String,
            unique: true,
            sparse: true               // Allows null values
        },
        
        membershipDate: {
            type: Date,
            default: Date.now
        },
        
        isActive: {
            type: Boolean,
            default: true              // Account active status
        },
        
        // -------- BORROWING INFO --------
        currentBorrowedBooks: [{
            book: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Book'
            },
            borrowDate: {
                type: Date,
                default: Date.now
            },
            dueDate: {
                type: Date,
                default: function() {
                    // Due date is 14 days from borrow date
                    return new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
                }
            }
        }],
        
        borrowHistory: [{
            book: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Book'
            },
            borrowDate: Date,
            returnDate: Date
        }],
        
        // -------- PASSWORD RESET --------
        resetPasswordToken: String,
        resetPasswordExpire: Date,
        
        // -------- ACCOUNT SECURITY --------
        lastLogin: Date,
        
        loginAttempts: {
            type: Number,
            default: 0
        },
        
        lockUntil: Date                // Account lockout timestamp
    },
    {
        timestamps: true               // Adds createdAt and updatedAt
    }
);

// ============================================
// MIDDLEWARE - RUNS AUTOMATICALLY
// ============================================

// -------- HASH PASSWORD BEFORE SAVING --------
// This runs every time a user is created or password is changed
userSchema.pre('save', async function(next) {
    // Only hash if password was modified (or new)
    if (!this.isModified('password')) {
        return next();
    }
    
    // Generate salt (random data for hashing)
    const salt = await bcrypt.genSalt(10);
    
    // Hash the password
    this.password = await bcrypt.hash(this.password, salt);
    
    next();
});

// -------- GENERATE MEMBERSHIP NUMBER --------
userSchema.pre('save', async function(next) {
    // Only generate if new user and no membership number
    if (this.isNew && !this.membershipNumber) {
        const year = new Date().getFullYear();
        const random = Math.floor(100000 + Math.random() * 900000);
        this.membershipNumber = `LIB${year}${random}`;
    }
    next();
});

// ============================================
// INSTANCE METHODS - CALL ON USER DOCUMENT
// ============================================

// -------- COMPARE ENTERED PASSWORD WITH HASHED PASSWORD --------
userSchema.methods.matchPassword = async function(enteredPassword) {
    // bcrypt.compare() hashes enteredPassword and compares
    return await bcrypt.compare(enteredPassword, this.password);
};

// -------- GENERATE JWT TOKEN --------
userSchema.methods.getSignedJwtToken = function() {
    // jwt.sign() creates a token
    return jwt.sign(
        { id: this._id },              // Payload (data to encode)
        process.env.JWT_SECRET,        // Secret key
        { expiresIn: process.env.JWT_EXPIRE }  // Token lifetime
    );
};

// -------- CHECK IF USER CAN BORROW --------
userSchema.methods.canBorrow = function() {
    // Maximum 5 books at a time
    if (this.currentBorrowedBooks.length >= 5) {
        return { allowed: false, reason: 'Maximum 5 books allowed' };
    }
    
    // Check if account is active
    if (!this.isActive) {
        return { allowed: false, reason: 'Account is not active' };
    }
    
    // Check if account is locked
    if (this.lockUntil && this.lockUntil > Date.now()) {
        return { allowed: false, reason: 'Account is temporarily locked' };
    }
    
    // Check for overdue books
    const hasOverdue = this.currentBorrowedBooks.some(
        item => item.dueDate < new Date()
    );
    
    if (hasOverdue) {
        return { allowed: false, reason: 'You have overdue books' };
    }
    
    return { allowed: true };
};

// -------- GET OVERDUE BOOKS --------
userSchema.methods.getOverdueBooks = function() {
    const now = new Date();
    return this.currentBorrowedBooks.filter(item => item.dueDate < now);
};

// -------- INCREMENT LOGIN ATTEMPTS --------
userSchema.methods.incLoginAttempts = async function() {
    // If lock has expired, reset attempts
    if (this.lockUntil && this.lockUntil < Date.now()) {
        return this.updateOne({
            $set: { loginAttempts: 1 },
            $unset: { lockUntil: 1 }
        });
    }
    
    // Otherwise increment attempts
    const updates = { $inc: { loginAttempts: 1 } };
    
    // Lock account after 5 failed attempts for 2 hours
    const maxAttempts = 5;
    const lockTime = 2 * 60 * 60 * 1000; // 2 hours
    
    if (this.loginAttempts + 1 >= maxAttempts) {
        updates.$set = { lockUntil: Date.now() + lockTime };
    }
    
    return this.updateOne(updates);
};

// -------- RESET LOGIN ATTEMPTS --------
userSchema.methods.resetLoginAttempts = async function() {
    return this.updateOne({
        $set: { loginAttempts: 0, lastLogin: Date.now() },
        $unset: { lockUntil: 1 }
    });
};

// ============================================
// STATIC METHODS - CALL ON USER MODEL
// ============================================

// -------- FIND USERS WITH OVERDUE BOOKS --------
userSchema.statics.findUsersWithOverdueBooks = function() {
    const now = new Date();
    return this.find({
        'currentBorrowedBooks.dueDate': { $lt: now }
    });
};

// -------- GET STATISTICS --------
userSchema.statics.getStats = async function() {
    const stats = await this.aggregate([
        {
            $group: {
                _id: null,
                totalUsers: { $sum: 1 },
                activeUsers: {
                    $sum: { $cond: ['$isActive', 1, 0] }
                },
                totalBorrowedBooks: {
                    $sum: { $size: '$currentBorrowedBooks' }
                }
            }
        }
    ]);
    
    return stats[0] || {};
};

// -------- INDEXES --------
// Note: email and membershipNumber already have indexes from unique: true
// We only need to add composite/compound indexes here
userSchema.index({ role: 1, isActive: 1 }); // Compound index for filtering users

// -------- CREATE AND EXPORT MODEL --------
const User = mongoose.model('User', userSchema);

module.exports = User;

// ============================================
// DEEP DIVE - PASSWORD SECURITY:
// ============================================
//
// WHY HASH PASSWORDS?
// - Storing plain text passwords is DANGEROUS
// - If database is hacked, all passwords exposed
// - Hashing is one-way encryption (can't reverse)
//
// BCRYPT:
// - Industry standard for password hashing
// - Uses "salt" - random data added to password
// - Each password has unique hash even if same text
//
// EXAMPLE:
// Password: "mypassword123"
// Salt: "$2a$10$abcdefghijklmnopqrstuv"
// Hash: "$2a$10$abcd...xyz" (60 characters)
//
// Same password, different salt = different hash
// This prevents rainbow table attacks
//
// ============================================
// DEEP DIVE - JWT (JSON WEB TOKENS):
// ============================================
//
// WHAT IS JWT?
// - Secure way to transmit information between parties
// - Self-contained (contains all user info)
// - Digitally signed (can verify authenticity)
//
// STRUCTURE:
// Header.Payload.Signature
//
// Example token:
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
// eyJpZCI6IjEyMzQ1IiwiaWF0IjoxNTE2MjM5MDIyfQ.
// SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
//
// WORKFLOW:
// 1. User logs in with email/password
// 2. Server verifies credentials
// 3. Server creates JWT with user ID
// 4. Frontend stores token (localStorage/cookie)
// 5. Frontend sends token with every request
// 6. Backend verifies token and allows access
//
// SECURITY:
// - Token signed with JWT_SECRET
// - If someone modifies token, signature breaks
// - Server rejects invalid signatures
// - Tokens expire (JWT_EXPIRE)
//
// ============================================
// DEEP DIVE - ACCOUNT SECURITY:
// ============================================
//
// FAILED LOGIN ATTEMPTS:
// - Track number of failed logins
// - Lock account after 5 failures
// - Prevents brute force attacks
// - Auto-unlock after 2 hours
//
// PASSWORD REQUIREMENTS:
// - Minimum 6 characters (should be 8+ in production)
// - Use regex for complexity rules
// - Example: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/
//   (at least 1 lowercase, 1 uppercase, 1 number)
//
// BEST PRACTICES:
// - Never log passwords
// - Use HTTPS in production
// - Set secure cookie flags
// - Implement password reset
// - Add 2FA (Two-Factor Authentication)
// - Rate limit login endpoints
// ============================================
