'use strict';
// (function(exports, require, module, __filename, __dirname, hexo){ // This is what HEXO passes to this function(file)!

var hexo = hexo || {};
const rtSettings = require('./Settings/_readTime.json');
//const rtlogic = require('./lib/logic');
const readTime = require('./lib/readtime');

// debugger; //init HEXO debugger


/**
 * @function readTime_init
 * @description initializes parameters and logic for readTime plugin
 * @param {object} post 
 */
let readTime_init = function (post) {

    // check language defaults
    let lang = post.lang || hexo.config.language[0] || 'en'; //ISO-639-1 code

    // option defaults from settings file
    let rtConfig = {
        defaultTime: rtSettings.defaultTime,
        imgReadTime: rtSettings.imgReadTime
    };

    // use `_config.yml` readTime setting if defined. Otherwise, plugin defaults.
    if (typeof hexo.config.readTime == "object") {
        Object.assign(rtSettings, hexo.config.readTime);

        // override option defaults if available
        rtConfig = {
            defaultTime: hexo.config.readtime.defaultTime || rtSettings.defaultTime,
            imgReadTime: hexo.config.readtime.imgReadTime || rtSettings.imgReadTime
        };
    }

    let rtObj = new readTime(rtSettings.langProfile[lang], post.content, rtConfig);
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