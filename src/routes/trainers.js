const express = require('express');
const router = express.Router();
const Trainer = require('../models/Trainer');

// GET all trainers
router.get('/', async (req, res) => {
    try {
        const trainers = await Trainer.find();
        res.json(trainers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST a new trainer
router.post('/', async (req, res) => {
    const newTrainer = new Trainer(req.body);
    try {
        const savedTrainer = await newTrainer.save();
        res.status(201).json(savedTrainer);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// UPDATE a trainer
router.put('/:id', async (req, res) => {
    try {
        const updatedTrainer = await Trainer.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedTrainer);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE a trainer
router.delete('/:id', async (req, res) => {
    try {
        await Trainer.findByIdAndDelete(req.params.id);
        res.json({ message: 'Trainer deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
