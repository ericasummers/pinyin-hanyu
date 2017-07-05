'use strict';

const mongoose = require('mongoose');
const RequestsModel = require.main.require('./models/template.model');
const superagent = require('superagent');
//only for specific API calls, using bluebird and lodash to handle promises with libraries
// const Promise = require('bluebird');
// const _ = require('lodash');

module.exports = {
    index,
    load,
    save
}

// Called on '/', executes function and displays pug template
function index(req, res, next) {
    res.render('home/home.index.pug', { 
        title: 'Template Project'
     });
};

// Called on '/template'
function load(req, res, next) {
            //render pug template and feed in variables needed to be displayed on page
            res.render('templatepage/templatepage.pug', {
                    title: 'Template Extra Page'
    });
};

function save(req, res, next) {
    //save function for post
};