/* global require, module, process */

const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


// =========================================================
// SIGNUP API
// =========================================================

const signup = (req, res) => {
    const { name, email, password, phone } = req.body;

    // 1. Validate required fields
    if (!name || !email || !password) {
        return res.status(400).json({
            success: false,
            message: 'Name, email and password are required'
        });
    }


    // 2. Validate name
    if (typeof name !== 'string' || name.trim().length < 2) {
        return res.status(400).json({
            success: false,
            message: 'Name must contain at least 2 characters'
        });
    }


    // 3. Validate email
    const normalizedEmail = email.trim().toLowerCase();

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(normalizedEmail)) {
        return res.status(400).json({
            success: false,
            message: 'Please enter a valid email address'
        });
    }


    // 4. Validate password
    if (typeof password !== 'string' || password.length < 8) {
        return res.status(400).json({
            success: false,
            message: 'Password must be at least 8 characters long'
        });
    }


    // 5. Check if email already exists
    const checkEmailSQL =
        'SELECT id FROM users WHERE email = ?';

    db.query(
        checkEmailSQL,
        [normalizedEmail],
        (error, results) => {

            if (error) {
                console.error(
                    'Email check error:',
                    error.message
                );

                return res.status(500).json({
                    success: false,
                    message: 'Something went wrong'
                });
            }


            if (results.length > 0) {
                return res.status(409).json({
                    success: false,
                    message: 'Email is already registered'
                });
            }


            // 6. Hash password
            bcrypt.hash(
                password,
                10,
                (hashError, hashedPassword) => {

                    if (hashError) {
                        console.error(
                            'Password hashing error:',
                            hashError.message
                        );

                        return res.status(500).json({
                            success: false,
                            message: 'Password could not be secured'
                        });
                    }


                    // 7. Insert user into database
                    // role is NOT included here intentionally.
                    // Database DEFAULT will automatically set role = 'user'.

                    const insertSQL = `
                        INSERT INTO users
                        (name, email, password_hash, phone)
                        VALUES (?, ?, ?, ?)
                    `;


                    db.query(
                        insertSQL,
                        [
                            name.trim(),
                            normalizedEmail,
                            hashedPassword,
                            phone
                                ? phone.trim()
                                : null
                        ],
                        (insertError, result) => {

                            if (insertError) {
                                console.error(
                                    'Signup error:',
                                    insertError.message
                                );


                                if (
                                    insertError.code ===
                                    'ER_DUP_ENTRY'
                                ) {
                                    return res.status(409).json({
                                        success: false,
                                        message:
                                            'Email is already registered'
                                    });
                                }


                                return res.status(500).json({
                                    success: false,
                                    message:
                                        'User registration failed'
                                });
                            }


                            // 8. Send response
                            return res.status(201).json({
                                success: true,
                                message:
                                    'Account created successfully',

                                user: {
                                    id: result.insertId,
                                    name: name.trim(),
                                    email: normalizedEmail,
                                    phone: phone || null,

                                    // Every newly registered
                                    // account is a normal user.
                                    role: 'user'
                                }
                            });
                        }
                    );
                }
            );
        }
    );
};



// =========================================================
// LOGIN API
// =========================================================

const login = (req, res) => {
    const { email, password } = req.body;


    // 1. Validate input
    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: 'Email and password are required'
        });
    }


    // 2. Normalize email
    const normalizedEmail =
        email.trim().toLowerCase();


    // 3. Find user in database
    const sql =
        'SELECT * FROM users WHERE email = ?';


    db.query(
        sql,
        [normalizedEmail],
        (error, results) => {

            if (error) {
                console.error(
                    'Login database error:',
                    error.message
                );

                return res.status(500).json({
                    success: false,
                    message: 'Something went wrong'
                });
            }


            // 4. Check user exists
            if (results.length === 0) {
                return res.status(401).json({
                    success: false,
                    message:
                        'Invalid email or password'
                });
            }


            const user = results[0];


            // 5. Compare password
            bcrypt.compare(
                password,
                user.password_hash,
                (compareError, isMatch) => {

                    if (compareError) {
                        console.error(
                            'Password comparison error:',
                            compareError.message
                        );

                        return res.status(500).json({
                            success: false,
                            message: 'Login failed'
                        });
                    }


                    if (!isMatch) {
                        return res.status(401).json({
                            success: false,
                            message:
                                'Invalid email or password'
                        });
                    }


                    // 6. Generate JWT token
                    //
                    // IMPORTANT:
                    // role is now included in JWT.
                    //
                    // Example:
                    // normal user:
                    // { id: 1, role: 'user' }
                    //
                    // admin:
                    // { id: 2, role: 'admin' }

                    const token = jwt.sign(
                        {
                            id: user.id,
                            role: user.role
                        },
                        process.env.JWT_SECRET,
                        {
                            expiresIn: '1d'
                        }
                    );


                    // 7. Send response
                    return res.status(200).json({
                        success: true,
                        message: 'Login successful',

                        token,

                        user: {
                            id: user.id,
                            name: user.name,
                            email: user.email,
                            phone: user.phone,
                            role: user.role
                        }
                    });
                }
            );
        }
    );
};



// =========================================================
// EXPORT
// =========================================================

module.exports = {
    signup,
    login
};