// Quick test script to verify user creation works
// Run with: node testUserCreation.js

const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');

async function testUserCreation() {
    try {
        // Connect to MongoDB
        console.log('🔌 Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');
        
        // Create a test user
        console.log('\n📝 Creating test user...');
        const testUser = await User.create({
            name: 'Test User Direct',
            email: 'testdirect@example.com',
            password: 'Test123456',
            phone: '1234567890',
            role: 'user'
        });
        
        console.log('✅ User created successfully!');
        console.log('User ID:', testUser._id);
        console.log('Name:', testUser.name);
        console.log('Email:', testUser.email);
        console.log('Role:', testUser.role);
        console.log('Membership Number:', testUser.membershipNumber);
        
        // Verify user exists in database
        console.log('\n🔍 Verifying user in database...');
        const foundUser = await User.findById(testUser._id);
        
        if (foundUser) {
            console.log('✅ User found in database!');
            console.log('Stored Name:', foundUser.name);
            console.log('Stored Email:', foundUser.email);
        } else {
            console.log('❌ User NOT found in database!');
        }
        
        // Get count of all users
        console.log('\n📊 Counting all users...');
        const userCount = await User.countDocuments();
        console.log('Total users in database:', userCount);
        
        // Clean up test user
        console.log('\n🧹 Cleaning up test user...');
        await User.deleteOne({ email: 'testdirect@example.com' });
        console.log('✅ Test user deleted');
        
        process.exit(0);
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error('Full error:', error);
        process.exit(1);
    }
}

testUserCreation();
