// Test script to verify book creation works
require('dotenv').config();
const mongoose = require('mongoose');
const Book = require('./models/Book');

async function testBookCreation() {
    try {
        console.log('🔌 Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Count existing books
        const beforeCount = await Book.countDocuments();
        console.log(`\n📊 Books in database BEFORE: ${beforeCount}`);

        // Create a test book
        console.log('\n📝 Creating test book...');
        const testBook = await Book.create({
            title: 'Test Book ' + Date.now(),
            author: 'Test Author',
            category: 'Fiction',
            totalCopies: 3
        });

        console.log('✅ Book created:', {
            id: testBook._id,
            title: testBook.title,
            author: testBook.author,
            totalCopies: testBook.totalCopies,
            availableCopies: testBook.availableCopies
        });

        // Verify it's in database
        const foundBook = await Book.findById(testBook._id);
        if (foundBook) {
            console.log('✅ VERIFIED: Book found in database');
        } else {
            console.error('❌ ERROR: Book not found in database!');
        }

        // Count books after
        const afterCount = await Book.countDocuments();
        console.log(`\n📊 Books in database AFTER: ${afterCount}`);
        console.log(`📈 Difference: +${afterCount - beforeCount}`);

        // List all books
        console.log('\n📚 All books in database:');
        const allBooks = await Book.find().select('title author createdAt').sort('-createdAt').limit(10);
        allBooks.forEach((book, i) => {
            console.log(`${i + 1}. ${book.title} by ${book.author} (${book.createdAt})`);
        });

        console.log('\n✅ Test completed successfully!');
        process.exit(0);

    } catch (error) {
        console.error('❌ Test failed:', error);
        process.exit(1);
    }
}

testBookCreation();
