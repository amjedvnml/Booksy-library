// ============================================
// AUTH CONTROLLER - HANDLES AUTHENTICATION
// ============================================
// Registration, Login, Password Management

const User = require('../models/User');

// ============================================
// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
// ============================================
exports.register = async (req, res, next) => {
    try {
        const { name, email, password, phone, address } = req.body;
        
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Email already registered'
            });
        }
        
        // Create user
        const user = await User.create({
            name,
            email,
            password,    // Will be auto-hashed by pre-save middleware
            phone,
            address
        });
        
        // Generate JWT token
        const token = user.getSignedJwtToken();
        
        res.status(201).json({
            success: true,
            message: 'Registration successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                membershipNumber: user.membershipNumber
            }
        });
        
    } catch (error) {
        // Handle validation errors
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: 'Validation Error',
                errors: messages
            });
        }
        next(error);
    }
};

// ============================================
// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
// ============================================
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        
        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and password'
            });
        }
        
        // Find user by email (include password field)
        const user = await User.findOne({ email }).select('+password');
        
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }
        
        // Check if account is locked
        if (user.lockUntil && user.lockUntil > Date.now()) {
            const minutesLeft = Math.ceil((user.lockUntil - Date.now()) / 60000);
            return res.status(423).json({
                success: false,
                message: `Account locked. Try again in ${minutesLeft} minutes`
            });
        }
        
        // Check password
        const isMatch = await user.matchPassword(password);
        
        if (!isMatch) {
            // Increment failed login attempts
            await user.incLoginAttempts();
            
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }
        
        // Reset login attempts on successful login
        await user.resetLoginAttempts();
        
        // Generate JWT token
        const token = user.getSignedJwtToken();
        
        res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                membershipNumber: user.membershipNumber,
                avatar: user.avatar
            }
        });
        
    } catch (error) {
        next(error);
    }
};

// ============================================
// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
// ============================================
exports.getMe = async (req, res, next) => {
    try {
        // req.user is set by auth middleware
        const user = await User.findById(req.user.id)
            .populate({
                path: 'currentBorrowedBooks.book',
                select: 'title author coverImage'
            });
        
        res.status(200).json({
            success: true,
            data: user
        });
        
    } catch (error) {
        next(error);
    }
};

// ============================================
// @desc    Update user profile (including avatar)
// @route   PUT /api/auth/profile
// @access  Private
// ============================================
exports.updateProfile = async (req, res, next) => {
    try {
        // Fields allowed to be updated
        const fieldsToUpdate = {};
        
        // Only update fields that are provided
        if (req.body.name) fieldsToUpdate.name = req.body.name;
        if (req.body.phone) fieldsToUpdate.phone = req.body.phone;
        if (req.body.address) fieldsToUpdate.address = req.body.address;
        if (req.body.avatar) fieldsToUpdate.avatar = req.body.avatar;
        
        const user = await User.findByIdAndUpdate(
            req.user.id,
            fieldsToUpdate,
            {
                new: true,
                runValidators: true
            }
        ).select('-password');
        
        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            data: user
        });
        
    } catch (error) {
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: 'Validation Error',
                errors: messages
            });
        }
        next(error);
    }
};

// ============================================
// @desc    Update password
// @route   PUT /api/auth/updatepassword
// @access  Private
// ============================================
exports.updatePassword = async (req, res, next) => {
    try {
        const { currentPassword, newPassword } = req.body;
        
        // Validate input
        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Please provide current and new password'
            });
        }
        
        // Get user with password
        const user = await User.findById(req.user.id).select('+password');
        
        // Check current password
        const isMatch = await user.matchPassword(currentPassword);
        
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Current password is incorrect'
            });
        }
        
        // Update password (will be hashed by pre-save middleware)
        user.password = newPassword;
        await user.save();
        
        // Generate new token
        const token = user.getSignedJwtToken();
        
        res.status(200).json({
            success: true,
            message: 'Password updated successfully',
            token
        });
        
    } catch (error) {
        next(error);
    }
};

// ============================================
// @desc    Logout user
// @route   GET /api/auth/logout
// @access  Private
// ============================================
exports.logout = async (req, res, next) => {
    try {
        // In a real app with token blacklist:
        // - Add current token to blacklist
        // - Or use refresh tokens
        
        res.status(200).json({
            success: true,
            message: 'Logged out successfully',
            data: {}
        });
        
    } catch (error) {
        next(error);
    }
};

// ============================================
// @desc    Get user's borrowed books
// @route   GET /api/auth/borrowed
// @access  Private
// ============================================
exports.getBorrowedBooks = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id)
            .populate({
                path: 'currentBorrowedBooks.book',
                select: 'title author isbn coverImage'
            });
        
        // Calculate days remaining for each book
        const borrowedBooks = user.currentBorrowedBooks.map(item => {
            const daysRemaining = Math.ceil(
                (item.dueDate - Date.now()) / (1000 * 60 * 60 * 24)
            );
            
            return {
                book: item.book,
                borrowDate: item.borrowDate,
                dueDate: item.dueDate,
                daysRemaining,
                isOverdue: daysRemaining < 0
            };
        });
        
        res.status(200).json({
            success: true,
            count: borrowedBooks.length,
            data: borrowedBooks
        });
        
    } catch (error) {
        next(error);
    }
};

