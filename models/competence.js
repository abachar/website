'use strict';

var mongoose = require('mongoose');

module.exports = (function () {

    // private schema
    var Competence = mongoose.model('competences', new mongoose.Schema({
        name   : { type: String, required: true, unique: true },
        level  : String,
        skills : [new mongoose.Schema({
            name  : String,
            level : String
        })]
    }));

    // API
    var _findAll = function (callback) {
        Competence.find({}, callback);
    };

    return {
        findAll: _findAll
    };
}());