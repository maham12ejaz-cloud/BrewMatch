USE brewmatch;

-- Create coffees table
CREATE TABLE IF NOT EXISTS coffees (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    image VARCHAR(500),
    strength ENUM('Strong', 'Medium', 'Light') NOT NULL,
    taste VARCHAR(50) NOT NULL,
    milk ENUM('Milk', 'No Milk', 'Any') NOT NULL,
    temperature ENUM('Hot', 'Cold', 'Both') NOT NULL,
    sweetness ENUM('Not Sweet', 'Slightly Sweet', 'Very Sweet') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
);

-- Check table structure
DESCRIBE coffees;

-- Check coffee records
SELECT * FROM coffees;