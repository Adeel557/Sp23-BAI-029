const express = require('express');
const Product = require('../models/Product');
const router = express.Router();

// Home page
router.get('/', (req, res) => {
    res.render('ecom', {
        title: 'Home',
        user: req.session.user || null
    });
});

// Shop page
router.get('/shop', async (req, res) => {
    try {
        const products = await Product.find();
        res.render('shop', {
            title: 'Shop',
            products,
            user: req.session.user || null
        });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.render('shop', {
            title: 'Shop',
            products: [],
            error: 'Error loading products',
            user: req.session.user || null
        });
    }
});

module.exports = router; 