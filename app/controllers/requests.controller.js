'use strict';

const pkg = require.main.require('../package.json');
const mongoose = require('mongoose');

class RequestsController{

    constructor (models, services) {
        this.default = true;
        this.models = models;
        this.services = services;
        //connect merge request model to access schema
        this.mergeRequestService = services.merges();
    }

    index (req, res) {
        let dbMergeRequests = '';
        // let userListArray = '';

        //query database for all saved entries from glmerge-requests collection and retrieve
        this.mergeRequestService.list().then(docs => {
            let dbMergeRequests = docs;

            let userListArray = this.mergeRequestService.collectUsers(dbMergeRequests);
            let mergeRequestsByUser = this.mergeRequestService.userSortRequests(userListArray, dbMergeRequests);
            let closedRequestsTotals = this.mergeRequestService.closedRequestsNumbers(mergeRequestsByUser);
            let rawAverageCloseTimes = this.mergeRequestService.rawAverageUsersCloseTimes(mergeRequestsByUser);
            let parsedAverageCloseTimesByUser = this.mergeRequestService.averageUsersCloseTimes(mergeRequestsByUser);

            let compiledUsersData = [];
            for (let i = 0; i < userListArray.length; i++) {
                compiledUsersData.push({
                    userName: userListArray[i],
                    avatar: mergeRequestsByUser[i][0].avatar,
                    userState: mergeRequestsByUser[i][0].userState,
                    userMergeRequests: mergeRequestsByUser[i],
                    userRequestTotals: mergeRequestsByUser[i].length,
                    userClosedRequestTotals: closedRequestsTotals[i],
                    userOpenRequestTotals: (mergeRequestsByUser[i].length - closedRequestsTotals[i]),
                    rawUserCloseTime: rawAverageCloseTimes[i],
                    userCloseTime: parsedAverageCloseTimesByUser[i]
                });
            }

            // render pug template and feed in variables needed to be displayed on page
            res.render('pages/requests.view.pug', {
                    "compiledUsersData": compiledUsersData,
                    "requestsCount": dbMergeRequests.length,
                    pkg,
                    activeTab : 'Merge Requests'
            });
        }).catch(err => {
            console.log('Final error', err.message);
            res.sendStatus(500);
        });
    }
}

module.exports = (models, services) => {
    return new RequestsController(models, services);
};