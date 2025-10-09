const express = require('express');
const router = express.Router();
const Member = require('../models/Member');
const Trainer = require('../models/Trainer');
const bcrypt = require('bcryptjs');

// GET all members
router.get('/', async (req, res) => {
    try {
        // Populate assignedTrainer to get the trainer's name for display
        const members = await Member.find().populate('assignedTrainer', 'name specialization');
        res.json(members);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST a new member
router.post('/', async (req, res) => {
    const { name, username, password, email, phone, plan } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required.' });
    }

    try {
        const existingMember = await Member.findOne({ username });
        if (existingMember) {
            return res.status(400).json({ message: 'Username already taken.' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newMember = new Member({
            name,
            username,
            password: hashedPassword,
            email,
            phone,
            plan
        });

        const savedMember = await newMember.save();
        const memberResponse = savedMember.toObject();
        delete memberResponse.password;

        res.status(201).json(memberResponse);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// UPDATE a member
router.put('/:id', async (req, res) => {
    const { assignedTrainer } = req.body;

    try {
        const member = await Member.findById(req.params.id);
        if (!member) {
            return res.status(404).json({ message: "Member not found" });
        }

        const oldTrainerId = member.assignedTrainer;

        // If password is being updated, hash it
        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            req.body.password = await bcrypt.hash(req.body.password, salt);
        }
        
        const updatedMember = await Member.findByIdAndUpdate(req.params.id, req.body, { new: true });

        // Logic to update trainer's assigned members list
        if (assignedTrainer && oldTrainerId?.toString() !== assignedTrainer) {
            // Add member to new trainer's list
            await Trainer.findByIdAndUpdate(assignedTrainer, { $addToSet: { assignedMembers: member._id } });
        }
        if (oldTrainerId && oldTrainerId.toString() !== assignedTrainer) {
            // Remove member from old trainer's list
            await Trainer.findByIdAndUpdate(oldTrainerId, { $pull: { assignedMembers: member._id } });
        }

        const memberResponse = updatedMember.toObject();
        delete memberResponse.password;

        res.json(memberResponse);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE a member
router.delete('/:id', async (req, res) => {
    try {
        const member = await Member.findByIdAndDelete(req.params.id);
        if (!member) {
            return res.status(404).json({ message: 'Member not found' });
        }

        // If member was assigned to a trainer, remove them from that trainer's list
        if (member.assignedTrainer) {
            await Trainer.findByIdAndUpdate(member.assignedTrainer, { $pull: { assignedMembers: member._id } });
        }
        
        res.json({ message: 'Member deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;

