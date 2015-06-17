'use strict';

var express = require('express'),
    router  = express.Router();

/**
 * GET /
 */
router.get('/:url', function (request, response) {
    var url = new Buffer(request.params.url, 'base64').toString('ascii');
});

/**
 *
 */
module.exports = function (app) {
    app.use('/proxy', router);
};
