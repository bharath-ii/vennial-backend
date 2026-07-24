const express = require('express');
const { db } = require('../config/firebase');
const { protect, authorize } = require('../middleware/auth');
const { client } = require('../config/redis');

const router = express.Router();
const productsCol = db.collection('products');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
router.get('/', async (req, res) => {
    try {
        const { category } = req.query;
        const cacheKey = `products_${category || 'all'}`;

        // Try to get from Redis (with fallback if Redis is down)
        try {
            if (client.isOpen) {
                const cachedProducts = await client.get(cacheKey);
                if (cachedProducts) {
                    res.setHeader('X-Cache', 'HIT');
                    return res.status(200).json(JSON.parse(cachedProducts));
                }
            }
        } catch (redisError) {
            console.error('Redis GET error:', redisError);
        }

        res.setHeader('X-Cache', 'MISS');

        let snapshot;
        if (category) {
            let categoryList = [category];
            if (category === 'Temper') categoryList.push('Screen Guard');
            if (category === 'Combo Folder') categoryList.push('Combo/Display');
            if (category === 'Frame') categoryList.push('Center Panel');
            if (category === 'Back Case') categoryList.push('Phone Case');

            if (categoryList.length > 1) {
                snapshot = await productsCol.where('category', 'in', categoryList).get();
            } else {
                snapshot = await productsCol.where('category', '==', category).get();
            }
        } else {
            snapshot = await productsCol.get();
        }

        let products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Sort in-memory to avoid FAILED_PRECONDITION (missing index)
        products.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        // Save to Redis (expire in 1 hour)
        try {
            if (client.isOpen) {
                await client.setEx(cacheKey, 3600, JSON.stringify(products));
            }
        } catch (redisError) {
            console.error('Redis SET error:', redisError);
        }

        res.status(200).json(products);
    } catch (error) {
        console.error('API Error:', error);
        res.status(500).json({ 
            success: false, 
            message: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

// @desc    Create product
// @route   POST /api/products
// @access  Private/Admin
router.post('/', async (req, res) => {
    try {
        const productData = {
            ...req.body,
            createdAt: new Date().toISOString()
        };
        const docRef = await productsCol.add(productData);
        const newProduct = { id: docRef.id, ...productData };

        // Clear cache in background (non-blocking)
        if (client.isOpen) {
            client.keys('products_*')
                .then(keys => { if (keys && keys.length > 0) return client.del(keys); })
                .catch(err => console.error('Redis CACHE CLEAR error:', err));
        }

        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await productsCol.doc(id).update(req.body);

        // Clear cache in background (non-blocking)
        if (client.isOpen) {
            client.keys('products_*')
                .then(keys => { if (keys && keys.length > 0) return client.del(keys); })
                .catch(err => console.error('Redis CACHE CLEAR error:', err));
        }

        res.status(200).json({ success: true, message: 'Product updated' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await productsCol.doc(id).delete();

        // Clear cache in background (non-blocking)
        if (client.isOpen) {
            client.keys('products_*')
                .then(keys => { if (keys && keys.length > 0) return client.del(keys); })
                .catch(err => console.error('Redis CACHE CLEAR error:', err));
        }

        res.status(200).json({ success: true, message: 'Product deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
