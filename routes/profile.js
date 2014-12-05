'use strict';

var express    = require('express'),
    router     = express.Router(),
    async      = require('async'),
    experience = require("../models/experience"),
    project    = require("../models/project"),
    competence = require("../models/competence");

/**
 * GET /profile
 */
router.get('/', function (request, response) {

    async.parallel({
        experiences: function (callback) {
            experience.find({}).exec(callback);
        },
        projects: function (callback) {
            project.find({}).exec(callback);
        },
        competences: function (callback) {
            competence.find({}).exec(callback);
        }
    }, function (errs, results) {
        if (errs) {
            response.end();
        } else {
            response.render('profile/index', {
                experiences: results.experiences,
                projects   : results.projects,
                competences: results.competences
            });
        }
    });
});

/**
 *
 */
module.exports = function (app) {
    app.use('/profile', router);
};