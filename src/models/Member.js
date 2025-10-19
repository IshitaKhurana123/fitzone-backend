const mongoose = require('mongoose');

const MemberSchema = new mongoose.Schema({
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
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    phone: {
        type: String,
        required: true
    },
    plan: {
        type: String,
        enum: ['basic', 'premium', 'vip'],
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ['Paid', 'Unpaid'],
        default: 'Unpaid'
    },
    // --- UPDATED ---
    // Changed from 'Number' to an array of 'Date' objects
    attendance: [{
        type: Date
    }],
    // ---------------
    assignedTrainer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Trainer', // This creates a reference to the Trainer model
        default: null
    },
    joinDate: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Member', MemberSchema);