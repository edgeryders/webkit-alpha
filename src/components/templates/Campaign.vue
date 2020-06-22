<template>
  <div id="app">
    <vue-headful :title="config.site.title || 'Edgeryders'" :description="config.site.summary"/>
    <div class="menu">
      <div class="menu_bg">
        <div class="blur" :style="get('menu').style"></div>
        <div
        class="header_image"
        v-if="getProp(config, 'header.image')"
        :style="[{background: 'url(' + config.header.image + ')', height: config.header.height, backgroundPosition: config.header.position }]"
      ></div>
      </div>
      
      <span class="title">
        <a :href="config.menu.edgeryders.url" v-if="getProp(config, 'menu.edgeryders')" >
          <Logo :type="config.menu.edgeryders.icon || 'classic' " :color="config.menu.edgeryders.color || 'white'" />
        </a>
        <div v-else>
          <Logo type="classic" color="white" />
        </div>
        <a :href="config.menu.other.url" v-if="getProp(config, 'menu.other')">
          <img class="other_logo" :src="config.menu.other.icon" />
        </a>
        <h2 v-if="get('menu').title">{{get('menu').title}}</h2>
      </span>

      <div class="links" :class="{'nofade': getProp(config, 'menu.links.fade') == false}">
        <div v-if="showAnchorMenu(config)" class="anchor">
          <a v-for="(link, index) in getNavElements(blocks)" :href="link.url">
            {{ link.text }}
          </a>
        </div>
        <div v-if="get('menu').links.length" class="external">
          <a v-for="(link, index) in get('menu').links" :key="index" :href="link.url" :style="link.style">{{link.text}}</a>
        </div>
      </div>
    </div>

    <div class="section header" id="test" :style="get('header').style">
      <div
        class="header_image"
        v-if="getProp(config, 'header.image')"
        :style="[{background: 'url(' + config.header.image + ')', height: config.header.height, backgroundPosition: config.header.position }]"
      ></div>

      <div class="wrapper" v-if="get('header').views">
        <div v-for="(view, index) in get('header').views" :key="index">
          <div class="image" v-if="view.type == 'image'" style="width: 300px">
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
        </div>
      </div>

      <div class="social" v-if="getProp(config, 'header.social')">
        <div v-for="(service, index) in config.header.social" :key="index" >
          <a :href="socialLink(service)" :class="service" target="_blank"></a>
        </div>
      </div>
    </div>

    <div v-for="(block, index) in blocks" :key="index">
      <div
        v-if="type(block) == 'content'"
        class="section content"
        :style="block.content.style"
        :id="block.content.config && block.content.config.id"
      >
        <div
          class="title"
          :class="{single: block.content.views.length == 1 && block.content.views[0].text.length == 1}"
          v-if="block.content.title"
        >
          <div class="title_wrapper"><h2>{{block.content.title}}</h2></div>
        </div>
        <div class="wrapper" :class="{single: block.content.views.length == 1 && block.content.views[0].text.length == 1}">
          <div
            v-for="(view, index) in block.content.views"
            :key="index"
            class="view"
            :class="view.type"
          >
            <div v-if="view.type == 'image'" :style="{flexBasis: config.width}">
              <img :src="view.image.url" />
            </div>
            <TextView
              v-if="view.type == 'text'"
              :title="view.title"
              :text="view.text"
              :config="view.config"
            />
            <FormView
              v-if="view.type == 'form'"
              :title="view.title"
              :text="view.text"
              :fields="view.fields"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="section footer">
        <div class="wrapper">
          <div>
            <h3>Terms of Participation &amp; Privacy Policy</h3>
            <p>The Edgeryders online platform and activities are intended for people to cooperate within and across projects trying to build a better world. The word "better" has here a fairly broad range of meaning. These Community Guidelines are here to help you understand what it means to be a member of Edgeryders. Don’t forget that your use of Edgeryders is subject to these Community Guidelines and our Terms of Service.</p>
          </div>
          <div>
            <h3>Contact Us</h3>
            <ul>
              <li><a href="mailto:info@edgeryders.eu">Email</a></li>
              <li><a href="https://twitter.com/edgeryders">Twitter</a></li>
              <li><a href="https://t.me/edgeryders">Telegram</a></li>
            </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
var YAML = require("yamljs");
import Parallax from "vue-parallaxy";

import TextView from "@/components/views/Text.vue";
import FormView from "@/components/views/Form.vue";
import Logo from "@/components/elements/Logo.vue";

