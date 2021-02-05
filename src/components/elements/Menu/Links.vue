<template>
  <div class="links_container">
     <div class="mobile_menu_icon" @click="toggleMenu" :class="{'active': mobileMenu}">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>
    <ul class="webkit_menu" :class="{active: mobileMenu}">
      <li v-for="item in items" :class="{active: isActive(item.slug)}">
        <span @click="load(item.slug)">{{item.slug}}</span>
        <ul>
          <li v-for="child in item.children" :class="{active: isActive(child.slug)}">
            <span @click="load(item.slug + '/' + child.slug)">{{child.slug}}</span>
            <ul class="subChildren">
              <li v-for="sub in child.children" :class="{active: isActive(sub.slug)}">
                <span @click="load(item.slug + '/' + child.slug + '/' + sub.slug)">{{sub.slug}}</span>
              </li>
            </ul>
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
      mobileMenu: null
    }
  },
  created(){
  },
  watch: {
  },
  methods: {
    isActive(slug) {
      if (this.active.includes(slug.toLowerCase().replace(' ', '-'))) {
        return true
      } else {
        return false
      }
    },
    load(slug) {
      this.mobileMenu = false;
      bus.$emit("loadPage", slug);
    },
    toggleMenu(){
      this.mobileMenu = !this.mobileMenu;
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


.mobile_menu_icon {
  width: 25px;
  height: 30px;
  margin-top: 10px;
  margin-right: 20px;
  transform: rotate(0deg);
  transition: .5s ease-in-out;
  cursor: pointer;
  display: none;
  top: 0;
  right: 0;
  span {
    display: block;
    position: absolute;
    height: 2.5px;
    width: 100%;
    background: #fff;
    border-radius: 9px;
    opacity: 1;
    left: 0;
    transform: rotate(0deg);
    transition: .25s ease-in-out;
    &:nth-child(1) {
      top: 0px;
    }
    &:nth-child(2) {
      top: 9px;
    }
    &:nth-child(3) {
      top: 9px;
    }
    &:nth-child(4) {
      top: 18px;
    }
  }
  &.active {
    span {
      &:nth-child(1) {
        top: 9px;
        width: 0%;
        left: 50%;
      }
      &:nth-child(2) {
        transform: rotate(45deg);
      }
      &:nth-child(3) {
        transform: rotate(-45deg);
      }
      &:nth-child(4) {
        top: 9px;
        width: 0%;
        left: 50%;
      }
    }
  }
}

@media only screen and (min-width: 600px) {

ul.webkit_menu {
  font-size: 0;
  list-style-type: none;
  display: flex;
  align-items: center;
  height: 100%;
  // initial li
  li {
    height: 100%;
    position: relative;
    border-right: .5px solid rgba(255,255,255,0.1);
    &:first-child {
     border-left: none;
  }
    span {
    font-weight: bold;
    width: 100%;
        text-transform: capitalize;
    color: #fff;
    height: 3.7rem !important;
    @apply flex px-5 items-center;
    font-family: $open-sans;
    font-size: 1.05rem;
    font-weight: 600;
    height: 100%;
  }
    &.active {
      background-color: rgba(0,0,0,0.3) ;
    color: #fff;

    }
    &:hover {
    > span {
      background: rgba(0,0,0,0.8);
      color: white;
    }
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
           background-color: rgba(0,0,0,0.5);
           backdrop-filter: blur(10px) !important;
          border: none;
          &.active {
          color: #fff;
           background-color: rgba(0,0,0,0.6);
           }
           
           ul.subChildren {
             display: none;
             width: 200px;
               left: -201px;
               height: auto;
               top: 0px;
               position: absolute;
               
               backdrop-filter: blur(10px);
               li {
                    &.active {
                    span{
                    background-color: rgba(0,0,0,0.3) !important;
                    }
                  }
             }
        
           }

          &:hover {
              background-color: rgba(0,0,0,0.3);
              ul {
                display: block;
              
                li {
                  background-color: rgba(0,0,0,0.6);
                  backdrop-filter: blur(10px) !important;
                  &:hover {
                    background: black;
                  }
             
                }
              }
          }
       
        }
      }
    }
  }
}

}

@media only screen and (max-width: 600px) {


.webkit_menu {
  position: fixed;
  width: 100vw;
  height: 97vh;
  background-color: rgba(0,0,0,0.9);
  backdrop-filter: blur(10px) !important;
  top: 60px;
  left: 0;
  @apply pt-3 px-4;
  color: white;
  display: none;
  &.active {
      display: block;
    animation: showMenu .45s ease forwards;
}
  > li {
    
    @apply px-4 w-full;
    text-transform: capitalize;
    > span {
      border-bottom: 1px solid rgba(255,255,255,1);
      display: block;
      width: 100%;
      @apply py-4 mb-0 font-bold;
    }

    ul {
      margin-left: 20px;
      width: auto;
      li {
        span {
          border-bottom: 1px solid rgba(255,255,255,0.7);
          display: block;
          width: 100%;
          @apply py-4;
        }
      }
    }
  }
}

  .links_container {
    height: auto;
  }

  .mobile_menu_icon {
    display: block !important;
  }
}
// page container
.links_container {
  width: auto;
  height: 100%;
  display: flex;
  @apply items-center;
  margin: 0;
}



@keyframes showMenu {
  0% {
    opacity: 0;
    transform: scale(0);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}


</style>
