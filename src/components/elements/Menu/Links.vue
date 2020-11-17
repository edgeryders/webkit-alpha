<template>
  <div class="links_container">
    <ul>
      <li v-for="item in items"  :class="{active: item.slug == parent}">
        <span @click="load(item)">{{ item.slug }}</span>
        <ul v-if="item.children">
          <li v-for="subItem in item.children" @click="load(subItem, item.slug)" :class="{active: subItem.slug == child}">
            {{ subItem.slug }}
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script>
import { bus } from "@/main";

export default {
  name: "Links",
  props: ["items", "active"],
  data() {
    return {
      parent: null,
      child: null,
    }
  },
  created(){
    this.parent = this.active.parent;
    this.child = this.active.child;
  },
  watch: {
    active: function (val) {
      this.parent = val.parent;
      if (val.child) {
      this.child = val.child;
      }
    },
  },
  methods: {
    load(data, parent) {
      if (parent) {
        this.parent = parent;
        this.child = data.slug;
      } else {
        this.parent = data.slug;
        this.child = null;
      }
      bus.$emit("loadPage", data);
    }
  }
};
</script>

<style scoped lang="scss">
//variables
$background-purple: #eeeeee;
$subtle-white: #f9f9f9;
$subtle-grey: #f2f2f2;
$masked-grey: #333;
$blue: #0569FA;

$open-sans: "Helvetica", sans-serif;

// page container
.links_container {
  width: auto;
  height: 100%;
  display: flex;
  margin: 0;
}

ul {
  font-size: 0;
  list-style-type: none;
  display: flex;
  align-items: center;
  height: 100%;
  // initial li
  li {
    font-family: $open-sans;
    font-size: 1rem;
    font-weight: 400;
    color: #fff;
    height: 100%;
    padding: 0 1.25rem;
    text-transform: capitalize;
    display: inline-flex;
    align-items: center;
    position: relative;
    border-right: .5px solid rgba(255,255,255,0.1);
    &:first-child {
     border-left: none;
  }
    span {
    font-weight: bold;
  }
    &.active {
      background-color: rgba(0,0,0,0.3) ;
    color: #fff;

    }
    ul {
      display: none;
box-shadow: 0 10px 10px rgba(0,0,0,0.1);
            border-top: none;
 }

    // initial li:hover
    &:hover {
      cursor: pointer;
      background-color: rgba(0,0,0,0.3);
       box-shadow: none;
      span.active {
                color: white !important;

    }

      // secondary ul visibility change
      ul {
        display: inline-block;
        width: 200px;
        right: -1px;
        height: auto;
        top: 60px;
        position: absolute;

        // secondary li
        li {
          display: flex;
          @apply pl-5;
          padding-top: 1.2rem;
          padding-bottom: 1.2rem;
          font-size: 16px;
          align-items: center;
           background-color: rgba(0,0,0,0.5);

          font-weight: bold;
          border: none;
          border-bottom: .5px solid rgba(255,255,255,0.1);
          &.active {
          color: #fff;
           background-color: rgba(0,0,0,0.6);
           border-bottom: .5px solid rgba(255,255,255,0.3);

        }

          &:hover {
              background-color: rgba(0,0,0,0.6);
          }
       
        }
      }
    }
  }
}
</style>
