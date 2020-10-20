<template>
  <div id="app" ref="bodyContainer">
    <vue-headful
      :title="config.site.title || 'Edgeryders'"
      :description="config.site.summary"
    />
    <div class="wk_menu">
      <div class="menu_bg">
        <div class="blur" :style="menu.style" :class="{ disable_blur: getProp(header, 'blur') == false }"></div>
        <div
          class="header_image"
          v-if="header"
          :style="[
            {
              background: 'url(' + header.image + ')',
              height: header.height,
              backgroundPosition: header.position,
              opacity: header.opacity,
            },
          ]"
        ></div>
      </div>

      <!-- <span class="menu_logo">
        <div v-if="getProp(menu, 'edgeryders.url')">
          <Menu
            :type="menu.edgeryders.icon || 'classic'"
            :color="menu.edgeryders.color || 'white'"
          />
        </div>
        <div v-else>
          <Menu type="classic" color="white" />
        </div>
        <a :href="menu.other.url" v-if="getProp(menu, 'other')">
          <img class="other_logo" :style="{height: menu.other.size}" :src="menu.other.icon" />
        </a>
        <h2 v-if="menu.title">{{ menu.title }}</h2>
      </span> -->

      <div
        class="menu_links"
        :class="{ nofade: getProp(config, 'menu.fade') == false }"
      >
        <div v-if="getProp(menu, 'links.anchor') !== false" class="anchor">
          <a v-for="(link, index) in getNavElements(blocks)" :href="link.url">
            {{ link.text }}
          </a>
        </div>
        <div v-if="menu.links" class="external">
          <a
            v-for="(link, index) in menu.links"
            :key="index"
            :href="link.url"
            :style="link.style"
            :class="link.class"
            >{{ link.text }}</a
          >
        </div>
      </div>
    </div>

    <div :class="{'modal': activeModal}" :style="'top : -' + windowTop + 'px'">

    <div class="section header" :style="header.style" v-if="header">
      <div
        class="header_image"
        v-if="getProp(header, 'image')"
        :style="[
          {
            background: 'url(' + header.image + ')',
            height: header.height,
            backgroundPosition: header.position,
            opacity: header.opacity,
          },
        ]"
      ></div>

      <div class="wrapper" v-if="header.views">
        <div v-for="(view, index) in header.views" :key="index">
          <div class="image" v-if="view.type == 'image'" :style="view.style">
            <img :src="view.image.url" />
          </div>
          <TextView
            v-if="view.type == 'text'"
            :title="view.title"
            :text="view.text"
            :links="view.links"
            :config="view.config"
            :stylesheet="view.style"
          />
          <Form
              v-if="view.type == 'form'"
              :title="view.title"
              :text="view.text"
              :fields="view.fields"
              :config="view.config"
            />
          
          
        </div>
      </div>

      <div class="social" v-if="getProp(header, 'social')">
        <div v-for="(service, index) in header.social" :key="index">
          <a :href="socialLink(service)" :class="service" target="_blank"></a>
        </div>
      </div>
    </div>
    
  

    <div v-for="(block, index) in blocks" :key="index">

      <div
        v-if="type(block) == 'section'"
        class="section content"
        :style="block.section.style"
        :id="block.section.config && block.section.config.id"
      >
        <div
          class="title"
          :class="{
            single:
              block.section.views.length == 1 &&
              block.section.views[0].text.length == 1,
          }"
          v-if="block.section.title"
        >
          <h2>{{ block.section.title }}</h2>
          <h3 v-if="block.section.subtitle" @click="handleClicks" v-html="block.section.subtitle"></h3>
        </div>
        <div class="views">
          <div
            v-for="(view, index) in block.section.views"
            :key="index"
            class="view"
            :class="view.type"
          >
            <div
              v-if="view.type == 'title'"
              class="title_view"
            >

            <h2 v-html="view.title"></h2>

            <p v-html="view.text"></p>
       
            </div>
            <div
              v-if="view.type == 'image'"
              :style="{ flexBasis: config.width }"
            >
              <img :src="view.image.url" />
            </div>
            <TextView
              v-if="view.type == 'text'"
              :title="view.title"
              :text="view.text"
              :config="view.config"
            />
            <Form
              v-if="view.type == 'form'"
              :view="view"
            />
            <Grid v-if="view.type == 'grid'" :view="view" />
            <Cards v-if="view.type == 'cards'" :view="view" />
            <Slider v-if="view.type == 'slider'" :view="view" />
            <List v-if="view.type == 'table'" :view="view" />

            <Blog v-if="view.type == 'blog'" :view="view" />
          </div>
        </div>
      </div>
    </div>
    <Footer :config="footer.config" />
    <Modal v-if="modal !== null" @close="closeModal()" :type="modal.type" :value="modal.value" />
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
          "data:image/svg+xml,%3Csvg viewBox='0 0 500 500' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 250a250 250 0 1 1 500 0 250 250 0 0 1-500 0zm97-103v106h42v-16h-26v-31h19v-16h-19v-27h26v-16zm80 91c6 0 8-4 8-11v-52c0-8-4-12-13-12h-4v75zm-25-91h23c19 0 27 10 27 29v48c0 20-8 29-26 29h-24zm63 25c0-17 9-27 25-27s24 9 24 27v10h-16v-11c0-8-3-11-8-11-6 0-9 3-9 11v59c0 7 3 11 9 11 5 0 8-4 8-11v-17h-10v-13h26v53h-8l-3-7c-4 7-9 10-16 10-14 0-22-11-22-30zm64-25h43v16h-26v27h18v16h-18v31h26v16h-43zM112 381H95V275h24c18 0 26 8 26 30 0 13-3 21-10 26l12 50h-17l-10-45h-8zm0-60v-31h6c8 0 10 3 10 15 0 11-2 16-10 16zm53-46l10 42h1l10-42h17l-19 62v44h-16v-42l-20-64zm69 90c6 0 9-4 9-11v-51c0-9-4-13-13-13h-4v75zm-24-90h23c18 0 27 9 27 29v47c0 20-8 30-26 30h-24zm136 46v-31h6c8 0 10 3 10 15 0 11-2 16-10 16zm-72-46h43v15h-26v28h19v15h-19v32h26v16h-43zm72 106h-16V275h24c17 0 25 8 25 30 0 13-3 21-10 26l12 50h-17l-10-45h-8zm57-30c1 11 4 16 11 16 6 0 10-4 10-10 0-9-6-14-15-23-12-12-20-21-20-35 0-15 11-26 25-26s24 10 25 26l-16 2c-1-9-3-13-9-13-5 0-9 4-9 10 0 9 7 16 17 25 11 11 18 19 18 34s-11 26-26 26-26-11-27-29zm-65-172v-42h-42a42 42 0 1 1 42 42z' :fill='color' fill-rule='evenodd'/%3E%3C/svg%3E",
      },
      data: {
        config: null,
        blocks: null,
      },
    };
  },
  components: {
    TextView,
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
  props: ["blocks", "config", "header", "menu", "footer"],
  methods: {
    handleClicks(event) {
      let { target } = event;
      var linkTarget = target.getAttribute('href');
      if (target && target.matches("a") && linkTarget.includes("form:")) {
        var formId = target.getAttribute('href').replace("form:", '');
        event.preventDefault();
        this.openModal('form', formId)
      }
    },
    openModal(type, value) {
      var obj = {
        type: type,
        value: value,
        position: this.windowTop
      }
      this.activeModal = true;
      localStorage.setItem('modal', JSON.stringify(obj))
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
            url: "#" + id,
          };
        }
      });
      return navArray.filter(function(el) {
        return el != null;
      });
    },
    get(BlockName) {
      var block = this.blocks.filter((x) => x[BlockName]);
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
    const payloadParam = urlParams.get('payload')
    if (payloadParam && localStorage.getItem('modal')) {
      var obj = JSON.parse(localStorage.getItem('modal'));
      console.log(obj.type)
      this.openModal(obj.type, obj.value);
      this.windowTop = obj.position
    }
  },
};
</script>
<style lang="scss">
.modal {
  overflow: hidden;
  position: fixed;
}

@media only screen and (max-width: 600px) {

}

</style>
