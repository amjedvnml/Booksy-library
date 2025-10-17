const multer = require('multer');
const path = require('path');

// Configure storage
const storage = multer.memoryStorage(); // Store files in memory for Vercel

// File filter - only allow PDFs
const fileFilter = (req, file, cb) => {
    console.log('📁 File upload detected:', {
        fieldname: file.fieldname,
        originalname: file.originalname,
        mimetype: file.mimetype,
        size: file.size
    });

    if (file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        cb(new Error('Only PDF files are allowed!'), false);
    }
};

// Create multer instance
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    }
});

module.exports = upload;
