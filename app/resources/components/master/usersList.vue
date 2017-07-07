<script>
'use strict';

import Vue2Filters from 'vue2-filters';
import VeeValidate from 'vee-validate';
import moment from 'moment';
import _ from 'lodash';

export default {
    name: 'vue-users-list',
    props: ['compiledUsersData'],
    data() {
        return {
            message: 'Vue Users List',
            originalData: _.cloneDeep(this.compiledUsersData),
            sortedUserData: '',
            lastSort: '',
            sortCount: 0,
            checkedActive: false,
            startDate: '',
            endDate: '',
            today: moment(),
            dateError: ''
        }
    },
    methods: {
        //pass in array of all individual user merge requests to return number of closed requests for that user
        closedRequestsNumbers: function(userMergeRequests) {
                let closedRequests = userMergeRequests.filter(eachUserRequest => {
                    if (eachUserRequest.state === 'merged' || eachUserRequest.state === 'closed') {
                        return eachUserRequest;
                    }
                });
                return closedRequests.length;
        },
        //pass in array of all individual merge requests to return raw average time to close for that user
        rawAverageTimeToClose: function(userMergeRequests) {

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

            if (closeTimes) {
                let sumTimes = closeTimes.reduce((a, b) => { return a + b; });
                let averageTime = parseFloat((sumTimes / closeTimes.length).toFixed(4));
                
                return averageTime;
            }
        },
        //pass in array of all individual merge requests to calculate the average time a user takes to close merge requests
        parsedAverageTimeToClose: function(userMergeRequests) {

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
        },
        dateFormat: function(dateValue) {
            return moment(String(dateValue)).format('dddd, MMMM Do YYYY, hh:mm:ss a');
        },
        sortBy: function(property) {
            if (this.lastSort === property && this.sortCount === 0) {
                this.sortedUserData = _.sortBy(this.sortedUserData, property);
                this.sortCount = 1;
            } else if (this.lastSort === property && this.sortCount != 0) {
                this.sortedUserData = _.sortBy(this.sortedUserData, property).reverse();
                this.sortCount = 0;
            } else {
                this.sortedUserData = _.sortBy(this.sortedUserData, property).reverse();
                this.lastSort = property;
                this.sortCount = 0;
            }
            return this.sortedUserData;
        },
        filterUsers: function() {
            if (this.checkedActive === true) {
                let userData = [];
                for (let i = 0; i < this.sortedUserData.length; i++) {
                    if (this.sortedUserData[i].userState === "active") {
                        userData.push(this.sortedUserData[i]);
                    }
                }
                this.sortedUserData = userData;
                return this.sortedUserData;
            } else {
                this.sortedUserData = this.compiledUsersData;
                return this.sortedUserData;
            }
        },
        clearDates: function() {
            if (this.startDate && this.endDate) {
                this.startDate = '';
                this.endDate = '';
                this.sortedUserData = this.originalData;
                return this.sortedUserData;
            }
        },
        filterDates: function() {
            if (this.startDate && this.endDate && this.endDate > this.startDate) {
                this.sortedUserData = this.originalData;
                this.sortedUserData = _.cloneDeep(this.compiledUsersData);
                let userData = [];
                for (let i = 0; i < this.sortedUserData.length; i++) {
                    let individualData = [];
                    individualData.push(this.sortedUserData[i]);
                    let filteredRequests = individualData[0].userMergeRequests.filter(eachRequest => {
                        if (moment(eachRequest.createdDate).format('YYYY-MM-DD') > this.startDate && moment(eachRequest.createdDate).format('YYYY-MM-DD') < this.endDate) {
                            return eachRequest;
                        }
                    });
                    individualData[0].userMergeRequests = filteredRequests;
                    individualData[0].userRequestTotals = filteredRequests.length;
                    individualData[0].userClosedRequestTotals = this.closedRequestsNumbers(filteredRequests);
                    individualData[0].userOpenRequestTotals = (filteredRequests.length) - this.closedRequestsNumbers(filteredRequests);
                    if (individualData[0].userRequestTotals > 0) {
                        individualData[0].rawUserCloseTime = this.rawAverageTimeToClose(filteredRequests);
                        individualData[0].userCloseTime = this.parsedAverageTimeToClose(filteredRequests);
                    } else {
                        individualData[0].rawUserCloseTime = 'N/A';
                        individualData[0].userCloseTime = 'N/A';
                    }
                    userData.push(individualData[0]);
                }
                this.sortedUserData = userData;
                return this.sortedUserData;
            } else {
                alert('Please enter a valid start and end date!');
                this.sortedUserData = this.originalData;
                return this.sortedUserData;
            }
        },
    },
    beforeMount() {
        this.filterUsers();
        this.sortBy('userRequestTotals');
    }
}

</script>

<template lang="pug">
    #userListDisplay.container
        p Sort by date: 
            input(type="date" v-model="startDate" placeholder="Start Date")
            span &nbsp;&nbsp;&nbsp;
            input(type="date" v-model="endDate" placeholder="End Date")
            span &nbsp;&nbsp;&nbsp;
            button(v-on:click="filterDates") Filter By Date Range
            span &nbsp;&nbsp;&nbsp;
            button(v-on:click="clearDates") Clear Dates
            span &nbsp;&nbsp;&nbsp;
            input(type="checkbox" v-model="checkedActive" id="activeOnly" value="true" v-on:click="filterUsers")
            span &nbsp;&nbsp;
            label(for="activeOnly") View active users only
        table#userListTable
            tr.frescaFontWhite
                th(v-on:click="sortBy('userName')").headingTitlePadding.tableSort User
                th(v-on:click="sortBy('userRequestTotals')").headingTitlePadding.tableSort Total by User
                th(v-on:click="sortBy('userClosedRequestTotals')").headingTitlePadding.tableSort Closed Requests
                th(v-on:click="sortBy('userOpenRequestTotals')").headingTitlePadding.tableSort Currently Open
                th(v-on:click="sortBy('rawUserCloseTime')").headingTitlePadding.tableSort Average Time to Close

            tr(v-for="user in sortedUserData")
                td.leftAlign(v-if="user.avatar")
                    img(v-bind:src='user.avatar').sizeAvatarPicturesOnList
                    router-link.frescaFontWhite(:to="user.userName") {{ user.userName }}
                td.leftAlign(v-else)
                    img(src='../../public/images/blocked.jpeg').sizeAvatarPicturesOnList
                    router-link.frescaFontWhite(:to="user.userName") {{ user.userName }}
                td {{ user.userRequestTotals }}
                td {{ user.userClosedRequestTotals }}
                td {{ user.userOpenRequestTotals }}
                td {{ user.userCloseTime }}
        br
        br
        h5.frescaFont brought to you by "The Interns" 
            a(href="https://github.com/ericaw21") Erica Wright
            span &nbsp;&&nbsp;
            a(href="https://github.com/Michaela-Davis") Michaela Davis
            span &nbsp; P.S. We miss you!
</template>