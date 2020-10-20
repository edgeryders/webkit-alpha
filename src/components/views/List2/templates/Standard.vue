<template>
  <div class="list_container" v-resize="onResize" :class="viewport">

    <ul class="list_items" :class="{ active: !active }">
      <input placeholder="search" v-model="search" v-if="view && view.config && view.config.search" />
      <li
        v-for="(item, index) in filteredItems"
        :key="index"
        @click="select(index)"
        :class="{ active: selected == index }"
      >
        <img v-if="item.image" />
        {{ item.title }}
      </li>
    </ul>
    <div class="list_info" :class="{ active: active }" @click="toggle()">
      <div class="list_back">back</div>
      <div v-if="selected !== null" class="item_selected">
        <div
          v-if="filteredItems[selected].image"
          class="item_image"
          :style="{ background: 'url(' + filteredItems[selected].image + ')' }"
        ></div>
        <a class="item_title" :class="{ overlay: items[selected].image }" :href="filteredItems[selected].url"  target="_blank">
          {{ filteredItems[selected].title }}
        </a>
        <div class="item_meta" v-if="display && display.includes('date')">
          <a v-if="display.includes('date') && filteredItems[selected].date" class="item_date" :href="filteredItems[selected].url"  target="_blank">{{filteredItems[selected].date | formatDate }}</a>
          <a v-if="display.includes('author') && filteredItems[selected].author" class="item_author" target="_blank" :href="'https://edgeryders.eu/u/' + getAuthor(filteredItems[selected].author)">@{{getAuthor(filteredItems[selected].author) }}</a>
      
        </div>
        <div class="item_text" v-if="filteredItems[selected].text" v-html="filteredItems[selected].text"></div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import User from "@/components/elements/User.vue";
export default {
  name: "Standard",
  data() {
    return {
      selected: null,
      active: false,
      topics: null,
      display: null,
      index: 0,
      viewport: 'desktop',
      search: ''
    };
  },
  mounted() {
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
    onResize({ width, height }) {
      if (width < 600) {
        this.viewport = 'mobile'
      } else {
         this.viewport = 'desktop';
         this.selected = 0;
      }
    },
    select(index) {
      this.selected = index;
      this.toggle();
    },
    toggle() {
      this.active = !this.active;
    },
    getAuthor(userid) {
      return this.users.filter((x) => x.id == userid)[0].username;
    }
  },
  filters: {
    formatDate: function(value) {
      return moment(String(value)).format("dddd, MMMM Do YYYY");
    },
  },
  computed: {
    filteredItems() {
      if (this.items) {
        var self = this;
        return this.items.filter(item => {
           return item.title && item.title.toLowerCase().includes(this.search)
        })
      }
    }
  },
  components: {
    User,
  },
  props: ["view", "items", "users"],
};
</script>

<style lang="scss" scoped>
.list_container {
  width: 100%;
  margin: 0 auto;
  position: relative;
  overflow: hidden;
  border-radius: 0;
  height: 400px;
  ul.list_items {
    list-style-type: none;
    padding: 0;
    height: 100%;
    overflow: scroll;
    transform: translateX(-100%);
    transition: transform 0.5s ease;
    &.active {
      transform: translateX(0%);
    }
    li {
      border-bottom: 1px solid #efefef;
      padding: .75rem 0 !important;
      &.active,
      &:hover {
        background: #fafafa;
        cursor: pointer;
      }
      &:last-child {
        border: none;
      }
    }
  }
  .list_info {
    position: absolute;
    top: 0;
    left: 0;
    transform: translateX(101%);
    transition: transform 0.3s ease;
    width: 100%;
    border-radius: 10px;
    height: 100%;
    overflow: hidden !important;
    &.active {
      transform: translateX(0%);
    }
    .item_selected {
      position: relative;
      width: 100%;
      overflow: scroll;
      border-radius: 10px;
      height: 100%;
      .item_title {
        padding: 5%;
        margin: 0;
        text-decoration: none;
        display: block;
        font-size: 1.1rem;
        margin: 0 auto;
        font-weight: bold;
        width: 90%;
        color: white;
        background: rgba(0, 0, 0, 0.6);
        &:hover {
        color: orangered !important;
        }
        &.overlay {
          position: absolute;
          top: 0;
        }
      }
      .item_meta {
        width: 90%;
        margin: 0 auto 1rem;
        display: flex;
        a.item_date {
          font-weight: bold;
          color: rgba(0,0,0,0.7);
          margin-right: 1rem;

        }
        a.item_author {
          font-weight: bold;
          color: black;
      
        }
        a {
              padding: .2rem 0 .2rem .5rem;
              text-decoration: none;
              position: relative;
              &:before {
                content: '';
                background: rgba(0,0,0,0.2);
                border-radius: 10px;
                width: 4px;
                height: 4px;
                position: absolute;
                left: -5px;
                top: 43%;
              }
              &:hover {
              color: orangered;
            }
              &:first-child {
               padding-left: 0;
               &:before {
               display: none;
             }
            }
          }
      }
      .item_image {
        width: 100%;
        height: 200px;
        display: inline-block;
        background-size: cover !important;
        background-position: 50% 20% !important;
        box-shadow: inset 0 -10px 10px rgba(0, 0, 0, 0.3);
      }
      .item_text {
        padding: 5%;
        line-height: 1.4rem;
        width: 90% !important;
      }
    }
  }
}

.list_container {
  border-radius: 10px;
  overflow: hidden;
  display: block;
  position: relative;
  ul.list_items {
  input {
    width: 90%;
    padding: 1rem 5%;
    outline: none;
    background: #fff;
    border: none;
    font-size: 1rem;
    border-bottom: 1px solid #efefef;
    &:focus {
    background: white;
  }
  }
    li {
      padding: 1.4rem 1rem;
      font-weight: bold;
    }
  }
  .list_info {
    border-radius: 10px;
    display: inline-block;
    .item_title {
      border-radius: 10px 10px 0 0;
    }
  }
}

.list_container.desktop {
  display: flex;
  border: none;
  border-radius: 10px;
  margin: 0rem 0 3rem;
  border: 1px solid #fafafa;

  ul.list_items {
    border-right: 1px solid #ddd;
    width: 500px;
    height: auto !important;
    flex-grow: 1;
    transform: none;
    li {
      border-bottom: 1px solid #efefef;
      background: rgba(0,0,0,0.01);
      &.active {
      background: rgba(0,0,0,0.04);;
    }
    }
  }
  .list_info {
    position: relative;
    transform: none;
    border-radius: 0;
    height: auto;
    .item_selected {
      border-radius: 0;
            overflow: scroll;

      .item_title {
        position: relative;
        background: none;
        padding: 0;
        color: black;
        width: 90%;
        margin: 2rem auto 1rem;
        border-bottom: 1px solid #ddd;
        padding-bottom: 1rem;
      }
      .item_text {
        padding: 0 5% 2rem;
      }
    }
  }
}

@media only screen and (max-width: 600px) {

.list_container {
border-radius: 0
}

}
</style>
