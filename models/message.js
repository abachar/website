'use strict';

var mongoose = require('mongoose');

var Message = function () {

    // private schema
    var model = mongoose.model('messages', new mongoose.Schema({
        name   : { type: String, required: true },
        email  : { type: String, required: true },
        subject: { type: String, required: true },
        content: { type: String, required: true },
        sent_at: { type: Date, default: Date.now }
    }));

    // API
    var _create = function (message, callback) {
        var entity = new model();
        entity.name    = message.name;
        entity.email   = message.email;
        entity.subject = message.subject;
        entity.content = message.content;
        entity.save(callback);
    };

    return {
        create: _create
    }
}();

/**
 * Export Message model
 */
module.exports = Message;