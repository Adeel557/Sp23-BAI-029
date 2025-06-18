const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const { isNotAuthenticated } = require('../middleware/auth');
const router = express.Router();

// Login page
router.get('/login', isNotAuthenticated, (req, res) => {
    res.render('login', {
        title: 'Login',
        user: null,
        registered: req.query.registered
    });
});

// Register page
router.get('/register', isNotAuthenticated, (req, res) => {
    res.render('register', {
        title: 'Register',
        user: null
    });
});

// Login handler
router.post('/login', isNotAuthenticated, async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.render('login', {
                title: 'Login',
                error: 'Invalid email or password',
                user: null
            });
        }
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.render('login', {
                title: 'Login',
                error: 'Invalid email or password',
                user: null
            });
        }
        req.session.user = {
            id: user._id,
            fullName: user.fullName,
            email: user.email,
            isAdmin: user.isAdmin
        };
        res.redirect('/');
    } catch (error) {
        console.error('Login error:', error);
        res.render('login', {
            title: 'Login',
            error: 'An error occurred during login',
            user: null
        });
    }
});

// Register handler
router.post('/register', isNotAuthenticated, async (req, res) => {
    try {
        const { fullName, email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.render('register', {
                title: 'Register',
                error: 'Email already registered',
                user: null
            });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            fullName,
            email,
            password: hashedPassword
        });
        await user.save();
        res.redirect('/login?registered=true');
    } catch (error) {
        console.error('Registration error:', error);
        res.render('register', {
            title: 'Register',
            error: 'An error occurred during registration',
            user: null
        });
    }
});

// Logout
router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
        }
        res.redirect('/login');
    });
});

module.exports = router; 