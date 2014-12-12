'use strict';

var mongoose = require('mongoose');

module.exports = function () {

    // private schema
    var model = mongoose.model('experiences', new mongoose.Schema({
        start       : { type: Date, required: true },
        end         : Date,
        employer    : { type: String, required: true },
        job         : { type: String, required: true },
        name        : { type: String, required: true },
        client      : String,
        description : String,
        tools       : [String],
        methods     : [String],
        roles       : [String]
    }));

    // API
    var _findAll = function (callback) {
        model.find({}, callback);
    };

    return {
        findAll: _findAll
    };
}();