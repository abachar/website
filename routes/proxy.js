'use strict';

var express = require('express'),
    router  = express.Router();

/**
 * GET /
 */
router.get('/', function (request, response) {
});

/**
 *
 */
module.exports = function (app) {
    app.use('/proxy', router);
};
