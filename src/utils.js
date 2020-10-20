export default {
  data: function() {
    return {};
  },
  methods: {
    loadTemplate(id) {
      var self = this;
      fetch("https://edgeryders.eu/raw/" + id + ".json")
        .then(response => {
          response.text().then(function(text) {
            self.parseBlocks(text);
          });
        })
        .catch(error => console.error(error));
    },
    parseBlocks(text) {
      var regex = /&(?!#?[a-z0-9]+;)/gm;
      var cleant_text = text.replace(regex, "&amp;");
      var xml = new DOMParser().parseFromString(cleant_text, "text/xml");
      var blocks = xml.getElementsByTagName("Webkit")[0].childNodes;
      var array = [];
      for (var x = 0; x < blocks.length; x++) {
        console.log(blocks[x].nodeName.toLowerCase());

        if (blocks[x].nodeName.toLowerCase() == "config") {
          var config = this.parseCode(blocks[x].textContent);
          console.log(config);
          if (config.child) {
            this.childConfig = config;
          } else {
            this.config = config;
          }
          if (this.config.site.title) {
            this.sendAnalytics(this.pathname + " - " + this.config.site.title);
          } else {
            this.sendAnalytics("/" + this.pathname);
          }
          if (this.config.site && this.config.site.theme) {
            this.loadThemeLocal(this.config.site.theme);
          } else {
            this.loadThemeLocal("event");
          }
          if (this.config.site && this.config.site.template) {
            if (this.config.site.template.toLowerCase() == "campaign") {
              this.activeTemplate = "edgeryders";
            } else if (this.config.site.template.toLowerCase() == "standard") {
              this.activeTemplate == "minimal";
            } else {
              this.activeTemplate = this.config.site.template.toLowerCase();
            }
          }
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
          this.blocks.push(block);
        }
        if (blocks[x].nodeName.toLowerCase() == "footer") {
          this.footer = this.createFooter(blocks[x]);
        }
      }
      return array;
    }
  }
};
