/* global require, module */

const db = require('../config/db');

// COMMON ORDER CREATION FUNCTION
const createOrder = (req, res, userId = null) => {
    const {
        customer_name,
        customer_email,
        customer_phone,
        delivery_address,
        items
    } = req.body;

    // 1. Validate customer details
    if (
        !customer_name ||
        !customer_email ||
        !customer_phone ||
        !delivery_address
    ) {
        return res.status(400).json({
            success: false,
            message: 'All customer details are required'
        });
    }

    // 2. Validate items
    if (!Array.isArray(items) || items.length === 0) {
        return res.status(400).json({
            success: false,
            message: 'At least one coffee is required'
        });
    }

    // 3. Validate each item
    for (const item of items) {
        if (
            !Number.isInteger(Number(item.coffee_id)) ||
            Number(item.coffee_id) <= 0 ||
            !Number.isInteger(Number(item.quantity)) ||
            Number(item.quantity) <= 0
        ) {
            return res.status(400).json({
                success: false,
                message: 'Invalid coffee ID or quantity'
            });
        }
    }

    // 4. Prevent duplicate coffee entries
    const coffeeIds = items.map(item => Number(item.coffee_id));

    if (new Set(coffeeIds).size !== coffeeIds.length) {
        return res.status(400).json({
            success: false,
            message: 'Duplicate coffee items are not allowed'
        });
    }

    // 5. Get actual coffee prices from database
    const sql = 'SELECT id, name, price FROM coffees WHERE id IN (?)';

    db.query(sql, [coffeeIds], (error, coffees) => {
        if (error) {
            console.error('Coffee lookup error:', error.message);

            return res.status(500).json({
                success: false,
                message: 'Failed to verify coffees'
            });
        }

        if (coffees.length !== coffeeIds.length) {
            return res.status(404).json({
                success: false,
                message: 'One or more coffees were not found'
            });
        }

        // 6. Calculate total using database prices
        const coffeeMap = new Map(
            coffees.map(coffee => [coffee.id, coffee])
        );

        let totalCents = 0;

        const orderItems = items.map(item => {
            const coffee = coffeeMap.get(Number(item.coffee_id));

            const unitPriceCents = Math.round(
                Number(coffee.price) * 100
            );

            const subtotalCents =
                unitPriceCents * Number(item.quantity);

            totalCents += subtotalCents;

            return {
                coffee_id: coffee.id,
                quantity: Number(item.quantity),
                unit_price: (unitPriceCents / 100).toFixed(2),
                subtotal: (subtotalCents / 100).toFixed(2)
            };
        });

        const totalAmount = (totalCents / 100).toFixed(2);

        // 7. Start database transaction
        db.beginTransaction((transactionError) => {
            if (transactionError) {
                console.error('Transaction error:', transactionError.message);

                return res.status(500).json({
                    success: false,
                    message: 'Could not start order transaction'
                });
            }

            // 8. Insert main order
            const orderSQL = `
                INSERT INTO orders (
                    user_id,
                    customer_name,
                    customer_email,
                    customer_phone,
                    delivery_address,
                    total_amount
                )
                VALUES (?, ?, ?, ?, ?, ?)
            `;

            db.query(
                orderSQL,
                [
                    userId,
                    customer_name.trim(),
                    customer_email.trim().toLowerCase(),
                    customer_phone.trim(),
                    delivery_address.trim(),
                    totalAmount
                ],
                (orderError, orderResult) => {
                    if (orderError) {
                        return db.rollback(() => {
                            console.error('Order insert error:', orderError.message);

                            res.status(500).json({
                                success: false,
                                message: 'Failed to create order'
                            });
                        });
                    }

                    const orderId = orderResult.insertId;

                    // 9. Insert order items
                    const itemSQL = `
                        INSERT INTO order_items (
                            order_id,
                            coffee_id,
                            quantity,
                            unit_price,
                            subtotal
                        )
                        VALUES ?
                    `;

                    const itemValues = orderItems.map(item => [
                        orderId,
                        item.coffee_id,
                        item.quantity,
                        item.unit_price,
                        item.subtotal
                    ]);

                    db.query(itemSQL, [itemValues], (itemError) => {
                        if (itemError) {
                            return db.rollback(() => {
                                console.error('Order items error:', itemError.message);

                                res.status(500).json({
                                    success: false,
                                    message: 'Failed to save order items'
                                });
                            });
                        }

                        // 10. Commit transaction
                        db.commit((commitError) => {
                            if (commitError) {
                                return db.rollback(() => {
                                    console.error('Commit error:', commitError.message);

                                    res.status(500).json({
                                        success: false,
                                        message: 'Order could not be completed'
                                    });
                                });
                            }

                            res.status(201).json({
                                success: true,
                                message: 'Order placed successfully',
                                order: {
                                    order_id: orderId,
                                    user_id: userId,
                                    total_amount: totalAmount,
                                    status: 'Pending',
                                    items: orderItems
                                }
                            });
                        });
                    });
                }
            );
        });
    });
};


// PLACE ORDER FOR LOGGED-IN USER
const placeUserOrder = (req, res) => {
    createOrder(req, res, req.user.id);
};


// PLACE ORDER FOR GUEST USER
const placeGuestOrder = (req, res) => {
    createOrder(req, res, null);
};


module.exports = {
    placeUserOrder,
    placeGuestOrder
};
