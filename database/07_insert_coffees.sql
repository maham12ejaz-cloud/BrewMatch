USE brewmatch;

INSERT INTO coffees
(id, name, description, price, image, strength, taste, milk, temperature, sweetness)
VALUES
(1, 'Espresso', 'A rich and bold coffee with a strong, intense flavor.', 300, '/images/espresso.jpg', 'Strong', 'Bold', 'No Milk', 'Hot', 'Not Sweet'),

(2, 'Latte', 'A smooth and creamy coffee made with espresso and steamed milk.', 450, '/images/latte.jpg', 'Medium', 'Creamy', 'Milk', 'Hot', 'Slightly Sweet'),

(3, 'Cappuccino', 'A balanced coffee with espresso, steamed milk, and soft milk foam.', 450, '/images/cappuccino.jpg', 'Medium', 'Smooth', 'Milk', 'Hot', 'Not Sweet'),

(4, 'Mocha', 'A delicious combination of espresso, chocolate, and steamed milk.', 500, '/images/mocha.jpg', 'Medium', 'Chocolate', 'Milk', 'Hot', 'Very Sweet'),

(5, 'Cold Brew', 'A smooth and refreshing coffee brewed slowly with cold water.', 400, '/images/cold-brew.jpg', 'Strong', 'Smooth', 'Any', 'Cold', 'Not Sweet'),

(6, 'Caramel Latte', 'A creamy latte with a rich and sweet caramel flavor.', 550, '/images/caramel-latte.jpg', 'Medium', 'Sweet', 'Milk', 'Hot', 'Very Sweet'),

(7, 'Americano', 'A simple and bold coffee made with espresso and hot water.', 350, '/images/americano.jpg', 'Strong', 'Bold', 'No Milk', 'Hot', 'Not Sweet'),

(8, 'Flat White', 'A velvety coffee with rich espresso and smooth steamed milk.', 480, '/images/flat-white.jpg', 'Medium', 'Creamy', 'Milk', 'Hot', 'Slightly Sweet'),

(9, 'Macchiato', 'A strong espresso balanced with a small amount of creamy milk.', 400, '/images/macchiato.jpg', 'Strong', 'Bold', 'Milk', 'Hot', 'Not Sweet'),

(10, 'Iced Latte', 'A refreshing cold latte made with espresso, milk, and ice.', 500, '/images/iced-latte.jpg', 'Medium', 'Creamy', 'Milk', 'Cold', 'Slightly Sweet'),

(11, 'Frappuccino', 'A creamy and refreshing blended coffee with a sweet flavor.', 600, '/images/frappuccino.jpg', 'Light', 'Sweet', 'Milk', 'Cold', 'Very Sweet'),

(12, 'Vanilla Latte', 'A smooth latte combined with a soft and sweet vanilla flavor.', 520, '/images/vanilla-latte.jpg', 'Medium', 'Sweet', 'Milk', 'Hot', 'Very Sweet'),

(13, 'Iced Mocha', 'A chilled chocolate coffee with creamy milk and espresso.', 550, '/images/iced-mocha.jpg', 'Medium', 'Chocolate', 'Milk', 'Cold', 'Very Sweet'),

(14, 'Irish Coffee', 'A rich and sweet coffee with a warm and smooth flavor.', 650, '/images/irish-coffee.jpg', 'Strong', 'Sweet', 'Any', 'Hot', 'Very Sweet'),

(15, 'Hazelnut Coffee', 'A smooth coffee with a warm, nutty hazelnut flavor.', 550, '/images/hazelnut-coffee.jpg', 'Medium', 'Nutty', 'Milk', 'Hot', 'Slightly Sweet');

-- Verify inserted coffees
SELECT * FROM coffees;

-- Count total coffees
SELECT COUNT(*) AS total_coffees FROM coffees;