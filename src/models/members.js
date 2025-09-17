const mongoose = require('mongoose');

const MemberSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    plan: String,
    status: { type: String, default: 'active' }
});

module.exports = mongoose.model('Member', MemberSchema);
