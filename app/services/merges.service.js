'use strict';

const mongoose = require('mongoose');
const moment = require('moment');
module.exports = MergesService;

function MergesService () {

    if (!(this instanceof MergesService)) {
        return new MergesService();
    }

    this.model = mongoose.model('MergeRequest');

    this.list = list;
    this.collectUsers = collectUsers;
    this.userSortRequests = userSortRequests;
    this.closedRequestsNumbers = closedRequestsNumbers;
    this.averageUsersCloseTimes = averageUsersCloseTimes;
    this.rawAverageUsersCloseTimes = rawAverageUsersCloseTimes;
};

function list() {
    return this.model.find({}, (err, docs) => {
        if (err) {
            throw err;
        }
    });
}
//returns array of usernames
function collectUsers(queryResponse) {

    let listUsersArray = [];

    for (let i = 0; i < queryResponse.length; i++) {
        if (listUsersArray.indexOf(queryResponse[i].authorName) >= 0) {
        } else {
            listUsersArray.push(queryResponse[i].authorName);
        }
    }
    return listUsersArray;
}

//returns array of all merge requests grouped by user using the index of the userList above to match up
function userSortRequests(userList, allRequestsList) {
    let requestsWithUserIndex = userList.map(eachUser => {
        return allRequestsList.filter(eachRequest => {
            return eachRequest.authorName === eachUser;
        });
    });
    return requestsWithUserIndex;
}

// //array of the number of closed merge requests by user using the index of the userlist to match up
function closedRequestsNumbers(allRequestsByUser) {
    let allClosedRequests = allRequestsByUser.map(userRequests => {
        let closedRequests = userRequests.filter(eachRequest => {
            if (eachRequest.state === 'merged' || eachRequest.state === 'closed') {
                return eachRequest;
            }
        });
        return closedRequests.length;
    });
    return allClosedRequests;
}

// //array of the raw average time users take to close requests using the index of the userlist to match up
function rawAverageUsersCloseTimes(allRequestsByUser) {
    return allRequestsByUser.map(eachUserRequests => {
        return averageTimeToClose(eachUserRequests);
    });
}

// //calculate the average time a user takes to close merge requests
function averageTimeToClose(userMergeRequests) {

    let closedRequests = userMergeRequests.filter(eachUserRequest => {
        if (eachUserRequest.state === 'merged' || eachUserRequest.state === 'closed') {
            return eachUserRequest;
        }
    });
    let closeTimes = closedRequests.map(eachClosedRequest => {
        let mergeOpenDate = moment(eachClosedRequest.createdDate);
        let mergeCloseDate = moment(eachClosedRequest.closedDate);
        return mergeCloseDate.diff(mergeOpenDate, 'seconds');
    });

    let sumTimes = closeTimes.reduce((a, b) => { return a + b; });
    let averageTime = parseFloat((sumTimes / closeTimes.length).toFixed(4));
    
    return averageTime;
}

// //array of the parsed average time users take to close requests using the index of the userlist to match up
function averageUsersCloseTimes(allRequestsByUser) {
    return allRequestsByUser.map(eachUserRequests => {
        return parsedAverageTimeToClose(eachUserRequests);
    });
}

// //calculate the average time a user takes to close merge requests
function parsedAverageTimeToClose(userMergeRequests) {

    let closedRequests = userMergeRequests.filter(eachUserRequest => {
        if (eachUserRequest.state === 'merged' || eachUserRequest.state === 'closed') {
            return eachUserRequest;
        }
    });
    let closeTimes = closedRequests.map(eachClosedRequest => {
        let mergeOpenDate = moment(eachClosedRequest.createdDate);
        let mergeCloseDate = moment(eachClosedRequest.closedDate);
        return mergeCloseDate.diff(mergeOpenDate, 'seconds');
    });

    let sumTimes = closeTimes.reduce((a, b) => { return a + b; });
    let averageTime = parseFloat((sumTimes / closeTimes.length).toFixed(4));
    
    //if greater than 7 days, round to nearest week
    if (parseInt(averageTime) > 604800) {
        let numberOfWeeks = averageTime/604800;
        if (numberOfWeeks >= 1.5) {
            return (Math.round(numberOfWeeks) + ' weeks');
        } else {
            return (Math.round(numberOfWeeks) + ' week');
        }
    }
    //if greater than 2 days, round to nearest day
    else if (parseInt(averageTime) > 172800) {
        let numberOfDays =averageTime/86400;
        return (Math.round(numberOfDays) + ' days');
    }
    //if greater than 8 hours, round to nearest hour
    else if (parseInt(averageTime) > 28800) {
        let numberOfHours =averageTime/3600;
        return (Math.round(numberOfHours) + ' hours');
    }
    //if greater than 1 hour, round to nearest minute
    else if (parseInt(averageTime) > 3600) {
        let numberOfMinutes =averageTime/60;
        let numberOfHoursWithoutMinutes = Math.floor(averageTime/3600);
        let numberOfMinutesWithoutHours = (averageTime - (numberOfHoursWithoutMinutes * 3600))/60;
        if ((Math.round(numberOfMinutesWithoutHours)) === 1) {
            return (numberOfHoursWithoutMinutes + ' hours ' + Math.round(numberOfMinutesWithoutHours) + ' minute');
        } else {
            return (numberOfHoursWithoutMinutes + ' hours ' + Math.round(numberOfMinutesWithoutHours) + ' minutes');
        }
    }
    //if less than 1 hour, display to nearest second --:--
    else {
        let totalMinutes = Math.floor(averageTime/60);
        let totalSeconds = Math.round(averageTime - (totalMinutes * 60));
        if (totalMinutes >= 2 && totalSeconds >= 2) {
            return totalMinutes + ' minutes ' + totalSeconds + ' seconds';
        }
        if (totalMinutes >= 2 && totalSeconds === 1) {
            return totalMinutes + ' minutes ' + totalSeconds + ' second';
        }
        if (totalMinutes === 1 && totalSeconds >= 2) {
            return totalMinutes + ' minute ' + totalSeconds + ' seconds';
        }
        if (totalMinutes === 1 && totalSeconds === 1) {
            return totalMinutes + ' minute ' + totalSeconds + ' second';
        }
        if (totalMinutes < 1 && totalSeconds >= 2) {
            return totalSeconds + ' seconds';
        }
        if (totalMinutes < 1 && totalSeconds === 1) {
            return totalSeconds + ' second';
        }
    }
}