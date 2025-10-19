const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

// Import your MongoDB models
const Admin = require('../models/Admin');
const Member = require('../models/Member');
const Trainer = require('../models/Trainer');

// POST /api/auth/login
// This route now checks all 3 user collections
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ success: false, message: 'Username and password required' });
    }

    try {
        // 1. Check if it's an Admin
        const admin = await Admin.findOne({ username });
        if (admin) {
            const match = bcrypt.compareSync(password, admin.password);
            if (match) {
                // Successful admin login
                // Convert to object and remove password before sending
                const user = admin.toObject();
                delete user.password;
                return res.json({ success: true, role: 'admin', user: user });
            }
        }

        // 2. Check if it's a Trainer
        const trainer = await Trainer.findOne({ username });
        if (trainer) {
            const match = bcrypt.compareSync(password, trainer.password);
            if (match) {
                // Successful trainer login
                const user = trainer.toObject();
                delete user.password;
                return res.json({ success: true, role: 'trainer', user: user });
            }
        }

        // 3. Check if it's a Member
        const member = await Member.findOne({ username });
        if (member) {
            const match = bcrypt.compareSync(password, member.password);
            if (match) {
                // Successful member login
                const user = member.toObject();
                delete user.password;
                return res.json({ success: true, role: 'member', user: user });
            }
        }

        // 4. If no user was found in any collection
        return res.status(401).json({ success: false, message: 'Invalid credentials' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// POST /api/auth/register (Registers a new MEMBER)
// I updated this to work with your Member model
router.post('/register', async (req, res) => {
    // Member model requires more fields
    const { name, username, password, email, phone, plan } = req.body;
    
    if (!username || !password || !name || !email || !phone || !plan) {
        return res.status(400).json({ message: 'All fields are required: name, username, password, email, phone, plan' });
    }

    try {
        // Check if username or email already exists
        const existingUser = await Member.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).json({ message: 'Username or email already exists' });
        }

        // Hash the password
        const hashedPassword = bcrypt.hashSync(password, 10);

        // Create new member
        const newMember = new Member({
            name,
            username,
            password: hashedPassword,
            email,
            phone,
            plan,
            joinDate: new Date() // Set join date on creation
        });

        await newMember.save();

        res.status(201).json({ message: 'Member registered successfully' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;