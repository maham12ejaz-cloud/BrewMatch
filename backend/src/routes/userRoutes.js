/*global require, module*/

const express = require('express');

const router = express.Router();

const authMiddleware = require('../middleware/authMiddleware');

const {
    getUserOrders,
    getUserProfile,
    updateUserProfile,
    changeUserPassword,
    forgotPassword,
    resetPassword
} = require('../controllers/userController');

// Get logged-in user's order history
router.get('/orders', authMiddleware, getUserOrders);

// Get logged-in user's profile
router.get('/profile', authMiddleware, getUserProfile);

// Update logged-in user's profile
router.put('/profile', authMiddleware, updateUserProfile);

// Change logged-in user's password
router.put('/change-password', authMiddleware, changeUserPassword);

// Forgot password
router.post('/forgot-password', forgotPassword);

// Reset password
router.post('/reset-password', resetPassword);

module.exports = router;
