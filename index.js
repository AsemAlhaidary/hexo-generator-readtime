'use strict';

var hexo = hexo || {};
var front = require('hexo-front-matter');
var fs = require('hexo-fs');

const rtSettings = require('./Settings/_readTime.json');
//const rtlogic = require('./lib/logic');
const readTime = require('./lib/readtime');

debugger; //init HEXO debugger


/**
 * @function readTime_init
 * @description initializes parameters and logic for readTime plugin
 * @param {object} post 
 */
let readTime_init = function (post) {

    // only update articles in the `_posts` folder
    if (post.layout != 'post')
        return post;
    if (!this.config.render_drafts && post.source.startsWith("_drafts/"))
        return post;


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

    let rtMetrics = {
        wordCount: rtObj.wordCount,
        charCount: rtObj.charCount,
        imgCount: rtObj.imgCount,
        readTime: rtString,
    };
    Object.assign(post, rtMetrics); //merge metrics with post data

    // parse front matter
    let tmpPost = front.parse(post.raw);

    // only update if value is different
    if (tmpPost.readTime != rtString) {

        // Update front-matter
        Object.assign(tmpPost, rtMetrics); //merge new front-matter data

        // only update if time is greater than 0 and `hexo generate`
        if (rtObj.time > 0 && hexo._isGenerating) {

            // overwrite markdown file
            fs.writeFile(post.full_source, '---\n' + front.stringify(tmpPost), 'utf-8');

            //show debug info
            hexo.log.i("Generated: readTime [%s] %j", post.source, rtMetrics);
        }
    }

    //update in-memory data
    return post;
};


/* 
 * Register the `before_post_render` event listener to trigger readTime
 * See https://hexo.io/api/events for further details on events
 */
hexo.extend.filter.register('before_post_render', readTime_init);