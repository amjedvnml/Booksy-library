// ============================================
// DATABASE CONNECTION FILE
// ============================================
// This file handles connecting to MongoDB database
// Think of it as opening the door to your library's storage room

const mongoose = require('mongoose');

// Connection state tracking for serverless
let isConnected = false;

// Function to connect to MongoDB
const connectDB = async () => {
    // Reuse existing connection in serverless environment
    if (isConnected && mongoose.connection.readyState === 1) {
        console.log('♻️ Using existing MongoDB connection');
        return;
    }

    try {
        // mongoose.connect() opens a connection to MongoDB
        // process.env.MONGODB_URI comes from .env file (keeps secrets safe)
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            // Optimize for serverless
            serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
            socketTimeoutMS: 45000,
        });

        isConnected = true;
        // If successful, log the host name
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
        console.log(`📚 Database Name: ${conn.connection.name}`);
        
    } catch (error) {
        // If connection fails, log error but don't crash serverless function
        console.error(`❌ MongoDB Connection Error: ${error.message}`);
        isConnected = false;
        // Don't use process.exit() in serverless - just throw the error
        throw new Error(`Database connection failed: ${error.message}`);
    }
};

// Export so we can use it in server.js
module.exports = connectDB;

// ============================================
// DEEP EXPLANATION:
// ============================================
// 
// 1. mongoose.connect() - Opens connection to MongoDB
//    - Like opening a phone line to the database
//    - Stays open as long as server runs
//
// 2. async/await - Handles asynchronous operations
//    - Connecting to database takes time (network call)
//    - "await" waits for connection before continuing
//    - "async" marks function as asynchronous
//
// 3. try/catch - Error handling
//    - try: Attempt to connect
//    - catch: If fails, handle the error gracefully
//
// 4. process.env - Environment variables
//    - Stores sensitive data (passwords, API keys)
//    - Different values for development/production
//    - NEVER commit .env to GitHub!
//
// 5. process.exit(1) - Shut down app
//    - If database connection fails, app can't work
//    - Exit code 1 = error (0 = success)
// ============================================
