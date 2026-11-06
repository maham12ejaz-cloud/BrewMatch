USE brewmatch;

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
    id INT PRIMARY KEY AUTO_INCREMENT,

    user_id INT NULL,

    customer_name VARCHAR(100) NOT NULL,
    customer_email VARCHAR(150) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    delivery_address TEXT NOT NULL,

    total_amount DECIMAL(10,2) NOT NULL,

    status ENUM(
        'Pending',
        'Confirmed',
        'Preparing',
        'Delivered',
        'Cancelled'
    ) DEFAULT 'Pending',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_orders_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE SET NULL
);

-- Check table structure
DESCRIBE orders;

-- Check order records
SELECT * FROM orders;

SELECT * FROM orders ORDER BY id DESC;