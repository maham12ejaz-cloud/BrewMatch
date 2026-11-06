/* global require, module */

const express = require('express');

const router = express.Router();

const {
    getAllCoffees,
    getCoffeeById,
    addCoffee,
    updateCoffee,
    deleteCoffee
} = require('../controllers/coffeeController');

// GET all coffees
router.get('/', getAllCoffees);

// GET coffee by ID
router.get('/:id', getCoffeeById);

// POST add new coffee
router.post('/', addCoffee);

// PUT update existing coffee
router.put('/:id', updateCoffee);

// DELETE coffee by ID
router.delete('/:id', deleteCoffee);

module.exports = router;
