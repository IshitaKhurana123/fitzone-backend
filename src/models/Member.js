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
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    },
    paymentStatus: {
        type: String,
        enum: ['Paid', 'Unpaid'],
        default: 'Unpaid'
    },
    attendance: {
        type: Number,
        default: 0
    },
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

