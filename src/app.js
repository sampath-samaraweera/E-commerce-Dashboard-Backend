require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const Jwt = require('jsonwebtoken')
const passport = require('./middlewares/googleAuth'); // Add passport middleware
const session = require('express-session'); // For session management

const app = express();
const JWT_KEY = process.env.JWT_KEY

app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  }));

// Session setup (required for passport)
app.use(session({ secret: JWT_KEY, resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

// Connect to database
connectDB();

// Routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);

// Google OAuth Routes
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback', 
    passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
      try {
        // Successful authentication, generate JWT token
        const token = Jwt.sign({ id: req.user._id }, JWT_KEY, { expiresIn: '1h' });
        console.log(token);
        res.redirect(`http://localhost:3000/login?token=${token}`);
      } catch (error) {
        console.error('Error generating token:', error);
        res.redirect('/?error=token_generation_failed');
      }
    }
  );

module.exports = app;
