<script>
'use strict';

export default {
    name: 'vue-master',
    props: ['compiledUsersData'],
    data() {
        return {
            message: 'Vue Master'
        };
    }
}
</script>

<template lang="pug">
    router-view(v-bind:compiled-users-data="this.compiledUsersData")
</template>