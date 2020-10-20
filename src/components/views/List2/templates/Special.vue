<template>
  <div class="list" v-resize="onResize" :class="[{ active: active }, viewport]">
    <div class="list_container">
    {{items}}
     
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
      selected: 0,
      active: false,
      topics: null,
      display: null,
      index: 0,
      viewport: "desktop",
      search: "",
    };
  },
  mounted() {
 
  },
  methods: {
    onResize({ width, height }) {
      if (width < 900) {
        this.viewport = "mobile";
      } else {
        this.viewport = "desktop";
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
    },
  },
  filters: {
    formatDate: function(value) {
      return moment(String(value)).format("dddd, MMMM Do YYYY");
    },
  },
  computed: {
    filteredItems() {
        var self = this;
        return items;

    },
  },
  components: {
    User,
  },
  props: ["view", "items"],
};
</script>

<style lang="scss" scoped>
.list {
  width: 100%;
  overflow: hidden;
  max-height: 400px;
  height: auto;
  transition: max-height 0.6s ease;
  &.active {
    max-height: 800px;
  }
}
.list_container {
  width: 400px;
  display: flex !important;
  flex-shrink: 0;
  margin: 0 auto;
  position: relative;
  align-items: flex-start;
  border-radius: 0;
}
.list_container {
  ul.list_items {
    list-style-type: none;
    padding: 0;
    width: 100%;
    height: 0;
    overflow: scroll;
    transform: translateX(-100%);
    transition: transform 0.5s ease;
    &.active {
      transform: translateX(0%);
      flex-shrink: 0;
      height: 400px;
    }
    input {
        width: 100%;
        padding: 1rem 0%;
        outline: none;
        font-weight: bold;
        border: none;
        font-size: 1rem;
        border-bottom: 1px solid #efefef;
        transition: padding 0.25s ease;
        background: #fff;
        padding: 1rem 0.2%;
     
      }
    li {
      border-bottom: 1px solid #efefef;
      padding: 0.7rem 0rem;
      font-weight: bold;

      .item_header {
        color: rgba(0, 0, 0, 0.5) !important;
      }
      &:last-child {
        border: none;
      }
    }
  }
  .list_info {
    width: 100%;
    flex-shrink: 0;
    height: auto;
    overflow: hidden;
    display: inline-block;
    position: relative;
    transform: translateX(100%);
    transition: transform 0.3s ease;
    .list_back {
      background: white;
      height: 2.75rem;
      display: inline-block;
      font-weight: bold;
      display: flex;
      width: 100%;
      background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' viewBox='0 0 100 125'%3E%3Cdefs%3E%3Cpath d='M87 48l-2-1H23l24-25 1-2-1-2-2-1-2 1-30 30-1 2 1 2 30 30 2 1 2-1 1-2-1-2-24-25h62l2-1 1-2-1-2z' id='a'/%3E%3C/defs%3E%3Cuse xlink:href='%23a'/%3E%3C/svg%3E") no-repeat 0 5%;
      background-size: 1.4rem;
      padding-left: 1.85rem;
    }
    &.active {
      transform: translateX(0%);
      flex-shrink: 0;
    }
    .item_selected {
      position: relative;
      display: flex;
      flex-direction: column;
      width: 100%;
      overflow: scroll;
      height: 100%;
      .item_title {
        padding: 0;
        display: block;
        margin: 0;
        text-decoration: none;
        font-size: 1.1rem;
        margin: 1rem auto 0;
        font-weight: bold;
        width: 100%;
        flex-shrink: 0;
        &:hover {
          color: orangered !important;
        }
        .item_date {
          font-size: 0.8rem;
          margin: 0.2rem 0.5rem 0 0;
          color: rgba(0, 0, 0, 0.8);
        }

        .item_author {
          color: rgba(0, 0, 0, 0.6);
        }
        &.overlay {
          position: absolute;
          top: 0;
        }
      }
      .item_meta {
        width: 100%;
        display: flex;
        font-weight: bold;
        color: rgba(0, 0, 0, 0.8);
        a.item_date {
          font-weight: bold;
          color: rgba(0, 0, 0, 0.7);
          margin-right: 1rem;
        }
        a.item_author {
          font-weight: bold;
        }
        a {
          padding: 0.2rem 0 0.2rem 0.5rem;
          text-decoration: none;
          position: relative;
          &:before {
            content: "";
            background: rgba(0, 0, 0, 0.2);
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
        flex-shrink: 0;
        height: 120px;
        display: inline-block;
        background-size: cover !important;
        background-position: 50% 20% !important;
        box-shadow: inset 0 -10px 10px rgba(0, 0, 0, 0.3);
      }
      .item_text {
      margin-top: .75rem;
        line-height: 1.4rem;
      }
    }
  }
}

.list.desktop {
  margin-left: -1%;
  width: 102%;
  &.active {
    max-height: 400px;
  }
  .list_container {
    display: flex;
    position: relative;
    border: none;
    margin: 1rem 0 3rem;
    width: 100%;
    ul.list_items {
      width: 400px;
      flex-shrink: 0;
      height: 400px !important;
      border-right: 1px solid #efefef;
      overflow: scroll;
      transform: none;
      &.active {
        transform: none;
      }
      input {
        padding: 1rem 5%;
      }
      li {
        border-bottom: 1px solid #efefef;
        padding: 0.7rem 1rem;
        &.active,
        &:hover {
          background: #fafafa;
          cursor: pointer;
        }
      }
    }
    .list_info {
      position: relative;
      transform: none;
      display: inline-block;
      border-radius: 0;
      height: auto;
      flex-shrink: unset;
      transform: none !important;
      .list_back {
        display: none;
    }
      &.active {
        transform: none;
        flex-shrink: unset;
      }
      .item_selected {
        border-radius: 0;
        width: 100%;
        flex-shrink: 0;
        padding: 0.5rem 2rem;
        overflow: scroll;
        flex-direction: row;
        .item_image {
          margin: 0;
          width: 200px;
          height: 300px;
        }
        .item_info {
          flex-grow: 1;
          margin: 0rem 0 0 2rem;
        }
        .item_title {
          position: relative;
          background: none;
          padding: 0;
          color: black;
          width: 100%;
          margin: 0rem auto 1rem;
          border-bottom: 1px solid #ddd;
          padding-bottom: 1rem;
        }
        .item_text {
          padding: 0 0 2rem;
        }
      }
    }
  }
}

@media only screen and (max-width: 600px) {
  .list_container {
    border-radius: 0;
  }
}
</style>
