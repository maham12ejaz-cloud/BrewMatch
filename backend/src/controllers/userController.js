/*global require, module*/

const db = require('../config/db');
const bcrypt = require('bcryptjs');


// ======================================================
// GET LOGGED-IN USER ORDER HISTORY
// ======================================================

const getUserOrders = (req, res) => {
    const userId = req.user.id;

    const sql = `
        SELECT
            o.id AS order_id,
            o.customer_name,
            o.customer_email,
            o.customer_phone,
            o.delivery_address,
            o.total_amount,
            o.status,
            o.created_at,
            oi.id AS order_item_id,
            oi.coffee_id,
            c.name AS coffee_name,
            c.image AS coffee_image,
            oi.quantity,
            oi.unit_price,
            oi.subtotal
        FROM orders o
        INNER JOIN order_items oi
            ON o.id = oi.order_id
        INNER JOIN coffees c
            ON oi.coffee_id = c.id
        WHERE o.user_id = ?
        ORDER BY o.created_at DESC, oi.id ASC
    `;

    db.query(sql, [userId], (error, results) => {

        if (error) {
            console.error(
                'Get user orders error:',
                error.message
            );

            return res.status(500).json({
                success: false,
                message: 'Failed to fetch order history'
            });
        }


        // Group order items under their orders
        const ordersMap = new Map();


        results.forEach((row) => {

            if (!ordersMap.has(row.order_id)) {

                ordersMap.set(row.order_id, {

                    order_id: row.order_id,

                    customer_name:
                        row.customer_name,

                    customer_email:
                        row.customer_email,

                    customer_phone:
                        row.customer_phone,

                    delivery_address:
                        row.delivery_address,

                    total_amount:
                        row.total_amount,

                    status:
                        row.status,

                    created_at:
                        row.created_at,

                    items: []

                });
            }


            ordersMap.get(row.order_id).items.push({

                order_item_id:
                    row.order_item_id,

                coffee_id:
                    row.coffee_id,

                coffee_name:
                    row.coffee_name,

                coffee_image:
                    row.coffee_image,

                quantity:
                    row.quantity,

                unit_price:
                    row.unit_price,

                subtotal:
                    row.subtotal

            });
        });


        const orders =
            Array.from(
                ordersMap.values()
            );


        res.status(200).json({

            success: true,

            count: orders.length,

            orders

        });
    });
};


// ======================================================
// GET LOGGED-IN USER PROFILE
// ======================================================

const getUserProfile = (req, res) => {

    const userId = req.user.id;


    const sql = `
        SELECT
            id,
            name,
            email,
            phone,
            created_at,
            updated_at
        FROM users
        WHERE id = ?
    `;


    db.query(
        sql,
        [userId],
        (error, results) => {

            if (error) {

                console.error(
                    'Get user profile error:',
                    error.message
                );

                return res.status(500).json({
                    success: false,
                    message: 'Failed to fetch profile'
                });
            }


            if (results.length === 0) {

                return res.status(404).json({
                    success: false,
                    message: 'User profile not found'
                });
            }


            res.status(200).json({

                success: true,

                user: results[0]

            });
        }
    );
};


// ======================================================
// UPDATE LOGGED-IN USER PROFILE
// ======================================================

const updateUserProfile = (req, res) => {

    const userId = req.user.id;

    const {
        name,
        email,
        phone
    } = req.body;


    // ==================================================
    // VALIDATION
    // ==================================================

    if (
        !name ||
        !name.trim() ||
        !email ||
        !email.trim()
    ) {

        return res.status(400).json({

            success: false,

            message:
                'Name and email are required'

        });
    }


    const cleanName =
        name.trim();

    const normalizedEmail =
        email.trim().toLowerCase();

    const cleanPhone =
        phone
            ? phone.trim()
            : null;


    // ==================================================
    // CHECK EMAIL
    // ==================================================

    const checkEmailSql = `
        SELECT id
        FROM users
        WHERE email = ?
        AND id != ?
    `;


    db.query(
        checkEmailSql,

        [
            normalizedEmail,
            userId
        ],

        (error, results) => {

            if (error) {

                console.error(
                    'Check profile email error:',
                    error.message
                );

                return res.status(500).json({

                    success: false,

                    message:
                        'Failed to update profile'

                });
            }


            // ==================================================
            // EMAIL ALREADY EXISTS
            // ==================================================

            if (results.length > 0) {

                return res.status(409).json({

                    success: false,

                    message:
                        'Email is already in use'

                });
            }


            // ==================================================
            // UPDATE USER
            // ==================================================

            const updateSql = `
                UPDATE users
                SET
                    name = ?,
                    email = ?,
                    phone = ?
                WHERE id = ?
            `;


            db.query(

                updateSql,

                [
                    cleanName,
                    normalizedEmail,
                    cleanPhone,
                    userId
                ],

                (updateError, result) => {

                    if (updateError) {

                        console.error(
                            'Update user profile error:',
                            updateError.message
                        );

                        return res.status(500).json({

                            success: false,

                            message:
                                'Failed to update profile'

                        });
                    }


                    if (
                        result.affectedRows === 0
                    ) {

                        return res.status(404).json({

                            success: false,

                            message:
                                'User profile not found'

                        });
                    }


                    // ==================================================
                    // GET UPDATED USER
                    // ==================================================

                    const getUpdatedUserSql = `
                        SELECT
                            id,
                            name,
                            email,
                            phone,
                            created_at,
                            updated_at
                        FROM users
                        WHERE id = ?
                    `;


                    db.query(

                        getUpdatedUserSql,

                        [userId],

                        (userError, userResults) => {

                            if (userError) {

                                console.error(
                                    'Get updated user error:',
                                    userError.message
                                );

                                return res.status(500).json({

                                    success: false,

                                    message:
                                        'Profile updated but failed to fetch updated data'

                                });
                            }


                            if (
                                userResults.length === 0
                            ) {

                                return res.status(404).json({

                                    success: false,

                                    message:
                                        'Updated user not found'

                                });
                            }


                            // ==================================================
                            // SUCCESS RESPONSE
                            // ==================================================

                            return res.status(200).json({

                                success: true,

                                message:
                                    'Profile updated successfully',

                                user:
                                    userResults[0]

                            });

                        }
                    );

                }
            );

        }
    );
};


