// Fix ISBN index to allow multiple books without ISBN
require('dotenv').config();
const mongoose = require('mongoose');
const Book = require('./models/Book');

async function fixISBNIndex() {
    try {
        console.log('🔌 Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        console.log('\n📋 Current indexes:');
        const indexes = await Book.collection.getIndexes();
        console.log(indexes);

        console.log('\n🗑️ Dropping old isbn_1 index...');
        try {
            await Book.collection.dropIndex('isbn_1');
            console.log('✅ Old index dropped');
        } catch (error) {
            console.log('⚠️ Index might not exist:', error.message);
        }

        console.log('\n🆕 Creating new sparse unique index for ISBN...');
        await Book.collection.createIndex(
            { isbn: 1 }, 
            { 
                unique: true, 
                sparse: true,  // This allows multiple null values!
                background: true 
            }
        );
        console.log('✅ New sparse index created');

        console.log('\n📋 New indexes:');
        const newIndexes = await Book.collection.getIndexes();
        console.log(newIndexes);

        console.log('\n✅ Index fix completed! Books without ISBN can now be created.');
        process.exit(0);

    } catch (error) {
        console.error('❌ Fix failed:', error);
        process.exit(1);
    }
}

fixISBNIndex();
