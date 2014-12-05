'use strict';

var express = require('express'),
    router  = express.Router(),
    fs      = require('fs'),
    path    = require('path'),
    project = require("../models/project");


/**
 * GET /projects
 */
router.get('/', function (request, response) {

    project.find({}, function (err, projects) {
        if (err) {
            response.end();
        } else {
            response.render('projects/index', {
                projects: projects
            });
        }
    });
});

/**
 * GET /projects/:code/assets/:filename
 */
router.get('/:code/assets/:filename', function (request, response) {

    var filename = path.join(__dirname,
        '../assets/projects',
        request.params.code,
        request.params.filename);

    fs.exists(filename, function (exists) {
        if (exists) {
            response.sendfile(filename);
        } else {
            response.end("File: <" + filename + "> not found!");
        }
    });
});

/**
 *
 */
module.exports = function (app) {
    app.use('/projects', router);
};