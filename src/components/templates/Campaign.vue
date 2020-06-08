<template>
  <div id="app" v-scroll="onScroll">
         <div class="menu"> 
            <div class="bg_image">
              <img :src="config.header.image" />
            </div>
            <span class="title" @click="loadThemeLocal('on_the_beach.scss')">
              <h2>Campaigns</h2>
            </span>
            <div class="links" v-if="showAnchorMenu(config)">
              <div v-if="showAnchorMenu(config)" class="anchor">
                <a v-for="(link, index) in getNavElements(blocks)" :href='link.url'>
                 {{ link.text }}
                </a>
              </div>
            </div>
          </div>


          <div class="section header" id="test" :style="{background: 'url(' + config.header.image + ')'}"> 

            <div class="wrapper">

              <div v-for="(view, index) in getHeaderViews()" :key="index">
                <div class="image" v-if="view.type == 'image'" style="width: 300px">
                    <img :src="view.image.url" />
                </div>
                <TextView v-if="view.type == 'text'" :title="view.title" :text="view.text" :links="view.links" :config="view.config" :stylesheet="view.style" />

              </div>
     
            </div>

              <div class="social">
                <div @click="copyurl" class="url_copy">
                  <div class="url"></div>
                  <textarea readonly rows='1' oninput='this.style.height = "";this.style.height = this.scrollHeight + "px"' ref="text">/test</textarea>
                </div>
                <a class="twitter" :href="socialLink('twitter')" target="_blank"></a>
                <a class="facebook" :href="socialLink('facebook')" target="_blank"></a>
                <a class="linkedin" :href="socialLink('linkedin')" target="_blank"></a>
                <a class="email" :href="socialLink('email')" target="_blank"></a>
              </div>
          </div>

    <div v-for="(block, index) in blocks" :key="index">

          <div v-if="type(block) == 'content'" class="section content" :style="block.content.style"> 
            <div class="title" v-if="block.content.title" v-html="block.content.title">
            </div>
            <div class="wrapper">
              <div v-for="(view, index) in block.content.views" :key="index" class="view" :class="view.type">
                <div v-if="view.type == 'image'" style="width: 300px">
                    <img :src="view.image.url" />
                </div>
                <TextView v-if="view.type == 'text'" :title="view.title" :text="view.text" :config="view.config" />
                <FormView v-if="view.type == 'form'" :title="view.title" :text="view.text" :fields="view.fields" />
              </div>
            </div>
          </div>
    </div>

  </div>
</template>

<script>
var YAML = require('yamljs');

import TextView from '@/components/views/Text.vue'
import FormView from '@/components/views/Form.vue'
import Logo from '@/components/elements/Logo.vue'

