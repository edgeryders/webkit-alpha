<template>
  <div class="events" v-resize="onResize">
    <div class="grid" v-if="display == 'desktop'">
      <Event v-for="(item, index) in items" :key="index" :data="item" />
    </div>
    <List v-if="display == 'mobile'" class="list_template" :items="items" />
  </div>
</template>

<script>
import Event from "@/components/elements/Event.vue";
import List from "@/components/views/List.vue";

export default {
  name: "Events",
  data() {
    return {
      events: null,
      events2: null,
      display: "desktop",
    };
  },
  props: ["view", "items"],
  methods: {
    onResize({ width, height }) {
      if (width < 500) {
        this.display = "mobile";
      } else {
        this.display = "desktop";
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
  },
  components: {
    Event,
    List,
  },
  created() {},
};
</script>

<style lang="scss" scoped>
.events .grid {
  width: 100%;
  position: relative;
  margin: 10px auto 0;
  column-count: 3;
  column-gap: 1.5rem;
  .event {
    display: inline-block;
    border: 1px solid #ddd;
    padding: 1.4rem;
    border-radius: 10px;
    margin-bottom: 1.5rem;
    .event_title {
    }
  }
  .grid_options {
    position: absolute;
    top: -60px;
    right: 5%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .grid_navigation {
      display: flex;
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
