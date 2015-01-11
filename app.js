'use strict';

var express      = require('express'),
    path         = require('path'),
    logger       = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser   = require('body-parser'),
    exphbs       = require('express-handlebars'),
    mongoose     = require('mongoose');


// Create application
var app = express();

// Connect to database
mongoose.connect(process.env.WEBSITE_MONGOLAB_URI || 'mongodb://localhost/website');

// view engine setup
var hbs = exphbs.create({
    defaultLayout: 'main',
    helpers      : require('./helpers'),
    partialsDir: ['views/partials/']
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

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

module.exports = app;