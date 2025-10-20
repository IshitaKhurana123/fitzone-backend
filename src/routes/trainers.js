
const express = require('express');
const router = express.Router();
const { readData, writeData } = require('../dataStore');

// GET all trainers
router.get('/', (req, res) => {
    const data = readData();
    const trainers = data.users.filter(u => u.role === 'trainer').map(u => {
        const copy = Object.assign({}, u); delete copy.password; return copy;
    });
    res.json(trainers);
});

// GET single trainer
router.get('/:id', (req, res) => {
    const data = readData();
    const user = data.users.find(u => u.id === req.params.id && u.role === 'trainer');
    if (!user) return res.status(404).json({ message: 'Trainer not found' });
    const safe = Object.assign({}, user); delete safe.password; res.json(safe);
});

module.exports = router;
