// Force MongoDB to sync indexes with model definition
require('dotenv').config();
const mongoose = require('mongoose');

async function syncIndexes() {
    try {
        console.log('🔌 Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        const Book = mongoose.model('Book', require('./models/Book').schema);
        
        console.log('\n🔄 Syncing indexes...');
        await Book.syncIndexes();
        console.log('✅ Indexes synced');

        console.log('\n📋 Current indexes after sync:');
        const indexes = await Book.collection.getIndexes();
        Object.entries(indexes).forEach(([name, index]) => {
            console.log(`- ${name}:`, index);
        });

        console.log('\n✅ Sync completed!');
        process.exit(0);

    } catch (error) {
        console.error('❌ Sync failed:', error);
        process.exit(1);
    }
}

syncIndexes();
