const express = require('express');
const Order = require('../models/Order');
const { isAuthenticated, isAdmin } = require('../middleware/auth');
const router = express.Router();

// User orders
router.get('/my-orders', isAuthenticated, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.session.user.id })
            .populate('items.product')
            .sort({ createdAt: -1 });
        res.render('orders', {
            title: 'My Orders',
            orders,
            user: req.session.user,
            success: req.query.success ? 'Order placed successfully!' : undefined
        });
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.render('orders', {
            title: 'My Orders',
            orders: [],
            error: 'Error fetching orders',
            user: req.session.user
        });
    }
});

// Admin orders
router.get('/admin/orders', isAuthenticated, isAdmin, async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('user', 'fullName email')
            .populate('items.product', 'name image')
            .sort({ createdAt: -1 });
        res.render('admin/orders', {
            title: 'Manage Orders',
            orders,
            user: req.session.user
        });
    } catch (error) {
        console.error('Error fetching orders for admin:', error);
        res.render('admin/orders', {
            title: 'Manage Orders',
            orders: [],
            error: 'Error loading orders',
            user: req.session.user
        });
    }
});

module.exports = router; 