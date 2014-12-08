var mongoose = require('mongoose');

module.exports = function () {

    // private schema
    var model = mongoose.model('competences', new mongoose.Schema({
        name   : { type: String, required: true, unique: true },
        level  : String,
        skills : [new mongoose.Schema({
            name  : String,
            level : String
        })]
    }));

    // API
    var _findAll = function (callback) {
        model.find({}, callback);
    };

    return {
        findAll: _findAll
    };
}();