/*global require, module*/

const express = require('express');

const router = express.Router();

const {
    getDashboardStats,
    getAllOrders,
    updateOrderStatus,
    getAllUsers,
    getAnalytics
} = require('../controllers/adminController');

const adminMiddleware = require('../middleware/adminMiddleware');

// ========================================
// GET DASHBOARD STATS
// ========================================

router.get(
    '/stats',
    adminMiddleware,
    getDashboardStats
);


// ========================================
// GET ALL ORDERS
// ========================================

router.get(
    '/orders',
    adminMiddleware,
    getAllOrders
);


// ========================================
// UPDATE ORDER STATUS
// ========================================

router.put(
    '/orders/:id/status',
    adminMiddleware,
    updateOrderStatus
);


// ========================================
// GET ALL USERS
// ========================================

router.get(
    '/users',
    adminMiddleware,
    getAllUsers
);


// ========================================
// GET ADMIN ANALYTICS
// ========================================

router.get(
    '/analytics',
    adminMiddleware,
    getAnalytics
);


module.exports = router;