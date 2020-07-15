<template>
  <div class="blog" v-resize="onResize">
    <div
      class="blog_container"
      v-if="viewport == 'desktop'"
      :style="{ columns: getColumns() }"
    >
      <div
        class="blog_entry"
        v-for="(item, index) in items.slice(0, item_count)"
        :key="index"
      >
        <a :href="item.url" target="_blank">{{ item.title }}</a>
        <div class="entry_meta" v-if="display">
          <div class="entry_author" v-if="display.includes('author')">
            <User :username="getAuthor(item.author)" />
          </div>
          <p class="entry_date" v-if="display.includes('date')">
            on <b>{{ item.date | formatDate }}</b>
          </p>
        </div>
        <div class="entry_text " v-html="item.text"></div>
      </div>
    </div>
    <List v-if="viewport == 'mobile'" class="list_template" :items="items" />
  </div>
</template>

<script>
import Event from "@/components/elements/Event.vue";
import List from "@/components/views/List.vue";
import User from "@/components/elements/User.vue";
import moment from "moment";
export default {
  name: "Events",
  data() {
    return {
      viewport: "desktop",
      display: null,
      item_count: null,
    };
  },
  props: ["view", "items", "users"],
  methods: {
    getAuthor(userid) {
      return this.users.filter((x) => x.id == userid)[0].username;
    },
    getColumns() {
      if (this.view.config.columns) {
        return this.view.config.columns;
      } else {
        return 0;
      }
    },
    onResize({ width, height }) {
      if (width < 500) {
        this.viewport = "mobile";
      } else {
        this.viewport = "desktop";
      }
    },
  },
  mounted() {
    var width = this.$el.offsetWidth;
    if (width < 500) {
      this.viewport = "mobile";
    } else {
      this.viewport = "desktop";
    }
    if (this.view.config.items) {
      this.item_count = this.view.config.items;
    } else {
      this.item_count = this.items.length;
    }
    if (this.view.config.display) {
      this.display = this.view.config.display.replace(" ", "").split(",");
    } else {
      this.display = null;
    }
  },
  filters: {
    formatDate: function(value) {
      return moment(String(value)).format("dddd, MMMM Do YYYY");
    },
  },
  components: {
    Event,
    List,
    User,
  },
  created() {},
};
</script>

<style lang="scss" scoped>
.blog_container {
  column-gap: 50px;
}
.blog_entry {
  max-width: 800px;
  display: inline-block;
  margin-bottom: 3rem;
  a {
    font-size: 1.2rem;
    text-decoration: none;
    font-weight: bold;
    display: inline-block;
    color: black;
    width: 100%;
    padding-bottom: 1rem;
    &:hover {
      text-decoration: underline;
    }
  }
  .entry_meta {
    display: inline-flex;
    align-items: center;
    background: rgba(0, 0, 0, 0.06);
    border-radius: 4px;
    margin: 0rem 0 1rem;
    padding: 0.1rem 1rem 0 .85rem;
    width: auto;
    color: rgba(0, 0, 0, 0.9);
    font-size: 0.9rem;
    /deep/ {
      .user_info {
        border: 1px solid #efefef;
      }
      .user_container:hover {
        .user_name {
          a {
            color: orangered !important;
          }
        }
      }
      .user_name a {
        background: none;
        font-size: 0.9rem;
        padding: 0 !important;
        margin-right: .35em;
        color: black !important;
      }
    }
  }
  .entry_text {
    line-height: 1.5rem;
  }
}
</style>
