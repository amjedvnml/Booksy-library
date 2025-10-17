// Check detailed index information
require('dotenv').config();
const mongoose = require('mongoose');

async function checkIndexDetails() {
    try {
        console.log('🔌 Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        const db = mongoose.connection.db;
        const collection = db.collection('books');

        console.log('\n📋 Detailed index information:');
        const indexes = await collection.indexes();
        
        indexes.forEach(index => {
            console.log('\n---');
            console.log('Name:', index.name);
            console.log('Keys:', index.key);
            console.log('Unique:', index.unique || false);
            console.log('Sparse:', index.sparse || false);
        });

        console.log('\n✅ Check completed!');
        process.exit(0);

    } catch (error) {
        console.error('❌ Check failed:', error);
        process.exit(1);
    }
}

checkIndexDetails();
