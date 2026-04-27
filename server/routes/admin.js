// Admin routes
const express = require('express');
const router = express.Router();
const prisma = require('../db');
const { verifyToken, verifyRole } = require('../middleware/auth');

// Apply middleware to all admin routes
router.use(verifyToken);
router.use(verifyRole(['ADMIN']));

// Admin Dashboard stats
router.get('/dashboard', async (req, res) => {
    try {
        const totalUsers = await prisma.user.count();
        const totalStores = await prisma.store.count();
        const totalRatings = await prisma.rating.count();

        res.json({ totalUsers, totalStores, totalRatings });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get users
router.get('/users', async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: { 
                id: true, name: true, email: true, address: true, role: true, createdAt: true,
                store: {
                    include: { ratings: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        const usersWithRatings = users.map(user => {
            let storeRating = null;
            if (user.role === 'STORE_OWNER' && user.store) {
                const sum = user.store.ratings.reduce((acc, curr) => acc + curr.value, 0);
                storeRating = user.store.ratings.length ? (sum / user.store.ratings.length).toFixed(1) : 'No Rating';
            }
            // Remove the raw store object to keep response clean
            const { store, ...rest } = user;
            return { ...rest, storeRating };
        });

        res.json(usersWithRatings);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get stores
router.get('/stores', async (req, res) => {
    try {
        const stores = await prisma.store.findMany({
            include: {
                ratings: true
            },
            orderBy: { createdAt: 'desc' }
        });

        // Calculate average rating for each store
        const storesWithAvgRating = stores.map(store => {
            const sum = store.ratings.reduce((acc, curr) => acc + curr.value, 0);
            const avgRating = store.ratings.length ? (sum / store.ratings.length).toFixed(1) : 'No Rating';
            return {
                id: store.id,
                name: store.name,
                address: store.address,
                avgRating
            };
        });

        res.json(storesWithAvgRating);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Add store (Admin action)
router.post('/stores', async (req, res) => {
    try {
        const { name, email, address, ownerId } = req.body;
        
        // Ensure the assigned owner exists
        const owner = await prisma.user.findUnique({ where: { id: ownerId } });
        if (!owner) return res.status(404).json({ error: 'Owner not found!' });

        // A user can only own one store in our schema design
        const existingStoreForOwner = await prisma.store.findUnique({ where: { ownerId } });
        if(existingStoreForOwner) return res.status(400).json({ error: 'User already owns a store!' });

        const store = await prisma.store.create({
            data: { name, email: email || 'default@store.com', address, ownerId }
        });

        // Ensure owner is a STORE_OWNER
        if (owner.role !== 'STORE_OWNER') {
            await prisma.user.update({
                where: { id: ownerId },
                data: { role: 'STORE_OWNER' }
            });
        }

        res.status(201).json(store);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
