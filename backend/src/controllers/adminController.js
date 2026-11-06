/*global require, module*/

const db = require('../config/db');

// ========================================
// GET DASHBOARD STATS
// ========================================

const getDashboardStats = (req, res) => {
    const sql = `
        SELECT
            (SELECT COUNT(*) FROM users) AS total_users,
            (SELECT COUNT(*) FROM coffees) AS total_coffees,
            (SELECT COUNT(*) FROM orders) AS total_orders,
            (SELECT COALESCE(SUM(total_amount), 0) FROM orders
             WHERE status != 'Cancelled') AS total_revenue
    `;

    db.query(sql, (error, results) => {
        if (error) {
            console.error(
                'Get dashboard stats error:',
                error.message
            );

            return res.status(500).json({
                success: false,
                message: 'Failed to fetch dashboard stats'
            });
        }

        const stats = results[0];

        return res.status(200).json({
            success: true,
            stats: {
                total_users: Number(stats.total_users),
                total_coffees: Number(stats.total_coffees),
                total_orders: Number(stats.total_orders),
                total_revenue: Number(stats.total_revenue)
            }
        });
    });
};


// ========================================
// GET ALL ORDERS FOR ADMIN
// ========================================

const getAllOrders = (req, res) => {
    const sql = `
        SELECT
            o.id AS order_id,
            o.user_id,
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
        ORDER BY o.created_at DESC, oi.id ASC
    `;

    db.query(sql, (error, results) => {
        if (error) {
            console.error(
                'Get all orders error:',
                error.message
            );

            return res.status(500).json({
                success: false,
                message: 'Failed to fetch orders'
            });
        }

        const ordersMap = new Map();

        results.forEach((row) => {
            if (!ordersMap.has(row.order_id)) {
                ordersMap.set(row.order_id, {
                    order_id: row.order_id,
                    user_id: row.user_id,
                    customer_name: row.customer_name,
                    customer_email: row.customer_email,
                    customer_phone: row.customer_phone,
                    delivery_address: row.delivery_address,
                    total_amount: row.total_amount,
                    status: row.status,
                    created_at: row.created_at,
                    items: []
                });
            }

            ordersMap.get(row.order_id).items.push({
                order_item_id: row.order_item_id,
                coffee_id: row.coffee_id,
                coffee_name: row.coffee_name,
                coffee_image: row.coffee_image,
                quantity: row.quantity,
                unit_price: row.unit_price,
                subtotal: row.subtotal
            });
        });

        const orders = Array.from(
            ordersMap.values()
        );

        res.status(200).json({
            success: true,
            count: orders.length,
            orders
        });
    });
};


// ========================================
// UPDATE ORDER STATUS
// ========================================

const updateOrderStatus = (req, res) => {
    const orderId = req.params.id;
    const { status } = req.body;

    const allowedStatuses = [
        'Pending',
        'Confirmed',
        'Preparing',
        'Delivered',
        'Cancelled'
    ];

    if (
        !status ||
        !allowedStatuses.includes(status)
    ) {
        return res.status(400).json({
            success: false,
            message: 'Invalid order status',
            allowedStatuses
        });
    }

    const sql = `
        UPDATE orders
        SET status = ?
        WHERE id = ?
    `;

    db.query(
        sql,
        [status, orderId],
        (error, result) => {
            if (error) {
                console.error(
                    'Update order status error:',
                    error.message
                );

                return res.status(500).json({
                    success: false,
                    message:
                        'Failed to update order status'
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Order not found'
                });
            }

            res.status(200).json({
                success: true,
                message:
                    'Order status updated successfully',
                order_id: Number(orderId),
                status
            });
        }
    );
};


// ========================================
// GET ALL USERS FOR ADMIN
// ========================================

const getAllUsers = (req, res) => {
    const sql = `
        SELECT
            id,
            name,
            email,
            phone,
            role,
            created_at,
            updated_at
        FROM users
        ORDER BY created_at DESC
    `;

    db.query(sql, (error, results) => {
        if (error) {
            console.error(
                'Get all users error:',
                error.message
            );

            return res.status(500).json({
                success: false,
                message: 'Failed to fetch users'
            });
        }

        return res.status(200).json({
            success: true,
            count: results.length,
            users: results
        });
    });
};


// ========================================
// GET ADMIN ANALYTICS
// ========================================

