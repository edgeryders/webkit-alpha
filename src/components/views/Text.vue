<template>
  <div class="text_wrapper" :class="[{'single': content.length == 1 }, config && config.class]" :style="config && config.style">
    <div v-if="title" class="text_title" v-html="title"></div>
    <div :class="{'horizontal': content.length > 1 }">
      <component class="text_content" v-for="(test, index) in content" v-bind:is="parse(test)" :key="index"></component>
      <div v-if="topic_text" v-html="topic_text" class="topic"></div>
      <div v-if="links" class="links">
        <a class="text_link" v-for="link in links" :href="link.url" :style="link.style" target="_blank">{{link.text}}</a>
      </div>
    </div>
  </div>
</template>

<script>
import User from "@/components/elements/User.vue";
import Vue from 'vue';

Vue.component('User', User);

export default {
  name: "TextView",
  data() {
    return {
      topic_text: null,
      dynamic: 'Test'
    }
  },
  components: {
    User
  },
  props: {
    title: String,
    text: Array,
    links: Array,
    config: Object,
    video: Object
  },
  methods: {
    parse(text) {
      var match = text.match(/\B@[a-z0-9_-]+/gim);
      console.log(match)
      if (match) {
        var username = text.match(/\B@[a-z0-9_-]+/gim)[0];
        function getUserComponent(match, offset, string) {
          return '<User username="' + match + '"></User>'
        }

        var html = text.replace(/\B@[a-z0-9_-]+/gim, getUserComponent);
  

        return {
            template: '<div>' + html + '</div>'
        }
      } else {
        return {
            template: '<div>' + text + '</div>'
        }
      }
    }
  },
  created(){
    this.content = this.text;
    if (this.config && this.config.topic) {
      fetch('https://edgeryders.eu/t/' + this.config.topic + '.json')
      .then(response => response.json())
      .then(data => {
        this.topic_text = data.post_stream.posts[0].cooked;
      })
    }
  }
};
</script>

