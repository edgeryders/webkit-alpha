import Vue from "vue";
import App from "./App.vue";
import "./assets/base.scss";

export const bus = new Vue();

import VueRouter from 'vue-router'

Vue.use(VueRouter)

import "vue-resize/dist/vue-resize.css";
import VueResize from "vue-resize";

Vue.use(VueResize);

import VueMasonry from "vue-masonry-css";

import VueAnalytics from "vue-analytics";

Vue.use(VueMasonry);

window.md = require("markdown-it")({
  html: true
});
var markdownItAttrs = require("markdown-it-attrs");
var emoji = require("markdown-it-emoji");
import twemoji from "twemoji";
import vuescroll from "vue-scroll";
const VueScrollTo = require("vue-scrollto");
Vue.use(VueScrollTo);

import VueSmoothScroll from "vue2-smooth-scroll";
Vue.use(VueSmoothScroll);

import vueHeadful from "vue-headful";

Vue.component("vue-headful", vueHeadful);

import VueKinesis from "vue-kinesis";
Vue.use(VueKinesis);

import VueResizeObserver from "vue-resize-observer";
Vue.use(VueResizeObserver);

Vue.config.productionTip = false;

md.use(markdownItAttrs).use(emoji);

window.md.renderer.rules.emoji = function(token, idx) {
  return twemoji.parse(token[idx].content, { size: "svg", ext: ".svg" });
};

Vue.use(vuescroll);

Vue.use(VueAnalytics, {
  id: "UA-4275556-5"
});

const routes = [
  { path: '/foo', component: App }
]

const router = new VueRouter({
  mode: 'history',
  routes // short for `routes: routes`
})


new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
