// ============================================
// AUTHENTICATION MIDDLEWARE - PROTECTS ROUTES
// ============================================
// Verifies JWT tokens and checks user permissions

const jwt = require('jsonwebtoken');
const User = require('../models/User');

// ============================================
// @desc    Protect routes - Verify JWT token
// ============================================
exports.protect = async (req, res, next) => {
    try {
        let token;
        
        console.log('🔐 PROTECT MIDDLEWARE - Start');
        console.log('- Authorization header:', req.headers.authorization ? 'Present' : 'Missing');
        
        // -------- EXTRACT TOKEN FROM HEADER --------
        // Check if Authorization header exists and starts with 'Bearer'
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer')
        ) {
            // Extract token from "Bearer TOKEN"
            token = req.headers.authorization.split(' ')[1];
            console.log('- Token extracted:', token ? 'Yes (length: ' + token.length + ')' : 'No');
        }
        // Alternative: Get token from cookie (if using cookies)
        // else if (req.cookies.token) {
        //     token = req.cookies.token;
        // }
        
        // -------- CHECK IF TOKEN EXISTS --------
        if (!token) {
            console.log('❌ PROTECT MIDDLEWARE - No token found');
            return res.status(401).json({
                success: false,
                message: 'Not authorized to access this route. Please login.'
            });
        }
        
        console.log('- JWT_SECRET exists?', !!process.env.JWT_SECRET);
        
        // -------- VERIFY TOKEN --------
        try {
            // jwt.verify() decodes token and verifies signature
            // Returns payload if valid, throws error if invalid
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            console.log('- Token verified. Decoded:', decoded);
            
            // -------- GET USER FROM TOKEN --------
            // decoded = { id: '507f1f77bcf86cd799439011', iat: 1516239022 }
            req.user = await User.findById(decoded.id).select('-password');
            
            console.log('- User found in DB?', !!req.user);
            console.log('- User ID:', req.user ? req.user._id : 'N/A');
            console.log('- User role:', req.user ? req.user.role : 'N/A');
            
            // Check if user still exists
            if (!req.user) {
                console.log('❌ PROTECT MIDDLEWARE - User not found in database');
                return res.status(401).json({
                    success: false,
                    message: 'User no longer exists'
                });
            }
            
            // Check if user is active
            if (!req.user.isActive) {
                console.log('❌ PROTECT MIDDLEWARE - User account inactive');
                return res.status(403).json({
                    success: false,
                    message: 'Your account has been deactivated'
                });
            }
            
            console.log('✅ PROTECT MIDDLEWARE - Success! Calling next()');
            
            // -------- PASS CONTROL TO NEXT MIDDLEWARE --------
            next();
            
        } catch (error) {
            // Token is invalid or expired
            if (error.name === 'JsonWebTokenError') {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid token'
                });
            }
            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({
                    success: false,
                    message: 'Token expired. Please login again.'
                });
            }
            throw error;
        }
        
    } catch (error) {
        console.error('Auth Middleware Error:', error);
        res.status(500).json({
            success: false,
            message: 'Authentication failed'
        });
    }
};

// ============================================
// @desc    Authorize specific roles
// @usage   authorize('admin', 'librarian')
// ============================================
exports.authorize = (...roles) => {
    // This returns a middleware function
    return (req, res, next) => {
        // Check if user's role is in allowed roles
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `User role '${req.user.role}' is not authorized to access this route`
            });
        }
        next();
    };
};

// ============================================
// @desc    Optional auth - Don't require login
// @usage   Get user if logged in, but allow without
// ============================================
exports.optionalAuth = async (req, res, next) => {
    try {
        let token;
        
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer')
        ) {
            token = req.headers.authorization.split(' ')[1];
        }
        
        if (token) {
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                req.user = await User.findById(decoded.id).select('-password');
            } catch (error) {
                // Invalid token, but we don't block the request
                req.user = null;
            }
        }
        
        next();
        
    } catch (error) {
        next(error);
    }
};

