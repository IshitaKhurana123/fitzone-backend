const express = require('express');
const router = express.Router();
const Trainer = require('../models/Trainer');
const Member = require('../models/Member');
const bcrypt = require('bcryptjs');

// GET all trainers
router.get('/', async (req, res) => {
    try {
        // Populate assignedMembers to get their details, selecting only necessary fields
        const trainers = await Trainer.find().populate('assignedMembers', 'name plan attendance');
        res.json(trainers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST a new trainer
router.post('/', async (req, res) => {
    const { name, username, password, specialization, experience, phone } = req.body;

    // Basic validation
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required.' });
    }

    try {
        // Check if username already exists
        const existingTrainer = await Trainer.findOne({ username });
        if (existingTrainer) {
            return res.status(400).json({ message: 'Username already taken.' });
        }

        // Hash the password before saving
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newTrainer = new Trainer({
            name,
            username,
            password: hashedPassword,
            specialization,
            experience,
            phone,
        });

        const savedTrainer = await newTrainer.save();
        // Don't send the password back in the response
        const trainerResponse = savedTrainer.toObject();
        delete trainerResponse.password;
        
        res.status(201).json(trainerResponse);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// UPDATE a trainer
router.put('/:id', async (req, res) => {
    try {
        // If password is being updated, it needs to be hashed
        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            req.body.password = await bcrypt.hash(req.body.password, salt);
        }

        const updatedTrainer = await Trainer.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedTrainer) {
            return res.status(404).json({ message: "Trainer not found" });
        }
        
        const trainerResponse = updatedTrainer.toObject();
        delete trainerResponse.password;

        res.json(trainerResponse);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE a trainer
router.delete('/:id', async (req, res) => {
    try {
        const trainer = await Trainer.findByIdAndDelete(req.params.id);
        if(!trainer) {
            return res.status(404).json({ message: 'Trainer not found' });
        }
        // Also unassign this trainer from any members
        await Member.updateMany({ assignedTrainer: req.params.id }, { $unset: { assignedTrainer: "" } });
        
        res.json({ message: 'Trainer deleted successfully and unassigned from members' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;

