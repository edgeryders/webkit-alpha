<template>
  <div class="events">
    <hooper
      class="slider"
      :settings="slider_settings"
      :progress="true"
      :autoPlay="true"
    >
      <slide
        v-for="(slide, indx) in featured"
        :key="indx"
        :index="indx"
        class="slide_content"
      >
        <div
          class="slide"
          style="color: black"
          :style="{ background: 'url(' + slide.image_url + ')' }"
        >
          <div class="slide_title">
            <a :href="slide.slug" target="_blank">{{ slide.title }}</a>
          </div>
        </div>
      </slide>
    </hooper>

    <div class="menu_item scheduled">
      <h3>Scheduled Events</h3>
      <div class="event_table">
        <ul class="event_list">
          <li
            v-for="(item, index) in upcoming"
            :key="index"
            @click="select(index)"
            :class="{ active: selected == index }"
          >
            {{ item.start | eventDate }}
          </li>
        </ul>
        <div class="event_info" v-if="upcoming">
          <a
            class="event_title"
            :href="upcoming[selected].url"
            target="_blank"
            >{{ upcoming[selected].title }}</a
          >
          <div class="event_text" v-html="upcoming[selected].text"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import { Hooper, Slide } from "hooper";
import "hooper/dist/hooper.css";
export default {
  name: "Events",
  data() {
    return {
      featured: null,
      upcoming: null,
      campfire: null,
      burning: null,
      status: null,
      status_index: 0,
      selected: 0,
      slider_settings: {
        itemsToShow: 1,
        centerMode: true,
        playSpeed: 2000,
        transition: 2000,
        hoverPause: true,
        infiniteScroll: true,
        autoplay: true,
        breakpoints: {
          600: {
            itemsToShow: 1,
          },
        },
      },
    };
  },
  components: {
    Hooper,
    Slide,
  },
  methods: {
    getEvents() {
      var self = this;
      fetch("https://edgeryders.eu/tags/covid19-event.json")
        .then((response) => response.json())
        .then((data) => {
          self.featured = this.getFeatured(data.topic_list.topics);
          self.upcoming = this.getUpcoming(data.topic_list.topics);
        });
    },
    getStatus() {
      var self = this;
      fetch("https://edgeryders.eu/t/13292.json/?page=4")
        .then((response) => response.json())
        .then((data) => {
          var array = data.post_stream.posts.map((x) => this.parseUpdate(x));
          self.status = this.sortTopics(array, "date");
        });
    },
    getFeatured(items) {
      return items.filter((x) => x.image_url);
    },
    getUpcoming(items) {
      var array = items.filter((x) => x.event).map((x) => this.parseEvent(x));
      return this.sortTopics(array, "start")
        .reverse()
        .slice(0, 5);
    },
    parseEvent(item) {
      var obj = {
        title: item.title,
        start: item.event.start,
        end: item.event.end,
        url: "http://edgeryders.eu/t/" + item.slug,
        text: item.excerpt,
      };
      return obj;
    },
    parseUpdate(item) {
      var text = item.cooked.replace(/<(.|\n)*?>/g, "");
      if (text) {
        var obj = {
          text: text,
          username: item.username,
          avatar:
            "https://edgeryders.eu" +
            item.avatar_template.replace("{size}", 200),
          date: item.created_at,
          url: item.post_number,
        };
        if (obj && obj.text) {
          return obj;
        }
      }
    },
    parseBurning(post) {
      if (!post.title.includes("Status")) {
        var obj = {
          title: post.title,
          comments: post.reply_count,
          bumped: post.bumped_at,
          poster: post.last_poster_username,
          url: "http://edgeryders.eu/t/" + post.slug,
        };
        return obj;
      }
    },
    sortTopics(items, key) {
      return items.sort(function(a, b) {
        var x = a[key];
        var y = b[key];
        return x < y ? -1 : x > y ? 1 : 0;
      });
    },
    getBurning(items) {
      var array = items.map((x) => this.parseBurning(x));
      return this.sortTopics(array, "bumped").slice(0, 6);
    },
    select(index) {
      this.selected = index;
    },
  },
  created() {
    this.date = new Date();
    this.getEvents();
    this.getStatus();
    this.intervalid1 = setInterval(() => {
      if (this.status_index + 1 < this.status.length) {
        this.status_index = this.status_index + 2;
      } else {
        this.status_index = 0;
      }
    }, 3000);
  },
  filters: {
    moment: function(date) {
      return moment(date).format("dddd MMMM Do YYYY");
    },
    eventDate: function(date) {
      return moment(date).format("dddd MMMM Do ");
    },
  },
  props: ["active"],
};
</script>

