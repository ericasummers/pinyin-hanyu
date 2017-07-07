<script>
'use strict';

import moment from 'moment';
import Vue2Filters from 'vue2-filters';
import _ from 'lodash';

export default {
    name: 'vue-user-details',
    props: ['compiledUsersData'],
    data() {
        return {
            message: 'Vue User Details',
            sortedUserData: [],
            userAllMerges: [],
            lastSort: '',
            sortCount: 0
        };
    },
    computed: {
        allUserData: function(params) {
            let output = [];
            for (let i = 0; i < this.compiledUsersData.length; i++) {
                if (this.compiledUsersData[i].userName === this.$route.params.authorName) {
                    output.push(this.compiledUsersData[i]);
                }
            }
            return output[0];
        },
        profilePicture: function() {
            let profilePicture = this.allUserData.avatar;
            if (profilePicture) {
                return profilePicture;
            } else {
                return "../../public/images/blocked.jpeg";
            }
        },
        userAllMergeRequests: function(params) {
            this.userAllMerges = this.allUserData.userMergeRequests
            return this.userAllMerges;
        }
    },
    methods: {
        dateFormat: function(dateValue) {
            return moment(String(dateValue)).format('dddd, MMMM Do YYYY, hh:mm:ss a');
        },
        sortBy: function(property) {
            if (this.lastSort === property && this.sortCount === 0) {
                this.sortedUserData = _.sortBy(this.userAllMergeRequests, property);
                this.sortCount = 1;
            } else if (this.lastSort === property && this.sortCount != 0) {
                this.sortedUserData = _.sortBy(this.userAllMergeRequests, property).reverse();
                this.sortCount = 0;
            } else {
                this.sortedUserData = _.sortBy(this.userAllMergeRequests, property).reverse();
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
div.container
    img.sizeAvatarPicturesOnDetail(v-bind:src="profilePicture")

    h3#userDetailsDisplay.frescaFont {{ $route.params.authorName }} has completed {{ allUserData.userRequestTotals }} merge requests to date! They have closed {{ allUserData.userClosedRequestTotals }} requests. On average, it takes them {{ allUserData.userCloseTime }} to close a merge request.
        
    table#userDetailTable.frescaFont
        tr
            th(v-on:click="sortBy('projectName')").headingTitlePadding.tableSort  Project
            th(v-on:click="sortBy('title')").headingTitlePadding.tableSort Title
            th(v-on:click="sortBy('description')").headingTitlePadding.tableSort Description
            th(v-on:click="sortBy('createdDate')").headingTitlePadding.tableSort Created
            th(v-on:click="sortBy('state')").headingTitlePadding.tableSort State
            th(v-on:click="sortBy('closedDate')").headingTitlePadding.tableSort Merged

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
    router-link.frescaFontWhite.headingTitlePadding(to='/') Back to users list
    br
    br
    h5.frescaFont brought to you by "The Interns" 
            a(href="https://github.com/ericaw21") Erica Wright
            span &nbsp;&&nbsp;
            a(href="https://github.com/Michaela-Davis") Michaela Davis
            span &nbsp; P.S. We miss you!
</template>