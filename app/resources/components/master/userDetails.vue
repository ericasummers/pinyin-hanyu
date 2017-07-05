<script>
'use strict';

import moment from 'moment';
import Vue2Filters from 'vue2-filters';
import _ from 'lodash';

export default {
    name: 'vue-user-details',
    props: ['userList', 'mergeRequestsByUser', 'closedRequestsTotals', 'averageUsersCloseTimes'],
    data() {
        return {
            message: 'Vue User Details',
            sortedUserData: [],
            lastSort: '',
            sortCount: 0
        };
    },
    computed: {
        userMergeRequests: function() {
            return this.getSpecificUserValue(this.mergeRequestsByUser, this.$route.params.authorName);
        }
    },
    methods: {
        getSpecificUserValue: function(groupDataArray, params) {
            let output = [];

            for (let i = 0; i < this.userList.length; i++) {
                if (this.mergeRequestsByUser[i][0].authorName === this.$route.params.authorName) {
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
                this.sortedUserData = _.sortBy(this.userMergeRequests, property);
                this.sortCount = 1;
            } else if (this.lastSort === property && this.sortCount % 2 != 0) {
                this.sortedUserData = _.sortBy(this.userMergeRequests, property).reverse();
                this.sortCount = 0;
            } else {
                this.sortedUserData = _.sortBy(this.userMergeRequests, property).reverse();
                this.lastSort = property;
                this.sortCount = 0;
            }
            return this.sortedUserData;
        }
    },
    beforeMount() {
        this.sortBy('projectName');
    }
}
</script>

<template lang="pug">
    h3#userDetailsDisplay User {{ $route.params.authorName }} has completed {{ getSpecificUserValue(mergeRequestsByUser, $route.params.authorName).length }} merge requests to date! They have closed {{ getSpecificUserValue(closedRequestsTotals, $route.params.authorName) }} requests. On average, it takes them {{ getSpecificUserValue(averageUsersCloseTimes, $route.params.authorName) }} to close a merge request.
        br
        br
        p Merge Requests Details:
            br
            br
            table#userDetailTable
                tr
                    th(v-on:click="sortBy('projectName')").tableSort Project Name
                    th(v-on:click="sortBy('title')").tableSort Merge Request Title
                    th(v-on:click="sortBy('description')").tableSort Merge Request Description (if any)
                    th(v-on:click="sortBy('createdDate')").tableSort Date Merge Request Created
                    th(v-on:click="sortBy('state')").tableSort State
                    th(v-on:click="sortBy('closedDate')").tableSort Date Closed/Merged (if applicable)

                tr(v-for="userRequest in sortedUserData")
                    td 
                        a(:href="userRequest.web_url") {{ userRequest.projectName | capitalize }}
                    td(v-if="!userRequest.title") 
                        a(:href="userRequest.web_url") N/A
                    td(v-else) 
                        a(:href="userRequest.web_url") {{ userRequest.title | capitalize }}
                    td(v-if="!userRequest.description") 
                        a(:href="userRequest.web_url") N/A
                    td(v-else) 
                        a(:href="userRequest.web_url") {{ userRequest.description | capitalize }}
                    td 
                        a(:href="userRequest.web_url") {{ dateFormat(userRequest.createdDate) }}
                    td 
                        a(:href="userRequest.web_url") {{ userRequest.state }}
                    td(v-if="userRequest.state !='opened'")
                        a(:href="userRequest.web_url") {{ dateFormat(userRequest.closedDate) }}
                    td(v-else)
                        a(:href="userRequest.web_url") N/A

            br
            router-link(to='/') Back to users list
</template>