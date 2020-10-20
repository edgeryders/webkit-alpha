<template>
  <div class="standard">
      <masonry
      class="grid"
      :cols="{default: columns, 800: 1}"
      :gutter="{default: gutter, 800: 0}"
      v-if="filteredItems().length"
      >
        <div v-for="(item, index) in filteredItems().slice(0,view.config.items)" class="item pb-4 mb-4 md:pb-4 md:mb-4" :key="index">
          <a class="item_title" :href="'https://edgeryders.eu/t/' + item.slug" target="_blank">
            <h2><span class="date">{{item.created_at | formatDate}}</span>{{item.title}}</h2>
          </a>
        </div>
      </masonry>
      
    <resize-observer @notify="onResize" />
  </div>
</template>

<script>
import moment from "moment";
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
  props: ["view", "items", "users"],
  methods: {
    handleResize ({ width, height }) {
      console.log('resized', width, height)
    },
    getAvatar(id) {
      return 'https://edgeryders.eu' + this.users.filter(x => x.id == id)[0].avatar_template.replace('{size}', 200)
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
    },
    filteredItems() {
        return this.items.filter(x => x.pinned == false).slice(0, this.view.items)
  
    }
  },
  mounted() {
    this.columns = this.view.config.columns || 2;
  },
  created() {

  },
  filters: {
    formatDate: function(value) {
      return moment(String(value)).format("DD.MM.YY");
    }
  },
  computed: {

  },
};
</script>

<style lang="scss" scoped>
.standard {
  position: relative
}
.title {
  display: flex !important;
  align-items: flex-start;
}
.date {
  color: #FF6A00;
  @apply mr-2;
}
.item {
  width: 100%;
  @apply border-b border-gray-200;
}
.item_title {
  @apply flex ;
  &:hover {
    @apply underline;
    cursor: pointer;

  }
  img {
  width: 35px;
  height: 35px;
  border-radius: 10px;
  @apply mr-4 mt-2;
}
  h2 {
    @apply font-bold text-xl leading-tight;
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
