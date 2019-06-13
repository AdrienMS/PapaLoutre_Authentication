const bodyParser = require('body-parser');
const compress = require('compression');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const swaggerUI = require('swagger-ui-express');
const methodOverride = require('method-override');
const errorHandling = require('../lib/error/index');
const routes = require('../app/routes/index');
const swaggerDocument = require('./swagger.json');

const app = express();

// parse body params and attache them to req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(compress());
app.use(methodOverride());

// secure apps by setting various HTTP headers
app.use(helmet());

// enable CORS - Cross Origin Resource Sharing
app.use(cors());

// mount all routes on /api path
app.use('/documentation', swaggerUI.serve, swaggerUI.setup(swaggerDocument));
app.use('/api', routes);

// catch 404 and forward to error handler
app.use((req, res, next) => next({ status: 404, message: `Can not found ${req.url}` }));

// error handler
app.use(errorHandling.handling);

module.exports = app;
