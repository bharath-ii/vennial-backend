const express = require('express');
const { db } = require('../config/firebase');
const router = express.Router();

const notificationsCol = db.collection('notifications');

router.get('/', async (req, res) => {
    try {
        const snapshot = await notificationsCol.orderBy('createdAt', 'desc').get();
        const notifications = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.status(200).json({ success: true, notifications });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const { title, message, icon, color } = req.body;
        if (!title || !message) return res.status(400).json({ success: false, message: 'Title and message are required.' });
        const notif = { title, message, icon: icon || 'bell', color: color || '#00b894', likedBy: [], likeCount: 0, createdAt: new Date().toISOString() };
        const docRef = await notificationsCol.add(notif);
        res.status(201).json({ success: true, id: docRef.id, notification: { id: docRef.id, ...notif } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.post('/:id/like', async (req, res) => {
    try {
        const { userId } = req.body;
        const { id } = req.params;
        if (!userId) return res.status(400).json({ success: false, message: 'userId is required.' });
        const docRef = notificationsCol.doc(id);
        const doc = await docRef.get();
        if (!doc.exists) return res.status(404).json({ success: false, message: 'Notification not found.' });
        const data = doc.data();
        const likedBy = data.likedBy || [];
        const alreadyLiked = likedBy.includes(userId);
        const updatedLikedBy = alreadyLiked ? likedBy.filter(uid => uid !== userId) : [...likedBy, userId];
        await docRef.update({ likedBy: updatedLikedBy, likeCount: updatedLikedBy.length });
        res.status(200).json({ success: true, liked: !alreadyLiked, likeCount: updatedLikedBy.length });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        await notificationsCol.doc(req.params.id).delete();
        res.status(200).json({ success: true, message: 'Notification deleted.' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
