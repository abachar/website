'use strict';

var moment    = require('moment'),
    highlight = require('highlight.js'),
    marked    = require('marked');

// Set moment to fr
moment.locale('fr');

// Configure marked
marked.setOptions({
    highlight: function (code) {
        return highlight.highlightAuto(code).value;
    }
});

/**
 *
 */
exports.formatDate = function (date, format) {
    return moment(date).format(format);
};

/**
 *
 */
exports.marked = function (source) {
    return marked(source);
};

/**
 *
 */
exports.duration = function (start, end, showMonths) {
    var diff, duration, m, y;
    if (!end) {
        diff = moment.duration(moment().diff(moment(start, "DD/MM/YYYY")));
    } else {
        diff = moment.duration(moment(end, "DD/MM/YYYY").diff(moment(start, "DD/MM/YYYY")));
    }

    y = diff.get('years');
    m = diff.get('months');
    if (y === 0) {
        duration = m <= 1 ? "Un mois" : m + " mois";
    } else {
        duration = y === 1 ? "Un an" : y + " ans";
        if (showMonths) {
            duration = duration + (m < 1 ? '' : (m === 1 ? " et un mois" : " et " + m + " mois"));
        }
    }
    return duration;
};