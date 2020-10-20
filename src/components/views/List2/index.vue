<template>
  <div class="container">
    <Special
      :view="view"
      :items="items"
    />

  </div>
</template>

<script>
import Special from "./templates/Special.vue";
export default {
  name: "List",
  data() {
    return {
      selected: null,
      active: false,
      users: null,
      topics: null,
      display: null,
      index: 0,
      viewport: 'desktop',
      search: ''
    };
  },
  mounted() {
    if (this.view.config.tag) {
      this.getTopics(this.view.config.tag, 'tag')
    }
    if (this.view.config.category) {
      this.getTopics(this.view.config.category, 'category')
    }
    if (this.view.config.url) {
      this.getUrl(this.view.config.url)
    }
    if (this.view.config.data) {
      this.getData(this.view.config.data)
    }
    var width = this.$el.offsetWidth;
    if (width < 500) {
      this.viewport = "mobile";
    } else {
      this.viewport = "desktop";
      this.selected = 0;
    }
    if (this.view.config.display) {
      this.display = this.view.config.display.replace(" ", "").split(",");
    } else {
      this.display = null;
    }
  },
  methods: {
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
    getAuthor(userid) {
      return this.users.filter((x) => x.id == userid)[0].username;
    },
    parseJson(value) {
      var code = value.match(/```([^`]*)```/);
      if (code) {
        return JSON.parse(code[1]);
      } else {
        return false;
      }
    },
    getData(topicId) {
      var self = this;
      fetch("https://edgeryders.eu/raw/" + topicId + ".json")
        .then((response) => {
          response.text().then(function(text) {
            self.items = self.parseJson(text).data;
          });
        })
        .catch((error) => console.error(error));
    },
    getTopics(value, type) {
      var self = this;
      if (type == "tag") {
        fetch("https://edgeryders.eu/tag/" + value + ".json")
          .then((response) => response.json())
          .then((data) => {
            self.users = data.users;
            var array = data.topic_list.topics.map((x) => self.createItem(x));
            self.items = array;
          });
      }
      if (type == "category") {
        fetch("https://edgeryders.eu/c/" + value + ".json")
          .then((response) => response.json())
          .then((data) => {
            self.users = data.users;
            var array = data.topic_list.topics.map((x) => self.createItem(x));
            self.items = array;
          });
      }
    }
  },
  components: {
    Special
  },
  props: ["view", "items", "template"],
};
</script>

<style lang="scss">

</style>
