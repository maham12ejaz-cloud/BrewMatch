# BrewMatch — AI Coffee Recommendation Website

BrewMatch is a full-stack coffee recommendation web application that helps users discover coffees based on their personal taste preferences.

The project combines a modern React frontend, Node.js/Express backend, MySQL database, JWT authentication, personalized coffee recommendations, favorites, cart, checkout, order management, and an admin dashboard.

> Note: The current recommendation system is rule-based and does not require a paid AI API.

---

## Features

### User Features

- User registration and login
- JWT-based authentication
- Secure password hashing
- User profile management
- Update name, email, and phone
- Change password
- Forgot password and reset password flow
- Browse available coffees
- View detailed coffee information
- Personalized coffee recommendation quiz
- Coffee match percentage
- Personalized recommendation reason
- Add coffee to favorites
- Remove coffee from favorites
- Add coffee to cart
- Update cart quantity
- Remove items from cart
- Checkout and order placement
- Order confirmation
- Orders stored in MySQL database

### Admin Features

- Separate admin login
- Admin authentication and authorization
- Admin dashboard
- Coffee management
- Add new coffees
- Update coffee information
- Delete coffees
- Undo delete action
- Order management
- Update order status
- User management
- Analytics dashboard
- Revenue statistics
- Order status statistics
- Popular coffee statistics
- User growth statistics
- Admin profile settings
- Admin password update
- Right-side toast notifications for admin actions

---

## Coffee Recommendation System

BrewMatch includes a personalized recommendation system.

Users answer questions about their preferences, such as:

- Coffee strength
- Taste
- Milk preference
- Temperature
- Sweetness

The answers are processed by the recommendation logic and matched against available coffee data.

The system then calculates a match percentage and provides a personalized reason for the recommendation.

The recommendation system is implemented in:

```text
src/utils/recomendation.js
```

This approach keeps the project free from dependency on paid AI APIs while still providing personalized recommendations.

---

## Tech Stack

### Frontend

- React
- Vite
- React Router
- JavaScript
- CSS
- Lucide React

### Backend

- Node.js
- Express.js
- REST API
- JWT Authentication
- bcrypt/password hashing
- CORS

### Database

- MySQL

### Development & Testing

- VS Code
- Postman
- Git
- GitHub

---

## Project Architecture

BrewMatch follows a full-stack architecture:

```text
                    BrewMatch
                        |
        +---------------+---------------+
        |                               |
     Frontend                        Backend
     React/Vite                  Node.js/Express
        |                               |
        |          REST API             |
        +-------------------------------+
                        |
                     MySQL
                    Database
```

---

## Project Structure

```text
coffee-ai/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js
│   │   │
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── coffeeController.js
│   │   │   ├── favoriteController.js
│   │   │   ├── orderController.js
│   │   │   ├── userController.js
│   │   │   └── adminController.js
│   │   │
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js
│   │   │   └── adminMiddleware.js
│   │   │
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── coffeeRoutes.js
│   │   │   ├── favoriteRoutes.js
│   │   │   ├── orderRoutes.js
│   │   │   ├── userRoutes.js
│   │   │   └── adminRoutes.js
│   │   │
│   │   ├── app.js
│   │   └── server.js
│   │
│   ├── .env
│   ├── package.json
│   └── package-lock.json
│
├── database/
│
├── public/
│
├── src/
│   ├── components/
│   ├── data/
│   ├── pages/
│   ├── utils/
│   ├── App.jsx
│   └── main.jsx
│
├── .gitignore
├── package.json
├── package-lock.json
├── vite.config.js
└── README.md
```

---

## Main Application Pages

### User Side

```text
/
├── Home
├── Login
├── Signup
├── Forgot Password
├── Reset Password
├── Profile
├── Quiz
├── Result
├── Coffees
├── Coffee Details
├── Favorites
├── Cart
├── Checkout
└── Order Confirmation
```

### Admin Side

```text
/admin/login
/admin/dashboard
/admin/coffees
/admin/orders
/admin/users
/admin/analytics
/admin/settings
```

---

## Authentication

BrewMatch uses JWT-based authentication.

After successful login:

```text
User Login
    ↓
Backend verifies credentials
    ↓
JWT token generated
    ↓
Token stored in browser
    ↓
Protected API requests use:
Authorization: Bearer <token>
```

