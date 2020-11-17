<template>
  <div class="relative" v-resize="onResize">

      <div class="carousel">
          <div v-for="(item, index) in slides.slice(slideIndex, slideIndex + number)" :key="slide" class="item">
              <div class="item_image" v-if="item.image" :style="'background: url(' + item.image + ')'"></div>
              <a class="title" :href="item.url" target="_blank">{{item.title}}</a>
              <p class="date">{{item.date | formatDate }}</p>
              <p v-html="item.text"></p>
          </div>
      </div>

      <div class="navigation">
        <div class="dots">
          <div v-for="(i, index) in Math.floor(slides.length / number)" class="indicator" :class="{active: slideIndex/number == index}" @click="setIndex(index)">
            
          </div>

        </div>
      </div>

  </div>

</template>

<script>
import moment from "moment";

export default {
  data() {
    return {
      slides: null,
      showImage: false,
      showLoader: true,
      tooltip: false,
      number: 2,
      slideIndex: 0,
      paused: false,
      timer: null,
      active: null
    };
  },
  methods: {
    getAsset(file) {
      return require("@/assets/" + file);
    },
    showTip(index) { 
      var self = this;
      this.$nextTick( () => self.$refs.newton[index]._tippy.show() )
     },
    hideTip(index) { 
      var self = this;
      this.$nextTick( () => self.$refs.newton[index]._tippy.hide() )
     },
    activate(index) {
      if (this.active == null) {
        this.active = index;
      } else {
        this.active = null;
      }
    },
    close() {
        this.active = null;
    },
    isActive() {
      if (this.active !== null) {
        return true
      } else {
        return false
      }
    },
    setIndex(value) {
      this.slideIndex = value * this.number;
      this.showLoader = false;
    },
    next() {
      
      if (this.slideIndex + 4 > this.slides.length) {
        this.slideIndex = 0;
      } else {
        this.slideIndex = this.slideIndex + this.number;
      }
     
    },
    stopRotation() {
      clearInterval(this.timer);
      this.paused = true;
    },
    startRotation() {
      this.timer = setInterval(this.next, 3000);
      this.paused = false;
    },
    onResize({ width, height }) {
      if (width < 500) {
        this.viewport = "mobile"
        this.number = 1;
      } else {
         this.viewport = "desktop";
          this.number = 2;
          this.tooltip = false;
      }
    }
  },
  mounted() {

    var width = window.innerWidth;
    if (width < 500) {
      this.viewport = "mobile";
      this.number = 1;
    } else {
      this.viewport = "desktop";
       this.number = this.show || 2;
      this.tooltip = true;
    }



  },
  filters: {
    formatDate: function(value) {
      return moment(String(value)).format("DD/MM/YYYY");
    },
  },
  computed: {
  },
  props: ["slides", "items", "show"]
};
</script>
<style lang="scss">
.carousel {
  display: flex;
}
.item {
  border-right: 1px solid #efefef;
  padding: 0 2rem 0 2rem;
  width: 100%;
  .item_image {
    height: 150px;
    display: block;
    margin-bottom: 1rem;
    width: 100%;
    background-size: cover !important;
    background-position: 50% 50% !important;
  }
  &:first-child {
    padding-left: 0;
  }
  &:last-child {
    border: none;
  }
  a.title {
    @apply font-bold border-b pb-2 mb-2 inline-block w-full;
    &:hover {
      color: orangered;
    }
  }
  .date {
    @apply font-bold mb-4;
  }
  img {
    @apply mb-3;
  }
}

.navigation {
  @apply block w-full items-center;
  margin-top: 30px;
  .dots {
    @apply inline-block;
    .indicator {
      background: #fff;
      float: left;
      border: 1px solid #ddd;
      width: 15px;
      height: 15px;
      border-radius: 100px;
      margin-right: 10px;
      margin-bottom: 10px;
      &:hover {
        cursor: pointer;
        background: #ddd;
      }
      &.active {
      background: #ff6a10;
      border: 1px solid #ff6a10;
    }
    }
  }
}

@media only screen and (max-width: 800px) {
 
  .carousel {
    flex-direction: column;
    .item {
      padding: 0 !important;
    }
  }
  
}


</style>
