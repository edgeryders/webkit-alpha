<template>
  <div id="app" ref="bodyContainer">
    <div class="menu_container">
      <a class="flex items-center" href="./">
        <div class="er_logo"></div>
        <img class="logo" src="@/assets/logos/participio_logo_2.png" />
      </a>
      <Links :items="config.pages" />
    </div>
    <div class="header" v-if="header" :style="header.config.style">
      <div class="wrapper">
        <div v-for="view in header.views" class="view">
          <div class="title" v-html="view.title"></div>
          <div class="text">
            <div v-for="text in view.text">
              <p v-html="text"></p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="content">
      <div class="section" v-for="item in blocks" :style="item.section.style">
        <div class="wrapper">
          <div class="section_title" v-if="item.section.title">
            <h2>{{ item.section.title }}</h2>
          </div>
          <div v-if="item.section.views" v-for="view in item.section.views">
            <div class="text_container" v-if="view.text">
              <div class="text" v-for="text in view.text" v-html="text"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
var YAML = require("yamljs");

import TextView from "@/components/views/Text.vue";
import Form from "@/components/views/Form";
import Grid from "@/components/views/Grid";
import List from "@/components/views/List";
import Blog from "@/components/views/Blog";
import Cards from "@/components/views/Cards";
import Footer from "@/components/views/Footer";
import Slider from "@/components/views/Slider";
import Menu from "@/components/elements/Menu";
import Links from "@/components/elements/Menu/Links";
import Modal from "@/components/elements/Modal";

