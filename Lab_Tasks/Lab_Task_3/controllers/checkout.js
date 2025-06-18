const express = require('express');
const Cart = require('../models/Cart');
const Order = require('../models/Order');
const { isAuthenticated } = require('../middleware/auth');
const router = express.Router();

// GET checkout page
router.get('/checkout', isAuthenticated, async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.session.user.id }).populate('items.product');
        if (!cart || cart.items.length === 0) {
            return res.redirect('/cart');
        }
        res.render('checkout', {
            title: 'Checkout',
            cart,
            user: req.session.user
        });
    } catch (error) {
        console.error('Checkout error:', error);
        res.render('checkout', {
            title: 'Checkout',
            error: 'Error processing checkout',
            user: req.session.user
        });
    }
});

// POST checkout (place order)
router.post('/checkout', isAuthenticated, async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.session.user.id }).populate('items.product');
        if (!cart || cart.items.length === 0) {
            return res.redirect('/cart');
        }
        const { fullName, email, phone, address, city, postalCode } = req.body;
        // Create order
        const order = new Order({
            user: req.session.user.id,
            items: cart.items.map(item => ({
                product: item.product._id,
                quantity: item.quantity,
                price: item.price
            })),
            totalAmount: cart.totalAmount,
            shippingAddress: {
                fullName,
                email,
                phone,
                address,
                city,
                postalCode
            }
        });
        await order.save();
        // Clear cart
        cart.items = [];
        cart.totalAmount = 0;
        await cart.save();
        res.redirect('/my-orders?success=true');
    } catch (error) {
        console.error('Checkout POST error:', error);
        res.render('checkout', {
            title: 'Checkout',
            error: 'Error placing order',
            user: req.session.user
        });
    }
});

module.exports = router; 