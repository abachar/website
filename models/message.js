'use strict';

var mongoose = require('mongoose');

module.exports = (function () {

    // private schema
    var Message = mongoose.model('messages', new mongoose.Schema({
        name   : { type: String, required: true },
        email  : { type: String, required: true },
        subject: { type: String, required: true },
        content: { type: String, required: true },
        sent_at: { type: Date, default: Date.now }
    }));

    // API
    var _create = function (message, callback) {
        Message.create(message, callback);
    };

    return {
        create: _create
    };
}());