'use strict';

// Get application
var app = require('./app');

// Set port
app.set('port', process.env.PORT || 3000);

// Start server
var server = app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + server.address().port);
});
