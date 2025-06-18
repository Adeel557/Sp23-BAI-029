const express = require('express');
const Complaint = require('../models/complaint');
const Order = require('../models/Order');
const { isAuthenticated, isAdmin } = require('../middleware/auth');
const router = express.Router();

// User: Contact Us / Submit Complaint page
router.get('/contact', isAuthenticated, async (req, res) => {
    try {
        // Get user's orders for the dropdown
        const orders = await Order.find({ user: req.session.user.id })
            .select('_id createdAt totalAmount')
            .sort({ createdAt: -1 });
        
        res.render('complaint', {
            title: 'Contact Us',
            orders,
            user: req.session.user
        });
    } catch (error) {
        console.error('Error loading contact page:', error);
        res.render('complaint', {
            title: 'Contact Us',
            orders: [],
            error: 'Error loading orders',
            user: req.session.user
        });
    }
});

// User: Submit complaint
router.post('/contact', isAuthenticated, async (req, res) => {
    try {
        const { orderId, message } = req.body;
        
        // Validate input
        if (!orderId || !message) {
            return res.render('complaint', {
                title: 'Contact Us',
                orders: await Order.find({ user: req.session.user.id }).select('_id createdAt totalAmount').sort({ createdAt: -1 }),
                error: 'Please fill in all fields',
                user: req.session.user
            });
        }
        
        // Check if order exists and belongs to user
        const order = await Order.findOne({ _id: orderId, user: req.session.user.id });
        if (!order) {
            return res.render('complaint', {
                title: 'Contact Us',
                orders: await Order.find({ user: req.session.user.id }).select('_id createdAt totalAmount').sort({ createdAt: -1 }),
                error: 'Invalid order ID',
                user: req.session.user
            });
        }
        
        // Create complaint
        const complaint = new Complaint({
            user: req.session.user.id,
            order: orderId,
            message: message.trim()
        });
        
        await complaint.save();
        
        res.redirect('/my-complaints?success=true');
    } catch (error) {
        console.error('Error submitting complaint:', error);
        res.render('complaint', {
            title: 'Contact Us',
            orders: await Order.find({ user: req.session.user.id }).select('_id createdAt totalAmount').sort({ createdAt: -1 }),
            error: 'Error submitting complaint. Please try again.',
            user: req.session.user
        });
    }
});

// User: View their complaints
router.get('/my-complaints', isAuthenticated, async (req, res) => {
    try {
        const complaints = await Complaint.find({ user: req.session.user.id })
            .populate('order', 'totalAmount createdAt')
            .sort({ createdAt: -1 });
        
        res.render('my-complaints', {
            title: 'My Complaints',
            complaints,
            user: req.session.user,
            success: req.query.success ? 'Complaint submitted successfully!' : undefined
        });
    } catch (error) {
        console.error('Error fetching complaints:', error);
        res.render('my-complaints', {
            title: 'My Complaints',
            complaints: [],
            error: 'Error fetching complaints',
            user: req.session.user
        });
    }
});

// Admin: View all complaints
router.get('/admin/complaints', isAuthenticated, isAdmin, async (req, res) => {
    try {
        const complaints = await Complaint.find()
            .populate('user', 'fullName email')
            .populate('order', 'totalAmount createdAt')
            .sort({ createdAt: -1 });
        
        res.render('admin/complaints', {
            title: 'Manage Complaints',
            complaints,
            user: req.session.user
        });
    } catch (error) {
        console.error('Error fetching complaints for admin:', error);
        res.render('admin/complaints', {
            title: 'Manage Complaints',
            complaints: [],
            error: 'Error loading complaints',
            user: req.session.user
        });
    }
});

// Admin: Update complaint status
router.post('/admin/complaints/:id/status', isAuthenticated, isAdmin, async (req, res) => {
    try {
        const { status } = req.body;
        const complaintId = req.params.id;
        
        if (!['pending', 'in-progress', 'resolved'].includes(status)) {
            return res.status(400).json({ error: 'Invalid status' });
        }
        
        await Complaint.findByIdAndUpdate(complaintId, { status });
        
        res.redirect('/admin/complaints?success=true');
    } catch (error) {
        console.error('Error updating complaint status:', error);
        res.redirect('/admin/complaints?error=true');
    }
});

module.exports = router; 