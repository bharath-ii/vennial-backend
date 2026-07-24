const express = require('express');
const router = express.Router();
const { db } = require('../config/firebase');

const COLLECTION = 'model_enquiries';

// @desc    Create a new model enquiry
// @route   POST /api/enquiries
// @access  Public
router.post('/', async (req, res) => {
    try {
        const { modelName, itemNeeded, photo, description, userName, userPhone, userId } = req.body;

        if (!modelName || !itemNeeded) {
            return res.status(400).json({ 
                success: false, 
                message: 'Model Name and Item Needed are required.' 
            });
        }

        const newEnquiry = {
            modelName,
            itemNeeded,
            photo: photo || '',
            description: description || '',
            userName: userName || 'Customer',
            userPhone: userPhone || '',
            userId: userId || '',
            status: 'PENDING',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        const docRef = await db.collection(COLLECTION).add(newEnquiry);
        res.status(201).json({ 
            success: true, 
            id: docRef.id, 
            enquiry: { id: docRef.id, ...newEnquiry } 
        });
    } catch (err) {
        console.error('Error creating enquiry:', err);
        res.status(500).json({ success: false, message: err.message });
    }
});

// @desc    Get all model enquiries (for Admin)
// @route   GET /api/enquiries
// @access  Public
router.get('/', async (req, res) => {
    try {
        const snapshot = await db.collection(COLLECTION).get();
        const enquiries = [];
        snapshot.forEach(doc => {
            enquiries.push({ id: doc.id, ...doc.data() });
        });

        // Sort descending by createdAt
        enquiries.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        res.json(enquiries);
    } catch (err) {
        console.error('Error fetching enquiries:', err);
        res.status(500).json({ success: false, message: err.message });
    }
});

// @desc    Update enquiry status
// @route   PUT /api/enquiries/:id
// @access  Public
router.put('/:id', async (req, res) => {
    try {
        const { status, note } = req.body;
        const updateData = {
            updatedAt: new Date().toISOString()
        };
        if (status) updateData.status = status;
        if (note !== undefined) updateData.adminNote = note;

        await db.collection(COLLECTION).doc(req.params.id).update(updateData);
        res.json({ success: true, message: 'Enquiry updated successfully' });
    } catch (err) {
        console.error('Error updating enquiry:', err);
        res.status(400).json({ success: false, message: err.message });
    }
});

// @desc    Delete an enquiry
// @route   DELETE /api/enquiries/:id
// @access  Public
router.delete('/:id', async (req, res) => {
    try {
        await db.collection(COLLECTION).doc(req.params.id).delete();
        res.json({ success: true, message: 'Enquiry deleted successfully' });
    } catch (err) {
        console.error('Error deleting enquiry:', err);
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;
