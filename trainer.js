const mongoose = require('mongoose');

const TrainerSchema = new mongoose.Schema({
    name: String,
    specialization: String,
    experience: Number,
    phone: String,
    status: { type: String, default: 'active' }
});

module.exports = mongoose.model('Trainer', TrainerSchema);