export default {
  name: "App",
  data() {
    return {
      tags: null,
      title: null,
      links: null,
      stylesheet: null,
      logo: {
        a: "data:image/svg+xml,%3Csvg viewBox='0 0 500 500' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 250a250 250 0 1 1 500 0 250 250 0 0 1-500 0zm97-103v106h42v-16h-26v-31h19v-16h-19v-27h26v-16zm80 91c6 0 8-4 8-11v-52c0-8-4-12-13-12h-4v75zm-25-91h23c19 0 27 10 27 29v48c0 20-8 29-26 29h-24zm63 25c0-17 9-27 25-27s24 9 24 27v10h-16v-11c0-8-3-11-8-11-6 0-9 3-9 11v59c0 7 3 11 9 11 5 0 8-4 8-11v-17h-10v-13h26v53h-8l-3-7c-4 7-9 10-16 10-14 0-22-11-22-30zm64-25h43v16h-26v27h18v16h-18v31h26v16h-43zM112 381H95V275h24c18 0 26 8 26 30 0 13-3 21-10 26l12 50h-17l-10-45h-8zm0-60v-31h6c8 0 10 3 10 15 0 11-2 16-10 16zm53-46l10 42h1l10-42h17l-19 62v44h-16v-42l-20-64zm69 90c6 0 9-4 9-11v-51c0-9-4-13-13-13h-4v75zm-24-90h23c18 0 27 9 27 29v47c0 20-8 30-26 30h-24zm136 46v-31h6c8 0 10 3 10 15 0 11-2 16-10 16zm-72-46h43v15h-26v28h19v15h-19v32h26v16h-43zm72 106h-16V275h24c17 0 25 8 25 30 0 13-3 21-10 26l12 50h-17l-10-45h-8zm57-30c1 11 4 16 11 16 6 0 10-4 10-10 0-9-6-14-15-23-12-12-20-21-20-35 0-15 11-26 25-26s24 10 25 26l-16 2c-1-9-3-13-9-13-5 0-9 4-9 10 0 9 7 16 17 25 11 11 18 19 18 34s-11 26-26 26-26-11-27-29zm-65-172v-42h-42a42 42 0 1 1 42 42z' :fill='color' fill-rule='evenodd'/%3E%3C/svg%3E"
      },
      data: {
        config: null,
        blocks: null
      }
    }
  },
  components: {
    TextView,
    FormView,
    Logo
  },
  props: ["blocks", "config"],
  methods: {
    getNavElements(sections) {
      var self = this;
        var navArray = sections.map(function(el) {
          var block = self.type(el);
          var id = el[block]['config'] && el[block]['config']['id'];
          if (id && block !== 'menu') {
            return {
              text: id,
              url: '#' + id
            } 
          }
        });
        return navArray.filter(function (el) {
            return el != null;
        });
    },
    getHeaderViews(){
      return this.blocks.filter(x => x['header'])[0]['header']['views']
    },
    socialLink(network, text) {
      var title = this.config.title;
      var link = location.href;
      var description = '';
      if (this.config.description) {
        description = this.config.description
      }
      if (network == 'twitter') {
        return "https://twitter.com/intent/tweet?text=" + title + " - " + link
      }
      if (network == 'facebook') {
        return "https://www.facebook.com/sharer/sharer.php?u=" + link
      }
      if (network == 'linkedin') {
        return "https://www.linkedin.com/sharing/share-offsite/?url=" + link
      }
      if (network == 'email') {
        return "mailto:?subject=" + title + "&body=" + description + ' ' + link
      }
    },
    copyurl() {
      this.$refs.text.select();
      const link = location.href

      var el = document.createElement('textarea');
      el.value = link;
      el.setAttribute('readonly', '');
      el.style = {position: 'absolute', left: '-9999px'};
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);

      this.copied = true;
      setTimeout(() => this.copied=false, 2000);

    },
    loadThemeLocal(stylesheet) {
      let file = document.createElement('link');
      file.rel = 'stylesheet';
      file.href =  require('@/assets/themes/' + stylesheet)
      document.head.appendChild(file)
    },
    showAnchorMenu(config) {
      if (config.menu && config.menu.anchor == true) {
        return true
      } else {
        return false
      }
    },
    type(obj) {
      return Object.keys(obj)[0]
    },
    onScroll: function(e, position) {
       let menu = document.querySelector(".menu")
        let social = document.querySelector(".social")
        window.console.log(position.scrollTop)
        if (position.scrollTop > 330) {
          menu.classList.add("active");
          social.classList.add("active");
        } else {
          menu.className = "menu";
          social.className = "social"
        }
    },
    scrollMenu() {
       window.console.log('hi')
   
    }
  },
  created(){
    if (process.browser) { 
      document.addEventListener('scroll', function(e){ 
        let container = document.getElementById('test')
        window.console.log(container.scrollTop)
      }, true);
    }
  }
};
</script>

<style lang="scss" scoped>

/* Helper Function */
$base-parallax-perspective: 7px;

@function parallax-scale-factor($z-distance) {
  @return ($base-parallax-perspective - $z-distance) / $base-parallax-perspective;
}

