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
            experience.findAll(callback);
        },
        projects: function (callback) {
            project.findAll(callback);
        },
        competences: function (callback) {
            competence.findAll(callback);
        }
    }, function (errs, results) {
        if (errs) {
            response.status(404).end();
        } else {
            response.render('profile/index', {
                isProfile  : true,
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