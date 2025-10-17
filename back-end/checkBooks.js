// Check what books exist and their ISBN values
require('dotenv').config();
const mongoose = require('mongoose');
const Book = require('./models/Book');

async function checkBooks() {
    try {
        console.log('🔌 Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        console.log('\n📚 All books in database:');
        const books = await Book.find().select('title author isbn createdAt');
        
        if (books.length === 0) {
            console.log('No books found');
        } else {
            books.forEach((book, i) => {
                console.log(`\n${i + 1}.`);
                console.log('   ID:', book._id);
                console.log('   Title:', book.title);
                console.log('   Author:', book.author);
                console.log('   ISBN:', book.isbn === null ? 'null' : book.isbn === undefined ? 'undefined' : `"${book.isbn}"`);
                console.log('   Created:', book.createdAt);
            });
        }

        console.log(`\n📊 Total: ${books.length} books`);

        console.log('\n✅ Check completed!');
        process.exit(0);

    } catch (error) {
        console.error('❌ Check failed:', error);
        process.exit(1);
    }
}

checkBooks();
