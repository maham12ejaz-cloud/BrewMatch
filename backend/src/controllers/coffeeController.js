
/* global require, module */

const db = require('../config/db');

// ==========================================
// GET ALL COFFEES
// ==========================================

const getAllCoffees = (req, res) => {
    const sql = 'SELECT * FROM coffees ORDER BY id ASC';

    db.query(sql, (error, results) => {
        if (error) {
            console.error('Error fetching coffees:', error.message);

            return res.status(500).json({
                success: false,
                message: 'Failed to fetch coffees'
            });
        }

        res.status(200).json({
            success: true,
            count: results.length,
            coffees: results
        });
    });
};

// ==========================================
// GET COFFEE BY ID
// ==========================================

const getCoffeeById = (req, res) => {
    const { id } = req.params;

    if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
        return res.status(400).json({
            success: false,
            message: 'Invalid coffee ID'
        });
    }

    const sql = 'SELECT * FROM coffees WHERE id = ?';

    db.query(sql, [id], (error, results) => {
        if (error) {
            console.error('Error fetching coffee:', error.message);

            return res.status(500).json({
                success: false,
                message: 'Failed to fetch coffee'
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Coffee not found'
            });
        }

        res.status(200).json({
            success: true,
            coffee: results[0]
        });
    });
};

// ==========================================
// POST - ADD NEW COFFEE
// ==========================================

