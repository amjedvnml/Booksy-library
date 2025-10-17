// ============================================
// AUTH ROUTES - AUTHENTICATION & USER ROUTES
// ============================================

const express = require('express');
const router = express.Router();

// Import controller functions
const {
    register,
    login,
    getMe,
    updateProfile,
    updatePassword,
    logout,
    getBorrowedBooks,
    getBorrowHistory
} = require('../controllers/authController');

// Import middleware
const { protect } = require('../middleware/auth');

// ============================================
// PUBLIC ROUTES - No authentication required
// ============================================

// @route   POST /api/auth/register
// @desc    Register new user
// @access  Public
router.post('/register', register);

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', login);

// ============================================
// PROTECTED ROUTES - Require authentication
// ============================================

// @route   GET /api/auth/me
// @desc    Get current logged in user profile
// @access  Private
router.get('/me', protect, getMe);

// @route   PUT /api/auth/profile
// @desc    Update user profile (name, phone, address, avatar)
// @access  Private
router.put('/profile', protect, updateProfile);

// @route   PUT /api/auth/updateprofile (deprecated - use /profile instead)
// @desc    Update user profile (name, phone, address)
// @access  Private
router.put('/updateprofile', protect, updateProfile);

// @route   PUT /api/auth/updatepassword
// @desc    Change password
// @access  Private
router.put('/updatepassword', protect, updatePassword);

// @route   GET /api/auth/logout
// @desc    Logout user (clear token)
// @access  Private
router.get('/logout', protect, logout);

// @route   GET /api/auth/borrowed
// @desc    Get user's currently borrowed books
// @access  Private
router.get('/borrowed', protect, getBorrowedBooks);

// @route   GET /api/auth/history
// @desc    Get user's borrow history
// @access  Private
router.get('/history', protect, getBorrowHistory);

module.exports = router;

