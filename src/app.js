require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');

const app = express();

app.use(express.json());
app.use(cors());

// Connect to database
connectDB();

// Routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);

module.exports = app;
