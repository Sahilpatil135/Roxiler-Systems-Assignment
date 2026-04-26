const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../db');
const { verifyToken } = require('../middleware/auth');

// Signup logic
router.post('/signup', async (req, res) => {
    try {
        const { name, email, password, address, role } = req.body;

        // Basic validation
        if (!name || name.length < 20 || name.length > 60) {
            return res.status(400).json({ error: 'Name must be between 20 and 60 characters.' });
        }
        if (!address || address.length > 400) {
            return res.status(400).json({ error: 'Address is required and must be max 400 characters.' });
        }
        const passRegex = /^(?=.*[A-Z])(?=.*[!@#\\$%\\^&\\*])(?=.{8,16})/;
        if (!passRegex.test(password)) {
            return res.status(400).json({ error: 'Password must be 8-16 chars, 1 uppercase, 1 special character.' });
        }

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already in use.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                address,
                role: role || 'NORMAL',
            }
        });

        res.status(201).json({ message: 'User created successfully', userId: newUser.id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET || 'supersecretjwtkey',
            { expiresIn: '1d' }
        );

        res.json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Update Password
router.post('/update-password', verifyToken, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await prisma.user.findUnique({ where: { id: req.user.id } });

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Incorrect current password.' });
        }

        const passRegex = /^(?=.*[A-Z])(?=.*[!@#\\$%\\^&\\*])(?=.{8,16})/;
        if (!passRegex.test(newPassword)) {
            return res.status(400).json({ error: 'New password does not meet criteria.' });
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        await prisma.user.update({
            where: { id: req.user.id },
            data: { password: hashedNewPassword }
        });

        res.json({ message: 'Password updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
