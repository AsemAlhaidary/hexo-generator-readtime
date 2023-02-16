'use strict';

let front = require('hexo-front-matter');
let fs = require('hexo-fs');

/**
 * @function getWordCount
 * @desc Count the words inside the wanted fields in the post
 * @param {Object} post - Object contains the data of the post
 * @param {Array} fields - Array of the wanted fields to count its words
 * @return {Number} - The number of the counted words
 */
let getWordCount = (post, fields) => {
  let wordCount = 0;

  // 1. Removing the HTML tags.
  // 2. Splitting the words of each field.
  // 3. Get the number of the words.
  fields.forEach(field => {
    wordCount += post[field].replace(/<[^>]+>/g, '')
                  .split(' ').length;
  });

  return wordCount;
}

/**
 * @function getCharCount
 * @desc Count the characters inside the wanted fields in the post
 * @param {Object} post - Object contains the data of the post
 * @param {Array} fields - Array of the wanted fields to 
 * count their characters
 * @return {Number} - The number of the counted characters
 */
let getCharCount = (post, fields) => {
  let charCount = 0;

  // 1. Removing the HTML tags and the {space} character.
  // 2. Count the number of the characters.
  fields.forEach(field => {
    charCount += post[field].replace(/[{<[^>]+>}\s]/g, '').length;
  });

  return charCount;
}

/**
 * @function getImgCount
 * @desc Count the images inside the wanted fields in the post
 * @param {Object} post - Object contains the data of the post
 * @param {Array} fields - Array of the wanted fields to 
 * count their images
 * @return {Number} - The number of the counted images
 */
let getImgCount = (post, fields) => {
  let imgCount = 0;

  // 1. Get all images tags inside each field.
  // 2. If there is no images OR empty array (zero images).
  // 3. Count the number of the images.
  fields.forEach(field => {
    imgCount += (post[field].match(/<img[^>]+>/g) || []).length;
  });

  return imgCount;
}

/**
 * @function getWordsPerMin
 * @desc Getting the {wordsPerMin} value from 
 * the HEXO config file, if not? get the value 
 * from default languages profile {_readTime.json}.
 * @param {Object} settings - The hexo config file
 * @param {String} language - The language of the post or site or "en"
 * @param {JSON} readTimeSettings - The default languages profile
 * @return {Number} - The number of words per minute.
 */
let getWordsPerMin = (settings, language, readTimeSettings) => {
  // Defalut to 0
  let wordsPerMin = 0;

  // If the wanted language has a setting inside HEXO config file
  if (language in settings.countLangProfile) {
    // If the key "wordsPerMin" is inside the setting of the wanted lang
    if ('wordsPerMin' in settings.countLangProfile[language]) {
      // Get the value of {wordsPerMin}
      wordsPerMin = settings.countLangProfile[language].wordsPerMin;
    }

  // Else If the wanted language has a setting inside the 
  // languages profile JSON file
  } else if (language in readTimeSettings.countLangProfile) {
    // If the key "wordsPerMin" is inside the setting of the wanted lang
    if ('wordsPerMin' in readTimeSettings.countLangProfile[language]) {
      // Get the value of {wordsPerMin}
      wordsPerMin = readTimeSettings.countLangProfile[language].wordsPerMin;
    }
  }

  // Returns the "wordPerMin" number OR 0
  return wordsPerMin
}

/**
 * @function getReadTime
 * @desc Get all the values that needed to calcualte 
 * the read time, then do the calculation
 * @param {Object} post - Object contains the data of the post
 * @param {Object} settings - The hexo config file
 * @param {JSON} readTimeSettings - The default languages profile
 * @return {Number} - The calculated read time.
 */
let getReadTime = (post, settings, readTimeSettings) => {
  // 1. Get the lang of the post, or the first lang inside 
  //    HEXO config file, or "en"
  let language = data.lang || settings.language[0] || 'en';

  // 2. Get {imgsPerMinute} value
  // 3. Get {wordsPerMinute} value
  // 4. Get {wordCount} value
  // 5. Get {imgCount} value
  let imgsPreMinute = settings.readtime.imgReadTime;
  let wordsPerMinute = getWordsPerMin(settings, language, readTimeSettings);
  let wordCount = getWordCount(post, settings.readtime.fields);
  let imgCount = getImgCount(post, settings.readtime.fields);

  // 6. Calclulate and return the read time
  return (wordCount * wordsPerMinute) + (imgCount * imgsPreMinute);
}

module.exports = (data, hexo, readTimeSettings) => {
  console.log(data);
  if (data.layout != 'post') return data;
  if (!hexo.config.render_drafts && data.source.startsWith("_drafts/")) return data;

  let counts = {
    wordCount: getWordCount(data, hexo.config.readtime.fields),
    charCount: getCharCount(data, hexo.config.readtime.fields),
    imgCount: getImgCount(data, hexo.config.readtime.fields),
    readTime: getReadTime(data, hexo.config, readTimeSettings),
  }

  Object.keys(counts).forEach(count => {
    if (data[count] && typeof data[count] == 'number') return;

    data[count] = counts[count];
  });

  return data;
}