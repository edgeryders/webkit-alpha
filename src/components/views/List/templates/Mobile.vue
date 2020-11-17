<template>
  <div class="list" :class="{ active: !active }">
    <div class="list_container">
    <ul class="list_items" :class="{ active: !active }">
      <li
        v-for="(item, index) in items"
        :key="index"
        @click="select(index)"
        :class="{ active: selected == index }"
      >
        <img v-if="item.image" :src="item.image" />
        {{ item.title }}
      </li>
    </ul>
    <div class="list_info" :class="{ active: active }" @click="toggle()">
      <div class="list_back">back</div>
      <div v-if="selected !== null" class="item_selected">
        <div class="user_profile">
          <img
            v-if="items[selected].image"
            class="item_image"
            :src="items[selected].image"
          />
          <div class="flex flex-col" style="width: 70%">
            <a class="item_title w-full mb-1" :href="'https://edgeryders.eu/u/' + items[selected].username"  target="_blank">
              {{ items[selected].title }}
            </a>
            <a class="message" v-if="items[selected].username" :href="sendMessage(items[selected].username)" target="_blank">Message</a>
          </div>
        </div>
        <div class="item_text" v-if="items[selected].text" v-html="items[selected].text"></div>
        <div class="sidebar" v-if="items[selected].skills">
          <h3>Skills</h3>
          <ul>
            <li v-for="(skill, index) in items[selected].skills">{{skill}}</li>
          </ul>
        </div>
      </div>

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
      user: null,
      index: 0,
      viewport: 'desktop',
      search: ''
    };
  },
  mounted() {
  },
  methods: {
    select(index) {
      this.selected = index;
      this.toggle();
    },
    sendMessage(username) {
      var recipient = username;
      var url = location.href;
      var link =
        "https://edgeryders.eu/new-message?username=" +
        username +
        "&title=hey%20@" +
        recipient +
        "!&body=I saw you mentioned [here](" +
        url +
        ") and wanted to get in touch.";
      return link;
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
      return moment(value).fromNow();
    },
  },
  computed: {
  },
  components: {
  },
  props: ["items"],
};
</script>

<style lang="scss" scoped>
.list {
    width: 100%;
    overflow: hidden;
   
     max-height: 800px;
    height: auto;
    transition: max-height .6s ease;
    &.active {
      max-height: 400px;
    }
}

.list_container {
  width: 400px;
  display: flex !important;
  flex-shrink: 0;
  margin: 0 auto;
  position: relative;
  align-items: flex-start;
  ul.list_items {
    list-style-type: none;
    padding: 0;
    width: 100%;
  
    overflow: scroll;
    transform: translateX(-100%);
    transition: transform 0.5s ease;
    height: 0;
    &.active {
      transform: translateX(0%);
       flex-shrink: 0;
  height: 400px;
      overflow: scroll !important;
    }
    li {
      border-bottom: 1px solid #efefef;
      padding: .75rem 0 !important;
      @apply flex items-center text-lg;
      img {
      width: 50px;
      height: 50px;
      border-radius: 100px;
      @apply mr-3 ;
    }
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
      margin-left: 1rem;
      display: inline-block;
      font-weight: bold;
      display: flex;
      width: 100%;
      background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' viewBox='0 0 100 125'%3E%3Cdefs%3E%3Cpath d='M87 48l-2-1H23l24-25 1-2-1-2-2-1-2 1-30 30-1 2 1 2 30 30 2 1 2-1 1-2-1-2-24-25h62l2-1 1-2-1-2z' id='a'/%3E%3C/defs%3E%3Cuse xlink:href='%23a'/%3E%3C/svg%3E") no-repeat 0 5%;
      background-size: 1.4rem;
      padding-left: 1.85rem;
    }
    .user_profile {
      @apply flex items-center justify-start mb-2 p-4 rounded-lg;
      background: #fafafa;
    }
    a.message {
      color: orangered;
      background: url("data:image/svg+xml,%3Csvg aria-hidden='true' data-prefix='fas' data-icon='envelope' class='svg-inline--fa fa-envelope fa-w-16' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'%3E%3Cpath fill='orangered' d='M502 191c4-3 10 0 10 5v204c0 27-21 48-48 48H48c-26 0-48-21-48-48V196c0-5 6-8 10-5l154 114c21 15 56 47 92 47s72-33 92-47l154-114zM256 320c23 0 57-29 73-41 133-97 143-105 174-129 6-5 9-12 9-19v-19c0-26-22-48-48-48H48C22 64 0 86 0 112v19c0 7 3 14 9 19 31 24 41 32 174 129 16 12 50 41 73 41z'/%3E%3C/svg%3E") no-repeat 0px center;
      font-size: 15px;
      @apply ml-2 font-bold;
      padding-left: 26px;
      background-size: 17px;
    }
    &.active {
      transform: translateX(0%);
    }
    .item_selected {
      position: relative;
      border-radius: 10px;
      width: 95%;
      margin-left: 1.75%;
      @apply mb-4;
      box-shadow: 0 10px 10px rgba(0,0,0,0.2);
      height: auto;
      .item_title {
        @apply ml-2 text-xl;
        text-decoration: none;
        display: inline-block;
        font-size: 1.1rem;
        font-weight: bold;
        &:hover {
        color: orangered !important;
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
        width: 65px;
        height: 65px;
        display: inline-block;
        border-radius: 10px;
        @apply mr-2;
      }
      .item_text {
        padding: 0 1rem 1rem;
        @apply text-base;
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

.sidebar {
  background: #000;
  color: white;
  padding: 1.5rem 1.6rem;
  width: 100%;
  @apply mt-4 rounded-b-lg;
  h3 {
    @apply font-bold text-xl border-b border-white pb-2 mb-3;
  }
  ul {
    list-style-type: square;
    @apply pl-6;
    li {

    }
  }
}

@media only screen and (max-width: 600px) {

.list_container {
border-radius: 0
}

}
</style>
