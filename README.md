# hexo-generator-database
Extract the database of HEXO blog into JSON or XML files

## Install

``` bash
$ npm install hexo-generator-database --save
```

## Options

You can configure this plugin in your root `_config.yml`.

``` yaml
database:
  path: db.json
  fields: [post]
```

- **path** - file path. By default is `db.json`.
- **fields** - the generate scope you want to generate, you can include:
  * **post** (Default) - will only covers all the posts of your blog. `(The only supported for now)`
  * **page** - will only covers all the pages of your blog.

## Exclude indexing

To exclude a certain post or page from being indexed, you can simply insert `indexing: false` setting at the top of its front-matter, *e.g.*:

```yml
title: "Code Highlight"
date: "2014-03-15 20:17:16"
tags: highlight
categories: Demo
description: "A collection of Hello World applications from helloworld.org."
toc: true
indexing: false
---
```

Then the generated result will not contain this post or page.

## Sponsor
I have created and used this package in my sponsor's [Blog](https://blog.richiebartlett.com/), you can find him at his [Website](https://richiebartlett.com/), also [Github](https://github.com/lorezyra)