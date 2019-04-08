// libraries
const bodyParser = require('body-parser'),
      express    = require('express'),
      fs         = require('fs'),
      https      = require('https'),
      morgan     = require('morgan');

var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080,
    ip   = process.env.IP   || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';

// server instance and middlewares for parsing the body and logging
var app = express();
app.use(bodyParser.json());
app.use(morgan('combined'));

// health check for readiness
app.get('/health', (req, res) => {
  res.status(200).end();
});

// include specific application handler
const handler = require('./handler.js');
app.use('', handler);

// error handling
app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500).send('Something bad happened!');
});

app.listen(port, ip);
console.log('Server running on http://%s:%s', ip, port);

module.exports = app;
