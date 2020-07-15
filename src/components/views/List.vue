<template>
  <div class="list_container">
    <ul class="list_items" :class="{ active: !active }">
      <li
        v-for="(item, index) in items"
        :key="index"
        @click="select(index)"
        :class="{ active: selected == index }"
      >
        <img v-if="item.image" />
        {{ item.title }}
      </li>
    </ul>
    <div class="list_info" :class="{ active: active }" @click="toggle()">
      <div v-if="selected !== null" class="item_selected">
        <h1 class="item_title" :class="{ overlay: items[selected].image }">
          {{ items[selected].title }}
        </h1>
        <div
          v-if="items[selected].image"
          class="item_image"
          :style="{ background: 'url(' + items[selected].image + ')' }"
        ></div>
        <div class="item_text" v-html="items[selected].text"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "List",
  data() {
    return {
      selected: null,
      active: false,
    };
  },
  methods: {
    select(index) {
      this.selected = index;
      this.toggle();
    },
    toggle() {
      this.active = !this.active;
    },
  },
  props: ["view", "items"],
};
</script>

<style lang="scss">
.list_container {
  width: 100%;
  margin: 0 auto;
  border: 1px solid #ddd;
  position: relative;
  overflow: hidden;
  border-radius: 0;
  ul.list_items {
    list-style-type: none;
    padding: 0;
    max-height: 400px;
    overflow: scroll;
    transform: translateX(-100%);
    transition: transform 0.5s ease;
    &.active {
      transform: translateX(0%);
    }
    li {
      border-bottom: 1px solid #ddd;
      padding: 1rem;
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
    background: white;
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
        font-size: 1.2rem;
        width: 90%;
        color: white;
        background: rgba(0, 0, 0, 0.6);
        &.overlay {
          position: absolute;
          top: 0;
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

@media only screen and (max-width: 600px) {

.list_container {
border-radius: 0
}

}
</style>
