# Webkit Alpha

This repository is for new Webkit development updates.

## Update 0.1

This version of the Webkit features:

- A new parser for generating sites using XML syntax and Markdown for shorter and simpler configurations. An example of this syntax can be seen in use [here](https://edgeryders.eu/raw/13810.json).
- A sandbox and local mode for switching between loading local and remote configurations
- A template system for loading specific layouts from a configuration 
- A theme system for loading custom styles from a configuration
- Improved inline styling options 

### XML Parser

The XML parser will not replace the JSON forms, but provide an easier option for project managers to write configurations.

The template syntax includes a front matter in YAML for configuring the site

```
site:
  title: Site Title
  template: Template Name (Vue template, optional)
  theme: Edgeryders (CSS theme, optional)
  lang: en-US (Language, optional)

```

Depending on the template loaded, additional template variables can be set in the frontmatter.

For the Campaign template, the following variables can be set:

```
menu: 
  anchor: true (displays sections with an ID)
  links: 
  	- text: link text 1
  	  url: https://...
  	- text: link text 2
  	  url: https://...
header:
  image: https://i.redd.it/x5zojh91awfz.jpg (header image)
  social: ['url', 'twitter', 'facebook', 'linkedin', 'email'] (social links to display)
```

A minimal XML layout looks like this:

```
<Webkit>

<Header>

  ## My header title.
  My header pargraph text

  [My header link #1](url)
  [My header link #2](url)

</Header>

<Content>

  <Text> A text view with html, embedded images, embedded video </Text>
  <Text> 
     ### A subtitle
     Another text view
   </Text>
  
</Content>

</Webkit>
```

When this repository will be moved to the main repository the Webkiot documentation will cover all the scenarios for this templating system.

### Sandbox/Local Mode

You can now set the Webkit to read from multiple configurations (Sandbox mode) or from one single local file (Local Mode).

This mode is set in config.yaml:

```
---
baseUrl: https://edgeryders.eu
title: Webkit Sandbox
mode: local (or sandbox)
```

When in Sandbox mode, you can provide a default topic ID to read the configuration from.

To load another configuration, put the topic ID after the trailing slash of the address where Webkit is deployed:

For example, to load the configuration of topic 13810 from the local server running webkit:

http://localhost:8080/13810

### Templates & Themes

There are cases where different sites need a specific layout and styling. For this there is the tempaltes directors, which hosts templates that can be loaded conditionnally based on the configuration.

Templates require development of a new Vue component hosted in the ```src/components/templates``` directory, while Themes are CSS files that can be hosted locally or loaded remotely. Local themes are in ```src/assets/themes``` directory.

The template and theme of a site are defined in the frontmatter of the configuration. If no template or theme is specified, Webkit will default to the standard configuration.

```
---
baseUrl: https://edgeryders.eu
title: Webkit Sandbox
mode: local (or sandbox)
template: Campaign
theme: edgeryders.scss (or topic ID with code block containing CSS)
```

### Inline styling

In the XML syntax, blocks can be styled with standard inline css as such:

```
<Content style="background: black; padding: 30px">

## My content title

<Text style="background: blue; font-family: Georgia, serif">
My text view with Georgia
</Text>

</Content>
```

Markdown elements can also be styled using Block Inline Attribute Lists, which can be used to attach attributes such as a class, id and style to Markdown text. An example of inline styling with Markdown:

```
<Content>

## My red title{style="color: red"}

</Content>
```

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Run your tests
```
npm run test
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
# webkit-alpha
