'use strict';

// Packages
const http = require('http');
const path = require('path');
const logger = require('morgan');
const express = require('express');
const mongoose = require('mongoose');
const favicon = require('serve-favicon');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

// Controllers and services
const serverServices = require('./services/server.service');
const homeController = require('./controllers/home.controller');

// create app instance
const app = express();

// Set up view engine
app.set('views', path.join(__dirname, 'resources', 'pages'));
app.set('view engine', 'pug');

// Set basedir for pug templates
app.locals.basedir = path.join(__dirname, 'resources', 'pages');

/*****************************************
 Connect to database
 *****************************************/
mongoose.connect('mongodb://localhost:27017/template-database');
mongoose.connection.on('error', console.error.bind(console, 'connection error:'));

/*****************************************
 Set up routes
 *****************************************/

// every request uses these
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'http', 'public')));

// Controllers
app.get('/', homeController.index);
// app.post('/', homeController.save);
app.get('/template', homeController.load);

// Error handling
app.use(function(req, res, next) {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.use(function(err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    res.status(err.status || 500);
    res.render('error');
});

//START SERVER
    let port = serverServices.normalizePort(process.env.PORT || '3000');
    app.set('port', port);

    let server = http.createServer(app);

    server.listen(port);
    server.on('error', serverServices.onError);
    server.on('listening', function() {
        serverServices.onListening(server);
    });