require("../bootstrap");


import Vue from "vue";

window.Vue = require("vue");

Vue.component('contact-form', require('./components/ContactForm.vue').default);

const app = new Vue({
    el: "#web",
    beforeCreate:function(){
    }
});
