<template>
  <div class="container">
    <div class="grid_text">
      <div class="grid_title">{{ view.title }}</div>
      <div v-html="view.text"></div>
    </div>
    <Standard :items="items" :users="users" :view="view" />
  </div>
</template>

<script>
import Standard from "./templates/Standard.vue";

export default {
  name: "GridView",
  data() {
    return {
      items: null,
      users: null,
    };
  },
  props: ["view", "data", "topics", "category"],
  components: {},
  methods: {
    getTopics(tag) {
      var self = this;
      fetch("https://edgeryders.eu/tag/" + tag + ".json")
        .then((response) => response.json())
        .then((data) => {
          var array = data.topic_list.topics.map((x) => self.createItem(x));
          self.items = array;
          self.users = data.users;
        });
    },
    getData(topicId) {
      var self = this;
      fetch("https://edgeryders.eu/raw/" + this.view.data + ".json")
        .then((response) => {
          response.text().then(function(text) {
            self.items = self.parseJson(text).data;
          });
        })
        .catch((error) => console.error(error));
    },
    createItem(item) {
      var obj = {
        title: item.title,
        image: item.image_url,
        date: item.created_at,
        text: item.excerpt,
        url: "https://edgeryders.eu/t/" + item.slug,
        author: item.posters[0].user_id,
        likes: item.like_count,
      };
      return obj;
    },
    parseJson(value) {
      var code = value.match(/```([^`]*)```/);
      if (code) {
        return JSON.parse(code[1]);
      } else {
        return false;
      }
    },
  },
  components: {
    Standard,
  },
  mounted() {
    if (this.view.data) {
      this.getData(this.view.data);
    }
    if (this.view.config.tag) {
      this.getTopics(this.view.config.tag);
    }
  },
};
</script>

<style lang="scss">
.container {
  max-width: 1220px;
  width: 90%;
  margin: 0 auto;
}
</style>
