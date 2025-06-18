const express = require('express');
const { isAuthenticated, isAdmin } = require('../middleware/auth');
const router = express.Router();
const Product = require('../models/Product');

// Admin dashboard
router.get('/admin', isAuthenticated, isAdmin, (req, res) => {
    res.render('admin/dashboard', {
        title: 'Admin Dashboard',
        user: req.session.user
    });
});

// Add product form
router.get('/admin/products/add', isAuthenticated, isAdmin, (req, res) => {
    res.render('admin/product_form', {
        title: 'Add New Product',
        product: null,
        user: req.session.user
    });
});

// Admin products list
router.get('/admin/products', isAuthenticated, isAdmin, async (req, res) => {
    try {
        const products = await Product.find();
        res.render('admin/products', {
            title: 'Manage Products',
            products,
            user: req.session.user
        });
    } catch (error) {
        console.error('Error fetching products for admin:', error);
        res.render('admin/products', {
            title: 'Manage Products',
            products: [],
            error: 'Error loading products',
            user: req.session.user
        });
    }
});

module.exports = router; 