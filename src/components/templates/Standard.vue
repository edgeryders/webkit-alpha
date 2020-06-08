<template>
  <div id="app">
    <div v-for="(block, index) in blocks" :key="index">
         <div v-if="type(block) == 'menu'" class="menu" :style="block.menu.style"> 
            <span class="title" @click="loadThemeLocal('on_the_beach.scss')" v-if="block.menu.title" v-html="block.menu.title"></span>
            <div>
              <div v-if="getNavElements(blocks).length && showAnchorMenu(block.menu)" class="links scroll">
                <a v-for="(link, index) in getNavElements(blocks)" :href='link.url'>
                 {{ link.text }}
                </a>
              </div>
              <div v-if="block.menu.links" class="links external">
                <span v-for="(link, index) in block.menu.links" :key="index" v-html="link"></span>
              </div>
            </div>
          </div>

          <div v-if="type(block) == 'header'" class="section header" :style="block.header.style"> 
            <div class="wrapper">
              <div v-for="(view, index) in block.header.views" :key="index">
                <div class="image" v-if="view.type == 'image'" style="width: 300px">
                    <img :src="view.image.url" />
                </div>
                <TextView v-if="view.type == 'text'" :title="view.title" :text="view.text" :config="view.config" :stylesheet="view.style" />
              </div>
            </div>
          </div>

          <div v-if="type(block) == 'content'" class="section content" :style="block.content.style"> 
            <div class="title" v-if="block.content.title" v-html="block.content.title">
            </div>
            <div class="wrapper">
              <div v-for="(view, index) in block.content.views" :key="index" class="view" :class="view.type">
                <div v-if="view.type == 'image'" style="width: 300px">
                    <img :src="view.image.url" />
                </div>
                <TextView v-if="view.type == 'text'" :title="view.title" :text="view.text" :config="view.config" />
                <FormView v-if="view.type == 'form'" :title="view.title" :text="view.text" :fields="view.fields" />
              </div>
            </div>
          </div>
    </div>

  </div>
</template>

<script>
var YAML = require('yamljs');

import TextView from '@/components/views/Text.vue'
import FormView from '@/components/views/Form.vue'

export default {
  name: "App",
  data() {
    return {
      tags: null,
      title: null,
      links: null,
      config: null,
      stylesheet: null,
      data: {
        config: null,
        blocks: null
      }
    }
  },
  components: {
    TextView,
    FormView
  },
  props: ["blocks"],
  methods: {
    getNavElements(sections) {
      var self = this;
        var navArray = sections.map(function(el) {
          var block = self.type(el);
          var id = el[block]['config'] && el[block]['config']['id'];
          if (id && block !== 'menu') {
            return {
              text: id,
              url: '#' + id
            } 
          }
        });
        return navArray.filter(function (el) {
            return el != null;
        });
    },
    showAnchorMenu(menu) {
      if (menu.config && menu.config.anchor == false) {
        return false
      } else {
        return true
      }
    },
    type(obj) {
      return Object.keys(obj)[0]
    }
  },
  created(){
    

  }
};
</script>

<style lang="scss" scoped>


</style>