<style scoped lang="scss">
.events {
  color: black;
  .date {
    font-weight: 100;
    font-size: 1.4rem;
    color: #f15133;
    padding: 0px;
    display: inline-block;
    border: none;
  }
  .create_account {
    font-weight: 100;
    font-size: 1rem;
  }
  .login_button {
    display: inline-block;
    background: url("data:image/svg+xml,%3Csvg aria-hidden='true' data-prefix='far' data-icon='user' class='svg-inline--fa fa-user fa-w-14' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 448 512'%3E%3Cpath fill='currentColor' stroke='white' stroke-width='19px' d='M314 304c-29 0-43 16-90 16s-61-16-90-16C60 304 0 364 0 438v26c0 27 22 48 48 48h352c27 0 48-21 48-48v-26c0-74-60-134-134-134zm86 160H48v-26c0-47 39-86 86-86 15 0 39 16 90 16 52 0 75-16 90-16 47 0 86 39 86 86v26zM224 288a144 144 0 100-288 144 144 0 000 288zm0-240a96 96 0 110 192 96 96 0 010-192z'/%3E%3C/svg%3E")
      no-repeat 0 0px;
    background-size: 18px;
    padding-left: 28px;
    padding-right: 10px;
    position: absolute;
    font-weight: 100;
    font-size: 1rem;
    top: 30px;
    right: 20px;
    &:hover {
      background: url("data:image/svg+xml,%3Csvg aria-hidden='true' data-prefix='far' data-icon='user' class='svg-inline--fa fa-user fa-w-14' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 448 512'%3E%3Cpath fill='orangered' stroke='white' stroke-width='19px' d='M314 304c-29 0-43 16-90 16s-61-16-90-16C60 304 0 364 0 438v26c0 27 22 48 48 48h352c27 0 48-21 48-48v-26c0-74-60-134-134-134zm86 160H48v-26c0-47 39-86 86-86 15 0 39 16 90 16 52 0 75-16 90-16 47 0 86 39 86 86v26zM224 288a144 144 0 100-288 144 144 0 000 288zm0-240a96 96 0 110 192 96 96 0 010-192z'/%3E%3C/svg%3E")
        no-repeat 0 0%;
      color: orangered;
      background-size: 18px;
    }
  }
  .intro {
    padding: 0 1.5rem;

    p {
      width: 90%;
      margin: 20px 0 0;
      line-height: 1.35rem;
      font-size: 0.9rem;
      font-weight: 400;
    }
  }
  .menu_list,
  .event_list {
    list-style-type: none;
    padding: 0;
    li {
      padding: 1rem 0;
      border-bottom: 1px solid #ddd;
      font-weight: 400;
      font-size: 0.8rem;
      a {
        font-weight: 400;
        color: black;
        text-decoration: none;
      }
      &:hover {
        a {
          font-weight: bold;
          color: orangered;
        }
      }
    }
  }
  .menu_item {
    padding: 1.5rem 1.5rem;
    border-top: 1px solid #ddd;
    width: 80%;
    padding-right: 15%;
    h3 {
      padding: 3px 0 10px 2.3rem;
      background-size: 18px;
      font-size: 1rem;
      display: flex;
      align-items: center;
      position: relative;
      &:before {
        top: 0;
        left: 0;
        position: absolute;
        content: "";
      }
    }
  }
  .scheduled {
    background: white;
    width: 92%;
    padding: 1.5rem 4%;
    h3 {
      &:before {
        width: 24px;
        height: 24px;
        background-size: 15px !important;
        background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 333 416.3' fill-rule='evenodd' clip-rule='evenodd' shape-rendering='geometricPrecision' text-rendering='geometricPrecision' image-rendering='optimizeQuality'%3E%3Cpath fill='white' stroke='white' stroke-width='4px' d='M167 33A133.6 133.6 0 1133 167C33 93 93 33 167 33zm-14 61c0-13 20-13 20 0v71l46 13c12 4 7 23-6 20l-52-16c-5-1-8-5-8-10V94zm14-41c-63 0-114 51-114 114A113.5 113.5 0 10167 53z' fill-rule='nonzero'/%3E%3C/svg%3E")
          center 85% no-repeat #2600ff;
      }
    }
    .event_table {
      display: flex;
      width: 100%;
    }
    .event_list {
      width: 40%;
      li {
        &.active {
          font-weight: bold;
          color: blue;
        }
        &:hover {
          color: blue;
          font-weight: bold;
        }
      }
    }
    .event_info {
      width: 57%;
      padding: 0 0 0 3%;
      a.event_title {
        margin: 0 0 0.75rem 0 !important;
        padding: 0.1rem 0 0.4rem;
        font-size: 0.85rem;
        line-height: 1.2rem;
        color: black;
        display: inline-block;
        text-decoration: none;
        font-weight: bold;
        border-bottom: 1px solid #ddd;
        width: 100%;
        &:hover {
          color: blue;
        }
      }
      .event_text {
        font-size: 0.8rem !important;
        line-height: 1.2rem;
        /deep/ a {
          color: black;
          font-weight: bold;
          text-decoration: none;
          &:hover {
            color: orangered;
          }
        }
      }
    }
  }
  .connect {
    width: 92%;
    padding: 1.5rem 4% 2rem;
    margin: 0 auto;
    h3 {
      &:before {
        width: 24px;
        height: 24px;
        background-size: 14.4px !important;
        background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 375' fill-rule='evenodd'%3E%3Cdefs%3E%3Cstyle/%3E%3C/defs%3E%3Cpath fill='white' stroke='%23f15133' stroke-width='7px' d='M149 25a59 59 0 00-57 63c-26 17-42 46-44 75l-4 2a59 59 0 00-21 80 59 59 0 0083 20c27 13 60 13 88 0 18 12 42 13 62 2a59 59 0 00-4-104 102 102 0 00-43-75 59 59 0 00-60-63zm0 30c11-1 21 5 26 14 9 15 4 32-10 40-14 9-32 4-40-10-8-15-4-32 10-40 5-3 10-4 14-4zm-47 62c17 25 51 33 77 18 8-5 15-11 19-18a74 74 0 0124 40 59 59 0 00-49 85c-15 5-32 5-46 0a59 59 0 00-48-84c2-16 10-30 23-41zm124 70c10-1 20 5 26 14 8 15 3 32-11 40-14 9-32 4-40-10-8-15-4-32 11-40 4-3 9-4 14-4zm-153 0c10 0 20 5 26 14 8 15 4 32-11 40-14 9-31 4-40-10-8-14-3-32 11-40 4-3 9-4 14-4z' style='text-indent:0;text-transform:none;block-progression:tb' fill-rule='nonzero' overflow='visible' color='%23000'/%3E%3C/svg%3E")
          45% 75% no-repeat #f15133;
      }
    }
    .contact {
      display: flex;
      width: 100%;
      p {
        width: 50%;
        padding: 1rem 0;
        font-weight: 100;
        font-size: 1rem;
        line-height: 1.4rem;
        flex-shrink: 0;
      }
    }
    .social_links {
      width: 40%;
      margin-left: 4%;
      display: flex;
      flex-direction: column;
      a {
        padding-left: 1.5rem;
        font-weight: bold;
        padding: 1rem 1.4rem 1rem 2rem;
        border-bottom: 1px solid #ddd;
        background-size: 18px !important;
        &.telegram {
          background: url("data:image/svg+xml,%3Csvg aria-hidden='true' data-prefix='fab' data-icon='telegram' class='svg-inline--fa fa-telegram fa-w-16' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 496 512'%3E%3Cpath fill='currentColor' d='M248 8a248 248 0 100 496 248 248 0 000-496zm122 170l-41 192c-3 13-11 17-22 10l-62-45-30 28c-3 4-6 6-13 6l5-63 115-103c5-5-1-7-8-3l-142 89-61-19c-14-4-14-13 3-19l239-93c11-4 20 3 17 20z'/%3E%3C/svg%3E")
            no-repeat 4px 55%;
        }
        &.twitter {
          background: url("data:image/svg+xml,%3Csvg aria-hidden='true' data-prefix='fab' data-icon='twitter' class='svg-inline--fa fa-twitter fa-w-16' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'%3E%3Cpath fill='currentColor' d='M459 152l1 13c0 139-106 299-299 299-59 0-115-17-161-47a217 217 0 00156-44c-47-1-85-31-98-72l19 1c10 0 19-1 28-3-48-10-84-52-84-103v-2c14 8 30 13 47 14A105 105 0 0136 67c51 64 129 106 216 110-2-8-2-16-2-24a105 105 0 01181-72c24-4 47-13 67-25-8 24-25 45-46 58 21-3 41-8 60-17-14 21-32 40-53 55z'/%3E%3C/svg%3E")
            no-repeat 4px 50%;
        }
        &.email {
          background: url("data:image/svg+xml,%3Csvg aria-hidden='true' data-prefix='fas' data-icon='envelope' class='svg-inline--fa fa-envelope fa-w-16' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'%3E%3Cpath fill='currentColor' d='M502 191c4-3 10 0 10 5v204c0 27-21 48-48 48H48c-26 0-48-21-48-48V196c0-5 6-8 10-5l154 114c21 15 56 47 92 47s72-33 92-47l154-114zM256 320c23 0 57-29 73-41 133-97 143-105 174-129 6-5 9-12 9-19v-19c0-26-22-48-48-48H48C22 64 0 86 0 112v19c0 7 3 14 9 19 31 24 41 32 174 129 16 12 50 41 73 41z'/%3E%3C/svg%3E")
            no-repeat 4px 50%;
          background-size: 17px !important;
        }
      }
    }
  }
  .status_updates {
    padding: 1.5rem 0 2rem 4%;
    display: inline-block;
    min-height: 180px;
    background: #fafafa;
    border-top: 1px solid #ddd;
    width: 96%;
    h3 {
      margin-bottom: 1rem;
      &:before {
        width: 24px;
        height: 24px;
        background-size: 14px !important;
        background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 125'%3E%3Cpath fill='white' d='M85 45H69l-6-24c-1-2-3-4-5-4s-4 2-5 4L42 59l-3-10c0-2-2-4-4-4H15c-3 0-5 2-5 5s2 5 5 5h16l7 24c0 2 2 4 4 4s4-2 5-4l11-38 2 10c1 2 3 4 5 4h20c3 0 5-2 5-5s-2-5-5-5z'/%3E%3C/svg%3E")
          center 80% no-repeat #f15133;
      }
    }
    .status {
      display: flex;
      float: left;
      width: 45%;
      span.avatar {
        width: 60px;
        flex-shrink: 0;
        border-radius: 100px;
        height: 60px;
        display: block;
        background-position: 50% 50% !important;
        background-size: cover !important;
      }
      span.update {
        padding: 1rem;
        background: white;
        border-radius: 4px;
        margin-left: 10px;
      }
    }
  }
  h4 {
    font-size: 1.05rem;
    border-bottom: 1px solid #ddd;
    padding-bottom: 1rem;
    margin: 1.7rem 0 0 !important;
  }
  .slider {
    width: 100%;
    margin: 0px 0;
    overflow: hidden;
    top: 0;
    height: 230px;
    outline: none;
    .slide {
      width: 100%;
      height: 100%;
      background-size: cover !important;
      background-position: 50% 50% !important;
      display: flex;
      position: relative;
      align-items: center;
      transition: transform 0.3s ease;
      &:hover {
        .slide_title {
          a {
            color: orangered;
          }
        }
      }
      .slide_title {
        position: absolute;
        bottom: 0;
        width: 100%;
        padding: 3% 4% 3%;
        background: rgba(255, 255, 255, 1);
        border-top: 1px solid #ddd;
        a {
          display: inline;
          color: black;
          text-decoration: none;
          font-weight: bold;
          width: 50%;
          margin: 0;
          font-size: 0.9rem;
          padding: 0;
          box-decoration-break: clone;
          line-height: 1.2rem;
        }
      }
    }
  }
}
.items {
  flex-shrink: 0;
  display: inline-flex;
  box-shadow: inset -4px 0 5px rgba(0, 0, 0, 0.04);
  height: 100%;
  width: 240px;
  overflow: hidden !important;
  position: relative;
  flex-direction: column;
}
.item {
  position: relative;
  padding: 15px 20px 13px;
  background: rgba(0, 0, 0, 0.01);
  color: black;
  display: inline-flex;

  &:hover {
    background-color: #efefef;
  }
  &:first-child {
    border-top: 1px solid white;
    border-radius: 8px 0 0 0 !important;
    &:hover {
    }
  }
  h3 {
    display: flex;
    width: 90%;
    align-items: center;
    margin-bottom: 10px;
    padding: 2px 0 12px 30px !important;
    font-size: 1.1rem;
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);

    margin: 0 0 0.5rem 0;
    padding: 0 0 0.5rem 0;
    background-position: 0 0 !important;
    background-size: 20px !important;
    background-repeat: no-repeat !important;
  }
}
</style>
