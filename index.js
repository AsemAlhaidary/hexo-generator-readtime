'use strict';

let readTimeSettings = require('./Settings/_readTime.json');

hexo.config.readtime = Object.assign({
  fields: ['content'],
  humanReadable: true,
  imgReadTime: 12,
  countLangProfile: {
    ar: {
      charPerMin: 612,
      wordsPerMin: 138,
    },
    en: {
      charPerMin: 987,
      wordsPerMin: 228,
    },
    jp: {
      charPerMin: 357,
      wordsPerMin: 193,
    },
    zh: {
      charPerMin: 255,
      wordsPerMin: 158,
    },
  },
}, hexo.config.readtime);


hexo.extend.filter.register('before_post_render', (data) => require('./lib/logic')(data, hexo, readTimeSettings));