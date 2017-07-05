<script>
'use strict';

import Vue2Filters from 'vue2-filters';
import _ from 'lodash';

export default {
    name: 'vue-users-list',
    props: ['userList', 'mergeRequestsByUser', 'closedRequestsTotals', 'averageUsersCloseTimes', 'rawUsersCloseTimes'],
    data() {
        return {
            message: 'Vue Users List',
            sortedUserData: [],
            lastSort: '',
            sortCount: 0,
            startDate: '',
            endDate: '',
            checkedActive: false
        };
    },
    computed: {
        completeUserData: function() {
            let userData = [];
            for (let i = 0; i < this.userList.length; i++) {
                userData.push({
                    userName: this.userList[i],
                    userMergeRequests: this.mergeRequestsByUser[i],
                    userRequestTotals: this.mergeRequestsByUser[i].length,
                    userClosedRequestTotals: this.closedRequestsTotals[i],
                    userOpenRequestTotals: (this.mergeRequestsByUser[i].length - this.closedRequestsTotals[i]),
                    rawUserCloseTime: this.rawUsersCloseTimes[i],
                    userCloseTime: this.averageUsersCloseTimes[i]
                });
            }
            this.sortedUserData = userData;
            return this.sortedUserData;
        }
    },
    methods: {
        getSpecificUserValue: function(groupDataArray, authorName) {
            let output = [];

            for (let i = 0; i < this.userList.length; i++) {
                if (this.mergeRequestsByUser[i][0].authorName === authorName) {
                    output.push(groupDataArray[i]);
                }
            }
            return output[0];
        },
        dateFormat: function(dateValue) {
            return moment(String(dateValue)).format('dddd, MMMM Do YYYY, hh:mm:ss a');
        },
        sortBy: function(property) {
            if (this.lastSort === property && this.sortCount % 2 === 0) {
                this.sortedUserData = _.sortBy(this.completeUserData, property);
                this.sortCount = 1;
            } else if (this.lastSort === property && this.sortCount % 2 != 0) {
                this.sortedUserData = _.sortBy(this.completeUserData, property).reverse();
                this.sortCount = 0;
            } else {
                this.sortedUserData = _.sortBy(this.completeUserData, property).reverse();
                this.lastSort = property;
                this.sortCount = 0;
            }
            return this.sortedUserData;
        }
    },
    beforeMount() {
        this.sortBy('userRequestTotals');
    },
    beforeUpdate() {
        if (this.checkedActive === true) {
            let filteredList = this.sortedUserData.filter(eachDataSet => {
                if (eachDataSet.userMergeRequests[0].avatar) {
                    return eachDataSet;
                }
            });
            this.sortedUserData = filteredList;
            return this.sortedUserData;
        } else if (this.checkedActive === false) {
            this.sortedUserData = this.completeUserData;
            return this.sortedUserData;
        }
    }
}

</script>

<template lang="pug">
    #userListDisplay
        p Sort by date: 
            input(type="date" v-model="startDate" placeholder="Start Date") 
            span &nbsp;&nbsp;&nbsp;
            input(type="date" v-model="endDate" placeholder="End Date")
            span &nbsp;&nbsp;&nbsp;
            input(type="checkbox" v-model="checkedActive" id="activeOnly" value="true")
            span &nbsp;&nbsp;
            label(for="activeOnly") View active users only {{ checkedActive }}

        table#userListTable
            tr

                th Profile Picture
                th(v-on:click="sortBy('userName')").tableSort User
                th(v-on:click="sortBy('userRequestTotals')").tableSort Total Merge Requests By User
                th(v-on:click="sortBy('userClosedRequestTotals')").tableSort Total Closed Requests
                th(v-on:click="sortBy('userOpenRequestTotals')").tableSort Total Currently Open Requests
                th(v-on:click="sortBy('rawUserCloseTime')").tableSort Average Time to Close Requests

            tr(v-for="user in sortedUserData")
                td(v-if="user.userMergeRequests[0].avatar")
                    img(v-bind:src='user.userMergeRequests[0].avatar').sizeAvatarPicturesOnList
                td(v-else)
                    img(src='../../public/images/blocked.jpeg').sizeAvatarPicturesOnList
                td
                    router-link(:to="user.userName") {{ user.userName }} (Click for details)
                td {{ user.userRequestTotals }}
                td {{ user.userClosedRequestTotals }}
                td {{ user.userOpenRequestTotals }}
                td {{ user.userCloseTime }}
            
</template>