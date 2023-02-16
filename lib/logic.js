'use strict';

let front = require('hexo-front-matter');
let fs = require('hexo-fs');

let getWordCount = (post, fields) => {
  let wordCount = 0;
  let fieldData;

  fields.forEach(field => {
    fieldData = post[field];
    fieldData = fieldData.replace(/<[^>]+>/g, '');
    wordCount += fieldData.split(' ').length - 1;
  });

  return wordCount;
}

let getCharCount = (post, fields) => {
  let charCount = 0;
  let fieldData;

  fields.forEach(field => {
    fieldData = post[field];
    fieldData = fieldData.replace(/{[<[^>]+>}\s]/g, '');
    charCount += fieldData.length;
  });

  return charCount;
}

let getImgCount = (post, fields) => {
  let imgCount = 0;
  let fieldData;

  fields.forEach(field => {
    fieldData = post[field];
    imgCount += (fieldData.match(/<img[^>]+>/g) || []).length;
  });

  return imgCount;
}

let getReadTime = (post, settings, language) => {
  // let fields = settings.fields;
  let wordsPerMinute = settings.wordsPerMinute;
  let imgsPreMinute = settings.imgsPreMinute;
  let wordCount = getWordCount(post, settings.fields);
  let imgCount = getImgCount(post, settings.fields);
  // let readTime = 0;
  // let fieldData;

  // fields.forEach(field => {
  //   fieldData = post[field];
  // });
  let readTime = (wordCount * wordsPerMinute) + (imgCount * imgsPreMinute);

  return readTime;
}

module.exports = (data) => {
  console.log(data);
  if (data.layout != 'post') return data;
  if (!this.config.render_drafts && data.source.startsWith("_drafts/")) return data;

  let config = this.config;
  let readtime = config.readtime;
  // let data = front.parse(data.raw);
  let language = data.lang || config.language[0] || 'en';

  let counts = {
    wordCount: getWordCount(data, readtime.fields),
    charCount: getCharCount(data, readtime.fields),
    imgCount: getImgCount(data, readtime.fields),
    readTime: getReadTime(data, readtime, language),
  }

  Object.keys(counts).forEach(count => {
    if (data[count] && typeof data[count] == 'number') return;

    data[count] = counts[count];
  });

  return data;
}