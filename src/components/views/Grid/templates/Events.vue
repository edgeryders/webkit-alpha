<template>
  <div class="events" v-if="item_count">
    <input class="events_search" placeholder="search events" v-model="search" />
      <masonry
      :cols="3"
      :gutter="40"
      class="grid"
       v-if="display == 'desktop'"
      >
        <Event v-for="(item, index) in filteredItems.slice(
            index,
            index + item_count
          )" :key="index" :data="item" />
      </masonry>
      
      <List v-if="display == 'mobile'" template="blog" class="list_template" :items="items" :view="view" />

    <resize-observer @notify="onResize" />
  </div>
</template>

<script>
import Event from "@/components/elements/Event.vue";
import List from "@/components/views/List";

export default {
  name: "Events",
  data() {
    return {
      events: null,
      events2: null,
      display: "desktop",
      item_count: 8,
      index: 0,
      search: ''
    };
  },
  props: ["view", "items"],
  methods: {
    handleResize ({ width, height }) {
      console.log('resized', width, height)
    },
    onResize({ width, height }) {
      if (width < 800) {
        this.display = "mobile";
      } else {
        this.display = "desktop";
      }
    },
    previous() {
      if (this.index - this.item_count < 0) {
        this.index = this.item_count;
      } else {
        this.index = this.index - this.item_count;
      }
    },
    next() {
      if (this.index + this.item_count >= this.items.length) {
        this.index = 0;
      } else {
        this.index = this.index + this.item_count;
      }
    },
  },
  mounted() {
    var width = this.$el.offsetWidth;

    if (width < 500) {
      this.display = "mobile";
    } else {
      this.display = "desktop";
    }
    if (this.items.length) {
      this.item_count = this.itemsLength;
    }
    if (this.view.config.items) {
      this.item_count = Number(this.view.config.items);
    } 
  },
  computed: {
    filteredItems() {
      if (this.items) {
        var self = this;
        return this.items.filter(item => {
           return item.title && item.title.toLowerCase().includes(this.search)
        })
      }
    },
    itemsLength() {
      if (this.items) {
        return this.items.length
      }
    }
  },
  components: {
    Event,
    List,
  },
  created() {},
};
</script>

<style lang="scss" scoped>
.events {
  position: relative
}
.events .grid {
  width: 100%;
  position: relative;
  margin: 10px auto 0;
  column-count: 4;
  column-gap: 1.5rem;
   .grid_options {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    position: absolute;
    top: -80px;
    right: 10px;
  }
  .event {
    display: inline-block;
    border: 1px solid #ddd;
    padding: 1.4rem;
    border-radius: 10px;
    margin-bottom: 1.5rem;
    .event_title {
    }
  }

  .grid_text {
    width: 92%;
    margin: 0 auto 2rem;
    .grid_title {
      font-size: 2rem;
      font-weight: bold;
      margin: 0 0 1rem 0;
    }
    p {
      font-size: 1.1rem;
      line-height: 1.7rem;
    }
  }
  .item {
    margin: 0.6%;
    position: relative;
    float: left;
    width: 15.25%;
    height: 12vw;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .item_container {
    display: block;
    width: 95%;
    height: 95%;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
    border-radius: 4px;
    position: relative;
    background-size: cover !important;
    overflow: hidden;
  }

  .item_container .item_info {
    height: 82%;
    width: 85%;
    position: absolute;
    border-radius: 4px;
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

  .item_container:hover {
    cursor: pointer;
    .item_info {
      transform: translateY(0%);
      color: white;
    }
  }
}

.list_template {
  margin: 30px auto 0;
}
</style>
