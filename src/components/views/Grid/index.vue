<template>
  <div class="container">
    <div class="grid_text">
      <div class="grid_title">{{ view.title }}</div>
      <div v-html="view.text"></div>
    </div>
    <People
      v-if="view.config.template == 'people'"
      class="grid_template"
      :items="items"
    />
    <Events
      v-if="view.config.template == 'events'"
      :items="items"
      :view="view"
    />
  </div>
</template>

<script>
import People from "./templates/People.vue";
import Events from "./templates/Events.vue";

export default {
  name: "GridView",
  data() {
    return {
      items: null,
    };
  },
  props: ["view", "data", "topics", "category"],
  components: {
    People,
    Events,
  },
  methods: {
    getTopics(tag) {
      var self = this;
      fetch("https://edgeryders.eu/tag/" + tag + ".json")
        .then((response) => response.json())
        .then((data) => {
          var array = data.topic_list.topics.map((x) => self.createItem(x));
          self.items = array;
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
        text: item.excerpt,
        url: "https://edgeryders.eu/t/" + item.slug,
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
