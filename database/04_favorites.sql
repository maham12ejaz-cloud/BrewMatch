USE brewmatch;

-- Create favorites table
CREATE TABLE IF NOT EXISTS favorites (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    coffee_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    UNIQUE KEY unique_user_coffee (user_id, coffee_id),

    CONSTRAINT fk_favorites_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_favorites_coffee
        FOREIGN KEY (coffee_id)
        REFERENCES coffees(id)
        ON DELETE CASCADE
);

-- Check table structure
DESCRIBE favorites;

-- Check favorite records
SELECT * FROM favorites;