#app {
  overflow-y: scroll;
  width: 100vw;
  height: 100vh;
  perspective: $base-parallax-perspective;
  perspective-origin: 0;
}
.menu {
  background: none;
  position: fixed;
  overflow: hidden;
  width: 100%;
  padding: 0 !important;
  transform: translateZ(1px) scale(parallax-scale-factor(1));
  transform-origin: 0% 558%;
  .bg_image {
    width: 100%;
    display: block;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    z-index: 1;
    overflow: hidden;
    img {
      display: block;
      width: 150% !important;
      position: absolute;
      margin-left: -10px;
      margin-top: -10px;
      transition: all 1s ease;
    }
  }
  .links {
    position: relative;
    margin-right: 10px;
    z-index: 2;
    opacity: 0;
    transition: all 0s ease;
  }
  .title {
    position: relative;
    z-index: 2;
    padding: 0 1rem 0 4.7rem;
    background: url("data:image/svg+xml,%3Csvg viewBox='0 0 500 500' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='white' d='M0 250a250 250 0 11500 0 250 250 0 01-500 0zm97-103v106h42v-16h-26v-31h19v-16h-19v-27h26v-16zm80 91c6 0 8-4 8-11v-52c0-8-4-12-13-12h-4v75zm-25-91h23c19 0 27 10 27 29v48c0 20-8 29-26 29h-24zm63 25c0-17 9-27 25-27s24 9 24 27v10h-16v-11c0-8-3-11-8-11-6 0-9 3-9 11v59c0 7 3 11 9 11 5 0 8-4 8-11v-17h-10v-13h26v53h-8l-3-7c-4 7-9 10-16 10-14 0-22-11-22-30zm64-25h43v16h-26v27h18v16h-18v31h26v16h-43zM112 381H95V275h24c18 0 26 8 26 30 0 13-3 21-10 26l12 50h-17l-10-45h-8zm0-60v-31h6c8 0 10 3 10 15 0 11-2 16-10 16zm53-46l10 42h1l10-42h17l-19 62v44h-16v-42l-20-64zm69 90c6 0 9-4 9-11v-51c0-9-4-13-13-13h-4v75zm-24-90h23c18 0 27 9 27 29v47c0 20-8 30-26 30h-24zm136 46v-31h6c8 0 10 3 10 15 0 11-2 16-10 16zm-72-46h43v15h-26v28h19v15h-19v32h26v16h-43zm72 106h-16V275h24c17 0 25 8 25 30 0 13-3 21-10 26l12 50h-17l-10-45h-8zm57-30c1 11 4 16 11 16 6 0 10-4 10-10 0-9-6-14-15-23-12-12-20-21-20-35 0-15 11-26 25-26s24 10 25 26l-16 2c-1-9-3-13-9-13-5 0-9 4-9 10 0 9 7 16 17 25 11 11 18 19 18 34s-11 26-26 26-26-11-27-29zm-65-172v-42h-42a42 42 0 1142 42z' fill-rule='evenodd'/%3E%3C/svg%3E") no-repeat 20px center;
    background-size: 2.7rem;
    .logo {
      margin-right: 10px;
    }
    h2 {
      font-size: 1.4rem;
    }
  }
  &.active {
    box-shadow: 0 3px 5px rgba(0,0,0,.2);
    overflow: hidden;
    .links {
      opacity: 1;
      transition: all 1s ease;
    }
    .bg_image {
      background: black;
      img {
        filter: blur(10px)
      }
    }
  }

}

.menu .title {
  display: flex;
}

