<template>
  <div class="people" v-resize="onResize">
    <div class="grid" v-if="display == 'desktop'">
      <div class="grid_options">
        <div class="grid_navigation">
          <button class="toggle previous" @click="previous()"></button>
          <button class="toggle next" @click="next()"></button>
        </div>
      </div>

      <div class="grid_content">
        <div
          class="item"
          v-for="(item, index) in items.slice(
            thumbnail_index,
            thumbnail_index + thumbnail_count
          )"
          :key="index"
        >
          <kinesis-container style="height: 100%">
            <kinesis-element :strength="10" type="depth" style="height: 100%;">
              <div
                class="item_container"
                :style="{ background: 'url(' + item.image + ')' }"
              >
                <div class="item_info">
                  <h2>{{ item.title }}</h2>
                  <p>{{ item.text.substring(0, 150) }}...</p>
                </div>
              </div>
            </kinesis-element>
          </kinesis-container>
        </div>
      </div>
    </div>
    <List v-if="display == 'mobile'" class="list_template" :items="items" />
  </div>
</template>

<script>
import List from "@/components/views/List.vue";
export default {
  name: "Grid",
  data() {
    return {
      thumbnail_count: 12,
      thumbnail_index: 0,
      display: "desktop",
    };
  },
  props: ["view", "items"],
  components: {
    List,
  },
  mounted() {
    var width = this.$el.offsetWidth;
    if (width < 500) {
      this.display = "mobile";
    } else {
      this.display = "desktop";
    }
  },
  methods: {
    onResize({ width, height }) {
      if (width < 500) {
        this.display = "mobile";
      } else {
        this.display = "desktop";
      }
    },
    previous() {
      if (this.thumbnail_index - this.thumbnail_count < 0) {
        this.thumbnail_index = this.thumbnail_count;
      } else {
        this.thumbnail_index = this.thumbnail_index - this.thumbnail_count;
      }
    },
    next() {
      if (this.thumbnail_index + this.thumbnail_count > this.items.length) {
        this.thumbnail_index = 0;
      } else {
        this.thumbnail_index = this.thumbnail_index + this.thumbnail_count;
      }
    },
  },
};
</script>

<style lang="scss">
.grid {
  width: 100%;
  position: relative;
  .grid_options {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    position: absolute;
    top: -80px;
    right: 10px;
  }
}
.grid_content {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  grid-template-rows: repeat(3, minmax(75px));
  grid-gap: 30px;
  margin: 10px 0 0;
  width: 100%;
  .item {
    display: block;
    width: 100%;
    height: 160px;
    div {
      width: 100%;
      display: inline-block;
      height: 100%;
    }
  }
  .grid_text {
    width: 92%;
    margin: 0 auto 2rem;
    .grid_title {
      font-size: 2rem;
      font-weight: bold;
      margin: 0;
    }
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
</style>
