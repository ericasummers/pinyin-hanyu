'use strict';

const mongoose = require('mongoose');
const templateSchema = mongoose.Schema({
    id: { type: Number, required: true },
    username: String,
    authorName: { type: String, required: true },
    createdDate: { type: Date, required: true },
    state: { type: String, required: true },
    description: String,
    closedDate: Date
}, {
    collection: 'template'
});

templateSchema.methods.durationToClose = function () {
    // const durationTime = this.closedDate - this.createdDate;
    // const durationPhrase = `This merge request took ${durationTime} to close`;
    // console.log(durationPhrase);
    // return durationPhrase;
};

module.exports = TemplateRequestModel;

function TemplateRequestModel(connection) {
    return connection.model('Template', templateSchema);
}