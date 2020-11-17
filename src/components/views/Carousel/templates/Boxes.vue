<template>
  <div class="relative" v-resize="onResize">

      <div class="carousel" @mouseenter="stopRotation" @mouseleave="startRotation">
          <div v-for="(slide, index) in slides.slice(slideIndex, slideIndex + number)" :key="slide" class="slide_el-md" :class="{active: paused}" @click="activate(index)" :content="`<div class='tooltip_custom'><h2>${slide.title}</h2></div>`" v-tippy="{followCursor : true, offset: '10, 10', touch: false, theme: 'light', placement : 'left', arrow : true, arrowType : 'round', animation : 'shift-away' }" ref="newton">
              <h2>{{slide.title}}</h2>
          </div>
      </div>

      <div class="navigation">

        <div id="load_container" :class="{'paused': paused}">
        <div id="circle-loader-wrap" v-if="showLoader">
        <div class="left-wrap">
        <div class="loader"></div>  
        </div>
        <div class="right-wrap">
        <div class="loader"></div>
        </div>
        </div>
        </div>

        <div class="dots">
          <div v-for="(i, index) in Math.floor(slides.length / number) + 1" class="indicator" :class="{active: slideIndex/number == index}" @click="setIndex(index)">
            
          </div>

        </div>
      </div>

  </div>

</template>

<script>
export default {
  data() {
    return {
      slides: null,
      showImage: false,
      showLoader: true,
      tooltip: false,
      number: 4,
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
      this.stopRotation();
      setTimeout(() => this.showLoader = true, 1);
      this.startRotation();
    },
    next() {
      
      if (this.slideIndex + 1 >= this.slides.length) {
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
          this.number = 4;
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
       this.number = 4;
      this.tooltip = true;
    }

    this.startRotation();


  },
  computed: {
  },
  props: ["slides"]
};
</script>
<style lang="scss">


</style>