// ============================================
// DEEP DIVE - MIDDLEWARE EXPLAINED:
// ============================================
//
// WHAT IS MIDDLEWARE?
// - Function that executes BETWEEN request and response
// - Has access to req, res, and next()
// - Can modify req/res objects
// - Can end request-response cycle
// - Can call next middleware
//
// MIDDLEWARE CHAIN:
// Request
//   ↓
// cors()
//   ↓
// express.json()
//   ↓
// logger()
//   ↓
// protect() ← We are here
//   ↓
// authorize()
//   ↓
// Route Handler
//   ↓
// Response
//
// MIDDLEWARE FUNCTION SIGNATURE:
// (req, res, next) => { ... }
//
// req - Request object (data from client)
// res - Response object (send data back)
// next - Function to call next middleware
//
// CALLING next():
// next() - Continue to next middleware
// next(error) - Skip to error handler
// Don't call next() - Stop the chain (must send response!)
//
// ============================================
// DEEP DIVE - JWT TOKEN VERIFICATION:
// ============================================
//
// TOKEN STRUCTURE:
// Header.Payload.Signature
//
// HEADER:
// {
//   "alg": "HS256",
//   "typ": "JWT"
// }
//
// PAYLOAD:
// {
//   "id": "507f1f77bcf86cd799439011",
//   "iat": 1516239022,  // Issued at
//   "exp": 1516325422   // Expires at
// }
//
// SIGNATURE:
// HMACSHA256(
//   base64UrlEncode(header) + "." +
//   base64UrlEncode(payload),
//   secret
// )
//
// VERIFICATION PROCESS:
// 1. Split token into 3 parts
// 2. Decode header and payload (base64)
// 3. Recreate signature using secret
// 4. Compare signatures
// 5. If match → valid
// 6. Check expiration time
// 7. Extract user ID from payload
//
// WHY JWT IS SECURE:
// - Signature prevents tampering
// - If someone modifies payload, signature breaks
// - Only server knows the secret key
// - Can't fake a valid signature without secret
//
// ============================================
// DEEP DIVE - AUTHORIZATION PATTERNS:
// ============================================
//
// ROLE-BASED ACCESS CONTROL (RBAC):
// - User has one role: user, librarian, admin
// - Each role has specific permissions
// - Example: Only admin can delete users
//
// PERMISSION-BASED:
// - User has specific permissions
// - More granular control
// - Example: user.permissions = ['read:books', 'write:books']
//
// RESOURCE-BASED:
// - Check ownership of resource
// - Example: Only owner can edit their comment
//
// COMBINING METHODS:
// app.delete('/books/:id',
//   protect,                        // Must be logged in
//   authorize('admin', 'librarian'), // Must have role
//   checkOwnership,                  // Must own resource
//   deleteBook
// );
//
// ============================================
// DEEP DIVE - COMMON AUTH PATTERNS:
// ============================================
//
// 1. HEADER-BASED (Most Common):
// Authorization: Bearer eyJhbGc...
//
// 2. COOKIE-BASED:
// Set-Cookie: token=eyJhbGc...; HttpOnly; Secure
//
// 3. QUERY PARAMETER (Not Recommended):
// /api/books?token=eyJhbGc...
// Problem: Tokens logged in server logs
//
// 4. CUSTOM HEADER:
// X-Auth-Token: eyJhbGc...
//
// BEST PRACTICE:
// - Use Authorization header with Bearer scheme
// - HTTPS only in production
// - Short-lived tokens
// - Refresh token mechanism
//
// ============================================
// DEEP DIVE - TOKEN REFRESH STRATEGY:
// ============================================
//
// PROBLEM:
// - Long-lived tokens = security risk
// - Short-lived tokens = frequent login
//
// SOLUTION: Two-Token System
//
// ACCESS TOKEN:
// - Short-lived (15 minutes)
// - Used for API requests
// - Stored in memory/localStorage
//
// REFRESH TOKEN:
// - Long-lived (7 days)
// - Used to get new access token
// - Stored in httpOnly cookie
// - Can be revoked
//
// FLOW:
// 1. User logs in
// 2. Server sends access + refresh tokens
// 3. Client uses access token
// 4. Access token expires (15 min)
// 5. Client sends refresh token
// 6. Server validates refresh token
// 7. Server sends new access token
// 8. Repeat until refresh token expires
//
// LOGOUT:
// - Delete access token from client
// - Blacklist/delete refresh token on server
//
// ============================================
// DEEP DIVE - SECURITY BEST PRACTICES:
// ============================================
//
// 1. NEVER TRUST CLIENT INPUT
// - Always validate on server
// - Sanitize data
// - Use schema validation
//
// 2. USE ENVIRONMENT VARIABLES
// - Never hardcode secrets
// - Different secrets for dev/prod
// - Rotate secrets regularly
//
// 3. IMPLEMENT RATE LIMITING
// - Prevent brute force attacks
// - Limit requests per IP/user
// - Example: 100 requests/hour
//
// 4. LOG SECURITY EVENTS
// - Failed login attempts
// - Suspicious activity
// - Admin actions
//
// 5. USE HTTPS IN PRODUCTION
// - Encrypt all traffic
// - Prevents man-in-the-middle attacks
// - Required for secure cookies
//
// 6. IMPLEMENT ACCOUNT LOCKOUT
// - Lock after X failed attempts
// - Temporary or permanent
// - Notify user via email
//
// 7. VALIDATE TOKEN ON EVERY REQUEST
// - Don't cache authentication
// - Check if user still exists
// - Check if account is active
//
// 8. USE STRONG JWT_SECRET
// - At least 32 characters
// - Random, complex string
// - Never commit to Git
// - Example: openssl rand -base64 32
// ============================================