// ======================================================
// CHANGE LOGGED-IN USER PASSWORD
// ======================================================

const changeUserPassword = (req, res) => {

    const userId = req.user.id;

    const {
        currentPassword,
        newPassword
    } = req.body;


    if (
        !currentPassword ||
        !newPassword
    ) {

        return res.status(400).json({

            success: false,

            message:
                'Current password and new password are required'

        });
    }


    if (newPassword.length < 8) {

        return res.status(400).json({

            success: false,

            message:
                'New password must be at least 8 characters long'

        });
    }


    const getUserSql = `
        SELECT password_hash
        FROM users
        WHERE id = ?
    `;


    db.query(
        getUserSql,
        [userId],
        async (error, results) => {

            if (error) {

                console.error(
                    'Get password error:',
                    error.message
                );

                return res.status(500).json({

                    success: false,

                    message:
                        'Failed to change password'

                });
            }


            if (
                results.length === 0
            ) {

                return res.status(404).json({

                    success: false,

                    message:
                        'User not found'

                });
            }


            const user =
                results[0];


            const passwordMatches =
                await bcrypt.compare(
                    currentPassword,
                    user.password_hash
                );


            if (!passwordMatches) {

                return res.status(401).json({

                    success: false,

                    message:
                        'Current password is incorrect'

                });
            }


            const newPasswordHash =
                await bcrypt.hash(
                    newPassword,
                    10
                );


            const updatePasswordSql = `
                UPDATE users
                SET password_hash = ?
                WHERE id = ?
            `;


            db.query(

                updatePasswordSql,

                [
                    newPasswordHash,
                    userId
                ],

                (updateError, result) => {

                    if (updateError) {

                        console.error(
                            'Update password error:',
                            updateError.message
                        );

                        return res.status(500).json({

                            success: false,

                            message:
                                'Failed to change password'

                        });
                    }


                    if (
                        result.affectedRows === 0
                    ) {

                        return res.status(404).json({

                            success: false,

                            message:
                                'User not found'

                        });
                    }


                    return res.status(200).json({

                        success: true,

                        message:
                            'Password changed successfully'

                    });

                }
            );

        }
    );
};

// =========================
// FORGOT PASSWORD
// =========================

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email is required.'
            });
        }

        const cleanEmail = email.trim().toLowerCase();

        const [users] = await db.query(
            `
            SELECT id, name, email
            FROM users
            WHERE email = ?
            `,
            [cleanEmail]
        );

        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No account found with this email address.'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Account found. You can reset your password.',
            user: {
                id: users[0].id,
                name: users[0].name,
                email: users[0].email
            }
        });

    } catch (error) {
        console.error(
            'Forgot password error:',
            error
        );

        return res.status(500).json({
            success: false,
            message: 'Server error. Please try again later.'
        });
    }
};

// =========================
// RESET PASSWORD
// =========================

const resetPassword = async (req, res) => {
    try {
        const { email, newPassword } = req.body;

        if (!email || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Email and new password are required.'
            });
        }

        if (newPassword.length < 8) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 8 characters.'
            });
        }

        const cleanEmail = email.trim().toLowerCase();

        const [users] = await db.query(
            `
            SELECT id
            FROM users
            WHERE email = ?
            `,
            [cleanEmail]
        );

        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No account found with this email address.'
            });
        }

        const hashedPassword = await bcrypt.hash(
            newPassword,
            10
        );

        await db.query(
            `
            UPDATE users
            SET password_hash = ?
            WHERE id = ?
            `,
            [
                hashedPassword,
                users[0].id
            ]
        );

        return res.status(200).json({
            success: true,
            message: 'Password reset successfully.'
        });

    } catch (error) {
        console.error(
            'Reset password error:',
            error
        );

        return res.status(500).json({
            success: false,
            message: 'Server error. Please try again later.'
        });
    }
};

// ======================================================
// EXPORT CONTROLLERS
// ======================================================

module.exports = {

    getUserOrders,

    getUserProfile,

    updateUserProfile,

    changeUserPassword,

    forgotPassword,

    resetPassword

};

