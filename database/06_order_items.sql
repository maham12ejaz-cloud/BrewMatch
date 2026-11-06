USE brewmatch;

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
    id INT PRIMARY KEY AUTO_INCREMENT,

    order_id INT NOT NULL,
    coffee_id INT NOT NULL,

    quantity INT NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_order_items_order
        FOREIGN KEY (order_id)
        REFERENCES orders(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_order_items_coffee
        FOREIGN KEY (coffee_id)
        REFERENCES coffees(id)
        ON DELETE RESTRICT
);

-- Check table structure
DESCRIBE order_items;

-- Check order items
SELECT * FROM order_items;