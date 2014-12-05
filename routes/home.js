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
            article.find({}).sort({created_at: 'desc'}).limit(3).exec(callback);
        },
        projects: function (callback) {
            project.find({}).limit(2).exec(callback);
        }
    }, function (errs, results) {
        if (errs) {
            response.end();
        } else {
            response.render('home/index', {
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