const express = require('express');
const router = express.Router();
const prisma = require('../db');
const { verifyToken, verifyRole } = require('../middleware/auth');

router.use(verifyToken);
router.use(verifyRole(['NORMAL', 'ADMIN', 'STORE_OWNER'])); // Anyone logged in ideally can view stores

// List all stores
router.get('/stores', async (req, res) => {
    try {
        const { search } = req.query; // search by Name/Address

        const whereClause = search ? {
            OR: [
                { name: { contains: search, mode: 'insensitive' } },
                { address: { contains: search, mode: 'insensitive' } }
            ]
        } : {};

        const stores = await prisma.store.findMany({
            where: whereClause,
            include: {
                ratings: true
            }
        });

        // Calculate average and user's specific rating
        const result = stores.map(store => {
            const sum = store.ratings.reduce((acc, curr) => acc + curr.value, 0);
            const avgRating = store.ratings.length ? (sum / store.ratings.length).toFixed(1) : 'No Rating';
            const userRating = store.ratings.find(r => r.userId === req.user.id);

            return {
                id: store.id,
                name: store.name,
                address: store.address,
                avgRating,
                myRating: userRating ? userRating.value : null
            };
        });

        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Submit or Modify rating
router.post('/rate', async (req, res) => {
    try {
        const { storeId, value } = req.body;
        
        if (value < 1 || value > 5) {
            return res.status(400).json({ error: 'Rating must be between 1 and 5' });
        }

        const existingRating = await prisma.rating.findUnique({
            where: {
                userId_storeId: {
                    userId: req.user.id,
                    storeId: parseInt(storeId)
                }
            }
        });

        if (existingRating) {
            // Modify rating
            const updated = await prisma.rating.update({
                where: { id: existingRating.id },
                data: { value: parseInt(value) }
            });
            return res.json({ message: 'Rating updated', rating: updated });
        } else {
            // New rating
            const newRating = await prisma.rating.create({
                data: {
                    value: parseInt(value),
                    userId: req.user.id,
                    storeId: parseInt(storeId)
                }
            });
            return res.status(201).json({ message: 'Rating submitted', rating: newRating });
        }

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
