const mongoose = require('mongoose');

const MONGO_URI="mongodb+srv://admin:admin@cluster0.g0sp0f8.mongodb.net/e-commerce"

const connectDB = async () => {
    console.log(MONGO_URI);
    try {
        await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

module.exports = connectDB;
