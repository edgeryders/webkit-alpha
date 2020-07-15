<template>
  <div class="slider" v-resize="onResize" v-if="slides">
    <hooper :settings="settings">
      <slide v-for="(slide, indx) in slides" :key="indx" :index="indx">
        <div class="slide">
          <div class="slide_info">
            <a
              class="slide_title"
              :href="getPermalink(slide.slug)"
              target="_blank"
              >{{ slide.title }} {{ width }}</a
            >
            <User :username="getAuthor(slide.posters[0].user_id)" mini="true" />
            <p class="slide_excerpt" v-html="slide.excerpt"></p>
            <a
              class="slide_link"
              :href="getPermalink(slide.slug)"
              target="_blank"
              >Read More</a
            >
          </div>

          <div
            class="slide_image"
            v-if="slide.image_url"
            :style="{ background: 'url(' + slide.image_url + ')' }"
          ></div>
        </div>
      </slide>
    </hooper>
  </div>
</template>

<script>
import User from "@/components/elements/User.vue";

import moment from "moment";
import { Hooper, Slide } from "hooper";
import "hooper/dist/hooper.css";

export default {
  data() {
    return {
      slides: null,
      width: null,
      settings: {
        itemsToShow: 1.15,
        centerMode: true,
        playSpeed: 5000,
        transition: 800,
        infiniteScroll: true,
        autoplay: true,
        breakpoints: {
          600: {
            itemsToShow: 1.75,
          },
        },
      },
    };
  },
  components: {
    Hooper,
    Slide,
    User,
  },
  methods: {
    onResize({ width, height }) {
      if (width < 600) {
        this.settings.itemsToShow = 1.15;
      }
    },
    getAuthor(userid) {
      return this.users.filter((x) => x.id == userid)[0].username;
    },
    getTopics(value, type) {
      var self = this;
      if (type == "tag") {
        fetch("https://edgeryders.eu/tag/" + value + ".json")
          .then((response) => response.json())
          .then((data) => {
            self.users = data.users;
            self.slides = data.topic_list.topics;
          });
      }
    },
    getPermalink(slug) {
      return "https://edgeryders.eu/t/" + slug;
    },
    show(value) {
      return this.display.includes(value);
    },
  },
  created() {
    this.getTopics(this.view.config.tag, "tag");
  },
   mounted() {
    this.width = this.$el.offsetWidth;
    if (this.width < 600) {
      this.settings.itemsToShow = 1;
    }
  },
  filters: {
    formatDate: function(value) {
      return moment(String(value)).format("dddd, MMMM DD YYYY");
    },
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
