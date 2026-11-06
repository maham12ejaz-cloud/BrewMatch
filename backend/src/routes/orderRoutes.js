/* global require, module */

const express = require('express');

const router = express.Router();

const authMiddleware = require('../middleware/authMiddleware');

const {
    placeUserOrder,
    placeGuestOrder
} = require('../controllers/orderController');

// Logged-in user order
router.post('/user', authMiddleware, placeUserOrder);

// Guest user order
router.post('/guest', placeGuestOrder);

module.exports = router;
