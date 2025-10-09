const mongoose = require('mongoose');

const TrainerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    specialization: {
        type: String,
        required: true
    },
    experience: {
        type: Number,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    },
    salaryStatus: {
        type: String,
        enum: ['Paid', 'Unpaid'],
        default: 'Unpaid'
    },
    attendance: {
        type: Number,
        default: 0
    },
    assignedMembers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Member' // Creates a reference to the Member model
    }],
    joinDate: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Trainer', TrainerSchema);

