var express      = require('express'),
    path         = require('path'),
    logger       = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser   = require('body-parser'),
    hbs          = require('hbs'),
    moment       = require('moment'),
    marked       = require('marked'),
    mongoose     = require('mongoose');

/**
 *
 * @param app
 */
function setupHandlebars(app) {
    // Partials
    hbs.registerPartials(path.join(__dirname, 'views'));

    hbs.registerHelper("formatDate", function (date, format) {
        return new hbs.SafeString(moment(date).format(format));
    });

    hbs.registerHelper("duration", function (start, end, showMonths) {
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
        return new hbs.SafeString(duration);
    });

    marked.setOptions({
        highlight: function (code) {
            return require('highlight.js').highlightAuto(code).value;
        }
    });

    hbs.registerHelper("marked", function (source) {
        return new hbs.SafeString(marked(source));
    });

    app.set('view engine', 'hbs');
    app.set('views', path.join(__dirname, 'views'));
}

function createApplication() {
	var app = express();

    // Connect to database
    mongoose.connect(process.env.WEBSITE_MONGOLAB_URI);

    // view engine setup
    setupHandlebars(app);

    // Set port
    app.set('port', process.env.PORT || 3000);

    // Configuration
    app.use(logger('dev'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(cookieParser());
    app.use(express["static"](path.join(__dirname, 'public')));
    app.use('/bower_components', express["static"](__dirname + '/../bower_components'));

    // Routing
    require('./routes/home')(app);
    require('./routes/profile')(app);
    require('./routes/projects')(app);
    require('./routes/blog')(app);
    require('./routes/contact')(app);

    // catch 404 and forward to error handler
    app.use(function (request, response, next) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    });

    // development error handler
    if (app.get('env') === 'development') {
        app.use(function (error, request, response) {
            response.status(error.status || 500);

            response.render('error', {
                message: error.message,
                error: error,
                layout: null
            });
        });
    }

    // production error handler
    app.use(function (error, request, response) {
        response.status(error.status || 500);

        response.render('error', {
            message: error.message,
            error: {},
            layout: null
        });
    });

    return app;
}

// Create application
module.exports = createApplication();