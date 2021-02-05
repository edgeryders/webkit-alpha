<template>
  <div id="app" :class="theme">

 <multisite
      v-if="blocks && !loading"
      :header="header"
      :config="config"
      :child="childConfig"
      :blocks="blocks"
      :active="active_slugs"
    ></multisite>


  </div>
</template>

<script>
var YAML = require("yamljs");
import { bus } from "@/main";

import template from "./data/template.md";
import configuration from "./data/config.yaml";
const _ = require('lodash')

import multisite from "./components/templates/Multisite.vue";

export default {
  name: "App",
  data() {
    return {
      current: null,
      current_sub: null,
      current_child: null,
      currentText: null,
      tags: null,
      loading: false,
      activeTemplate: "edgeryders",
      current_config: null,
      current_slug: null,
      active_slugs: [],
      template,
      configuration,
      title: null,
      links: null,
      blocks: [],
      header: null,
      menu: null,
      footer: null,
      childBlocks: null,
      active: null,
      config: null,
      childConfig: null,
      stylesheet: null,
      pathname: null,
      data: {
        config: null,
        blocks: null
      }
    };
  },
  components: {
    multisite
  },
  methods: {
    getAttributes(element) {
      var attrs = element.attributes;
      var obj = {};
      for (var i = attrs.length - 1; i >= 0; i--) {
        var attrname = attrs[i].name;
        var attrvalue = attrs[i].value;
        if (attrvalue == "true") {
          obj[attrname] = true;
        } else if (attrvalue == "false") {
          obj[attrname] = false;
        } else {
          obj[attrname] = attrvalue;
        }
      }
      return obj;
    },
    parseJson(value) {
      var code = value.match(/```([^`]*)```/);
      if (code) {
        return JSON.parse(code[1]);
      } else {
        return false;
      }
    },
    createView(view, header) {
      var name = view.nodeName.toLowerCase();
      var styleAtr = view.getAttribute("style");
      var dataAtr = view.getAttribute("data");
      var tagAtr = view.getAttribute("tag");
      var style = styleAtr;

      var html = md.render(view.textContent);
      var text = view.textContent;

      var obj = {};
      obj["type"] = name;

      if (view.hasAttributes()) {
        var config = this.getAttributes(view);
        obj["config"] = config;
      }

      if (dataAtr) {
        obj["data"] = dataAtr;
      }

      if (name == "text" && !header) {
        obj["text"] = this.parseText(text);
        obj["links"] = header;
        if (style) {
          obj["style"] = style;
        }
        return obj;
      }

      if (name == "text" && header) {
        obj["text"] = this.parseHeaderText(html);
        obj["links"] = this.parseHeaderLinks(html);
        if (style) {
          obj["style"] = style;
        }
        return obj;
      }

      if (name == "image") {
        var imageUrl = this.regexMatch(html, "url");
        if (imageUrl) {
          var image = {
            url: imageUrl[0].replace(")", "")
          };
          obj["image"] = image;
          if (style) {
            obj["style"] = style;
          }
          return obj;
        }
      } else {
        obj["text"] = this.parseTextOnly(html);
        obj["title"] = this.parseTitle(html, "text");
        if (style) {
          obj["style"] = style;
        }
        return obj;
      }
    },
    createFooter(footer) {
      var obj = {};
      if (footer.hasAttributes()) {
        var config = this.getAttributes(footer);
        obj["config"] = config;
      }

      var viewNodes = footer.childNodes;

      var views = [];
      for (var x = 0; x < viewNodes.length; x++) {
        var text = this.parseTextOnly(viewNodes[x].textContent);
        views = text;
      }

      if (this.parseTitle(viewNodes[0].textContent)) {
        var title = this.parseTitle(viewNodes[0].textContent, "text");
        obj["title"] = title;
        obj["subtitle"] = this.parseSubtitle(viewNodes[0].textContent);
      }

      obj["text"] = views;

      return obj;
    },
    createBlock(block) {
      var name = block.nodeName.toLowerCase();
      if (name == "content") {
        name = "section";
      }
      var styleAtr = block.getAttribute("style");

      var style = styleAtr;

      var obj = {};
      obj[name] = {};

      if (block.hasAttributes()) {
        var attrs = block.attributes;
        var config = this.getAttributes(block);
        obj[name]["config"] = config;
      }

      var viewNodes = block.childNodes;

      var views = [];
      for (var x = 0; x < viewNodes.length; x++) {
        if (
          viewNodes[x].nodeName !== "#text" &&
          viewNodes[x].nodeName !== "#comment" &&
          name !== "header"
        ) {
          var view = this.createView(viewNodes[x], false);
          views.push(view);
        }
        if (
          viewNodes[x].nodeName !== "#text" &&
          viewNodes[x].nodeName !== "#comment" &&
          name === "header"
        ) {
          var view = this.createView(viewNodes[x], true);
          views.push(view);
        }
      }

      if (this.parseTitle(viewNodes[0].textContent)) {
        var title = this.parseTitle(viewNodes[0].textContent, "text");
        obj[name]["title"] = md.render(title);
        obj[name]["subtitle"] = this.parseSubtitle(viewNodes[0].textContent);
      }

      if (views.length) {
        obj[name]["views"] = views.filter(function(e) {
          return e;
        });
      }

      var code = this.parseCode(block.textContent);

      if (code && code.config) {
        obj[name]["config"] = code.config;
      }
      if (code && code.style) {
        obj[name]["style"] = code.style;
      }

      if (style) {
        obj[name]["style"] = style;
      }

      if (name == "menu" || name == "header") {
        obj[name]["links"] = this.parseHeaderLinks(block.textContent);
      }
      return obj;
    },
    parseCode(text) {
      var code = text.match(/```([^`]*)```/);
      if (code) {
        return YAML.parse(code[1]);
      } else {
        return false;
      }
    },
    parseTitle(text, render) {
      var title = this.regexMatch(text, "title");
      if (title[1] && render == "text") {
        return title[1].trim();
      } else if (title) {
        return md.render(title[0]).replace("\n", "");
      } else {
        return "";
      }
    },
    parseSubtitle(text) {
      var title = this.regexMatch(text, "subtitle");
      if (title[1]) {
        return md.render(title[1]).replace("\n", "");
      }
    },
    parseText(text) {
      if (text.includes("---")) {
        var textContent = text.split("---").map(x => this.parseTextContent(x));
        return textContent;
      }
      else {
        var array = [];
        array.push(this.parseTextContent(text));
        return array;
      }
    },
    parseTextContent(text) {
      var html = md.render(text);
      if (this.parseVideo(text)) {
        html = this.parseVideo(html);
      }
      return html;
    },
    parseTextOnly(text) {
      var regex = /^(#{1,6}\s*.+)/gm;
      var html = text.replace(regex, "");
      if (html.includes("---")) {
        var textContent = html.split("---").map(x => this.parseTextContent(x));
        return textContent;
      } else {
        return md.render(html);
      }
    },
    parseLinks(text) {
      var html = md.renderInline(text);
      const regex = /<\s*a[^>]*>(.*?)<\s*\/s*a>/gm;
      const matches = html.match(regex);
      return matches;
    },
    parseHeaderText(text) {
      var titleRegex = /^#{2}([^#].*?)\n/gm;
      var linksRegex = /<p><\s*a[^>]*>(.*?)<\s*\/s*a><\/p>/gs;

      var noTitle = text.replace(titleRegex, "");
      var html = md.render(noTitle);
      var text = html.replace(linksRegex, "").replace(/(\r\n|\n|\r)/gm, "");
      return [text];
    },
    parseHeaderLinks(text) {
      var html = md.renderInline(text);
      const regex = /<\s*a[^>]*>(.*?)<\s*\/s*a>/gm;
      const matches = "<body>" + html.match(regex) + "</body>";

      var array = [];

      var doc = document.createElement("html");
      doc.innerHTML = matches;
      var links = doc.getElementsByTagName("a");
      var urls = [];

      for (var i = 0; i < links.length; i++) {
        var obj = {
          text: links[i].textContent,
          url: links[i].getAttribute("href"),
          style: links[i].getAttribute("style"),
          class: links[i].getAttribute("class")
        };
        urls.push(obj);
      }
      return urls;
    },
    isImage(text) {
      var regex = /\.(gif|jpg|jpeg|tiff|png)/g;
      if (regex.exec(text) !== null) {
        return true;
      } else {
        return false;
      }
    },
    parseVideo(text) {
      text.match(
        /(http:|https:|)\/\/(player.|www.)?(vimeo\.com|youtu(be\.com|\.be|be\.googleapis\.com))\/(video\/|embed\/|watch\?v=|v\/)?([A-Za-z0-9._%-]*)(\&\S+)?/
      );

      if (RegExp.$3.indexOf("youtu") > -1) {
        return this.parseYouTube(RegExp.$6, text);
      } else if (RegExp.$3.indexOf("vimeo") > -1) {
        return this.parseVimeo(RegExp.$6, text);
      } else {
        return false;
      }
    },
    parseYouTube(id, text) {
      var youtube = /(?:https?:)?(?:\/\/)?(?:[0-9A-Z-]+\.)?(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/\S*?[^\w\s-])((?!videoseries)[\w-]{11})(?=[^\w-]|$)(?![?=&+%\w.-]*(?:['"][^<>]*>|<\/a>))[?=&+%\w.-]*/gim;
      var embed =
        "<div class='videoWrapper' style='--aspect-ratio: 3 / 4;'><iframe width='560' height='349' src='https://www.youtube.com/embed/" +
        id +
        "' frameborder='0' allowfullscreen></iframe></div>";
      var video = text.replace(youtube, embed);
      return video;
    },
    parseVimeo(id, text) {
      var vimeo = /(http:|https:|)\/\/(player.|www.)?(vimeo\.com|youtu(be\.com|\.be|be\.googleapis\.com))\/(video\/|embed\/|watch\?v=|v\/)?([A-Za-z0-9._%-]*)(\&\S+)?/gim;
      var embed =
        "<div class='videoWrapper' style='--aspect-ratio: 3 / 4;'><iframe src='https://player.vimeo.com/video/" +
        id +
        "' width='100%' height='330px' frameborder='0' webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe></div>";
      var video = text.replace(vimeo, embed);
      return video;
    },
    regexMatch(text, element) {
      var regex = {
        title: /\#+(.*?)\n/gi,
        subtitle: /\###+(.*?)\n/gi,
        attribute: /\[(.*?)\]/gi,
        tag: /\<([^}]+)\>/,
        url: /(https?:\/\/[^\s]+)/,
        link: /\[([^\[]+)\](\(.*\))/gm,
        image: /[\/.](gif|jpg|jpeg|tiff|png)$/i,
        atag: /<\s*a[^>]*>(.*?)<\s*\/s*a>/
      };
      if (text.match(regex[element])) {
        var match = regex[element].exec(text);
        return match;
      } else {
        return false;
      }
    },
    escape(string) {
      return encodeURI(string);
    },
    unescape(string) {
      return decodeURI(string);
    },
    parseConfig(block) {
          var config = this.parseCode(block);
          if (!this.config) {
            this.config = config;
          } 
          if (config.child) {
            this.childConfig = config;
          } 
          if (this.config && this.config.site.title) {
            this.sendAnalytics(this.pathname + " - " + this.config.site.title);
          } else {
            this.sendAnalytics("/" + this.pathname);
          }
      },
    parseBlocks(text) {
      console.log(text);
      var regex = /&(?!#?[a-z0-9]+;)/gm;
      var cleant_text = text.replace(regex, "&amp;");
      var xml = new DOMParser().parseFromString(cleant_text, "text/xml");
      var blocks = xml.getElementsByTagName("Webkit")[0].childNodes;
      var sections = [];
      for (var x = 0; x < blocks.length; x++) {
        if (blocks[x].nodeName.toLowerCase() == "config") {
          this.parseConfig(blocks[x].textContent)
        }
        if (blocks[x].nodeName.toLowerCase() == "header") {
          var block = this.createBlock(blocks[x]);
          this.header = block.header;
        }
        if (blocks[x].nodeName.toLowerCase() == "menu") {
          var block = this.createBlock(blocks[x]);
          this.menu = block;
        }

        if (blocks[x].nodeName.toLowerCase() == "content") {
          var block = this.createBlock(blocks[x]);
          sections.push(block);
        }
        if (blocks[x].nodeName.toLowerCase() == "footer") {
          this.footer = this.createFooter(blocks[x]);
        }
      }
      this.blocks = sections;
    },
    sendAnalytics(siteName) {
      this.$ga.page(siteName);
    },
    type(obj) {
      return Object.keys(obj)[0];
    },
    isNumeric(num) {
      return !isNaN(num);
    },
    validateYaml(str) {
      try {
        YAML.parse(str);
      } catch (e) {
        return false;
      }
      return true;
    },
    getYaml(value) {
      const doc = new DOMParser().parseFromString(value, "text/html");
      var yaml = [...doc.querySelectorAll("code")].map(
        code => code.textContent
      );
      if (this.validateYaml(yaml[0])) {
        return YAML.parse(yaml[0]);
      } else {
        return false;
      }
    },
    loadTemplate(id) {
      var self = this;
      fetch("https://edgeryders.eu/raw/" + id + ".json")
        .then(response => {
          response.text().then(function(text) {
            self.getSlugs();
            if (self.active_slugs.length > 0){
              self.loading = true;
              self.parseBlocks(text);
              self.loadChild();
            }
            else {
              self.parseBlocks(text);
            }
          });
        })
        .catch(error => console.error(error));
    },
    getSlugs() {
      var slugs = window.location.pathname.split("/").filter(function(e){return e});
      if (slugs.length > 0) {
        this.active_slugs = slugs.map(x => x.replace(' ', '-').toLowerCase());
        this.current_slug = this.active_slugs.slice(-1)[0];
      }
    },
    loadChild(slug) {
      var self = this;
      if (slug) { 
        this.$router.push({ path: '/' + slug.replace(' ', '-').toLowerCase() });
      }
     
      this.getSlugs();
      
      this.current_config = this.getConfig(this.config.pages, this.current_slug);

      fetch("https://edgeryders.eu/raw/" + this.current_config.data)
        .then(response => {
          response.text().then(function(text) {
            self.parseBlocks(text);
            if (self.loading) {
              self.loading = false
            }
          });
        })
        .catch(error => console.error(error));
    },
    getConfig(array, id){
        var object;

        array.some(function f(a) {
            if (a.slug.replace(' ', '-').toLowerCase() === id) {
                object = a;
                return true;
            }
            if (Array.isArray(a.children)) {
                return a.children.some(f);
            }
        });
        return object;
    },
    loadTheme() {
      let file = document.createElement("link");
      file.rel = "stylesheet";
      document.head.appendChild(file);
    },
    loadThemeLocal(theme) {
      var selected_theme = theme;
      if (theme.toLowerCase() == "edgeryders") {
        selected_theme = "event";
      }
      this.theme = selected_theme + "_theme";
    },
    loadTemplateLocal(template) {
      var temp = require("./data/" + template);
      this.parseBlocks(temp.default);
    },
    loadNewPage(data) {
      this.loadTemplate(data, true);
    }
  },
  created() {

    bus.$on("loadPage", slug => {
        this.loadChild(slug);
        window.scrollTo(0, 0);
    });

    if (process.env.VUE_APP_MODE == "local") {
      this.loadTemplateLocal(process.env.VUE_APP_TEMPLATE);
    }
    
    
    if (process.env.VUE_APP_MODE == "sandbox") {
      this.loadTemplate(process.env.VUE_APP_TEMPLATE);
    }

  }
};
</script>

<style lang="scss">

.test_list {
  list-style-type: disc;
  li {
  span.active {
  font-weight: bold;
}
    @apply pl-4;
    ul {
      li {
@apply pl-4;
      }
      
    }
  }
}
.blank_theme {
  @import "@/assets/blank.scss";
}

.event_theme {
  @import "@/assets/event.scss";
}

.research_theme {
  @import "@/assets/research.scss";
}

.default_theme {
  @import "@/assets/econ.scss";
}

.econ_theme {
  @import "@/assets/econ.scss";
}
</style>
