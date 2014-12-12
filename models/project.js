'use strict';

var mongoose = require('mongoose');

module.exports = function () {

    // private schema
    var model = mongoose.model('projects', new mongoose.Schema({
        code        : { type: String, required: true, unique: true },
        name        : { type: String, required: true },
        description : String,
        tools       : [String],
        thumbnail   : String,
        images      : [String]
    }));

    // API
    var _findLastTwo = function (callback) {
        model.find({}).limit(2).exec(callback);
    };

    var _findAll = function (callback) {
        model.find({}, callback);
    };

    return {
        findLastTwo: _findLastTwo,
        findAll    : _findAll
    };
}();