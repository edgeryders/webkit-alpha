<template>
  <div class="container">
    <div class="grid_text">
      <div class="grid_title">
        <a class="subscribe" target="_blank" :href="'https://edgeryders.eu/tag/' + view.config.tag + '.rss'"></a>
        <h3> {{ view.config.title }} </h3>
      </div>
      <div class="grid_nav">
        <div class="nav back" @click="previous()">Previous</div>
        <div class="nav next" @click="next()">Next</div>
      </div>
    </div>
    <Standard :items="items" :count="current_index" :users="users" :view="view" />
  </div>
</template>

<script>
import Standard from "./templates/Standard.vue";

export default {
  name: "GridView",
  data() {
    return {
      items: null,
      users: null,
      grid_items: null,
      current_index: 0
    };
  },
  props: ["view", "data", "topics", "category"],
  components: {},
  methods: {
    next() {
      if (this.current_index + Number(this.view.config.items) < this.items.length) {
        this.current_index = this.current_index + Number(this.view.config.items);
      } else {
        this.current_index = 0
      }
    },
    previous() {
      if (this.current_index - Number(this.view.config.items) < 0) {
        this.current_index = this.items.length - Number(this.view.config.items);
      } else {
        this.current_index = this.current_index - Number(this.view.config.items);
      }
    },
    getTopics(tag) {
      var self = this;
      fetch("https://edgeryders.eu/tag/" + tag + ".json")
        .then((response) => response.json())
        .then((data) => {
          var array = data.topic_list.topics.map((x) => self.createItem(x));
          self.items = array.sort((a, b) => b.date.localeCompare(a.date));
;

          self.users = data.users;
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
      if (code) {
        return JSON.parse(code[1]);
      } else {
        return false;
      }
    },
  },
  components: {
    Standard,
  },
  mounted() {
    if (this.view.data) {
      this.getData(this.view.data);
    }
    if (this.view.config.tag) {
      this.getTopics(this.view.config.tag);
    }
  },
  computed: {
    gridItems(){
      return this.items
    }
  }
};
</script>

<style lang="scss">
.container {
  max-width: 1220px;
  width: 90%;
  margin: 0 auto;
}

.grid_text {
  .grid_title {
  width: 100%;
  display: flex;
  @apply mb-3 items-center;
      h3 {
      @apply font-bold text-4xl;
    }
    a.subscribe {
    width: 22px;
    height: 22px;
    margin-top: 4px;
    @apply mr-4;
    border-radius: 0px;
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 40'%3E%3Cpath fill='white' d='M6 22a4 4 0 100 8 4 4 0 000-8zM5 2a3 3 0 100 6c10 0 19 9 19 19a3 3 0 106 0C30 13 19 2 5 2zm0 10a3 3 0 100 6c5 0 9 4 9 9a3 3 0 106 0c0-8-7-15-15-15z'/%3E%3C/svg%3E") no-repeat #000 52% 65%;
    background-size: 11px !important;

    &:hover {
        background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 40'%3E%3Cpath fill='white' d='M6 22a4 4 0 100 8 4 4 0 000-8zM5 2a3 3 0 100 6c10 0 19 9 19 19a3 3 0 106 0C30 13 19 2 5 2zm0 10a3 3 0 100 6c5 0 9 4 9 9a3 3 0 106 0c0-8-7-15-15-15z'/%3E%3C/svg%3E") no-repeat orangered 52% 65%;
  }
  }
  }
}

.grid_nav {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  width: 200px;
  @apply mb-6;
  .nav {
    margin-right: 1rem;
    display: inline-block;
    float: left;
     font-weight: bold;
  position: relative;
  &:after {
  content: '';
  position: absolute;
top: 3px;
  width: 20px;


  height: 20px;
     background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' viewBox='0 0 100 125'%3E%3Cdefs%3E%3Cpath stroke='black' stroke-width='2' d='M87 48l-2-1H23l24-25 1-2-1-2-2-1-2 1-30 30-1 2 1 2 30 30 2 1 2-1 1-2-1-2-24-25h62l2-1 1-2-1-2z' id='a'/%3E%3C/defs%3E%3Cuse xlink:href='%23a'/%3E%3C/svg%3E") no-repeat 0 0%;
   background-size: 20px !important;
   }
&:hover {
  color: orangered;
  cursor: pointer;
  &:after {
       background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' viewBox='0 0 100 125'%3E%3Cdefs%3E%3Cpath fill='orangered' stroke='orangered' stroke-width='2' d='M87 48l-2-1H23l24-25 1-2-1-2-2-1-2 1-30 30-1 2 1 2 30 30 2 1 2-1 1-2-1-2-24-25h62l2-1 1-2-1-2z' id='a'/%3E%3C/defs%3E%3Cuse xlink:href='%23a'/%3E%3C/svg%3E") no-repeat 0 0%;

}
}
}
  .back {

   padding-left: 26px;
   &:after {
   left: 0;
 }
  }
  .next {
  padding-right: 26px;
  &:after {
  right: 0;
  transform: scaleX(-1);
}
  }

}

@media screen and (max-width: 600px) {
.grid_nav {
  display: none;
}
.grid_text {
  width: 85%;
  margin: 0 auto;
}
  
}
</style>