// ============================================
// @desc    Get user's borrow history
// @route   GET /api/auth/history
// @access  Private
// ============================================
exports.getBorrowHistory = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id)
            .populate({
                path: 'borrowHistory.book',
                select: 'title author isbn coverImage'
            });
        
        res.status(200).json({
            success: true,
            count: user.borrowHistory.length,
            data: user.borrowHistory
        });
        
    } catch (error) {
        next(error);
    }
};

// ============================================
// DEEP DIVE - AUTHENTICATION VS AUTHORIZATION:
// ============================================
//
// AUTHENTICATION:
// - WHO are you?
// - Verifying identity (email + password)
// - Login, registration, JWT tokens
//
// AUTHORIZATION:
// - WHAT can you do?
// - Checking permissions/roles
// - Admin can delete, User can only read
//
// FLOW:
// 1. User logs in (Authentication)
// 2. Server issues JWT token
// 3. User requests to delete book
// 4. Server checks token (Authentication)
// 5. Server checks role (Authorization)
// 6. Allow or deny
//
// ============================================
// DEEP DIVE - JWT WORKFLOW:
// ============================================
//
// REGISTRATION/LOGIN:
// 1. User sends email + password
// 2. Server verifies credentials
// 3. Server creates JWT:
//    - Header: Algorithm (HS256)
//    - Payload: { id: user._id, iat: timestamp }
//    - Signature: HMAC(header + payload, secret)
// 4. Server sends token to client
//
// SUBSEQUENT REQUESTS:
// 1. Client stores token (localStorage/cookie)
// 2. Client sends token in header:
//    Authorization: Bearer eyJhbGc...
// 3. Server verifies token:
//    - Check signature validity
//    - Check expiration
//    - Extract user ID
// 4. Server fetches user from database
// 5. Server processes request
//
// TOKEN STORAGE:
// - localStorage: Easy, but vulnerable to XSS
// - httpOnly cookie: Secure, but need CORS setup
// - sessionStorage: Cleared on tab close
//
// BEST PRACTICE:
// - Short-lived access tokens (15 min)
// - Long-lived refresh tokens (7 days)
// - Refresh token rotation
// - Token blacklist for logout
//
// ============================================
// DEEP DIVE - PASSWORD SECURITY:
// ============================================
//
// NEVER DO THIS:
// ❌ Store passwords in plain text
// ❌ Use reversible encryption
// ❌ Log passwords
// ❌ Send passwords in URL
// ❌ Use weak hashing (MD5, SHA1)
//
// ALWAYS DO THIS:
// ✅ Hash with bcrypt (or argon2)
// ✅ Use salt (unique per password)
// ✅ Enforce minimum length (8+)
// ✅ Use HTTPS
// ✅ Implement rate limiting
// ✅ Add account lockout
// ✅ Use 2FA (Two-Factor Auth)
//
// BCRYPT ROUNDS:
// - Cost factor: 10 = 2^10 = 1024 iterations
// - Higher = more secure, but slower
// - 10-12 rounds recommended
// - As computers get faster, increase rounds
//
// ============================================
// DEEP DIVE - COMMON SECURITY ATTACKS:
// ============================================
//
// 1. BRUTE FORCE:
// - Try many passwords rapidly
// - Defense: Rate limiting, account lockout
//
// 2. CREDENTIAL STUFFING:
// - Use leaked passwords from other sites
// - Defense: Unique salts, breach detection
//
// 3. SQL INJECTION:
// - Inject malicious SQL code
// - Defense: Mongoose escapes queries automatically
//
// 4. XSS (Cross-Site Scripting):
// - Inject malicious JavaScript
// - Defense: Sanitize input, escape output
//
// 5. CSRF (Cross-Site Request Forgery):
// - Trick user into unwanted actions
// - Defense: CSRF tokens, SameSite cookies
//
// 6. MAN-IN-THE-MIDDLE:
// - Intercept network traffic
// - Defense: HTTPS, certificate pinning
//
// ============================================
// DEEP DIVE - HTTP SECURITY HEADERS:
// ============================================
//
// X-Content-Type-Options: nosniff
// - Prevents MIME type sniffing
//
// X-Frame-Options: DENY
// - Prevents clickjacking
//
// X-XSS-Protection: 1; mode=block
// - Enables XSS filter
//
// Strict-Transport-Security: max-age=31536000
// - Enforces HTTPS
//
// Content-Security-Policy
// - Controls resource loading
//
// Use helmet.js middleware to set these!
// ============================================
