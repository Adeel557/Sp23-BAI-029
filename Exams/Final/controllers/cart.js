const express = require('express');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { isAuthenticated } = require('../middleware/auth');
const router = express.Router();

// Add to cart
router.post('/cart/add/:productId', isAuthenticated, async (req, res) => {
    try {
        const { productId } = req.params;
        const { quantity = 1 } = req.body;
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        let cart = await Cart.findOne({ user: req.session.user.id });
        if (!cart) {
            cart = new Cart({ user: req.session.user.id });
        }
        const existingItem = cart.items.find(item => item.product.toString() === productId);
        if (existingItem) {
            existingItem.quantity += parseInt(quantity);
        } else {
            cart.items.push({
                product: productId,
                quantity: parseInt(quantity),
                price: product.price
            });
        }
        cart.totalAmount = cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
        await cart.save();
        res.redirect('/cart');
    } catch (error) {
        console.error('Add to cart error:', error);
        res.status(500).json({ error: 'Error adding to cart' });
    }
});

// Update cart
router.post('/cart/update/:productId', isAuthenticated, async (req, res) => {
    try {
        const { productId } = req.params;
        const { quantity } = req.body;
        const cart = await Cart.findOne({ user: req.session.user.id });
        if (!cart) {
            return res.status(404).json({ error: 'Cart not found' });
        }
        const item = cart.items.find(item => item.product.toString() === productId);
        if (item) {
            item.quantity = parseInt(quantity);
            cart.totalAmount = cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
            await cart.save();
        }
        res.redirect('/cart');
    } catch (error) {
        console.error('Update cart error:', error);
        res.status(500).json({ error: 'Error updating cart' });
    }
});

// Remove from cart
router.post('/cart/remove/:productId', isAuthenticated, async (req, res) => {
    try {
        const { productId } = req.params;
        const cart = await Cart.findOne({ user: req.session.user.id });
        if (!cart) {
            return res.status(404).json({ error: 'Cart not found' });
        }
        cart.items = cart.items.filter(item => item.product.toString() !== productId);
        cart.totalAmount = cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
        await cart.save();
        res.redirect('/cart');
    } catch (error) {
        console.error('Remove from cart error:', error);
        res.status(500).json({ error: 'Error removing from cart' });
    }
});

// View cart
router.get('/cart', isAuthenticated, async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.session.user.id }).populate('items.product');
        res.render('cart', {
            title: 'Shopping Cart',
            cart,
            user: req.session.user
        });
    } catch (error) {
        console.error('Cart view error:', error);
        res.render('cart', {
            title: 'Shopping Cart',
            error: 'Error loading cart',
            user: req.session.user
        });
    }
});

module.exports = router; 