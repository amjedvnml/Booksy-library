// Export the Express app for Vercel Serverless Functions
// This imports the fully configured Express app from server.js
// which already includes all routes:
// - /api/auth (authentication routes)
// - /api/books (book management routes)
// - /api/users (user management routes)

const app = require('../server');

module.exports = app;
