const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
const bcrypt = require('bcrypt');
const path = require('path');
const mongoose = require('mongoose');
const { isAuthenticated, isNotAuthenticated, isAdmin } = require('./middleware/auth');
const User = require('./models/User');
const Order = require('./models/Order');
const Cart = require('./models/Cart');
const Product = require('./models/Product');

// Import routers
const authRouter = require('./controllers/auth');
const cartRouter = require('./controllers/cart');
const checkoutRouter = require('./controllers/checkout');
const ordersRouter = require('./controllers/orders');
const adminRouter = require('./controllers/admin');
const shopRouter = require('./controllers/shop');

const app = express();

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/Ecommerce', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('MongoDB connection error:', err);
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Session configuration
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: false,
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// View engine setup
app.use(expressLayouts);
app.set('layout', 'main');
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Cart middleware
app.use(async (req, res, next) => {
    if (req.session.user) {
        try {
            let cart = await Cart.findOne({ user: req.session.user.id })
                .populate('items.product');
            
            if (!cart) {
                cart = new Cart({ user: req.session.user.id });
                await cart.save();
            }
            
            res.locals.cart = cart;
        } catch (error) {
            console.error('Cart middleware error:', error);
        }
    }
    next();
});

// Use routers
app.use(authRouter);
app.use(cartRouter);
app.use(checkoutRouter);
app.use(ordersRouter);
app.use(adminRouter);
app.use(shopRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
