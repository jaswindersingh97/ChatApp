const mongoose = require('mongoose');

// MongoDB connection URI
const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/myDatabase'; // Use environment variable or fallback to local

const connectDB = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(uri, {
            useNewUrlParser: true,   // Use the new URL parser
        });

        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message);
        process.exit(1); // Exit the process if unable to connect
    }
};

module.exports = connectDB;
