'use strict';

hexo.extend.filter.register('before_post_render', (data) => require('./lib/logic')(data, hexo, require('./Settings/_readTime.json')));