
const express = require('express');
const router = express.Router();
const { readData, writeData } = require('../dataStore');

// GET all members
router.get('/', (req, res) => {
    const data = readData();
    const members = data.users.filter(u => u.role === 'member').map(u => {
        const copy = Object.assign({}, u); delete copy.password; return copy;
    });
    res.json(members);
});

// GET single member (by id)
router.get('/:id', (req, res) => {
    const data = readData();
    const user = data.users.find(u => u.id === req.params.id && u.role === 'member');
    if (!user) return res.status(404).json({ message: 'Member not found' });
    const safe = Object.assign({}, user); delete safe.password; res.json(safe);
});

// Mark attendance (add a date string)
router.post('/:id/attendance', (req, res) => {
    const { date, present } = req.body; // date in ISO or YYYY-MM-DD
    const data = readData();
    const user = data.users.find(u => u.id === req.params.id && u.role === 'member');
    if (!user) return res.status(404).json({ message: 'Member not found' });
    const d = date ? date : new Date().toISOString().slice(0,10);
    // attendance list stores present dates
    user.attendance = user.attendance || [];
    if (present) {
        if (!user.attendance.includes(d)) user.attendance.push(d);
    } else {
        user.attendance = user.attendance.filter(x => x !== d);
    }
    writeData(data);
    res.json({ message: 'Attendance updated', attendance: user.attendance });
});

module.exports = router;
