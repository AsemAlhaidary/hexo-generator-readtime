'use strict';

let front = require('hexo-front-matter');
let fs = require('hexo-fs');

let getWordCount = (post, wordCount) => {
  let fields = wordCount.fields;
  let wordCount = 0;
  let fieldData;

  fields.forEach(field => {
    fieldData = post[field];
    fieldData = fieldData.replace(/<[^>]+>/g, '');
    wordCount += fieldData.split(' ').length - 1;
  });

  return wordCount;
}

let getCharCount = (post, charCount) => {
  let fields = charCount.fields;
  let charCount = 0;
  let fieldData;

  fields.forEach(field => {
    fieldData = post[field];
    fieldData = fieldData.replace(/{[<[^>]+>}\s]/g, '');
    charCount += fieldData.length;
  });

  return charCount;
}

let getImgCount = (post, imgCount) => {
  let fields = imgCount.fields;
  let imgCount = 0;
  let fieldData;

  fields.forEach(field => {
    fieldData = post[field];
    imgCount += (fieldData.match(/<img[^>]+>/g) || []).length;
  });

  return imgCount;
}

let getReadTime = (post, readTime, language) => {
  // let fields = readTime.fields;
  let wordsPerMinute = readTime.wordsPerMinute;
  let imgsPreMinute = readTime.imgsPreMinute;
  let wordCount = getWordCount(post, readTime);
  let imgCount = getImgCount(post, readTime);
  // let readTime = 0;
  // let fieldData;

  // fields.forEach(field => {
  //   fieldData = post[field];
  // });
  let readTime = (wordCount * wordsPerMinute) + (imgCount * imgsPreMinute);

  return readTime;
}

module.exports = (data) => {
  if (data.layout != 'post') return data;
  if (!this.config.render_drafts && data.source.startsWith("_drafts/")) return data;

  let config = this.config;
  let readtime = config.readtime;
  let post = front.parse(data.raw);
  let language = post.lang || config.language[0] || 'en';

  let counts = {
    wordCount: getWordCount(post, readtime.wordCount),
    charCount: getCharCount(post, readtime.charCount),
    imgCount: getImgCount(post, readtime.imgCount),
    readTime: getReadTime(post, readtime.readTime, language),
  }

  Object.keys(counts).forEach(count => {
    if (post[count] && typeof post[count] == 'number') return;

    post[count] = counts[count];
  });

  return data;
}