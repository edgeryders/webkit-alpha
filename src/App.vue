<template>
  <div id="app">
    <component
      :is="activeTemplate"
      :blocks="blocks"
      :config="config"
    ></component>
  </div>
</template>

<script>
var YAML = require("yamljs");

import template from "./data/template.md";
import configuration from "./data/config.yaml";

import edgeryders from "./components/templates/Edgeryders.vue";
import minimal from "./components/templates/Minimal.vue";

export default {
  name: "App",
  data() {
    return {
      tags: null,
      activeTemplate: "edgeryders",
      template,
      configuration,
      title: null,
      links: null,
      blocks: null,
      config: null,
      stylesheet: null,
      data: {
        config: null,
        blocks: null,
      },
    };
  },
  components: {
    edgeryders,
    minimal,
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

      var html = view.innerHTML;
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
        obj["text"] = this.parseText(html);
        obj["links"] = header;
        if (style) {
          obj["style"] = style;
        }
        return obj;
      }

      if (name == "text" && header) {
        obj["text"] = this.parseHeaderText(html);
        obj["title"] = this.parseTitle(html);
        obj["links"] = this.parseHeaderLinks(html);
        if (style) {
          obj["style"] = style;
        }
        return obj;
      }

      if (name == "form") {
        obj["title"] = this.parseTitle(html);
        obj["fields"] = [];
        var formtext = this.parseTextOnly(view.childNodes[0].textContent);
        if (formtext) {
          obj["text"] = formtext;
        }

        var fields = view.querySelectorAll("Field");

        for (var x = 0; x < fields.length; x++) {
          var field = this.getAttributes(fields[x]);
          field["text"] = md.render(fields[x].textContent);
          obj["fields"].push(field);
        }

        return obj;
      }

      if (name == "image") {
        var imageUrl = this.regexMatch(html, "url");
        if (imageUrl) {
          var image = {
            url: imageUrl[0].replace(")", ""),
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
        if (viewNodes[x].nodeName !== "#text" && viewNodes[x].nodeName !== "#comment" && name !== "header") {
          var view = this.createView(viewNodes[x], false);
          views.push(view);
        }
        if (viewNodes[x].nodeName !== "#text"  && viewNodes[x].nodeName !== "#comment" && name === "header") {
          var view = this.createView(viewNodes[x], true);
          views.push(view);
        }
      }

      if (this.parseTitle(viewNodes[0].textContent)) {
        var title = this.parseTitle(viewNodes[0].textContent, "text");
        obj[name]["title"] = title;
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
      var regex = /^#{2}([^#].*?)\n/;
      const matches = text.match(regex);
      return matches;
    },
    parseText(text) {
      if (text.includes("---")) {
        var textContent = text
          .split("---")
          .map((x) => this.parseTextContent(x));
        return textContent;
      } else {
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
      return md.render(html);
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
        attribute: /\[(.*?)\]/gi,
        tag: /\<([^}]+)\>/,
        url: /(https?:\/\/[^\s]+)/,
        link: /\[([^\[]+)\](\(.*\))/gm,
        image: /[\/.](gif|jpg|jpeg|tiff|png)$/i,
        atag: /<\s*a[^>]*>(.*?)<\s*\/s*a>/,
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
    parseBlocks(text) {
      var regex = /&(?!#?[a-z0-9]+;)/gm;
      var cleant_text = text.replace(regex, "&amp;");
      var xml = new DOMParser().parseFromString(cleant_text, "text/xml");
      var blocks = xml.getElementsByTagName("Webkit")[0].childNodes;

      var array = [];
      for (var x = 0; x < blocks.length; x++) {
        if (blocks[x].nodeName !== "#text" && blocks[x].nodeName !== "Config") {
          var block = this.createBlock(blocks[x]);
          array.push(block);
        }
        if (blocks[x].nodeName === "Config") {
          this.config = this.parseCode(blocks[x].textContent);
          if (this.config.site && this.config.site.template) {
            if (this.config.site.template.toLowerCase() == "campaign") {
              this.activeTemplate = "edgeryders";
            } else if (this.config.site.template.toLowerCase() == "standard") {
              this.activeTemplate == "minimal";
            } else {
              this.activeTemplate = this.config.site.template.toLowerCase();
            }
          }
          if (this.config.site && this.config.site.theme) {
            this.loadThemeLocal(this.config.site.theme);
          } else {
            this.loadThemeLocal('edgeryders');
          }
        }
      }

      return array;
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
        (code) => code.textContent
      );
      if (this.validateYaml(yaml[0])) {
        return YAML.parse(yaml[0]);
      } else {
        return false;
      }
    },
    getImage(dom) {
      return dome;
    },
    loadTemplate(id) {
      var self = this;
      fetch("https://edgeryders.eu/raw/" + id + ".json")
        .then((response) => {
          response.text().then(function(text) {
            self.blocks = self.parseBlocks(text);
          });
        })
        .catch((error) => console.error(error));
    },
    loadTheme() {
      let file = document.createElement("link");
      file.rel = "stylesheet";
      document.head.appendChild(file);
    },
    loadThemeLocal(theme) {
      let link = document.createElement("link");
      link.rel = "stylesheet";
      link.type = "text/css";
      link.href = "/" + theme.toLowerCase() + ".css";
      link.media = "all";
      document.head.appendChild(link);
    },
    loadTemplateLocal(template) {
      var temp = require("./data/" + template);
      this.blocks = this.parseBlocks(temp.default);
    },
  },
  created() {
    var temp = this.template;
    var config = this.configuration;
    var self = this;
    var pathname = window.location.pathname.substring(1).replace("/", "");
    var address = window.location.hostname;
    var self = this;

    if (config.mode == "local") {
      this.loadTemplateLocal(config.template);
    }

    if (config.mode == "sandbox") {
      fetch("https://edgeryders.eu/t/13671.json")
        .then((response) => response.json())
        .then((data) => {
          // var template = 13686;
          var template = 13799;

          var directories = this.getYaml(data.post_stream.posts[0].cooked);
          var result = directories.filter(
            (x) =>
              x.alias == pathname || x.id == pathname || x.domain == address
          )[0];
          if (pathname && !isNaN(pathname)) {
            try {
              self.loadTemplate(pathname);
            } catch (e) {
              self.loadTemplate(template);
            }
          } else if (result && result.id) {
            try {
              self.loadTemplate(result.id);
            } catch (e) {
              self.loadTemplate(template);
            }
          } else {
            self.loadTemplate(template);
          }
        });
    }
  },
};
</script>

<style lang="scss"></style>
