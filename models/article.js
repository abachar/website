'use strict';

var mongoose = require('mongoose');

module.exports = (function () {

    // private schema
    var Article = mongoose.model('articles', new mongoose.Schema({
        code        : { type: String, required: true, unique: true },
        created_at  : { type: Date},
        printable   : { type: Boolean, default: false },
        draft       : { type: Boolean, default: true },
        author      : String,
        title       : { type: String , required: true },
        description : String,
        thumbnail   : String,
        comments    : [new mongoose.Schema({
            author     : String,
            email      : String,
            created_at : { type: Date, required: true },
            content    : String
        })]
    }));

    // API
    var _findLastThree = function (callback) {
        Article.find({}).sort({created_at: 'desc'}).limit(3).exec(callback);
    };

    var _findAll = function (callback) {
        Article.find({}).sort({created_at: 'desc'}).exec(callback);
    };

    var _findByCode = function (code, callback) {
        Article.findOne({code: code}, callback);
    };

    var _pushComment = function (code, comment, callback) {
        Article.update({code: code},  { $push: { comments: comment} }, callback);
    };

    return {
        findLastThree: _findLastThree,
        findAll      : _findAll,
        findByCode   : _findByCode,
        pushComment  : _pushComment
    };
}());