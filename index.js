'use strict';

/* 
 * Register the `before_post_render` event listener to trigger readTime
 * See https://hexo.io/api/events for further details on events
 */

hexo.extend.filter.register('before_post_render', (data) => require('./lib/logic')(data, hexo, require('./Settings/_readTime.json')));