'use strict';

const Hexo = require('hexo');
let front = require('hexo-front-matter');
let fs = require('hexo-fs');

/**
 * @function updateThemeSettings
 * @desc Set a default settings to hexo.theme.config file, 
 * and respect users settings
 * @param {Hexo} hexo
 */
let updateThemeSettings = hexo => {
  hexo.theme.config.readtime = Object.assign({
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
  }, hexo.theme.config.readtime);
}

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
 * @function isLangInSet
 * @desc Check if the language has a setting inside the 
 * given settings
 * @param {Object} readtimeSet - The s
 * @param {String} lang - The language
 * @return {Boolean}
 */
let isLangInSet = (readtimeSet, lang) => {
  return Object.keys(readtimeSet.countLangProfile).includes(lang);
}

/**
 * @function isPropInLang
 * @desc Check if the language has a property inside the 
 * given settings
 * @param {Object} readtimeSet - The settings
 * @param {String} prop - The property to check for
 * @param {String} lang - The language
 * @return {Boolean}
 */
let isPropInLang = (readtimeSet, prop, lang) => {
  return Object.keys(readtimeSet.countLangProfile[lang]).includes(prop);
}

/**
 * @function isPropInSet
 * @desc Check if the property has a setting in the given 
 * language of the given settings
 * @param {Object} readtimeSet - The settings
 * @param {String} prop - The property to check for
 * @param {String} lang - The language
 * @return {Boolean}
 */
let isPropInSet = (readtimeSet, prop, lang) => {
  return isLangInSet(readtimeSet, lang) && isPropInLang(readtimeSet, prop, lang);
}

/**
 * @function getWordsPerMin
 * @desc Getting the {wordsPerMin} value from 
 * the HEXO config file, if not? get the value 
 * from default languages profile {_readTime.json}.
 * @param {Hexo.Theme} themeConfig - The hexo.theme.config file
 * @param {String} language - The language of the post or site or "en"
 * @param {JSON} defaultSettings - The default languages profile
 * @return {Number} - The number of words per minute.
 */
let getWordsPerMin = (themeConfig, language, defaultSettings) => {
  // Defalut to 0
  let wordsPerMin = 0;

  // Is "wordsPerMin" property in themeConfig.readtime at the wanted lang?
  if (isPropInSet(themeConfig.readtime, 'wordsPerMin', language)) {
    wordsPerMin = themeConfig.readtime.countLangProfile[language].wordsPerMin;

  // Is "wordsPerMin" property in defaultSettings at the wanted lang?
  } else if (isPropInSet(defaultSettings, 'wordsPerMin', language)) {
    wordsPerMin = defaultSettings.countLangProfile[language].wordsPerMin;

  // Use the "wordsPerMin" value of "en" lang
  } else {
    wordsPerMin = defaultSettings.countLangProfile.en.wordsPerMin;
  }

  // Returns the "wordPerMin" number OR 0
  return wordsPerMin
}

/**
 * @function getReadTime
 * @desc Get all the values that needed to calcualte 
 * the read time, then do the calculation
 * @param {Object} post - Object contains the data of the post
 * @param {Hexo} hexo - Hexo base class
 * @param {JSON} defaultSettings - The default languages profile
 * @return {Number} - The calculated read time.
 */
let getReadTime = (post, hexo, defaultSettings) => {
  // 1. Get the lang of the post, or the first lang inside 
  //    HEXO config file, or "en"
  let language = post.lang || hexo.config.language[0] || 'en';

  // 2. Get {imgsPerMinute} value
  // 3. Get {wordsPerMinute} value
  // 4. Get {wordCount} value
  // 5. Get {imgCount} value
  let imgsPreMinute = hexo.theme.config.readtime.imgReadTime;
  let wordsPerMinute = getWordsPerMin(hexo.theme.config, language, defaultSettings);
  let wordCount = getWordCount(post, hexo.theme.config.readtime.fields);
  let imgCount = getImgCount(post, hexo.theme.config.readtime.fields);

  // 6. Calclulate and return the read time
  return (wordCount * wordsPerMinute) + (imgCount * imgsPreMinute);
}

/**
 * @desc Manage all the process of getting the counts and 
 * readtime of the post, then update the front-matter of 
 * the post with new variables
 * @param {Object} data - The post data
 * @param {Hexo} hexo - Hexo base class
 * @param {JSON} defaultSettings - The "_readTime.json" file
 * @return {Object} - The processed post contains variables 
 * of the counts and readtime
 */
module.exports = (data, hexo, defaultSettings) => {
  if (data.layout != 'post') return data;
  if (!hexo.config.render_drafts && data.source.startsWith("_drafts/")) return data;

  updateThemeSettings(hexo);

  let counts = {
    wordCount: getWordCount(data, hexo.theme.config.readtime.fields),
    charCount: getCharCount(data, hexo.theme.config.readtime.fields),
    imgCount: getImgCount(data, hexo.theme.config.readtime.fields),
    readTime: getReadTime(data, hexo, defaultSettings),
  }

  Object.assign(data, counts);

  return data;
}