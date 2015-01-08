'use strict';

var mongoose = require('mongoose');

module.exports = (function () {

    // private schema
    var _model = mongoose.model('messages', new mongoose.Schema({
        name: {type: String},
        email: {type: String},
        subject: {type: String},
        content: {type: String},
        sent_at: {type: Date, default: Date.now}
    }));

    // API
    var _create = function (message, callback) {
        _model.create(message, callback);
    };

    return {
        model: _model,
        create: _create
    };
}());