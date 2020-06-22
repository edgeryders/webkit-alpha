<template>
  <div id="app">
    <Campaign v-if="activeTemplate == 'campaign'" :blocks="blocks" :config="config" />
    <Standard v-if="activeTemplate == 'standard'" :blocks="blocks" :config="config" />
    <Research v-if="activeTemplate == 'research'" :blocks="blocks" :config="config" />
  </div>
</template>

<script>
var YAML = require('yamljs');

import template from './data/template.md'
import configuration from './data/config.yaml'

import TextView from './components/views/Text.vue'
import FormView from './components/views/Form.vue'

import Campaign from './components/templates/Campaign.vue'
import Standard from './components/templates/Standard.vue'
import Research from './components/templates/Research.vue'

export default {
  name: "App",
  data() {
    return {
      tags: null,
      activeTemplate: 'standard',
      template,
      configuration,
      title: null,
      links: null,
      blocks: null,
      config: null,
      stylesheet: null,
      data: {
        config: null,
        blocks: null
      }
    }
  },
  components: {
    Campaign,
    Standard,
    Research,
    TextView,
    FormView
  },
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
    showAnchorMenu(menu) {
      if (menu.config && menu.config.anchor == false) {
        return false
      } else {
        return true
      }
    },
    getAttributes(element) {
      var attrs = element.attributes;
      var obj = {};
      for(var i = attrs.length - 1; i >= 0; i--) {
          var attrname = attrs[i].name;
          var attrvalue = attrs[i].value;
          if (attrvalue == 'true') {
            obj[attrname] = true;
          } else if (attrvalue == 'false') {
            obj[attrname] = false
          } else {
            obj[attrname] = attrvalue
          }
       }
       return obj
    },
    createView(view, header) {
      var name = view.nodeName.toLowerCase();
      var styleAtr = view.getAttribute('style');
      var style = styleAtr;
  
      var html = view.textContent
      var obj = {};
      obj['type'] = name

      if (view.hasAttributes()) {
       var config = this.getAttributes(view);
       obj['config'] = config;
      }

      if (name == 'text' && !header) {
        obj['text'] = this.parseText(html)
        obj['links'] = header
        if (style) {
          obj['style'] = style;
        }
        return obj
      }

      if (name == 'text' && header) {
        obj['text'] = this.parseHeaderText(html)
        obj['title'] = this.parseTitle(html)
        obj['links'] = this.parseHeaderLinks(html)
        if (style) {
          obj['style'] = style;
        }
        return obj
      }

      if (name == 'form') {
        obj['title'] = this.parseTitle(html)
        obj['fields'] = []
        var formtext = this.parseTextOnly(view.childNodes[0].textContent)
        if (formtext) {
          obj['text'] = formtext
        }
        
        var fields = view.querySelectorAll('Field');

        for (var x = 0; x < fields.length; x++) {
          var field = this.getAttributes(fields[x])
          field['text'] = md.render(fields[x].textContent);
          obj['fields'].push(field)
        }

        return obj
      }

      if (name == 'image') {
        var imageUrl = this.regexMatch(html, 'url')
        if (imageUrl) {
          var image = {
            url: imageUrl[0].replace(')', '')
          }
          obj['image'] = image
          if (style) {
            obj['style'] = style;
          }
          return obj
        } 
      }
    },
    createBlock(block) {
      var name = block.nodeName.toLowerCase();
      var styleAtr = block.getAttribute('style');
      
      var style = styleAtr;
     
      var obj = {};
      obj[name] = {};

      if (block.hasAttributes()) {
       var attrs = block.attributes;
       var config = this.getAttributes(block);
       obj[name]['config'] = config;
      }

      var viewNodes = block.childNodes;

      var views = [];
       for (var x = 0; x < viewNodes.length; x++) {
          if (viewNodes[x].nodeName !== '#text' && name !== 'header') {
            var view = this.createView(viewNodes[x], false);
            views.push(view)
          }
          if (viewNodes[x].nodeName !== '#text' && name === 'header') {
            var view = this.createView(viewNodes[x], true);
            views.push(view)
          }
     
        }

      if (this.parseTitle(viewNodes[0].textContent)) {
        var title = this.parseTitle(viewNodes[0].textContent, 'text');
        obj[name]['title'] = title;
      }

      if (views.length) {
        obj[name]['views'] = views.filter(function(e){return e})
      }

      var code = this.parseCode(block.textContent);

      if (code && code.config) {
        obj[name]['config'] = code.config;
      }
      if (code && code.style) {
        obj[name]['style'] = code.style;
      }

      if (style) {
        obj[name]['style'] = style;
      }
 

      if (name == 'menu' || name == 'header') {
        obj[name]['links'] = this.parseHeaderLinks(block.textContent);
      }
            
      return obj
    },
    parseCode(text) {
      var code = text.match(/```([^`]*)```/);
      if (code) {
        return YAML.parse(code[1])
      } else {
        return false
      }
    },
    parseTitle(text, render) {
      var title = this.regexMatch(text, 'title');
      if (title[1] && render == 'text') {
        return title[1].trim();        
      } else if (title) {
        return md.render(title[0]).replace('\n', '');
      } else {
        return ''
      }
    },
    parseSubtitle(text) {
      var regex = /^#{2}([^#].*?)\n/
      const matches = text.match(regex)
      return matches
    },
    parseText(text) {
      if(text.includes('---')) {
        var textContent = text.split('---').map(x => this.parseTextContent(x));
        return textContent
      } else {
        var array = [];
        array.push(this.parseTextContent(text))
        return array
      }
    },
    parseTextContent(text){
      var html = md.render(text);
      if (this.containsVideo(text)) {
        html = this.parseVideo(html)
      } 
      return html
    },
    parseTextOnly(text){
      var regex = /^(#{1,6}\s*.+)/mg;
      var html = text.replace(regex, '');
      return md.render(html)
    },
    parseLinks(text) {
        var html = md.renderInline(text);
        const regex = /<\s*a[^>]*>(.*?)<\s*\/s*a>/gm
        const matches = html.match(regex)
        return matches
    },
    parseHeaderText(text){
      var titleRegex = /^#{2}([^#].*?)\n/mg;
      var linksRegex = /<p><\s*a[^>]*>(.*?)<\s*\/s*a><\/p>/gs;

      var noTitle = text.replace(titleRegex, '')
      var html = md.render(noTitle);
      var text = html.replace(linksRegex, '').replace(/(\r\n|\n|\r)/gm,"")
      return [text]
    },
    parseHeaderLinks(text) {
        var html = md.renderInline(text);
        const regex = /<\s*a[^>]*>(.*?)<\s*\/s*a>/gm
        const matches = '<body>' + html.match(regex) + '</body>'

        var array = [];

        var doc = document.createElement("html");
        doc.innerHTML = matches;
        var links = doc.getElementsByTagName("a")
        var urls = [];

        for (var i=0; i<links.length; i++) {
          var obj = {
            text: links[i].textContent,
            url: links[i].getAttribute("href"),
            style: links[i].getAttribute("style")
          }
          urls.push(obj)
        }
        return urls
    },
    isImage(text) {
      var regex = /\.(gif|jpg|jpeg|tiff|png)/g
      if (regex.exec(text) !== null) {
        return true
      } else {
        return false
      }
    },
    containsVideo(text) {
      var regex = /(?:https?:)?(?:\/\/)?(?:[0-9A-Z-]+\.)?(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/\S*?[^\w\s-])((?!videoseries)[\w-]{11})(?=[^\w-]|$)(?![?=&+%\w.-]*(?:['"][^<>]*>|<\/a>))[?=&+%\w.-]*/gim
      if (regex.exec(text) !== null) {
        return true
      } else {
        return false
      }
    },
    parseVideo(text) {
      var regex = /(?:https?:)?(?:\/\/)?(?:[0-9A-Z-]+\.)?(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/\S*?[^\w\s-])((?!videoseries)[\w-]{11})(?=[^\w-]|$)(?![?=&+%\w.-]*(?:['"][^<>]*>|<\/a>))[?=&+%\w.-]*/gim
      var videoEmbeds = text.replace(regex, function(match, token) {
        return "<div class='videoWrapper' style='--aspect-ratio: 3 / 4;'><iframe width='560' height='349' src='https://www.youtube.com/embed/" + token + "' frameborder='0' allowfullscreen></iframe></div>"
      });
      return videoEmbeds
    },
    regexMatch(text, element) {
      var regex = {
        title: /\#+(.*?)\n/gi,
        attribute: /\[(.*?)\]/gi,
        tag: /\<([^}]+)\>/,
        url: /(https?:\/\/[^\s]+)/,
        link: /\[([^\[]+)\](\(.*\))/gm,
        image: /[\/.](gif|jpg|jpeg|tiff|png)$/i,
        atag: /<\s*a[^>]*>(.*?)<\s*\/s*a>/
      }
      if (text.match(regex[element])) {
        var match = regex[element].exec(text);
        return match;
      } else {
        return false
      }
    },
    escape(string) {
      return encodeURI(string);
    },
    unescape(string){
      return decodeURI(string);
    },
    parseBlocks(text) {
      var regex = /&(?!#?[a-z0-9]+;)/mg;
      var cleant_text = text.replace(regex, '&amp;');
      var xml = new DOMParser().parseFromString(cleant_text, "text/xml");
      var blocks = xml.getElementsByTagName('Webkit')[0].childNodes;
       console.log(xml)
          console.log(blocks)

      var array = [];
      for (var x = 0; x < blocks.length; x++) {
        if (blocks[x].nodeName !== '#text' && blocks[x].nodeName !== 'Config') {
          var block = this.createBlock(blocks[x]);
          array.push(block)
        }
        if (blocks[x].nodeName === 'Config') {
          this.config = this.parseCode(blocks[x].textContent);
          if (this.config.site && this.config.site.template) {
            this.activeTemplate = this.config.site.template.toLowerCase();
          }
          if (this.config.site && this.config.site.theme) {
            this.loadThemeLocal(this.config.site.theme)
          } 
        }
      }

      return array;
    },
    type(obj) {
      return Object.keys(obj)[0]
    },
    isNumeric(num){
      return !isNaN(num)
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
      var yaml = [...doc.querySelectorAll('code')].map(code => code.textContent);
      if (this.validateYaml(yaml[0])) {
        return YAML.parse(yaml[0]);
      } else {
        return false
      }
    },
    getImage(dom) {
      return dome
    },
    loadTemplate(id) {
      var self = this;
      fetch('https://edgeryders.eu/raw/' + id + '.json')
      .then(response => {
        response.text().then(function (text) {
          self.blocks = self.parseBlocks(text);
        });
      })
      .catch(error => console.error(error));
    },
    loadTheme() {
      let file = document.createElement('link');
      file.rel = 'stylesheet';
      document.head.appendChild(file)
    },
    loadThemeLocal(theme) {
      if (this.configuration.mode == 'local') {
        require('./assets/themes/' + theme.toLowerCase() + '.scss');
      } else {
        let link = document.createElement('link');
        link.rel  = 'stylesheet';
        link.type = 'text/css';
        link.href = '/' + theme.toLowerCase() + '.css';
        link.media = 'all';
        console.log(link);
        document.head.appendChild(link)
      }
    },
    loadTemplateLocal(template) {
      var temp = require('./data/' + template);
      this.blocks = this.parseBlocks(temp.default);
    }
  },
  created(){
    var temp = this.template;
    var config = this.configuration;
    var self = this;
    var pathname = window.location.pathname.substring(1);
    var address = window.location.hostname;
    var self = this;

    if (config.mode == 'local') {
      this.loadTemplateLocal(config.template);

      
    }

    if (config.mode == 'sandbox') {
      fetch('https://edgeryders.eu/t/13671.json')
      .then(response => response.json())
      .then(data => {
        
        // var template = 13686;
        var template = 13799;

        var directories = this.getYaml(data.post_stream.posts[0].cooked);
        var result = directories.filter(x => x.alias == pathname || x.id == pathname || x.domain == address)[0];
        if (pathname && !isNaN(pathname)) {
          try {
            self.loadTemplate(pathname);
          }
          catch(e) {
           self.loadTemplate(template);
          }
        }
        else if (result && result.id) {
          try {
            self.loadTemplate(result.id);
          }
          catch(e) {
            self.loadTemplate(template);
          }
        }
        else {
          self.loadTemplate(template);
        }
      })
    }

  }
};

</script>



<style lang="scss">

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

hr {
  border-top-style: solid;
  border-color: #ddd;
}

@keyframes hoverLink {
  0% {
    transform: translateY(5px);
    opacity: 0;
  }
  100% {
    transform: translateY(0px);
    opacity: 1;
  }
}
.menu {
  background: rgba(0,0,0,0.8);
  color: white;
  position: fixed;
  display: flex;
  z-index: 9999;
  align-items: center;
  justify-content: space-between;
  top: 0;
  left: 0;
  width: 96%;
  height: 4rem;
  padding: 0 2%;
  font-family: Helvetica;
  .title {
    font-size: .85rem;
  }
  .links {
    display: inline-block;
      a {
        color: white;
        text-decoration: none;
        display: inline-flex;
        justify-content: center;
        padding: 0.5rem 0.85rem;
        border-left: 1px solid rgba(255,255,255,0.2);
        &:hover {
          text-decoration: underline;
        }
        &:first-child {
          border: none
        }
    }
  }
}

.section {
  font-family: Helvetica;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding-bottom: 0px;
  width: 100%;
  .wrapper {
    width: 80%;
    display: flex;
    align-items: flex-start;
    justify-content: center;
  }
  .image {
    display: flex;
    align-items: center;
    justify-content: center;
    img {
      width: 100%;
    }
  }
  .title {
    width: 80%;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    font-size: 1.4rem;
    font-family: Helvetica;
  }
  .text_wrapper {
    h2 {
      font-size: 1.6rem;
      margin: 0 0 1.5rem 0;
    }
    h3 {
      margin: 0 0 .55rem 0;
      border-bottom: 1px solid #efefef;
      padding-bottom: .75rem;
    }
    p {
      font-size: 1.1rem;
      margin: 0;
      line-height: 1.7rem;
      .emoji {
        display: inline-block;
        width: 1em;
        height: 1em;
        position: relative;
        top: .1em;
      }
    }
    img:not(.emoji) {
      border-radius: 6px;
      background: #efefef;
      margin: 1rem 0 0 0;
      width: 85%;
    }
  }
}

.section.header {
  // margin-top: 4rem;
  min-height: 120px;
  border-bottom: 1px solid #ddd;
  padding: 6rem 0 3rem;
  display: flex;
  justify-content: center !important;
  .wrapper {
    align-items: center;
    justify-content: flex-starts !important;
    margin: 0 auto;
  }
  .image {
    width: 30%;
    margin-right: 2rem;
    img {
      width: 100%;
    }
  }
  .text {
    font-family: Helvetica;
    .hero_title {
      font-size: 1.5rem !important;
    }
    h2 {
      margin: 0 0 1rem 0;
      padding: 0 0 1rem 0;
      border-bottom: 1px solid #ddd;
    }
    p {
      font-size: 1.4rem !important;
      margin: 0 0 0.5rem 0;
      line-height: 2rem;
    }

  }
}

.section.content {
  .wrapper {
    .image + .text {
      margin-left: 3rem;
    }
    .text + .image {
      margin-left: 3rem;
    }
  }
  .text {
    .horizontal {
      display: flex;
      div + div {
        margin-left: 3rem !important;
      }
    }
    .topic {
      p img {
        width: auto !important;
        margin: 0 !important;
        max-width: 100%;
      }
      p + h3 {
        margin-top: 1.5rem;
      }
      p + p {
        margin-top: 1rem;
      }
      ol, ul {
        margin: 1rem 0;
        padding: 0 0 0 1.3rem;
        line-height: 1.75rem;
        font-size: 1.05rem;
      }
      blockquote {
        background: #fafafa;
        border-left: 2px solid #ddd;
        margin: 1rem 0 1.5rem;
        padding: 10px 15px 10px;
        p {
          margin: 0;
        }
      }
    }
    .emphasis {
      padding: 40px;
      background: #fafafa;
    }
  }
}

body {
  padding: 0 !important;
  margin: 0 !important;
}

.view {
  width: 100%;
}

.view + .view {
  margin-left: 3rem;
}

.form {
  margin-bottom: 1.5rem;
  h3 {
    font-size: 1.3rem;
    margin: 0 0 1rem 0;
    margin: 0 0 .55rem 0;
    border-bottom: 1px solid #efefef;
    padding-bottom: .75rem;
  }
  p {
    font-size: 1.1rem;
    margin: 0;
    line-height: 1.7rem;
    .emoji {
      display: inline-block;
      width: 1em;
      height: 1em;
      position: relative;
      top: .1em;
    }
  }
  .fields {
    margin-top: 1.5rem;
  }
  .field {
    margin: 0 0 1rem 0;
    *:focus {
        outline: none;
        border: 1px solid #000;
        background: #fafafa;
      }
    input, textarea {
      width: 96%;
      padding: 1rem;
      border: 1px solid #ddd;
      font-size: .95rem;
      color: #000 !important;
      font-weight: bold;
    }
    h3 {
      font-size: 1.1rem;
      border: none;
      margin: 0;
    }
    p {
      font-size: 1rem !important;
      line-height: 1.2rem;
      margin-bottom: 1rem;
    }
    button {
      border: 1px solid #ddd;
      border-radius: 6px;
      font-size: .85rem;
      padding: .7rem 1rem;
      background: white;
      margin-right: .5rem;
    }
  }
}

.create_account {
  h3 {
    font-size: 1.2rem;
    border: none;
    margin-bottom: 0;
  }
  input {
    padding: .7rem;
    width: 93.6%;
  }
  .terms {
    display: flex;
    background: #fafafa;
    padding: 1rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    width: 96%;
    align-items: center;
    p {
      margin: 0 0 0 10px;
    }
  }
}

@media only screen and (max-width: 600px) {
  .section {
    padding: 2rem 0 20px;
    .title {
      font-size: 1.2rem;
      * {
        margin: 0 0 1.5rem;
      }
    }
    &.header {
      margin-bottom: 0;
    }
    .view + .view {
      margin-left: 0rem;
      margin-top: 2rem;
    }
    .wrapper {
      flex-direction: column;
      .text {
        margin-left: 0rem;
        p img:not(.emoji) {
          width: 100%;
        }
      }
      .image {
        margin-left: 0rem;
      }
    }
  }
  .section.content .text .horizontal {
    flex-direction: column !important;
    div + div {
      margin-left: 0;
      margin-top: 2rem;
    }
  }
  .form {
    .field {
      input, textarea {
        width: 90%;
        padding: 1rem;
        border: 1px solid #ddd;
        font-size: .95rem;
        color: #000 !important;
        font-weight: bold;
      }
    }
  }
}


</style>
