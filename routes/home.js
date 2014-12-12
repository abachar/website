'use strict';

var express = require('express'),
    router  = express.Router(),
    async   = require('async'),
    article = require("../models/article"),
    project = require("../models/project");

/**
 * GET /
 */
router.get('/', function (request, response) {

    async.parallel({
        articles: function (callback) {
            article.findLastThree(callback);
        },
        projects: function (callback) {
            project.findLastTwo(callback);
        }
    }, function (errs, results) {
        if (errs) {
            response.status(404).end();
        } else {
            response.render('home/index', {
                isHome  : true,
                articles: results.articles,
                projects: results.projects
            });
        }
    });
});

/**
 *
 */
module.exports = function (app) {
    app.use('/', router);
};