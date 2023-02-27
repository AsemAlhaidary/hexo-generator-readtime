'use strict';

const Hexo = require('hexo');
const { sprintf } = require("sprintf-js");

/**
 * @function updateThemeSetting
 * @desc Set a default settings to hexo.theme.config file, 
 * and respect users settings
 * @param {Hexo} hexo
 */
let updateThemeSetting = hexo => {
  hexo.theme.config.readtime = Object.assign({
    fields: ['content'],
    humanReadable: true,
    defaultTime: 'auto',
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
 * @function getLanguage
 * @desc Gets the language of the post, or the first 
 * language in hexo config, or the "en" as default
 * @param {Object} post - The post data
 * @param {Hexo} hexo
 * @return {String} - The language
 */
let getLanguage = (post, hexo) => {
  return post.lang || hexo.config.language[0] || 'en';
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
    imgCount += (post[field].match(/<img/g) || []).length;
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
let getReadTime = (post, hexo, defaultSettings, language) => {
  // 1. Get {imgsPerMinute} value
  // 2. Get {wordsPerMinute} value
  // 3. Get {wordCount} value
  // 4. Get {imgCount} value
  let imgsPreMinute = hexo.theme.config.readtime.imgReadTime;
  let wordsPerMinute = getWordsPerMin(hexo.theme.config, language, defaultSettings);
  let wordCount = getWordCount(post, hexo.theme.config.readtime.fields);
  let imgCount = getImgCount(post, hexo.theme.config.readtime.fields);

  // 5. Calclulate and return the read time
  let readTime = (wordCount / wordsPerMinute) + (imgCount / imgsPreMinute); // minutes
  readTime *= 60; // seconds

  return readTime;
}

/**
 * @function getDefaultTimeUnit
 * @desc Get the defalut time unit from the theme config 
 * settings, or the default json settings
 * @param {Hexo} hexo
 * @param {JSON} defaultSettings
 * @return {String}
 */
let getDefaultTimeUnit = (hexo, defaultSettings) => {
  return hexo.theme.config.readtime.defaultTime || defaultSettings.defaultTime;
}

/**
 * @function getAutoFuzzyTime
 * @desc Calculate the fuzzy time based on the least "count" 
 * time for the {timeCount}. Ex, 90sec becomes almost 1min
 * @param {Number} timeCount - The time to be counted
 * @return {Object} { timeUnit: String, timeCount: Number }
 */
let getAutoFuzzyTime = (timeCount) => {
  let timeUnit = {
    "seconds": 1, // base unit
    "minutes": 60,
    "hours": 3600, // 60*60,
    "days": 86400, // 60*60*24
    "months": 2592000, // 60*60*24*30
    "years": 31557600, // 60*60*24*365.25
  }

  let count = timeCount,
    prevTU = 'seconds',
    unit = 'seconds';

  for (const tu in timeUnit) {
    if (timeCount >= timeUnit[tu]) {
      // Find the greatest {timeUnit} that wouldn't 
      // make the {timeCount} equals to 0.
      prevTU = tu;

      // Don't skip the rest of the code if the {timeCount} 
      // could be calculated by the "years".
      if (tu != 'years') continue;
    }

    // Calculate the time after finding the suitable unit
    count = Math.floor(timeCount / timeUnit[prevTU]);
    unit = prevTU;
    break;
  }

  return { timeUnit: unit, timeCount: count };
}

/**
 * @function getUnitTime
 * @desc Calculate the time based on the given {timeUnit}
 * @param {Number} timeCount - The time to be calculated
 * @param {String} timeUnit - The time unit
 * @return {Object} { timeUnit: String, timeCount: Number }
 */
let getUnitTime = (timeCount, timeUnit) => {
  let divisor = 365.25; //year

  switch (timeUnit) {
    case 'year', 'years':
      timeCount /= divisor;
    //console.log(`timeCount: ${timeCount}; tu: ${timeUnit};`);
    case 'month', 'months':
      divisor = 30;
      timeCount /= divisor;
    //console.log(`timeCount: ${timeCount}; tu: ${timeUnit};`);
    case 'day', 'days':
      divisor = 24;
      timeCount /= divisor;
    //console.log(`timeCount: ${timeCount}; tu: ${timeUnit};`);
    case 'hour', 'hours':
      divisor = 60;
      timeCount /= divisor;
    //console.log(`timeCount: ${timeCount}; tu: ${timeUnit};`);
    case 'minute', 'minutes':
      divisor = 60;
      timeCount /= divisor;
    //console.log(`timeCount: ${timeCount}; tu: ${timeUnit};`);
    default:
      break; //seconds
  }

  return { timeUnit: timeUnit, timeCount: timeCount };
}

/**
 * @function getFuzzyTimeUnit
 * @desc Controls how the time and the unit will be 
 * calculated based on the {timeUnit} value
 * @param {Number} timeCount - The time to be calculated
 * @param {String} timeUnit - The time unit
 * @return {Object} { timeUnit: String, timeCount: Number }
 */
let getFuzzyTimeUnit = (timeCount, timeUnit) => {
  if (timeUnit == 'auto') {
    return getAutoFuzzyTime(timeCount);
  }

  return getUnitTime(timeCount, timeUnit);
}

/**
 * @function getFormedUnit
 * @desc Get the correct form of the unit (singular/plural) 
 * in different languages based on the given time
 * @param {Number} time
 * @param {String} unit
 * @param {String} language
 * @return {String} 
 */
let getFormedUnit = (time, unit, language) => {
  let isPlural = unit[unit.length - 1] == 's';

  // Make it plural as default
  if (!isPlural && unit != 'auto') unit += 's'; // plural

  if (language == 'ar') {
    // In arabic, use plural form only with numbers [2-10]
    if (time <= 1 || time > 10) {
      unit = unit.slice(0, unit.length - 1); // singlular
    }
  } else {
    if (time <= 1) {
      unit = unit.slice(0, unit.length - 1); // singlular
    }
  }

  return unit;
}

/**
 * @function getFuzzyAbout
 * @desc Gets the translated "about" word based on the given language
 * @param {Hexo} hexo
 * @param {JSON} defaultSettings - The defalut "_readTime.json" file
 * @param {String} language - The language
 * @return {String} - The translated "about" word
 */
let getFuzzyAbout = (hexo, defaultSettings, language) => {
  let fuzzyAbout;

  // Use "try...catch" block to avoid "undefiend" error
  try {
    // Try to get the word from the theme config settings
    fuzzyAbout = hexo.theme.config.readtime.countLangProfile[language].fuzzyTime.about;
  } catch (error) {
    try {
      // Try to get the word from the default settings
      fuzzyAbout = defaultSettings.countLangProfile[language].fuzzyTime.about;
    } catch (error) {
      // Use the english version as default
      fuzzyAbout = 'about';
    }
  }

  return fuzzyAbout;
}

/**
 * @function getPattern
 * @desc Get the pattern text based on the given language
 * to present the result.
 * @param {Hexo} hexo
 * @param {JSON} defaultSettings
 * @param {String} language
 * @return {String} - The pattern text
 */
let getPattern = (hexo, defaultSettings, language) => {
  let pattern;

  try {
    // Try to get the pattern from the theme config settings
    pattern = hexo.theme.config.readtime.countLangProfile[language].fuzzyTime.pattern;
  } catch (error) {
    // Try to get the pattern from the default settings
    pattern = defaultSettings.countLangProfile[language].fuzzyTime.pattern;
  }

  return pattern;
}

/**
 * @function getFuzzyTimePeriod
 * @desc Get the translated time unit word from settings 
 * based on the given language
 * @param {Hexo} hexo
 * @param {JSON} defaultSettings
 * @param {String} language
 * @param {String} timeUnit - The time unit to be translated
 * @return {String} - The translated time unit
 */
let getFuzzyTimePeriod = (hexo, defaultSettings, language, timeUnit) => {
  let timePeriod;

  try {
    // Try to get the timePeriod from the theme config settings
    timePeriod = hexo.theme.config.readtime.countLangProfile[language].fuzzyTime.time_period[timeUnit];
  } catch (error) {
    try {
      // Try to get the timePeriod from the default settings
      timePeriod = defaultSettings.countLangProfile[language].fuzzyTime.time_period[timeUnit];
    } catch (error) {
      timePeriod = defaultSettings.defaultTime;
    }
  }

  return timePeriod;
}

/**
 * @desc Manage all the process of getting the counts and 
 * readtime of the post, then update the front-matter of 
 * the post with new variables
 * @param {Object} post - The post data
 * @param {Hexo} hexo - Hexo base class
 * @param {JSON} defaultSettings - The "_readTime.json" file
 * @return {Object} - The processed post contains variables 
 * of the counts and readtime
 */
module.exports = (post, hexo, defaultSettings) => {
  if (post.layout != 'post') return post;
  if (!hexo.config.render_drafts && post.source.startsWith("_drafts/")) return post;

  updateThemeSetting(hexo);

  // 1. Get the lang of the post, or the first lang inside 
  // HEXO theme config file, or "en"
  let language = getLanguage(post, hexo);

  // 2. Get the necessary values for the calculation
  let counts = {
    wordCount: getWordCount(post, hexo.theme.config.readtime.fields),
    charCount: getCharCount(post, hexo.theme.config.readtime.fields),
    imgCount: getImgCount(post, hexo.theme.config.readtime.fields),
    readTime: getReadTime(post, hexo, defaultSettings, language),
  }

  // 3. Get default time unit
  let defaultTimeUnit = getDefaultTimeUnit(hexo, defaultSettings);

  // 4. Get the {timeUnit} and the {timeCount}
  let { timeUnit, timeCount } = getFuzzyTimeUnit(counts.readTime, defaultTimeUnit, language);

  // 5. correct the unit text to be suitable in the output
  timeUnit = getFormedUnit(timeCount, timeUnit, language);

  // 6. Get the {about, pattern, timePeriod} from the settings
  let about = getFuzzyAbout(hexo, defaultSettings, language);
  let pattern = getPattern(hexo, defaultSettings, language);
  let timePeriod = getFuzzyTimePeriod(hexo, defaultSettings, language, timeUnit);

  // 7. Pass the {about, count, timePeriod} variables 
  // to the {pattern} text
  counts.readTime = sprintf(pattern, { about: about, count: timeCount, time_period: timePeriod });

  // 8. Update the front-matter data of the post
  Object.assign(post, counts);

  return post;
}