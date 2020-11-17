<template>
  <div class="carousel" v-resize="onResize">
    <Boxes v-if="view.config.type == 'boxes'" :slides="items" />
    <News v-if="view.config.type == 'news'" :slides="items" :show="view.config.show" />
  </div>
</template>

<script>
import Boxes from "./templates/Boxes.vue";
import News from "./templates/News.vue";
import List from "@/components/views/List/templates/Mobile.vue";

export default {
  data() {
    return {
     viewport: "desktop",
     items: null,
     users: null
    };
  },
  components: {
    Boxes,
    News,
    List
  },
  methods: {
   onResize({ width, height }) {
      if (width < 600) {
        this.viewport = "mobile";
      } else {
        this.viewport = "desktop";
      }
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
      console.log(code)
      if (code) {
        return JSON.parse('{ ' + code[1] + ' }');
      } else {
        return false;
      }
    }
  },
  created() {
    var self = this;
    if (self.view.config.data) {
      fetch("https://edgeryders.eu/raw/" + self.view.config.data + ".json")
        .then((response) => {
          response.text().then(function(text) {
            self.items = self.parseJson(text).data;
          });
        })
        .catch((error) => console.error(error));
    }
    if (self.view.config.category) {
      fetch("https://edgeryders.eu/c/" + self.view.config.category + ".json")
        .then((response) => response.json())
        .then((data) => {
          var array = data.topic_list.topics.map((x) => self.createItem(x));
          var items = array.sort((a, b) => b.date.localeCompare(a.date));
          if (this.view.config.items) {
           self.items = items.slice(0, this.view.config.items)
          } else {
           self.items = items;
          }
          self.users = data.users.slice(0, this.view.config.items);
        })
        .catch((error) => console.error(error));
    }
  },
  mounted() {
    var width = this.$el.offsetWidth;
    this.width = width;
    if (width < 700) {
      this.viewport = "mobile";
    } else {
      this.viewport = "desktop";
    }
  },
  filters: {
  
  },
  props: ["view"],
};
</script>

<style lang="scss" scoped>
.hooper {
  outline: none !important;
}
.hooper-slide {
  opacity: 0.2;
  transition: all 1s ease;
  &:hover {
    opacity: 1;
  }
}
.hooper-slide.is-current {
  opacity: 1;
  transform: scale(1.1);
}
.hooper-track {
  padding: 2rem 0;
}
.hooper {
  min-height: 360px !important;
}
.slide {
  width: 90%;
  margin: 5% auto 5%;
  height: 85%;
  display: flex;
  justify-content: center;
  border-radius: 10px;
  &:hover {
    cursor: grab;
  }
  .slide_info {
    flex-grow: 1;
    border-radius: 10px;
    background: #fafafa;
    padding: 1.5rem 1.5rem 0.75rem;
    width: 50%;
    display: flex;
    flex-direction: column;
    justify-content: center;

    align-items: flex-start;
    a {
      text-decoration: none;
      font-weight: bold;
      color: black;
      display: inline-block;
      &.slide_title {
        width: 100%;
        padding-bottom: 0.5rem;
        margin-bottom: 0.75rem;
        line-height: 1.3rem;
        border-bottom: 1px solid #efefef;
        &:hover {
          color: #ef5d3b;
        }
      }
      &.slide_link {
        background: black;
        display: inline-block;
        padding: 0.5rem 0.75rem;
        color: white;
        font-size: 0.68rem;
        margin: 0.65rem 0 0;
        flex-shrink: 0;
        border-radius: 20px;
        &:hover {
          background: #ef5d3b;
        }
      }
    }
    p {
      width: 100%;
      margin: 1rem 0 0 0;
      font-size: 0.8rem;
      display: inline-block;
      line-height: 1.2rem;
      &.slide_excerpt {
        overflow: hidden;
      }
    }
  }
  .slide_image {
    flex-shrink: 0;
    border-radius: 0 10px 10px 0;
    background-size: cover !important;
    background-position: 50% 50% !important;
    width: 40%;
    height: 100%;
    display: inline-block;
    box-shadow: inset 4px 0 10px rgba(0, 0, 0, 0.1);
  }
  h3 {
  }
}

@media only screen and (max-width: 600px) {
  .hooper {
    margin: 30px auto 0;
    height: 400px;
  }
  .hooper-slide {
    opacity: 0.4;
    transition: all 1s ease;
    &:hover {
      opacity: 1;
    }
  }
  .slide {
    justify-content: flex-start;
    flex-direction: column;
    margin-top: 30px;
    border-radius: 10px 10px 0 0 !important;
    overflow: hidden;
    .slide_info {
      width: 100%;
      padding: 1rem;
      flex-shrink: 0;
      height: 120px;
      overflow: scroll;
      border-radius: 0px 0px 0 0 !important;
      order: 2;
    }
    .slide_image {
      width: 100%;
      border-radius: 10px 10px 0 0 !important;
      order: 1;
      height: 90px;
    }
  }
}
</style>