Admin authentication is separated from normal user authentication.

Admin session data uses:

```text
adminToken
adminUser
```

while normal user authentication uses:

```text
token
user
```

This prevents the normal user interface from treating an admin account as a regular customer.

---

## Database

The application uses MySQL to store persistent application data.

Main tables include:

```text
users
coffees
favorites
orders
order_items
```

### Basic Relationships

```text
users
  |
  +---- favorites
  |
  +---- orders
           |
           +---- order_items
                    |
                    +---- coffees
```

An order can contain multiple coffee items, while each order item stores the selected coffee, quantity, unit price, and subtotal.

---

## Order Flow

The checkout system uses the backend API instead of storing completed orders only in browser storage.

```text
User adds coffee to cart
        ↓
Cart
        ↓
Checkout
        ↓
POST /api/orders/user
        ↓
JWT authentication
        ↓
Backend validates order
        ↓
MySQL transaction
        ↓
orders table
        +
order_items table
        ↓
Order Confirmation
```

The backend also retrieves the actual coffee prices from the database before calculating the final order total.

---

## Admin Dashboard

The admin dashboard provides an overview of the application.

It includes:

- Total users
- Total coffees
- Total orders
- Revenue
- Order statistics
- Popular coffees
- User growth
- Revenue analytics

Admin operations are protected using admin authorization middleware.

---

## API Structure

Main API areas include:

```text
/api/auth
/api/coffees
/api/favorites
/api/orders
/api/users
/api/admin
```

Examples:

```text
POST   /api/auth/login
POST   /api/auth/signup

GET    /api/coffees
GET    /api/coffees/:id

GET    /api/favorites
POST   /api/favorites
DELETE /api/favorites/:coffeeId

POST   /api/orders/user

GET    /api/users/profile
PUT    /api/users/profile

GET    /api/admin/...
```

---

## Installation

### 1. Clone the repository

```bash
git clone <your-github-repository-url>
```

### 2. Open the project

```bash
cd coffee-ai
```

### 3. Install frontend dependencies

```bash
npm install
```

### 4. Install backend dependencies

```bash
cd backend
npm install
```

---

## Environment Variables

Create a `.env` file inside the `backend` folder.

Example:

```env
PORT=5000

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=brewmatch

JWT_SECRET=your_secret_key
```

Do not upload the real `.env` file to GitHub.

The project uses `.gitignore` to protect environment variables and other sensitive files.

---

## Running the Project

### Start Backend

Open a terminal:

```bash
cd backend
npm start
```

The backend runs on:

```text
http://localhost:5000
```

### Start Frontend

Open another terminal:

```bash
npm run dev
```

The frontend normally runs on:

```text
http://localhost:5173
```

---

## Testing

Postman can be used to test backend APIs.

Examples of APIs that can be tested:

```text
Signup
Login
Get Coffees
Get Coffee Details
Favorites
Profile Update
Password Update
Place Order
Admin APIs
```

The MySQL database can also be checked directly using SQL queries to verify users, favorites, orders, and order items.

---

## Security

The project includes several basic security practices:

- Password hashing
- JWT authentication
- Protected routes
- Admin authorization middleware
- Environment variables for secrets
- Database validation
- Server-side order price verification
- MySQL transactions for order creation
- `.gitignore` protection for secret files

---

## Future Improvements

Possible future improvements include:

- Real AI-powered coffee recommendations
- Payment gateway integration
- Email order notifications
- Product reviews and ratings
- Advanced recommendation model
- Cloud database
- Production deployment
- More advanced analytics
- Image optimization
- Automated testing

---

## Learning Goals

This project was built to practice real-world software development concepts including:

- React component architecture
- React Router
- REST APIs
- Node.js and Express
- MySQL database design
- CRUD operations
- Authentication and authorization
- JWT
- Password hashing
- API integration
- Database transactions
- Admin dashboards
- Data visualization
- Git and GitHub
- Full-stack application development

---

## Author

**Maham**

BS Software Engineering Student

Interested in:

- Artificial Intelligence
- Machine Learning
- Software Engineering
- Full-Stack Development
- Database Systems

---

## License

This project is developed for educational and portfolio purposes.