export default {
  name: "App",
  data() {
    return {
      tags: null,
      title: null,
      links: null,
      stylesheet: null,
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
    FormView,
    Logo
  },
  props: ["blocks", "config"],
  methods: {
    getProp(obj, key) {
      var test = key.split(".").reduce(function(o, x) {
          return (typeof o == "undefined" || o === null) ? o : o[x];
      }, obj);
      console.log(test)
      return test
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
      var block = this.blocks.filter((x) => x[BlockName])
      if (block.length) {
        return block[0][BlockName];
      } else {
        return false
      }
    },
    isSingle(block) {
      if (block.views.length = 1) {
        return true
      } else {
        return false
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
      let menu = document.querySelector(".menu");
      var height = 400;
      if (this.config && this.config.header && this.config.header.height) {
        height = this.config.header.height.match(/(\d+)/)[0] - 70
      }
      if (window.scrollY > height) {
        menu.classList.add("active");
      } else {
        menu.className = "menu";
      }
    }
  },
  created() {
    if (process.browser) {
      window.addEventListener("scroll", this.handleScroll);
    }
  },
};
</script>

<style lang="scss" scoped>

div /deep/ .videoWrapper {
  position: relative;
  padding-bottom: 56.25%; /* 16:9 */
  height: 0;
}
div /deep/ .videoWrapper iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100% !important;
  height: 100% !important;
}



.section {
  background: white;
  z-index: 99;
  position: relative;
}

.menu {
  background: none;
  width: 100%;
  padding: 0 !important;
  top: 0;
  height: 70px;
  overflow: hidden;
  .menu_bg {
    width: 100%;
    height: 70px;
    overflow: hidden;
    position: fixed;
    .blur {
      position: absolute;
      z-index: 99999;
      top: 0;
      display: block;
      width: 100%;
      height: 100%;
      backdrop-filter: blur(0px);
      transition: backdrop-filter 0s linear;
    }
    .header_image {
      position: absolute;
    }
  }
  .links {
    position: relative;
    display: flex;
    margin-right: 10px;
    z-index: 2;
    opacity: 0;
    transition: all 0s ease;
    &.nofade {
      opacity: 1;
    }
    .anchor + .external {
      a:first-child {
        border-left: 1px solid rgba(255,255,255,0.2);
      }
    }
  }
  .title {
    position: relative;
    display: flex;
    align-items: center;
    z-index: 2;
    padding: 0 1.2rem;
    .logo {
      padding-right: .75rem;
      width: 40px;
      border-right: 1px solid rgba(255,255,255,0.2);
      &.glyph {
        padding-right: .35rem;
        width: 38px
      }
    }
    .other_logo {
      width: auto;
      height: 27px;
      display: flex;
    }
    img {
      margin-left: .75rem;
    }
    h2 {
      font-size: 1.4rem;
      margin-left: .75rem;
    }
  }
  &.active {
    box-shadow: 0 3px 5px rgba(0, 0, 0, 0.2);
    .links {
      opacity: 1;
      transition: all 1s ease;
    }
    .blur {
      backdrop-filter: blur(10px);
      transition: backdrop-filter .3s linear;
    }
  }
}

.header_image {
  position: fixed;
  height: 400px;
  top: 0;
  width: 100%;
  background-size: 100% !important;
  background-repeat: no-repeat !important;
}

.section.header {
  min-height: 380px;
  height: auto;
  position: relative;
  padding: 0;
  border: none; 
  .wrapper {
    width: 100%;
    height: auto;
    position: relative;
    top: 30px;
    justify-content: flex-start;
    .text_wrapper {
      padding: 0px 20px;
      .text_title {
        margin-bottom: 1rem;
        h2 {
          border-bottom: 0;
          padding: 0.75rem 1rem;
          font-size: 1.3rem;
          box-decoration-break: clone;
          line-height: 3.3rem;
          display: inline;
          color: white;
          background: black;
        }
      }
      /deep/ .text_content {
        margin-bottom: 1rem;
        p {
          display: inline;
          box-decoration-break: clone;
          line-height: 2.7rem;
          font-size: 1.2rem;
          color: black;
          padding: 10px;
          background: white;
        }
      }
      /deep/ .links {
        margin-top: 20px;
      }
      /deep/ a.text_link {
        color: rgba(0, 0, 0, 1);
        background: white;
        padding: 0.85rem 0.85rem 0.75rem;
        text-decoration: none;
        border-top: none;
        font-size: 1rem;
        display: inline-block;
        font-weight: bold;
        margin: 0 1rem 0 0;
      }
    }
  }
}


.section.header .wrapper /deep/ h2 {
  border-bottom: 0;
  padding-bottom: 0rem;
  margin-top: 0.5rem;
}

.social {
  position: absolute;
  right: 30px;
  display: flex;
  bottom: 18px;
  z-index: 9;
  height: 35px;
  &.active {
    position: fixed;
    top: 15px;
    z-index: 999999;
    display: none;
  }
   .url {
    width: 35px;
    height: 100%;
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' version='1' viewBox='0 0 100 125'%3E%3Cpath fill='%23fff' d='M5 70l25-24 8 8 16-16 8 8 17-16-9-9-16 17-8-8L70 5l25 25-25 24-8-8-16 16 8 8-24 25L5 70zm33-16L21 70l9 9 16-17-8-8z'/%3E%3C/svg%3E")
      #000;
    background-repeat: no-repeat;
    background-position: center 63% !important;
    background-size: 14px !important;
    &:hover {
      cursor: pointer;
      background-color: #F15133;
    }
  }
  div {
    width: 35px;
    height: 100%;
    display: inline-block;
    margin-right: 4px;
     &:last-child {
      margin-right: 0;
    }
  }
  a {
    width: 35px;
    height: 100%;
    display: block;
    background-position: center 54% !important;
    background-repeat: no-repeat !important;
    background-size: 12px !important;
    &.twitter {
      background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' version='1' viewBox='0 0 512 512'%3E%3Cpath fill='%23fff' d='M445 161V95h-33V61h-34V28H256v33h-33v34h-34v66h-44v-33h-45V95H67V61H0v189h33v34h34v33h67v34h-34v33H67v33H33v67h312v-33h33v-34h34v-33h33V262h34v-34h33v-67z'/%3E%3C/svg%3E") #000;
      background-size: 11px !important;
      &:hover {
        background-color: #1DA1F2;
      }
    }
    &.facebook {
      background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' version='1' viewBox='0 0 512 512'%3E%3Cpath fill='%23fff' d='M412 122V0H234v33h-34v34h-33v100h-67v122h67v223h134V289h66V167h-66v-45z'/%3E%3C/svg%3E") #000;
      transition-delay: 0.1s;
      &:hover {
      background-color: #4A66A0;
    }
    }
    &.linkedin {
      background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' version='1' viewBox='0 0 512 512'%3E%3Cpath fill='%23fff' d='M11 167h111v345H11zM100 33V0H33v33H0v67h33v34h67v-34h34V33zM479 234v-34h-34v-33H289v33h-33v-33H156v345h111V301h34v-34h66v34h34v211h111V234z'/%3E%3C/svg%3E") #000;
      transition-delay: 0.15s;
      &:hover {
        background-color: #2977C9;
      }
    }
    &.email {
      background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' version='1' viewBox='0 0 512 512'%3E%3Cpath fill='%23fff' d='M0 72v67h33v34h34v33h33v33h111v-33h67v-33h67v33h-67v33h-67v34h-77v167h77v-34h34v-33h33v-34h34v-33h33v-33h33v-34h34v-33h33v-33h34v-34h33V72z'/%3E%3C/svg%3E") #000;
      transition-delay: 0.3s;
      background-position: center 59% !important;
      &:hover {
        background-color: #4C30F7;
      }
    }
  }
}

 

.footer {
  background: #efefef;
  width: 100vw;
  display: inline-block;
  height: auto;
  .wrapper {
    width: 70%;
    display: block;
    font-family: 'Helvetica';
    max-width: 920px;
    margin: 3rem auto;
    position: relative;
    p {
      line-height: 1.5rem;
    }
    ul {
      list-style: none;
      margin: 0;
      display: inline-block;
      width: auto;
      padding: 0;
      min-width: 300px;
      li {
        padding: 1rem 0.2rem;
        font-weight: bold;
        border-bottom: 1px solid #ddd;
        a {
          color: black;
          text-decoration: none;
        }
      }
    }
  }
}
.section.content {
  display: flex;
  padding: 0rem 0 3rem;
  .title {
    width: 80% !important;
    color: white;
    align-self: flex-start;
    margin: 3rem auto 1rem;
    /deep/ {
      h1, h2, h3 {
        display: inline !important;
        box-decoration-break: clone !important;
        line-height: 2rem !important;
        color: black;
        font-size: 1.4rem;
      }
    }
    &.single {
      width: 70% !important;
      display: block;
      margin-bottom: 1.5rem;
      padding-bottom: .75rem;
      border-bottom: 1px solid #ddd;
      .title_wrapper {
        width: 80% !important;
      }
    }
  }
  .wrapper {
    &.single {
      width: 70%;
      max-width: 960px;
    }
  }
  .form {
    margin-bottom: 0
  }
  .text {
    .text_wrapper {
     &.indent {
        width: 80%;
        padding: 3rem 4rem;
        background: rgba(0,0,0,0.03);
      }
  }
    .text_wrapper.single {
      margin: 0 auto;
    }
    /deep/ .text_content {
      width: 100%;
      margin: 0 auto;
      p {
        margin-bottom: 20px !important;
      }
      h2 {
        margin-bottom: .75rem;
        font-size: 1.3rem;
        padding-bottom: 1rem;
      }
      h3 {
        margin: 0 0 1.3rem ;
      }
      ul + h3 {
        margin: 1.3rem 0;
      }
      ul + p {
        margin: 1.3rem 0;
      }
      ul,
      ol {
        width: 100% !important;
        padding:0 !important;
        margin: 0 !important;
        margin-block-start: 0 !important;
        list-style: none;
        li {
          margin: 0 !important;
          align-items: center;
          font-size: 1.1rem;
          line-height: 1.7em !important;
          padding: .65em 0;
          border-bottom: 1px solid #efefef;
          &:first-child {
            padding-top: 0;
          }
          &:last-child {
            border: none;
          }
          img {
            width: 1.3em;
            line-height: 1.3em;
            margin-right: .65rem;
            position: relative;
            top: 4px;
          }
        }
      }
    }
    /deep/ .horizontal {
      .text_content {
        width: 100% !important;
        padding: 0 !important;
      }
    }
  }
}

@media only screen and (max-width: 600px) {
  #app {
    overflow: auto;
    height: auto;
    position: inherit;
    width: auto;
  }
  .header_image {
    height: 60vh !important;
    width: 100%;
    background-position: 50% 50% !important;
    background-repeat: no-repeat !important;
    background-size: cover !important;
  }
  

  .menu {
    height: 70px;
    position: fixed;
    overflow: hidden;
    transform: none;
    transform-origin: 0;
    .menu_bg {
      .header_image {
        height: 60vh !important;
        background-position: 50% 50% !important;
        width: 100%;
        background-size: cover !important;
      }
    }
    .links {
      display: none;
    }
    .title {
      padding: 5px 0;
      width: 100%;
      margin: 4px 1rem 0;
      border-bottom: 1px solid white;
      padding: 0;
    }
    &.active {
      .title {
        border-bottom: 1px solid rgba(255, 255, 255, 0);
      }
    }
  }
  .section.header {
    height: 60vh;
    min-height: auto;
    align-items: start;
    border: none;
    .wrapper {
      .text {
        width: 80% !important;
        margin: 90px auto 20px;
        padding: 0 8% 0 0;
        /deep/ .text_title {
          display: inline-block;
          margin-bottom: 20px;
          transform: none;
          transform-origin: 0;
        }
        /deep/ .text_content {
          margin: 0;
          transform: none;
          transform-origin: 0;
          p {
            background: #000;
            font-size: 1.06rem !important;
            display: inline;
            font-weight: bold;
            box-decoration-break: clone;
            line-height: 2.3rem !important;
            color: #fff;
            padding: 10px 10px 10px;
          }
        }

        /deep/ .links {
          top: 0;
          margin: 20px 0 40px;
          padding-bottom: 20px !important;
          transform: none;
          transform-origin: 0;
          a {
            font-weight: bold;
            padding: 14px 18px 12px;
          }
        }
      }
    }
    .social {
      display: none;
    }
  }


.section.content {
  padding: 2rem 0 0 0;
  width: 100%;
  .wrapper {
    width: 90%;
    &.single {
    width: 90%;
    }
  }
  .title {
    width: 80% !important;
    color: white;
    align-self: flex-start;
    margin-top: 0rem;
    margin-bottom: 0px;
    h2 {
      line-height: 1.9rem;
    }
    &.single {
      width: 80% !important;
      display: block;
      
      .title_wrapper {
        width: 90% !important;
      }
    }
  }
  .text {
    width: 100% !important;
    .text_wrapper {
      width: 90%;
      margin: 0 !important;
      padding-left: 5% !important;
      padding-right: 5% !important;
      &.indent {
        width: 80%;
        padding: 10% !important;
        background: #efefef;
      }
    }
    /deep/ .text_content {
      width: 100%;
      margin: 0 auto;
      p {
        margin-bottom: 20px !important;
      }
      ul,
      ol {
        li {
          margin: 0 0 1rem 0;
          font-size: 1.1rem;
        }
      }
    }
    /deep/ .horizontal {
      .text_content {
        width: 100% !important;
        padding: 0 !important;
        margin: 1rem auto !important;
      }
    }
  }
}

.section {
  .title {
    * {
      margin: 0 !important;
    }
  }
  .view.form {
    margin: 0 auto 0;
    padding: 0 !important;
    width: 90%;
    .field {
      input {
        padding: 5%;
      } 
    }
    /deep/ .account_options {
      flex-direction: column;
      width: 80%;
      .option:first-child {
      border: none;
      border-bottom: 1px solid #ddd;
    }
    }
  }
}

}


</style>
