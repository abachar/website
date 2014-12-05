var mongoose = require('mongoose');

/**
 * Experience schema
 */
var ExperienceSchema = new mongoose.Schema({
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
});

/**
 * Export Experience model
 */
module.exports = mongoose.model('experiences', ExperienceSchema);