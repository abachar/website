var mongoose = require('mongoose');

/**
 * Message schema
 */
var MessageSchema = new mongoose.Schema({
    name   : { type: String, required: true },
    email  : { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    sent_at: { type: Date  , default: Date.now }
});

/**
 * Export Message model
 */
module.exports = mongoose.model('messages', MessageSchema);