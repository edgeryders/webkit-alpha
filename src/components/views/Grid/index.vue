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
    <Standard
      v-else
      :view="view"
      :items="items"
    />
  </div>
</template>

<script>
import People from "./templates/People.vue";
import Events from "./templates/Events.vue";
import Standard from "./templates/Standard.vue";

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
    Standard
  },
  methods: {
    getUsers(value, type) {
      var self = this;
      fetch("https://edgeryders.eu/" + type + "/" + value + ".json")
        .then((response) => response.json())
        .then((data) => {
          var array = data.users.map((x) => self.createProfile(x));
          self.items = array;
        });
    },
    getTopics(value, type) {
      var self = this;
      fetch("https://edgeryders.eu/" + type + "/" + value + ".json")
        .then((response) => response.json())
        .then((data) => {
          self.items = data.topic_list.topics;
        });
    },
     getUrl(url) {
      var self = this;
      fetch(url)
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
      if (item.event) {
        var event_start = item.event.start
      }
      var obj = {
        title: item.title,
        image: item.image_url,
        text: item.excerpt,
        start: event_start,
        url: "https://edgeryders.eu/t/" + item.slug,
        likes: item.like_count,
      };
      return obj;
    },
    createProfile(item) {
      var obj = {
        title: item.name,
        username: item.username,
        image: "https://edgeryders.eu/" + item.avatar_template.replace('{size}', '200')
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
    if (this.view.config.tag && this.view.config.template == "people" ) {
      this.getUsers(this.view.config.tag, 'tags');
    }
    if (this.view.config.tag && this.view.config.template == "events") {
      this.getTopics(this.view.config.tag, 'tags');
    }
    if (this.view.config.category) {
      this.getTopics(this.view.config.category, 'c');
    }
    if (this.view.config.url) {
      this.getUrl(this.view.config.url);
    }
  },
};
</script>

<style lang="scss">
.container {
  width: 100%;
  max-width: 2000px;
  margin: 0 auto;
}
</style>
