import Vue from "vue";
import App from "./App.vue";

window.md = require('markdown-it')();
var markdownItAttrs = require('markdown-it-attrs');
var emoji = require('markdown-it-emoji');
import twemoji from 'twemoji'
import vuescroll from 'vue-scroll'

import vueHeadful from 'vue-headful';
 
Vue.component('vue-headful', vueHeadful);


Vue.config.productionTip = false;

md.use(markdownItAttrs).use(emoji);

window.md.renderer.rules.emoji = function(token, idx) {
  return twemoji.parse(token[idx].content, {  size: 'svg', ext: '.svg' });
};

Vue.use(vuescroll)

new Vue({
  render: h => h(App)
}).$mount("#app");
