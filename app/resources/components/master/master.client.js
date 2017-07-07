'use strict';

import Vue from 'vue';
import usersList from './usersList.vue';
import userDetails from './userDetails.vue';
import master from './master.vue';
import VueRouter from 'vue-router';
import Vue2Filters from 'vue2-filters';
import VeeValidate from 'vee-validate';

Vue.use(VueRouter);
Vue.use(Vue2Filters);
Vue.use(VeeValidate);

const router = new VueRouter({
    routes: [
        { path: '/', component: usersList, props: true },
        { path: '/:authorName', component: userDetails, props: true }
    ]
});

new Vue({
    router,
    el: '#RouterVue',
    // render(h) {
    //     // h creates element, pass in component to render to bypass compiler for faster render
    //     return h(master)
    // },
    // template: '<vue-master></vue-master>',
    components: {
        [master.name]: master,
        [usersList.name]: usersList,
        [userDetails.name]: userDetails
    }
});