<template>
  <div class="standard">
      <masonry
      class="grid"
      :cols="{default: columns, 800: 1}"
      :gutter="{default: gutter, 800: 0}"
      >
        <div v-for="(item, index) in items" class="item" :key="index">
          <img :src="item.image" />
          <h2 v-html="item.title"></h2>
          <h3 v-html="item.subtitle"></h3>
          <p v-html="item.text"></p>
        </div>
      </masonry>
      
    <resize-observer @notify="onResize" />
  </div>
</template>

<script>

export default {
  name: "Standard",
  data() {
    return {
      width: null,
      display: "desktop",
      columns: 2,
      gutter: 40
    };
  },
  props: ["view", "items"],
  methods: {
    handleResize ({ width, height }) {
      console.log('resized', width, height)
    },
    onResize({ width, height }) {
      if (width < 500) {
        this.display = "mobile";
        this.columns = 1;
        this.gutter = 0
      } else {
        this.display = "desktop";
        this.columns = this.view.config.columns;
        this.gutter = 40
      }
    }
  },
  mounted() {
    this.columns = this.view.config.columns || 2;
  },
  created() {

  },
};
</script>

<style lang="scss" scoped>
.standard {
  position: relative
}
.item {
  img {
  @apply mb-2;
}
  h2 {
    @apply font-bold text-2xl;
  }
  h3 {
@apply font-light text-lg leading-tight;
  }
}

@media only screen and (max-width: 600px) {

.standard {
width: 85%;
margin: 0 auto;
.item {
  width: 100%;
  @apply mb-10;
  &:last-child {
  margin: 0
}
  img {
  width: 100%;
}
}
}
}
</style>
