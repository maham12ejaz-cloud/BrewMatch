/* global require, module */

const express = require('express');
const cors = require('cors');

const coffeeRoutes = require('./routes/coffeeRoutes');
const authRoutes = require('./routes/authRoutes');
const favoriteRoutes = require('./routes/favoriteRoutes');
const authMiddleware = require('./middleware/authMiddleware');
const orderRoutes = require('./routes/orderRoutes');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// Home route
app.get('/', (req, res) => {
    res.send('BrewMatch Backend is Running!');
});

app.get('/api/auth/me', authMiddleware, (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Authenticated successfully',
        user: req.user
    });
});

// Coffee API
app.use('/api/coffees', coffeeRoutes);

// Authentication API
app.use('/api/auth', authRoutes);

// Favorites API
app.use('/api/favorites', favoriteRoutes);

// Orders API
app.use('/api/orders', orderRoutes);

// User API
app.use('/api/users', userRoutes);

// Admin API
app.use('/api/admin', adminRoutes);


module.exports = app;