export default {
  name: "App",
  data() {
    return {
      tags: null,
      title: null,
      links: null,
      windowTop: null,
      activeModal: null,
      stylesheet: null,
      modal: null,
      logo: {
        a:
          "data:image/svg+xml,%3Csvg viewBox='0 0 500 500' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 250a250 250 0 1 1 500 0 250 250 0 0 1-500 0zm97-103v106h42v-16h-26v-31h19v-16h-19v-27h26v-16zm80 91c6 0 8-4 8-11v-52c0-8-4-12-13-12h-4v75zm-25-91h23c19 0 27 10 27 29v48c0 20-8 29-26 29h-24zm63 25c0-17 9-27 25-27s24 9 24 27v10h-16v-11c0-8-3-11-8-11-6 0-9 3-9 11v59c0 7 3 11 9 11 5 0 8-4 8-11v-17h-10v-13h26v53h-8l-3-7c-4 7-9 10-16 10-14 0-22-11-22-30zm64-25h43v16h-26v27h18v16h-18v31h26v16h-43zM112 381H95V275h24c18 0 26 8 26 30 0 13-3 21-10 26l12 50h-17l-10-45h-8zm0-60v-31h6c8 0 10 3 10 15 0 11-2 16-10 16zm53-46l10 42h1l10-42h17l-19 62v44h-16v-42l-20-64zm69 90c6 0 9-4 9-11v-51c0-9-4-13-13-13h-4v75zm-24-90h23c18 0 27 9 27 29v47c0 20-8 30-26 30h-24zm136 46v-31h6c8 0 10 3 10 15 0 11-2 16-10 16zm-72-46h43v15h-26v28h19v15h-19v32h26v16h-43zm72 106h-16V275h24c17 0 25 8 25 30 0 13-3 21-10 26l12 50h-17l-10-45h-8zm57-30c1 11 4 16 11 16 6 0 10-4 10-10 0-9-6-14-15-23-12-12-20-21-20-35 0-15 11-26 25-26s24 10 25 26l-16 2c-1-9-3-13-9-13-5 0-9 4-9 10 0 9 7 16 17 25 11 11 18 19 18 34s-11 26-26 26-26-11-27-29zm-65-172v-42h-42a42 42 0 1 1 42 42z' :fill='color' fill-rule='evenodd'/%3E%3C/svg%3E"
      },
      data: {
        config: null,
        blocks: null
      }
    };
  },
  components: {
    TextView,
    Links,
    Form,
    Grid,
    List,
    Blog,
    Cards,
    Slider,
    Menu,
    Footer,
    Modal
  },
  props: ["header", "blocks", "config"],
  methods: {
    handleClicks(event) {
      let { target } = event;
      var linkTarget = target.getAttribute("href");
      if (target && target.matches("a") && linkTarget.includes("form:")) {
        var formId = target.getAttribute("href").replace("form:", "");
        event.preventDefault();
        this.openModal("form", formId);
      }
    },
    openModal(type, value) {
      var obj = {
        type: type,
        value: value,
        position: this.windowTop
      };
      this.activeModal = true;
      localStorage.setItem("modal", JSON.stringify(obj));
      this.modal = obj;
    },
    closeModal() {
      this.activeModal = false;
      this.modal = null;
      this.$nextTick(function() {
        window.scrollTo(0, this.windowTop);
      });
    },
    getProp(obj, key) {
      var test = key.split(".").reduce(function(o, x) {
        return typeof o == "undefined" || o === null ? o : o[x];
      }, obj);
      console.log(test);
      return test;
    },
    getNavElements(sections) {
      var self = this;
      var navArray = sections.map(function(el) {
        var block = self.type(el);
        var id = el[block]["config"] && el[block]["config"]["id"];
        if (id && block !== "menu") {
          return {
            text: id,
            url: "#" + id
          };
        }
      });
      return navArray.filter(function(el) {
        return el != null;
      });
    },
    get(BlockName) {
      var block = this.blocks.filter(x => x[BlockName]);
      if (block.length) {
        return block[0][BlockName];
      } else {
        return false;
      }
    },
    isSingle(block) {
      if ((block.views.length = 1)) {
        return true;
      } else {
        return false;
      }
    },
    socialLink(network, text) {
      var title = this.config.title;
      var link = location.href;
      var description = "";
      if (this.config.description) {
        description = this.config.description;
      }
      if (network == "twitter") {
        return "https://twitter.com/intent/tweet?text=" + title + " - " + link;
      }
      if (network == "facebook") {
        return "https://www.facebook.com/sharer/sharer.php?u=" + link;
      }
      if (network == "linkedin") {
        return "https://www.linkedin.com/sharing/share-offsite/?url=" + link;
      }
      if (network == "email") {
        return "mailto:?subject=" + title + "&body=" + description + " " + link;
      }
    },
    copyurl() {
      this.$refs.text.select();
      const link = location.href;

      var el = document.createElement("textarea");
      el.value = link;
      el.setAttribute("readonly", "");
      el.style = { position: "absolute", left: "-9999px" };
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);

      this.copied = true;
      setTimeout(() => (this.copied = false), 2000);
    },
    showAnchorMenu(config) {
      if (config?.menu?.links?.anchor) {
        return config?.menu?.links?.anchor;
      } else {
        return true;
      }
    },
    type(obj) {
      return Object.keys(obj)[0];
    },
    handleScroll(event) {
      let menu = document.querySelector(".wk_menu");
      var height = 400;
      if (!this.activeModal) {
        this.windowTop = window.top.scrollY;
      }
      if (this.config && this.config.header && this.config.header.height) {
        height = this.config.header.height.match(/(\d+)/)[0] - 70;
      }
      if (window.scrollY > height) {
        menu.classList.add("active");
      } else {
        menu.className = "wk_menu";
      }
    }
  },
  created() {
    if (process.browser) {
      window.addEventListener("scroll", this.handleScroll);
    }
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const payloadParam = urlParams.get("payload");
    if (payloadParam && localStorage.getItem("modal")) {
      var obj = JSON.parse(localStorage.getItem("modal"));
      console.log(obj.type);
      this.openModal(obj.type, obj.value);
      this.windowTop = obj.position;
    }
  }
};
</script>
<style lang="scss">
.header {
  width: 100%;
  height: 460px;
  padding-top: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: height 1s cubic-bezier(0.22, 1, 0.36, 1);
  .wrapper {
    width: 70%;
  }
}

