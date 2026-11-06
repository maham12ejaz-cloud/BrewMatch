/*global require, process, module */

const jwt = require('jsonwebtoken');
const db = require('../config/db');

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            success: false,
            message: 'Access denied. Please login first.'
        });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        db.query(
            'SELECT id, name, email, phone, role FROM users WHERE id = ?',
            [decoded.id],
            (error, results) => {
                if (error) {
                    console.error(
                        'Authentication error:',
                        error.message
                    );

                    return res.status(500).json({
                        success: false,
                        message: 'Authentication failed'
                    });
                }

                if (results.length === 0) {
                    return res.status(401).json({
                        success: false,
                        message: 'User account not found'
                    });
                }

                req.user = results[0];

                next();
            }
        );

    } catch {
        return res.status(401).json({
            success: false,
            message: 'Invalid or expired token'
        });
    }
};

module.exports = authMiddleware;