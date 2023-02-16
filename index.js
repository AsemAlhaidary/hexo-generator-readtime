'use strict';

let logic = require('./lib/logic');

hexo.config.readtime = Object.assign({
  fields: ['content'],
  wordsPerMinute: 15,
  imgsPreMinute: 6,
}, hexo.config.readtime);


hexo.extend.filter.register('before_post_render', logic);