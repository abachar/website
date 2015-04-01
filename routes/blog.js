'use strict';

var express   = require('express'),
    router    = express.Router(),
    async     = require('async'),
    fs        = require('fs'),
    path      = require('path'),
    validator = require("joi"),
    article   = require("../models/article");

/**
 *
 */
var formSchema = validator.object().keys({
    author : validator.string().required().max(100),
    email  : validator.string().required().max(100).email(),
    content: validator.string().required()
});


/**
 * GET /blog
 */
router.get('/', function (request, response) {

    article.findAll(function (err, articles) {
        if (err) {
            response.status(404).end();
        } else {
            response.render('blog/index', {
                isBlog  : true,
                articles: articles
            });
        }
    });
});


/**
 * GET /blog/:code
 */
router.get('/:code', function (request, response) {

    async.parallel({
        article: function (callback) {
            article.findByCode(request.params.code, callback);
        },
        contents: function (callback) {
            var fileName = path.join(__dirname, '../assets/articles/', request.params.code, 'article.md');
            fs.readFile(fileName, 'utf8', callback);
        }
    }, function (errs, results) {
        if (errs) {
            response.end();
        } else {
            response.render('blog/view', {
                isBlog  : true,
                article : results.article,
                contents: results.contents
            });
        }
    });
});


/**
 * GET /blog/:code/assets/:filename
 */
router.get('/:code/assets/:filename', function (request, response) {

    var filename = path.join(__dirname,
        '../assets/articles',
        request.params.code,
        'assets',
        request.params.filename);

    fs.exists(filename, function (exists) {
        if (exists) {
            response.sendfile(filename, {maxAge: 86400});
        } else {
            response.end("File: <" + filename + "> not found!");
        }
    });
});


/**
 * POST /blog/:code/comments
 */
router.post('/:code/comments', function (request, response) {

    async.waterfall([
        function (callback) {
            validator.validate(request.body, formSchema, function (err, form) {
                if (err) {
                    err = "Le formulaire n'est pas valide.";
                }
                callback(err, form);
            });
        },
        function (form, callback) {
            article.pushComment(request.params.code, {
                author: form.author,
                email: form.email,
                created_at: new Date(),
                content: form.content
            }, function (err) {
                if (err) {
                    err = "Échec lors de l'ajout du commentaire, veuillez essayer plus tard. l'&eacute;quipe abachar.fr s'excuse pour le desagrement";
                }
                callback(err);
            });
        }
    ], function (err) {
        if (err) {
            response.json({error: true, message: err});
        } else {
            response.json({success : true});
        }
    });
});

/**
 *
 */
module.exports = function (app) {
    app.use('/blog', router);
};
