'use strict';
// (function(exports, require, module, __filename, __dirname, hexo){ // This is what HEXO passes to this function(file)!

var hexo = hexo || {};
const rtSettings = require('./Settings/_readTime.json');
//const rtlogic = require('./lib/logic');
const readTime = require('./lib/readtime');

// debugger; //init HEXO debugger


/**
 * @function init
 * @description initializes parameters and logic for readTime plugin
 * @param {object} post 
 */
let readTime_init = function (post) {

    let lang = post.lang || hexo.config.language[0] || 'en';

    //TODO: get `hexo.config.readtime.defaultTime` (and imgReadTime)
    
    let rtObj = new readTime(rtSettings.langProfile[lang], post.content, {defaultTime: rtSettings.defaultTime, imgReadTime: rtSettings.imgReadTime});
    let rtString = rtObj.calculate();

    
  // Update post
  Object.assign(post, {
    wordCount: rtObj.wordCount,
    charCount: rtObj.charCount,
    imgCount: rtObj.imgCount,
    readTime: rtString,
  });

  //TODO: write to markdown file
    
};


/* 
 * Register the `before_post_render` event listener to trigger readTime
 * See https://hexo.io/api/events for further details on events
 */
hexo.extend.filter.register('before_post_render', readTime_init);
