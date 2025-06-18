const mongoose = require('mongoose');
const Product = require('../models/Product');

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/ecommerce', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('MongoDB connection error:', err);
});

const products = [
    {
        name: 'Organic Cotton Dungarees',
        description: 'Comfortable and sustainable organic cotton dungarees',
        price: 65.00,
        image: '/images/WK_31_-_LATEST_DROPS_-_THURS.webp'
    },
    {
        name: 'Recycled Denim Jacket',
        description: 'Stylish jacket made from recycled denim',
        price: 85.00,
        image: '/images/WK_30_MWMY_EDIT.webp'
    },
    {
        name: 'Organic Cotton T-Shirt',
        description: 'Soft and breathable organic cotton t-shirt',
        price: 35.00,
        image: '/images/WK_29_CAT_7.jpg'
    },
    {
        name: 'Recycled Denim Jeans',
        description: 'Classic jeans made from recycled denim',
        price: 75.00,
        image: '/images/WK_27_CAT_7.jpg'
    },
    {
        name: 'Organic Cotton Dress',
        description: 'Elegant dress made from organic cotton',
        price: 55.00,
        image: '/images/WK31_-_SPRING_PRINTS_EDIT.webp'
    },
    {
        name: 'Recycled Wool Sweater',
        description: 'Warm and cozy sweater made from recycled wool',
        price: 95.00,
        image: '/images/HOMEPAGE-6.jpg'
    }
];

const seedProducts = async () => {
    try {
        // Clear existing products
        await Product.deleteMany({});
        
        // Insert new products
        await Product.insertMany(products);
        
        console.log('Products seeded successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding products:', error);
        process.exit(1);
    }
};

seedProducts(); 