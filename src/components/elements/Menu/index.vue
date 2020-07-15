<template>
  <div class="menu_container" @mouseover="hover = true">
    <Logo :type="type" :color="color" />

    <div class="menu">
      <kinesis-container style="height: 100%">
        <kinesis-element
          :strength="1.2"
          type="depth"
          style="height: 100%"
          class="menu_content"
        >
          <Sidebar @select="select" />
          <div class="info">
            <Campfire :active="hover" v-if="active == 'campfire'" />
            <Events :active="hover" v-if="active == 'events'" />
          </div>
        </kinesis-element>
      </kinesis-container>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import { Hooper, Slide } from "hooper";
import "hooper/dist/hooper.css";

import Logo from "@/components/elements/Menu/Logo.vue";
import Sidebar from "@/components/elements/Menu/Sidebar.vue";
import Campfire from "@/components/elements/Menu/Campfire.vue";
import Events from "@/components/elements/Menu/Events.vue";

export default {
  name: "Menu",
  data() {
    return {
      active: "campfire",
      hover: false,
      date: "",
    };
  },
  components: {
    Hooper,
    Slide,
    Campfire,
    Sidebar,
    Events,
    Logo,
  },
  methods: {
    select(value) {
      this.active = value;
    },
  },
  created() {},
  filters: {},
  props: {
    color: String,
    type: String,
  },
};
</script>

<style scoped lang="scss">
@keyframes perspective {
  0% {
    perspective: 2000px;
  }
  99% {
    perspective: 2000px;
  }
  100% {
    perspective: 0;
  }
}

@keyframes showMenu {
  0% {
    transform: rotateX(12deg) translateY(0px);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  100% {
    transform: rotateX(0) translateY(0px);
    opacity: 1;
  }
}

.menu {
  width: 800px;
  height: 500px;
  position: absolute;
  left: 0px;
  top: 60px;
  animation: showMenu 0.5s ease forwards;
  z-index: 99;
  opacity: 0;
  display: none;
  .menu_content {
    background: #fafafa;
    display: flex;
    width: 100%;
    height: 100%;
    border-radius: 8px;
    box-shadow: 0 50px 100px rgba(50, 50, 93, 0.1),
      0 15px 35px rgba(50, 50, 93, 0.15), 0 5px 15px rgba(0, 0, 0, 0.1);
  }
}

.menu_container {
  position: relative;
  z-index: 9999999;
  left: 7px;
  top: 8px;
  padding-bottom: 15px;
  &:hover {
    animation: perspective 0.4s ease forwards;
    cursor: pointer;
    /deep/ .logo {
      background: rgba(255, 255, 255, 1);
      border-radius: 100%;
      svg {
        transform: scale(1);
        path {
          fill: RGBA(241, 81, 51, 1);
        }
      }
    }
    .menu {
      transform: rotateX(0) translateY(0);
      opacity: 1;
      display: flex;
    }
  }
}

.info {
  flex-grow: 1;
  height: 100%;
  width: 600px;
  border-radius: 0 8px 0 0;
  overflow: scroll;
  position: relative;
}
</style>
