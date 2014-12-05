var mongoose = require('mongoose');

/**
 * Project schema
 */
var ProjectSchema = new mongoose.Schema({
    code        : { type: String, required: true, unique: true },
    name        : { type: String, required: true },
    description : String,
    tools       : [String],
    thumbnail   : String,
    images      : [String]
});

/**
 * Export Project model
 */
module.exports = mongoose.model('projects', ProjectSchema);