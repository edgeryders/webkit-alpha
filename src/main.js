import Vue from "vue";
import App from "./App.vue";
import "./assets/base.scss";

window.md = require("markdown-it")({
  html: true,
});
var markdownItAttrs = require("markdown-it-attrs");
var emoji = require("markdown-it-emoji");
import twemoji from "twemoji";
import vuescroll from "vue-scroll";

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

new Vue({
  render: (h) => h(App),
}).$mount("#app");
