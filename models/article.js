var mongoose = require('mongoose');

/**
 * Article schema
 */
var ArticleSchema = new mongoose.Schema({
    code        : { type: String, required: true, unique: true },
    created_at  : { type: Date   , default: Date.now },
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
});

/**
 * Export Article model
 */
module.exports = mongoose.model('articles', ArticleSchema);