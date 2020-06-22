<template>
  <div id="app">
    <vue-headful :title="config.site.title || 'Edgeryders'" :description="config.site.summary"/>
    <div v-for="(block, index) in blocks" :key="index">
         <div v-if="type(block) == 'menu'" class="menu" :style="block.menu.style"> 
            <div class="title">
                <img v-if="config.site.icon" :src="config.site.icon" />
                <span v-if="block.menu.title"> 
                  <h2>{{block.menu.title}}</h2>
                </span>
            </div>
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
            <div class="container">
              <div class="wrapper">
                <div v-for="(view, index) in block.header.views" :key="index" :style="view.style">
                  <div class="hero_title" v-if="view.title">
                    <span v-html="view.title" class="title"></span>
                  </div>
                  <TextView v-if="view.type == 'text'" :text="view.text" :config="view.config" :stylesheet="view.style" />
                </div>
              </div>
            </div>
          </div>

          <div v-if="type(block) == 'content'" class="section content" :style="block.content.style" :id="block.content.config.id"> 
            <div class="title" v-if="block.content.title" :class="{single: isSingle(block.content.views)}">
              <h3>{{block.content.title}}</h3>
            </div>
            <div class="wrapper">
              <div v-for="(view, index) in block.content.views" :key="index" class="view" :class="view.type">
                <div v-if="view.type == 'image'" style="width: 300px">
                    <img :src="view.image.url" />
                </div>
                <TextView v-if="view.type == 'text'" :video="view" :title="view.title" :text="view.text" :config="view.config" />

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
  props: ["blocks", "config"],
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
    },
    isSingle(views) {
      var text = views.filter(x => x.type == 'text')[0];
      if (text.text.length == 1 && views.length == 1) {
        return true
      } else {
        return false
      }
    }
  },
  created(){
    

  }
};
</script>

<style lang="scss" scoped>
.section {
  padding: 60px 0 0;
}
.hero_title {
  display: flex;
  border-bottom: 1px solid #ddd;
  align-items: center;
  padding-bottom: .85rem;
  margin-bottom: 1rem;
  span.title {
    font-size: 1.15rem !important;
    /deep/ h2 {
      margin: 0 !important;
      padding-bottom: 0;
    }
  }
  img {
    width: 33px;
    height: 33px;
    margin: 0 10px 0 0;
  }
}
.menu {
  .title {
    display: flex;
    align-items: center;
  }
  a {
  font-weight: bold !important;
  }
  img {
    width: 26px;
    margin-right: .75rem;
  }
}
.section.header {
  padding: 120px 0 50px;
  .container {
    width: 80%;
    max-width: 860px;
  }
  .wrapper {
    max-width: 600px;
    display: inline-block;
    margin: 0;
  }
  .text_wrapper /deep/ p {
      font-size: 1.2rem;
      font-weight: bold;
      line-height: 1.75rem;
    }
}
.section.content {
  .title {
    max-width: 1080px;
    &.single {
      max-width: 860px;
    }
  }
  .wrapper {
    max-width: 1080px;
    .text_wrapper.single {
      max-width: 860px;
      margin: 0 auto;
    }
    .text {
      /deep/ p {
        margin-bottom: 1rem;
      }
      /deep/ ul {
        list-style: square;
        font-size: 1.1rem;
        margin: 0;
        padding: 0 .5rem 0 1.5rem;
        li {
          margin-bottom: 1rem;
          line-height: 1.55rem;
        }
      }
    }
  }
}
</style>