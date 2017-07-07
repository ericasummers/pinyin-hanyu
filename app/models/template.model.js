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


/////////Dashboard project code
'use strict';

module.exports = MergeRequestModel;

function MergeRequestModel(db) {
    const name = 'MergeRequest';
    const exists = db.mongoose.modelNames().indexOf(name) > -1;

    if (exists) { return db.mongoose.model(name); }

    return db.mongoose.connection.model(
        name,
        new db.mongoose.Schema(
            {
                id: { type: Number, required: true },
                username: { type: String },
                authorName: { type: String, required: true },
                createdDate: { type: Date, required: true },
                state: { type: String, required: true },
                title: { type: String },
                description: { type: String },
                closedDate: { type: Date },
                projectBranch: { type: String, required: true },
                projectName: {type: String, required: true },
                web_url: { type: String, required: true },
                avatar: { type: String },
                userState: { type: String }
            },
            { collection: 'merge-requests' })
    );
}