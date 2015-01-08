'use strict';

var mongoose = require('mongoose');

module.exports = (function () {

    // private schema
    var _model = mongoose.model('competences', new mongoose.Schema({
        name: {type: String, required: true, unique: true},
        level: String,
        skills: [new mongoose.Schema({
            name: String,
            level: String
        })]
    }));

    // API
    var _findAll = function (callback) {
        _model.find({}, callback);
    };

    return {
        model: _model,
        findAll: _findAll
    };
}());