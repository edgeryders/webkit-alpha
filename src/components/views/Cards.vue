<template>
  <div class="cards" v-resize="onResize" v-if="items.length">
    <div class="cards_text" v-if="view.title || view.text">
      <div class="cards_title title">{{ view.title }}</div>
      <div v-html="view.text"></div>
    </div>
    <div class="row">
      <div class="row_options">
        <div class="row_navigation">
          <button class="toggle previous" @click="previous()"></button>
          <button class="toggle next" @click="next()"></button>
        </div>
      </div>
      <div class="row_wrapper" v-if="items">
        <Card
          v-for="(item, index) in items.slice(
            card_index,
            card_index + card_count
          )"
          class="item"
          :parallax="parallax"
          :data="item"
          :key="index"
        />
      </div>
    </div>
  </div>
</template>

<script>
import Card from "@/components/elements/Card.vue";

export default {
  name: "GridView",
  data() {
    return {
      items: null,
      activeColor: "red",
      topic_text: null,
      parallax: "depth",
      dynamic: "Test",
      card_count: 5,
      card_index: 0,
    };
  },
  props: ["view"],
  components: {
    Card,
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
    createItem(item) {
      var obj = {
        title: item.title,
        image: item.image_url,
        text: item.excerpt.replace(/<[^>]*>?/gm, ""),
        url: "https://edgeryders.eu/t/" + item.slug,
        likes: item.like_count,
      };
      return obj;
    },
    onResize({ width, height }) {
      if (width < 500) {
        this.card_count = this.items.length;
        this.parallax = false;
      }
    },
    previous() {
      if (this.card_index - this.card_count < 0) {
        this.card_index = this.card_count;
      } else {
        this.card_index = this.card_index - this.card_count;
      }
    },
    next() {
      if (this.card_index + this.card_count > this.items.length) {
        this.card_index = 0;
      } else {
        this.card_index = this.card_index + this.card_count;
      }
    },
  },
  mounted() {
    var width = this.$el.offsetWidth;
    if (width < 500) {
      this.card_count = this.items.length;
      this.parallax = "false";
    }
    if (this.view.config.tag) {
      this.getTopics(this.view.config.tag);
    }
  },
};
</script>

<style lang="scss">
.cards {
    max-width: 1280px;
    margin: 0 auto;
  .cards_text {
    width: 80%;
    line-height: 1.75rem;
    font-size: 1.2rem;
    margin: 0 auto 1.5rem;
  }
}
.cards .row {
  width: 102%;
  margin-left: -1%;
  position: relative;
  display: flex;
  justify-content: flex-start;

  .row_options {
    width: 100%;
    max-width: 1520px;
    display: flex;
    justify-content: flex-end;
    position: absolute;
    top: -60px;

    align-items: center;
    .row_navigation {
      display: inline-flex;
      width: auto;
    }
  }
  .item {
    display: block;
    border-radius: 10px;
    position: relative;
    float: left;
    background-size: cover !important;
    width: 18%;
    height: 24vw;
    overflow: hidden;
  }
  .item .item_info {
    height: 82%;
    width: 85%;
    position: absolute;
    border-radius: 10px;
    bottom: 0;
    display: block;
    padding: 8%;
    background: rgba(0, 0, 0, 0.8);
    transform: translateY(100%);
    transition: all 0.4s ease;
    h2 {
      font-size: 1rem;
      margin: 0.5rem 0;
    }
    p {
      font-size: 0.8rem;
    }
  }

  .item:hover .item_info {
    transform: translateY(0%);
    color: white;
  }
}

@media only screen and (max-width: 600px) {
  .row {
    width: auto;
    margin: 0 auto;
    overflow: hidden;
    width: 100%;
    .row_wrapper {
      overflow-x: auto;
      scroll-snap-type: x mandatory;
      display: flex;
      scroll-behavior: smooth;
      -webkit-overflow-scrolling: touch;
      .item {
        scroll-snap-align: start;
        width: 70vw !important;
        height: 400px;
        margin-right: 1rem;
        flex-shrink: 0;
      }
    }
    .row_options {
      display: none;
    }
    .item {
      width: 500px !important;
    }
  }
}
</style>
