/* global require, module */

const express = require('express');

const router = express.Router();

const authMiddleware = require('../middleware/authMiddleware');

const {
    getFavorites,
    addFavorite,
    removeFavorite
} = require('../controllers/favoriteController');

// Get all favorites
router.get('/', authMiddleware, getFavorites);

// Add a favorite
router.post('/', authMiddleware, addFavorite);

// Remove a favorite
router.delete('/:coffeeId', authMiddleware, removeFavorite);

module.exports = router;
    