const getAnalytics = (req, res) => {

    // ----------------------------------------
    // 1. OVERALL SUMMARY
    // ----------------------------------------

    const summarySql = `
        SELECT
            (
                SELECT COALESCE(
                    SUM(total_amount),
                    0
                )
                FROM orders
                WHERE status != 'Cancelled'
            ) AS total_revenue,

            (
                SELECT COUNT(*)
                FROM orders
            ) AS total_orders,

            (
                SELECT COUNT(*)
                FROM users
            ) AS total_users,

            (
                SELECT COALESCE(
                    AVG(total_amount),
                    0
                )
                FROM orders
                WHERE status != 'Cancelled'
            ) AS average_order_value
    `;


    // ----------------------------------------
    // 2. DAILY REVENUE - LAST 7 DAYS
    // ----------------------------------------

    const dailyRevenueSql = `
        SELECT
            DATE(created_at) AS date,
            COALESCE(
                SUM(total_amount),
                0
            ) AS revenue,
            COUNT(*) AS orders
        FROM orders
        WHERE
            status != 'Cancelled'
            AND created_at >= DATE_SUB(
                CURDATE(),
                INTERVAL 6 DAY
            )
        GROUP BY DATE(created_at)
        ORDER BY date ASC
    `;


    // ----------------------------------------
    // 3. WEEKLY REVENUE - LAST 8 WEEKS
    // ----------------------------------------

    const weeklyRevenueSql = `
        SELECT
            YEARWEEK(
                created_at,
                1
            ) AS week_key,

            MIN(
                DATE(created_at)
            ) AS week_start,

            COALESCE(
                SUM(total_amount),
                0
            ) AS revenue,

            COUNT(*) AS orders

        FROM orders

        WHERE
            status != 'Cancelled'
            AND created_at >= DATE_SUB(
                CURDATE(),
                INTERVAL 7 WEEK
            )

        GROUP BY YEARWEEK(
            created_at,
            1
        )

        ORDER BY week_key ASC
    `;


    // ----------------------------------------
    // 4. MONTHLY REVENUE - LAST 6 MONTHS
    // ----------------------------------------

    const monthlyRevenueSql = `
        SELECT
            DATE_FORMAT(
                created_at,
                '%Y-%m'
            ) AS month,

            COALESCE(
                SUM(total_amount),
                0
            ) AS revenue,

            COUNT(*) AS orders

        FROM orders

        WHERE
            status != 'Cancelled'
            AND created_at >= DATE_SUB(
                CURDATE(),
                INTERVAL 5 MONTH
            )

        GROUP BY DATE_FORMAT(
            created_at,
            '%Y-%m'
        )

        ORDER BY month ASC
    `;


    // ----------------------------------------
    // 5. ORDER STATUS DISTRIBUTION
    // ----------------------------------------

    const orderStatusSql = `
        SELECT
            status,
            COUNT(*) AS count
        FROM orders
        GROUP BY status
        ORDER BY count DESC
    `;


    // ----------------------------------------
    // 6. POPULAR COFFEES
    // ----------------------------------------

    const popularCoffeesSql = `
        SELECT
            oi.coffee_id,
            c.name AS coffee_name,

            COALESCE(
                SUM(oi.quantity),
                0
            ) AS quantity_sold,

            COALESCE(
                SUM(oi.subtotal),
                0
            ) AS revenue

        FROM order_items oi

        INNER JOIN orders o
            ON oi.order_id = o.id

        INNER JOIN coffees c
            ON oi.coffee_id = c.id

        WHERE o.status != 'Cancelled'

        GROUP BY
            oi.coffee_id,
            c.name

        ORDER BY quantity_sold DESC

        LIMIT 5
    `;


    // ----------------------------------------
    // 7. USER GROWTH - LAST 6 MONTHS
    // ----------------------------------------

    const userGrowthSql = `
        SELECT
            DATE_FORMAT(
                created_at,
                '%Y-%m'
            ) AS month,

            COUNT(*) AS users

        FROM users

        WHERE created_at >= DATE_SUB(
            CURDATE(),
            INTERVAL 5 MONTH
        )

        GROUP BY DATE_FORMAT(
            created_at,
            '%Y-%m'
        )

        ORDER BY month ASC
    `;


    // ----------------------------------------
    // RUN ALL ANALYTICS QUERIES
    // ----------------------------------------

    db.query(
        summarySql,
        (summaryError, summaryResults) => {

            if (summaryError) {

                console.error(
                    'Analytics summary error:',
                    summaryError.message
                );

                return res.status(500).json({
                    success: false,
                    message:
                        'Failed to fetch analytics summary'
                });
            }


            db.query(
                dailyRevenueSql,
                (
                    dailyError,
                    dailyResults
                ) => {

                    if (dailyError) {

                        console.error(
                            'Daily analytics error:',
                            dailyError.message
                        );

                        return res.status(500).json({
                            success: false,
                            message:
                                'Failed to fetch daily analytics'
                        });
                    }


                    db.query(
                        weeklyRevenueSql,
                        (
                            weeklyError,
                            weeklyResults
                        ) => {

                            if (weeklyError) {

                                console.error(
                                    'Weekly analytics error:',
                                    weeklyError.message
                                );

                                return res.status(500).json({
                                    success: false,
                                    message:
                                        'Failed to fetch weekly analytics'
                                });
                            }


                            db.query(
                                monthlyRevenueSql,
                                (
                                    monthlyError,
                                    monthlyResults
                                ) => {

                                    if (monthlyError) {

                                        console.error(
                                            'Monthly analytics error:',
                                            monthlyError.message
                                        );

                                        return res.status(500).json({
                                            success: false,
                                            message:
                                                'Failed to fetch monthly analytics'
                                        });
                                    }


                                    db.query(
                                        orderStatusSql,
                                        (
                                            statusError,
                                            statusResults
                                        ) => {

                                            if (statusError) {

                                                console.error(
                                                    'Order status analytics error:',
                                                    statusError.message
                                                );

                                                return res.status(500).json({
                                                    success: false,
                                                    message:
                                                        'Failed to fetch order status analytics'
                                                });
                                            }


                                            db.query(
                                                popularCoffeesSql,
                                                (
                                                    coffeeError,
                                                    coffeeResults
                                                ) => {

                                                    if (
                                                        coffeeError
                                                    ) {

                                                        console.error(
                                                            'Popular coffees analytics error:',
                                                            coffeeError.message
                                                        );

                                                        return res.status(500).json({
                                                            success: false,
                                                            message:
                                                                'Failed to fetch popular coffees analytics'
                                                        });
                                                    }


                                                    db.query(
                                                        userGrowthSql,
                                                        (
                                                            userError,
                                                            userResults
                                                        ) => {

                                                            if (
                                                                userError
                                                            ) {

                                                                console.error(
                                                                    'User growth analytics error:',
                                                                    userError.message
                                                                );

                                                                return res.status(500).json({
                                                                    success: false,
                                                                    message:
                                                                        'Failed to fetch user growth analytics'
                                                                });
                                                            }


                                                            const summary =
                                                                summaryResults[0];


                                                            return res.status(
                                                                200
                                                            ).json({

                                                                success:
                                                                    true,

                                                                summary: {
                                                                    total_revenue:
                                                                        Number(
                                                                            summary.total_revenue
                                                                        ),

                                                                    total_orders:
                                                                        Number(
                                                                            summary.total_orders
                                                                        ),

                                                                    total_users:
                                                                        Number(
                                                                            summary.total_users
                                                                        ),

                                                                    average_order_value:
                                                                        Number(
                                                                            summary.average_order_value
                                                                        )
                                                                },

                                                                daily_revenue:
                                                                    dailyResults.map(
                                                                        (item) => ({
                                                                            date:
                                                                                item.date,

                                                                            revenue:
                                                                                Number(
                                                                                    item.revenue
                                                                                ),

                                                                            orders:
                                                                                Number(
                                                                                    item.orders
                                                                                )
                                                                        })
                                                                    ),

                                                                weekly_revenue:
                                                                    weeklyResults.map(
                                                                        (item) => ({
                                                                            week:
                                                                                item.week_key,

                                                                            week_start:
                                                                                item.week_start,

                                                                            revenue:
                                                                                Number(
                                                                                    item.revenue
                                                                                ),

                                                                            orders:
                                                                                Number(
                                                                                    item.orders
                                                                                )
                                                                        })
                                                                    ),

                                                                monthly_revenue:
                                                                    monthlyResults.map(
                                                                        (item) => ({
                                                                            month:
                                                                                item.month,

                                                                            revenue:
                                                                                Number(
                                                                                    item.revenue
                                                                                ),

                                                                            orders:
                                                                                Number(
                                                                                    item.orders
                                                                                )
                                                                        })
                                                                    ),

                                                                order_status:
                                                                    statusResults.map(
                                                                        (item) => ({
                                                                            status:
                                                                                item.status,

                                                                            count:
                                                                                Number(
                                                                                    item.count
                                                                                )
                                                                        })
                                                                    ),

                                                                popular_coffees:
                                                                    coffeeResults.map(
                                                                        (item) => ({
                                                                            coffee_id:
                                                                                Number(
                                                                                    item.coffee_id
                                                                                ),

                                                                            coffee_name:
                                                                                item.coffee_name,

                                                                            quantity_sold:
                                                                                Number(
                                                                                    item.quantity_sold
                                                                                ),

                                                                            revenue:
                                                                                Number(
                                                                                    item.revenue
                                                                                )
                                                                        })
                                                                    ),

                                                                user_growth:
                                                                    userResults.map(
                                                                        (item) => ({
                                                                            month:
                                                                                item.month,

                                                                            users:
                                                                                Number(
                                                                                    item.users
                                                                                )
                                                                        })
                                                                    )
                                                            });
                                                        }
                                                    );
                                                }
                                            );
                                        }
                                    );
                                }
                            );
                        }
                    );
                }
            );
        }
    );
};


// ========================================
// EXPORT CONTROLLERS
// ========================================

module.exports = {
    getDashboardStats,
    getAllOrders,
    updateOrderStatus,
    getAllUsers,
    getAnalytics
};