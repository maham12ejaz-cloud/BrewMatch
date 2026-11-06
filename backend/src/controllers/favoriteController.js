/* global require, module */

const db = require('../config/db');

// GET USER FAVORITES
const getFavorites = (req, res) => {
    const userId = req.user.id;

    const sql = `
        SELECT
            favorites.id AS favorite_id,
            coffees.*
        FROM favorites
        INNER JOIN coffees
            ON favorites.coffee_id = coffees.id
        WHERE favorites.user_id = ?
        ORDER BY favorites.created_at DESC
    `;

    db.query(sql, [userId], (error, results) => {
        if (error) {
            console.error('Get favorites error:', error.message);

            return res.status(500).json({
                success: false,
                message: 'Failed to fetch favorites'
            });
        }

        res.status(200).json({
            success: true,
            count: results.length,
            favorites: results
        });
    });
};


// ADD FAVORITE
const addFavorite = (req, res) => {
    const userId = req.user.id;
    const { coffee_id } = req.body;

    if (!Number.isInteger(Number(coffee_id)) || Number(coffee_id) <= 0) {
        return res.status(400).json({
            success: false,
            message: 'Valid coffee ID is required'
        });
    }

    const sql = `
        INSERT INTO favorites (user_id, coffee_id)
        VALUES (?, ?)
    `;

    db.query(sql, [userId, coffee_id], (error, result) => {
        if (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({
                    success: false,
                    message: 'Coffee is already in favorites'
                });
            }

            if (error.code === 'ER_NO_REFERENCED_ROW_2') {
                return res.status(404).json({
                    success: false,
                    message: 'Coffee not found'
                });
            }

            console.error('Add favorite error:', error.message);

            return res.status(500).json({
                success: false,
                message: 'Failed to add favorite'
            });
        }

        res.status(201).json({
            success: true,
            message: 'Coffee added to favorites',
            favoriteId: result.insertId,
            coffeeId: Number(coffee_id)
        });
    });
};


// REMOVE FAVORITE
const removeFavorite = (req, res) => {
    const userId = req.user.id;
    const { coffeeId } = req.params;

    if (!Number.isInteger(Number(coffeeId)) || Number(coffeeId) <= 0) {
        return res.status(400).json({
            success: false,
            message: 'Invalid coffee ID'
        });
    }

    const sql = `
        DELETE FROM favorites
        WHERE user_id = ? AND coffee_id = ?
    `;

    db.query(sql, [userId, coffeeId], (error, result) => {
        if (error) {
            console.error('Remove favorite error:', error.message);

            return res.status(500).json({
                success: false,
                message: 'Failed to remove favorite'
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Favorite not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Coffee removed from favorites'
        });
    });
};


module.exports = {
    getFavorites,
    addFavorite,
    removeFavorite
};
