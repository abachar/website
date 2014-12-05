'use strict';

var express   = require('express'),
    router    = express.Router(),
    async     = require('async'),
    validator = require("joi"),
    message   = require("../models/message");

/**
 *
 */
var formSchema = validator.object().keys({
  name   : validator.string().required().max(100),
  email  : validator.string().required().max(100).email(),
  subject: validator.string().required().max(200),
  message: validator.string().required()
});

/**
 * POST /contact
 */
router.post('/', function (request, response) {

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
            var msg = new message();
            msg.name    = form.name;
            msg.email   = form.email;
            msg.subject = form.subject;
            msg.message = form.message;
            msg.save(function (err) {
                if (err) {
                    err = "Échec lors de l'envoi de votre message, veuillez essayer plus tard. l'&eacute;quipe abachar.fr s'excuse pour le desagrement";
                }
                callback(err);
            });
        }
    ], function (err) {
        if (err) {
            response.json({
                error  : true,
                message: err
            });
        } else {
            response.json({
                success: true,
                message: "Merci, votre message a bien été envoyé."
            });
        }
    });
});

/**
 *
 */
module.exports = function (app) {
    app.use('/contact', router);
};