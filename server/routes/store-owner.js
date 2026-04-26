const express = require('express');
const router = express.Router();
const prisma = require('../db');
const { verifyToken, verifyRole } = require('../middleware/auth');

router.use(verifyToken);
router.use(verifyRole(['STORE_OWNER']));

router.get('/dashboard', async (req, res) => {
    try {
        const store = await prisma.store.findUnique({
            where: { ownerId: req.user.id },
            include: {
                ratings: {
                    include: {
                        user: {
                            select: { id: true, name: true, email: true }
                        }
                    }
                }
            }
        });

        if (!store) {
            return res.status(404).json({ error: 'You do not own any store.' });
        }

        const sum = store.ratings.reduce((acc, curr) => acc + curr.value, 0);
        const avgRating = store.ratings.length ? (sum / store.ratings.length).toFixed(1) : 'No Rating';

        res.json({
            storeName: store.name,
            avgRating,
            totalRatings: store.ratings.length,
            ratings: store.ratings.map(r => ({
                value: r.value,
                user: r.user.name,
                email: r.user.email,
                date: r.createdAt
            }))
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
