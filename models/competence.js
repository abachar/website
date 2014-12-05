var mongoose = require('mongoose');

/**
 * Competence schema
 */
var CompetenceSchema = new mongoose.Schema({
    name   : { type: String, required: true, unique: true },
    level  : String,
    skills : [new mongoose.Schema({
        name  : String,
        level : String
    })]
});

/**
 * Export Competence model
 */
module.exports = mongoose.model('competences', CompetenceSchema);