.menu_container {
  display: flex;
  position:fixed;
  backdrop-filter: blur(2px);
  background: rgba(255,255,255,0.9);
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 0px 10px rgba(0,0,0,0.1);
  width: 100%;
  height: 60px;
  .er_logo {
  background: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' width='500' height='500' version='1'%3E%3Cdefs%3E%3Cpath id='a' d='M0 250a250 250 0 1 1 500 0 250 250 0 0 1-500 0zm97-103v106h42v-16h-26v-31h19v-16h-19v-27h26v-16H97zm80 91c6 0 8-4 8-11v-52c0-8-4-12-13-12h-4v75h9zm-25-91h23c19 0 27 10 27 29v48c0 20-8 29-26 29h-24V147zm63 25c0-17 9-27 25-27s24 9 24 27v10h-16v-11c0-8-3-11-8-11-6 0-9 3-9 11v59c0 7 3 11 9 11 5 0 8-4 8-11v-17h-10v-13h26v53h-8l-3-7c-4 7-9 10-16 10-14 0-22-11-22-30v-54zm64-25h43v16h-26v27h18v16h-18v31h26v16h-43V147zM112 381H95V275h24c18 0 26 8 26 30 0 13-3 21-10 26l12 50h-17l-10-45h-8v45zm0-60v-31h6c8 0 10 3 10 15 0 11-2 16-10 16h-6zm53-46l10 42h1l10-42h17l-19 62v44h-16v-42l-20-64h17zm69 90c6 0 9-4 9-11v-51c0-9-4-13-13-13h-4v75h8zm-24-90h23c18 0 27 9 27 29v47c0 20-8 30-26 30h-24V275zm136 46v-31h6c8 0 10 3 10 15 0 11-2 16-10 16h-6zm-72-46h43v15h-26v28h19v15h-19v32h26v16h-43V275zm72 106h-16V275h24c17 0 25 8 25 30 0 13-3 21-10 26l12 50h-17l-10-45h-8v45zm57-30c1 11 4 16 11 16 6 0 10-4 10-10 0-9-6-14-15-23-12-12-20-21-20-35 0-15 11-26 25-26s24 10 25 26l-16 2c-1-9-3-13-9-13-5 0-9 4-9 10 0 9 7 16 17 25 11 11 18 19 18 34s-11 26-26 26-26-11-27-29l16-3zm-65-172v-42h-42a42 42 0 1 1 42 42z'/%3E%3C/defs%3E%3Cuse fill='orangered' fill-rule='evenodd' xlink:href='%23a'/%3E%3C/svg%3E");
  background-size: contain;
background-position: 0 center;
background-repeat: no-repeat;
width: 35px;
height: 35px;
margin-left: 1rem;
padding: 0 0 0 3rem;
display: inline-block;
border-right: 1px solid rgba(0,0,0,0.1);
}
  .logo {
    height: 20px;
    @apply ml-3 mt-0;
    width: auto;
  }
  .links {
    width: auto;
  }
}

.content {
  display: block;
  @apply w-full pt-12;
}

.section {

  @apply block w-full  mb-10; 
  .wrapper {
    width: 70%;
    @apply mx-auto;
  }
  .videoWrapper {
  margin-top: -3rem;
}
  .text_container {
    display: flex;
    .text {
      width: 100%;
      @apply mr-6;
      &:last-child {
        @apply mr-0;
      }
    }
  }
}

// Typography

.header {
  .wrapper {
    .title {
      @apply text-4xl font-bold;
    }
    .text {
      @apply text-2xl;
    }
  }
}

.section {
  .section_title {
    @apply font-bold text-3xl mb-4;
  }
  .text {
    @apply text-lg;
    h2 {
      @apply text-2xl font-bold mb-2;
    }
    p {
      @apply mb-4;
    }
    img {
      @apply mt-6 pl-6 pt-6;
    }
  }
}

@media only screen and (max-width: 600px) {
}
</style>