// ============================================
// DEEP DIVE - AUTHENTICATION ROUTES:
// ============================================
//
// REGISTRATION FLOW:
// 1. Client sends: POST /api/auth/register
//    Body: { name, email, password }
// 2. Server validates data
// 3. Server hashes password (bcrypt)
// 4. Server creates user in database
// 5. Server generates JWT token
// 6. Server sends token + user data
// 7. Client stores token
//
// LOGIN FLOW:
// 1. Client sends: POST /api/auth/login
//    Body: { email, password }
// 2. Server finds user by email
// 3. Server compares passwords (bcrypt.compare)
// 4. If match, generate JWT token
// 5. Server sends token + user data
// 6. Client stores token
//
// PROTECTED ROUTE FLOW:
// 1. Client sends: GET /api/auth/me
//    Header: Authorization: Bearer <token>
// 2. protect middleware extracts token
// 3. Middleware verifies token signature
// 4. Middleware decodes user ID
// 5. Middleware fetches user from database
// 6. Middleware adds user to req.user
// 7. Controller accesses req.user
// 8. Controller sends user data
//
// ============================================
// DEEP DIVE - TOKEN STORAGE (CLIENT SIDE):
// ============================================
//
// OPTION 1: localStorage
// Pros:
// - Easy to implement
// - Persists across sessions
// - Accessible from any window
//
// Cons:
// - Vulnerable to XSS attacks
// - JavaScript can access it
//
// Code:
// localStorage.setItem('token', response.data.token);
// const token = localStorage.getItem('token');
//
// OPTION 2: sessionStorage
// Pros:
// - Cleared when tab closes
// - More secure than localStorage
//
// Cons:
// - Still vulnerable to XSS
// - Lost on tab close
//
// OPTION 3: HttpOnly Cookie
// Pros:
// - Not accessible via JavaScript
// - Immune to XSS
// - Automatic with requests
//
// Cons:
// - Need CORS configuration
// - Vulnerable to CSRF
// - Need CSRF tokens
//
// Code (Backend):
// res.cookie('token', token, {
//     httpOnly: true,
//     secure: true,
//     sameSite: 'strict',
//     maxAge: 7 * 24 * 60 * 60 * 1000
// });
//
// OPTION 4: Memory (React State)
// Pros:
// - Most secure
// - Cleared on refresh
//
// Cons:
// - Lost on page refresh
// - Need refresh token
//
// BEST PRACTICE:
// - HttpOnly cookie for refresh token
// - Memory/state for access token
// - Refresh access token automatically
//
// ============================================
// DEEP DIVE - LOGOUT IMPLEMENTATION:
// ============================================
//
// CLIENT-SIDE ONLY (Simple):
// - Delete token from storage
// - Redirect to login
// - Problem: Token still valid until expiration
//
// Code:
// localStorage.removeItem('token');
// window.location.href = '/login';
//
// SERVER-SIDE (Secure):
// - Add token to blacklist
// - Check blacklist on every request
// - Problem: Need storage (Redis)
//
// WITH REFRESH TOKENS:
// - Delete refresh token from database
// - Clear client storage
// - Access token expires soon anyway
//
// FULL IMPLEMENTATION:
// 1. Client calls /api/auth/logout
// 2. Server blacklists refresh token
// 3. Server clears httpOnly cookie
// 4. Client deletes access token
// 5. Client redirects to login
//
// ============================================
// DEEP DIVE - PASSWORD CHANGE FLOW:
// ============================================
//
// 1. User enters current + new password
// 2. Client sends: PUT /api/auth/updatepassword
//    Header: Authorization: Bearer <token>
//    Body: { currentPassword, newPassword }
// 3. Server verifies current password
// 4. Server validates new password
// 5. Server hashes new password
// 6. Server updates user record
// 7. Server generates NEW token
// 8. Server sends new token
// 9. Client replaces old token
//
// WHY NEW TOKEN?
// - Old token has old password hash reference
// - Security best practice
// - Invalidates all other sessions
//
// ============================================
// DEEP DIVE - PROFILE UPDATE:
// ============================================
//
// ALLOWED FIELDS:
// - Name, phone, address
// - Profile picture
// - Preferences
//
// NEVER ALLOW DIRECT UPDATE:
// - Password (use separate endpoint)
// - Email (requires verification)
// - Role (admin only)
// - Membership number
// - Account status
//
// IMPLEMENTATION:
// const fieldsToUpdate = {
//     name: req.body.name,
//     phone: req.body.phone,
//     address: req.body.address
// };
//
// // Remove undefined fields
// Object.keys(fieldsToUpdate).forEach(key =>
//     fieldsToUpdate[key] === undefined && delete fieldsToUpdate[key]
// );
//
// await User.findByIdAndUpdate(req.user.id, fieldsToUpdate);
//
// ============================================
// DEEP DIVE - EMAIL VERIFICATION:
// ============================================
//
// FLOW:
// 1. User registers
// 2. Server creates user (isVerified: false)
// 3. Server generates verification token
// 4. Server sends email with link
// 5. User clicks link: /api/auth/verify/:token
// 6. Server verifies token
// 7. Server sets isVerified: true
// 8. User can now login
//
// CODE:
// // Generate token
// const verificationToken = crypto
//     .randomBytes(20)
//     .toString('hex');
//
// user.verificationToken = crypto
//     .createHash('sha256')
//     .update(verificationToken)
//     .digest('hex');
//
// user.verificationExpire = Date.now() + 24 * 60 * 60 * 1000;
//
// // Send email
// const verifyUrl = `${req.protocol}://${req.get('host')}/api/auth/verify/${verificationToken}`;
//
// ============================================
// DEEP DIVE - PASSWORD RESET:
// ============================================
//
// FLOW:
// 1. User clicks "Forgot Password"
// 2. User enters email
// 3. POST /api/auth/forgotpassword
// 4. Server generates reset token
// 5. Server sends email with link
// 6. User clicks link with token
// 7. User enters new password
// 8. PUT /api/auth/resetpassword/:token
// 9. Server verifies token
// 10. Server updates password
// 11. Server sends new JWT token
//
// SECURITY:
// - Token expires in 10 minutes
// - One-time use only
// - Hashed in database
// - Sent via email only
// - No password hints
//
// ============================================
// DEEP DIVE - ACCOUNT SECURITY FEATURES:
// ============================================
//
// 1. EMAIL VERIFICATION
// - Confirm email ownership
// - Prevent fake accounts
//
// 2. TWO-FACTOR AUTHENTICATION (2FA)
// - SMS code
// - Authenticator app (TOTP)
// - Backup codes
//
// 3. LOGIN HISTORY
// - Track login times
// - IP addresses
// - Device info
// - Alert on suspicious activity
//
// 4. SESSION MANAGEMENT
// - List active sessions
// - Logout from all devices
// - Logout specific device
//
// 5. SECURITY QUESTIONS
// - Additional verification
// - Password reset backup
//
// 6. CAPTCHA
// - Prevent bots
// - On login/registration
// - After failed attempts
//
// 7. RATE LIMITING
// - Max 5 login attempts per hour
// - Max 3 password reset requests per day
// - Per IP or per email
//
// 8. ACCOUNT LOCKOUT
// - Lock after X failed attempts
// - Temporary (2 hours) or permanent
// - Email notification
// - Admin unlock required
// ============================================
