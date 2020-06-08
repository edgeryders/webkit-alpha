<template>
  <div class="text" :style="config && config.style">
    <div v-if="title" class="text_title" v-html="title"></div>
    <div :class="{'horizontal': content.length > 1 }">
      <div class="text_content" v-for="(content, index) in content" v-html="content"></div>
      <div v-if="topic_text" v-html="topic_text" class="topic"></div>
      <div v-if="links" class="links">
        <a class="text_link" v-for="link in links" :href="link.url" :style="link.style" target="_blank">{{link.text}}</a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "TextView",
  data() {
    return {
      topic_text: null
    }
  },
  props: {
    title: String,
    text: Array,
    links: Array,
    config: Object
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

