<script>
'use strict';

export default {
    name: 'vue-master',
    props: ['dbMergeRequests', 'userList', 'mergeRequestsByUser', 'closedRequestsTotals', 'averageUsersCloseTimes', 'rawUsersCloseTimes'],
    data() {
        return {
            message: 'Vue Master'
        };
    }
}
</script>

<template lang="pug">
    router-view(v-bind:user-list="this.userList" v-bind:merge-requests-by-user="this.mergeRequestsByUser" v-bind:closed-requests-totals="this.closedRequestsTotals" v-bind:average-users-close-times="this.averageUsersCloseTimes" v-bind:raw-users-close-times="this.rawUsersCloseTimes")
</template>