'use strict';

const mongoose = require('mongoose');
module.exports = TemplateService;

function TemplateService () {

    if (!(this instanceof TemplateService)) {
        return new TemplateService();
    }

    this.model = mongoose.model('Template');

    this.list = list;
};

function list() {
    // return this.model.find({}, (err, docs) => {
    //     if (err) {
    //         throw err;
    //     }
    // });
}