.section.header {
  background-size: 150% !important;
  background-position: -10px -10px !important;
  background-attachment: fixed !important;
  min-height: 380px;
  height: auto;
  position: relative;
  padding: 0;
  .wrapper {
    width: 100%;
    height: auto;
    position: relative;
    top: 20px;
    justify-content: flex-start;
    .text {
      width: 60%;
      padding: 0px 20px;
      /deep/ .text_title {
        margin-bottom: 2rem;
        transform: translateZ(2px) scale(parallax-scale-factor(2));
        transform-origin: -6% 900%;
        h2 {
          border-bottom: 0;
          padding: 0.75rem 1rem;
          font-size: 1.5rem !important;
          display: inline;
          color: white;
          background: black;
        }
      }
      /deep/ .text_content {
        margin-bottom: 1rem;
        transform: translateZ(1px) scale(parallax-scale-factor(1));
        transform-origin: -4% 200%;
        p {
          display: inline;
          box-decoration-break: clone;
          line-height: 3rem !important;
          color: black;
          padding: 10px;
          background: white;
        }
      }
      /deep/ .links {
        margin-top: 20px;
        transform: translateZ(.5px) scale(parallax-scale-factor(.5));
        transform-origin: -4% 200%;
      }
      /deep/ a.text_link {
        color: rgba(0,0,0,1);
        background: white;
        padding: .85rem .85rem .75rem;
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


.section.header .wrapper p {
  margin-top: 1rem;

}

.section.header .wrapper /deep/ h2 {
  border-bottom: 0;
  padding-bottom: 0rem;
  margin-top: .5rem;
}


.social {
    position: absolute;
    right: 30px;
    display: flex;
    bottom: 20px; 
    z-index: 9;
    &.active {
    position: fixed;
    top: 15px;
    z-index: 999999;
      display: none
  }
    a {
      width: 33px;
      height: 33px;
      margin-right: 4px;
      background-position: center 54% !important;
      background-repeat: no-repeat !important;
      background-size: 12px !important; 
      &:last-child {
        margin-right: 0;
      }
      &.twitter {
        background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' version='1' viewBox='0 0 512 512'%3E%3Cpath fill='%23fff' d='M445 161V95h-33V61h-34V28H256v33h-33v34h-34v66h-44v-33h-45V95H67V61H0v189h33v34h34v33h67v34h-34v33H67v33H33v67h312v-33h33v-34h34v-33h33V262h34v-34h33v-67z'/%3E%3C/svg%3E") #000; 
        background-size: 11px !important; 
      }
      &.facebook {
        background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' version='1' viewBox='0 0 512 512'%3E%3Cpath fill='%23fff' d='M412 122V0H234v33h-34v34h-33v100h-67v122h67v223h134V289h66V167h-66v-45z'/%3E%3C/svg%3E") #000;
        transition-delay: .1s; 
      }
      &.linkedin {
        background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' version='1' viewBox='0 0 512 512'%3E%3Cpath fill='%23fff' d='M11 167h111v345H11zM100 33V0H33v33H0v67h33v34h67v-34h34V33zM479 234v-34h-34v-33H289v33h-33v-33H156v345h111V301h34v-34h66v34h34v211h111V234z'/%3E%3C/svg%3E") #000;
        transition-delay: .15s; 
      }
      &.email {
        background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' version='1' viewBox='0 0 512 512'%3E%3Cpath fill='%23fff' d='M0 72v67h33v34h34v33h33v33h111v-33h67v-33h67v33h-67v33h-67v34h-77v167h77v-34h34v-33h33v-34h34v-33h33v-33h33v-34h34v-33h33v-33h34v-34h33V72z'/%3E%3C/svg%3E") #000;
        transition-delay: .3s; 
        background-position: center 59% !important;
      }
    }
  }

  .url_copy {
    float: left;
    margin: 0 6px 0 0;
    position: relative;
    width: auto;
    height: 32px;
    display: flex;
    &:hover {
      cursor: pointer;
    }
    .url {
      width: 33px;
      height: 33px;
      background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' version='1' viewBox='0 0 100 125'%3E%3Cpath fill='%23fff' d='M5 70l25-24 8 8 16-16 8 8 17-16-9-9-16 17-8-8L70 5l25 25-25 24-8-8-16 16 8 8-24 25L5 70zm33-16L21 70l9 9 16-17-8-8z'/%3E%3C/svg%3E") #000;
      background-repeat: no-repeat;
      background-position: center 70%;
      background-size: 14px;
    }
    textarea {
      font-size: 13px;
      height: 24px;
      border: 1px solid black;
      border-left: none;
      margin: 0;
      resize: none;
      display: flex;
      padding: 7px 10px 0;
      align-items: center;
      align-content: center;
      justify-content: center;
      &:focus {
        outline: none !important;
        background: #ddd;

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
  .menu {
    height: 70px;
    position: fixed;
    transform: none;
    transform-origin: 0;
    .links {
      display: none;
    }
    .title {
      padding: 5px 0;
      width: 100%;
      margin: 4px 1.9rem 0;
      border-bottom: 1px solid white;
      padding: 0 1rem 0 3.1rem;
      background-size: 2.55rem;
      background-position: 0 center;
    }
    .bg_image {
      img {
        width: 200% !important;
      }
    }
    &.active {
      .title {
        border-bottom: 1px solid rgba(255,255,255,0);
      }
    }
  }
  .section.header {
    background-size: 200% !important;
    min-height: 380px;
    align-items: start;
    .wrapper {
      .text {
        width: 80% !important;
        margin: 90px auto 20px;
        padding: 0 20px 0 0;
        /deep/ .text_title {
          display: inline-block;
          margin-bottom: 20px;
          transform: none;
          transform-origin: 0;
          h2 {
            background: #fff;
            color: #000;
            display: inline;
            box-decoration-break: clone;
            padding: 8px 10px 8px;
            line-height: 3rem;
            font-size: 1.7rem !important;

          }
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
}

</style>
