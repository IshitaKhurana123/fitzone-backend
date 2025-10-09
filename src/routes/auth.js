const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Import all the user models
const Admin = require('../models/Admin');
const Member = require('../models/Member');
const Trainer = require('../models/Trainer');

// The main login route
router.post('/login', async (req, res) => {
    const { username, password, role } = req.body;

    // Basic validation
    if (!username || !password || !role) {
        return res.status(400).json({ message: 'Username, password, and role are required.' });
    }

    try {
        let user;
        let UserModel;

        // Determine which model to use based on the selected role
        switch (role) {
            case 'admin':
                UserModel = Admin;
                break;
            case 'member':
                UserModel = Member;
                break;
            case 'trainer':
                UserModel = Trainer;
                break;
            default:
                return res.status(400).json({ message: 'Invalid role specified.' });
        }

        // Find the user by username in the correct collection
        // We use .select('+password') because the password field is hidden by default in the model
        if (role === 'member') {
            user = await UserModel.findOne({ username }).populate('assignedTrainer', 'name specialization phone');
        } else if (role === 'trainer') {
             user = await UserModel.findOne({ username }).populate('assignedMembers', 'name plan attendance');
        } else {
             user = await UserModel.findOne({ username });
        }
        

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Compare the provided password with the hashed password in the database
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials.' });
        }

        // If credentials are correct, create a JWT payload
        const payload = {
            id: user._id,
            role: role
        };

        // Sign the token with the secret key, making it valid for 1 day
        const token = jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );
        
        // Prepare user object to be sent back, removing the password
        const userResponse = user.toObject();
        delete userResponse.password;

        // Send back the token and user info
        res.json({
            message: 'Logged in successfully!',
            token,
            user: userResponse,
            role
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;