const addCoffee = (req, res) => {
    const {
        name,
        description,
        price,
        image,
        strength,
        taste,
        milk,
        temperature,
        sweetness
    } = req.body;

    if (
        !name ||
        price === undefined ||
        price === null ||
        !strength ||
        !taste ||
        !milk ||
        !temperature ||
        !sweetness
    ) {
        return res.status(400).json({
            success: false,
            message: 'Please provide all required coffee fields'
        });
    }

    if (typeof name !== 'string' || !name.trim()) {
        return res.status(400).json({
            success: false,
            message: 'Coffee name must be valid text'
        });
    }

    if (!Number.isFinite(Number(price)) || Number(price) <= 0) {
        return res.status(400).json({
            success: false,
            message: 'Price must be a positive number'
        });
    }

    const validStrength = ['Strong', 'Medium', 'Light'];
    const validMilk = ['Milk', 'No Milk', 'Any'];
    const validTemperature = ['Hot', 'Cold', 'Both'];
    const validSweetness = [
        'Not Sweet',
        'Slightly Sweet',
        'Very Sweet'
    ];

    if (!validStrength.includes(strength)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid coffee strength'
        });
    }

    if (typeof taste !== 'string' || !taste.trim()) {
        return res.status(400).json({
            success: false,
            message: 'Taste must be valid text'
        });
    }

    if (!validMilk.includes(milk)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid milk preference'
        });
    }

    if (!validTemperature.includes(temperature)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid temperature'
        });
    }

    if (!validSweetness.includes(sweetness)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid sweetness level'
        });
    }

    const sql = `
        INSERT INTO coffees
        (
            name, description, price, image,
            strength, taste, milk, temperature, sweetness
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
        name.trim(),
        description || null,
        Number(price),
        image || null,
        strength,
        taste.trim(),
        milk,
        temperature,
        sweetness
    ];

    db.query(sql, values, (error, result) => {
        if (error) {
            console.error('Error adding coffee:', error.message);

            return res.status(500).json({
                success: false,
                message: 'Failed to add coffee'
            });
        }

        res.status(201).json({
            success: true,
            message: 'Coffee added successfully',
            coffeeId: result.insertId
        });
    });
};

// ==========================================
// PUT - UPDATE EXISTING COFFEE
// ==========================================

const updateCoffee = (req, res) => {
    const { id } = req.params;
    const data = req.body;

    // Validate request body
    if (
        !data ||
        typeof data !== 'object' ||
        Array.isArray(data)
    ) {
        return res.status(400).json({
            success: false,
            message: 'Please provide valid coffee data'
        });
    }

    // Validate coffee ID
    if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
        return res.status(400).json({
            success: false,
            message: 'Invalid coffee ID'
        });
    }

    const allowedFields = [
        'name',
        'description',
        'price',
        'image',
        'strength',
        'taste',
        'milk',
        'temperature',
        'sweetness'
    ];

    const fieldsToUpdate = Object.keys(data).filter(field =>
        allowedFields.includes(field)
    );

    if (fieldsToUpdate.length === 0) {
        return res.status(400).json({
            success: false,
            message: 'Please provide at least one valid field to update'
        });
    }

    const validStrength = ['Strong', 'Medium', 'Light'];
    const validMilk = ['Milk', 'No Milk', 'Any'];
    const validTemperature = ['Hot', 'Cold', 'Both'];
    const validSweetness = [
        'Not Sweet',
        'Slightly Sweet',
        'Very Sweet'
    ];

    if (
        data.name !== undefined &&
        (typeof data.name !== 'string' || !data.name.trim())
    ) {
        return res.status(400).json({
            success: false,
            message: 'Coffee name must be valid text'
        });
    }

    if (
        data.price !== undefined &&
        (!Number.isFinite(Number(data.price)) || Number(data.price) <= 0)
    ) {
        return res.status(400).json({
            success: false,
            message: 'Price must be a positive number'
        });
    }

    if (
        data.strength !== undefined &&
        !validStrength.includes(data.strength)
    ) {
        return res.status(400).json({
            success: false,
            message: 'Invalid coffee strength'
        });
    }

    if (
        data.taste !== undefined &&
        (typeof data.taste !== 'string' || !data.taste.trim())
    ) {
        return res.status(400).json({
            success: false,
            message: 'Taste must be valid text'
        });
    }

    if (
        data.milk !== undefined &&
        !validMilk.includes(data.milk)
    ) {
        return res.status(400).json({
            success: false,
            message: 'Invalid milk preference'
        });
    }

    if (
        data.temperature !== undefined &&
        !validTemperature.includes(data.temperature)
    ) {
        return res.status(400).json({
            success: false,
            message: 'Invalid temperature'
        });
    }

    if (
        data.sweetness !== undefined &&
        !validSweetness.includes(data.sweetness)
    ) {
        return res.status(400).json({
            success: false,
            message: 'Invalid sweetness level'
        });
    }

    if (
        data.description !== undefined &&
        data.description !== null &&
        typeof data.description !== 'string'
    ) {
        return res.status(400).json({
            success: false,
            message: 'Description must be text or null'
        });
    }

    if (
        data.image !== undefined &&
        data.image !== null &&
        typeof data.image !== 'string'
    ) {
        return res.status(400).json({
            success: false,
            message: 'Image must be text or null'
        });
    }

    const columnNames = {
        name: 'name',
        description: 'description',
        price: 'price',
        image: 'image',
        strength: 'strength',
        taste: 'taste',
        milk: 'milk',
        temperature: 'temperature',
        sweetness: 'sweetness'
    };

    const values = fieldsToUpdate.map(field => {
        if (field === 'name' || field === 'taste') {
            return data[field].trim();
        }

        if (field === 'price') {
            return Number(data[field]);
        }

        return data[field];
    });

    const setClause = fieldsToUpdate
        .map(field => `${columnNames[field]} = ?`)
        .join(', ');

    const sql = `
        UPDATE coffees
        SET ${setClause}
        WHERE id = ?
    `;

    db.query(sql, [...values, id], (error, result) => {
        if (error) {
            console.error('Error updating coffee:', error.message);

            return res.status(500).json({
                success: false,
                message: 'Failed to update coffee'
            });
        }

        if (result.affectedRows === 0) {
            return db.query(
                'SELECT id FROM coffees WHERE id = ?',
                [id],
                (selectError, results) => {
                    if (selectError) {
                        return res.status(500).json({
                            success: false,
                            message: 'Failed to verify coffee'
                        });
                    }

                    if (results.length === 0) {
                        return res.status(404).json({
                            success: false,
                            message: 'Coffee not found'
                        });
                    }

                    return res.status(200).json({
                        success: true,
                        message: 'Coffee is already up to date'
                    });
                }
            );
        }

        res.status(200).json({
            success: true,
            message: 'Coffee updated successfully'
        });
    });
};

// ==========================================
// DELETE - REMOVE COFFEE
// ==========================================

const deleteCoffee = (req, res) => {
    const { id } = req.params;

    // Validate coffee ID
    if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
        return res.status(400).json({
            success: false,
            message: 'Invalid coffee ID'
        });
    }

    const sql = 'DELETE FROM coffees WHERE id = ?';

    db.query(sql, [id], (error, result) => {
        if (error) {
            console.error('Error deleting coffee:', error.message);

            // Coffee may be referenced by an existing order item
            if (error.code === 'ER_ROW_IS_REFERENCED_2') {
                return res.status(409).json({
                    success: false,
                    message: 'This coffee cannot be deleted because it is associated with an existing order'
                });
            }

            return res.status(500).json({
                success: false,
                message: 'Failed to delete coffee'
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Coffee not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Coffee deleted successfully',
            coffeeId: Number(id)
        });
    });
};

// ==========================================
// EXPORT CONTROLLER FUNCTIONS
// ==========================================

module.exports = {
    getAllCoffees,
    getCoffeeById,
    addCoffee,
    updateCoffee,
    deleteCoffee
};
