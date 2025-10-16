// ============================================
// UPGRADE USER TO ADMIN SCRIPT
// ============================================
// Run this script to make a user an admin

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

// Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ MongoDB Connected');
    } catch (error) {
        console.error('❌ MongoDB Connection Error:', error.message);
        process.exit(1);
    }
};

// Make user admin
const makeAdmin = async (email) => {
    try {
        // Find user by email
        const user = await User.findOne({ email: email.toLowerCase() });

        if (!user) {
            console.log('❌ User not found with email:', email);
            console.log('💡 Make sure the email is correct and user is registered');
            process.exit(1);
        }

        // Check current role
        console.log(`📧 Email: ${user.email}`);
        console.log(`👤 Name: ${user.name}`);
        console.log(`🎭 Current Role: ${user.role}`);

        // Update to admin
        user.role = 'admin';
        await user.save();

        console.log('\n✅ SUCCESS! User upgraded to admin!');
        console.log(`🎭 New Role: ${user.role}`);
        console.log('\n🎉 You can now access admin features!');

    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
};

// Main execution
const run = async () => {
    try {
        // Connect to database
        await connectDB();

        // Get email from command line argument or use default
        const email = process.argv[2] || 'amjedvnml@gmail.com';

        console.log('🔧 Making user admin...');
        console.log('📧 Target email:', email);
        console.log('');

        // Make user admin
        await makeAdmin(email);

        // Disconnect
        await mongoose.connection.close();
        console.log('\n📊 Database connection closed');
        process.exit(0);

    } catch (error) {
        console.error('❌ Fatal Error:', error);
        process.exit(1);
    }
};

// Run the script
run();
