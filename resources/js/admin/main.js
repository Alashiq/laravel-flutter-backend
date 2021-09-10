require("../bootstrap");

import Vue from "vue";

import DataServices from "./shared/DataServices";
import Alert from "./shared/Alert";
import Loading from "./shared/Loading";
window.Vue = require("vue");

import VueRouter from "vue-router";
Vue.use(VueRouter);
import { routes } from "./routes/routes";


import Vuex from 'vuex'
Vue.use(Vuex)
import storeData from "./store/index.js"
import axios from "axios";

Vue.prototype.$http = DataServices;
Vue.prototype.$alert = Alert;
Vue.prototype.$loading = Loading;

const store = new Vuex.Store(
    storeData
 )

const router = new VueRouter({
    routes,
    mode: "history",
});





// Shared Components
Vue.component('App-Side', require('../admin/pages/Layout/AppSide/AppSide.vue').default);
Vue.component('App-Header', require('../admin/pages/Layout/AppHeader/AppHeader.vue').default);
Vue.component('Empty-Box', require('../admin/pages/Layout/EmptyBox/EmptyBox.vue').default);
Vue.component('Loading-Box', require('../admin/pages/Layout/LoadingBox/LoadingBox.vue').default);




window.root = new Vue({
    el: "#app",
    router,
    store,
    beforeCreate: function () {
    },
    methods:{
    }
});



