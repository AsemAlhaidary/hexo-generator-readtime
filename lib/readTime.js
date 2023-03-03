'use strict';

const { sprintf } = require("sprintf-js");

/**
 * @author Richie Bartlett (Rich @ RichieBartlett.com)
 * @version 1.0.0
 * @class readTime
 * @classdesc parses hexo `post.content` and provides analytics on the read time to review the document.
 * * supports UTF-8 characters - includes Arabic, Chinese, Japanese, Korean, and Vietnamese
 * 
 * @example
 * let readTime = (new readTime(langProfile, post.content)).calculate(); //fuzzy time string
 * 
 * @example
```js
let post = {content: "柏泰感切独台団碁度似難札精終南立愛配日容。島切負返検上孟彩密携終第連校価権戦。導防学覧相薦東基士口載契。横乗属産家載法結蘇支徴開幌夜。"};
let langProfile = {
      "name": "Chinese (Taiwan)",
      "nativeName": "中文 (繁體中文)",
      "family": "Sino-Tibetan",
      "region": ["Taiwan"],
      "unicodeRange": ["\u0021-\u007E", "\u0021-\u007E", "\u4E00-\u9FFF"],
      "charPerMin": 255,
      "wordsPerMin": 158,
      "fuzzyTime": {
        "pattern": "%(approx)s%(count)d%(time_period)s",
        "approx": "約",
        "time_period": {
          "second": "秒",
          "seconds": "秒",
          "minute": "分鐘",
          "minutes": "分鐘",
          "hour": "小時",
          "hours": "小時",
          "day": "日",
          "days": "日",
          "month": "月",
          "months": "月",
          "year": "年",
          "years": "年"
        }
      }
    };



const rtObj = new readTime(langProfile, post.content, {defaultTime: "minutes"});
let rtString = rtObj.calculate();
let rtWordCount = rtObj.wordCount;
let rtCharCount = rtObj.charCount;
let rtImgCount = rtObj.imgCount;

console.log(`rtString: ${rtString}`);
```
 */
class readTime {

    /**
     * @property {number} wordCount
     * @description total count of words in document
     */
    wordCount = 0;

    /**
     * @property {number} charCount
     * @description total (UTF-8) characters count in document
     */
    charCount = 0;

    /**
     * @property {number} imgCount
     * @description number of <img> <image> tags found in document
     */
    imgCount = 0;

    /**
     * @property {number} time
     * @description estimated time to read the document in seconds
     */
    time = 1;

    /**
     * @property {string} fuzzyTime
     * @description string in given langProfile for estimated time to read the document
     */
    fuzzyTime = "";

    /**
     * @property {string} timeUnit
     * @description selected time unit from `this.langProfile.fuzzytime.time_period` to estimate reading time
     */
    timeUnit = "auto";

    /**
     * @property {string} text
     * @description HTML string to process
     * @private
     */
    text = "";

    /**
     * @property {regexp} _whitespace
     * @description Unicode whitespace definition for regular expression. Includes tabs, newlines, and uncommon whitespace characters (even within word boundries) across all documented glyphs.
     * @private
     */
    _whitespace = /\b[\f\n\r\t\v\u00a0\u1680\u180e\u2000-\u200a\u2028\u2029\u202f\u205f\u3000\ufeff]\b/;

    /**
     * @property {object} langProfile
     * @description profile of the language to build metrics. Default is English.
     * @private
     */
    langProfile = {
        /**
         * @property {number} name
         * @description language name as written natively in its language
         */
        name: "English",
        /**
         * @property {array} unicodeRange
         * @description UTF-8 codes that define the range of characters used in the language
         */
        unicodeRange: ["\u0021-\u007E", "\u00A1-\u024F", "\u2C60-\u2C7F"],
        /**
         * @property {number} charPerMin
         * @description characters per minute, on average, the typical reader can process
         */
        charPerMin: 987,
        /**
         * @property {number} wordsPerMin
         * @description words per minute, on average, the typical reader can process
         */
        wordsPerMin: 228,
        /**
         * @property {object} fuzzyTime
         * @description properties for making human readable text for given read time
         */
        fuzzyTime: {
            /**
             * @property {string} pattern
             * @description defines how to print the human readable time; requires `sprintf()` string pattern
             */
            pattern: "%(about)s %(count)d %(time_period)s",
            /**
             * @property {string} approx
             * @description text for the word "about"
             */
            approx: "About",
            /**
             * @property {object} time_period
             * @description properties for words that define units of time in language
             */
            time_period: {
                second: "second",
                seconds: "seconds",
                minute: "minute",
                minutes: "minutes",
                hour: "hour",
                hours: "hours",
                day: "day",
                days: "days",
                month: "month",
                months: "months",
                year: "year",
                years: "years"
            }
        }
    };

    /**
     * @property {object} option
     * @description options for output
     * @private
     */
    option = {
        /**
         * @property defaultTime
         * @description option to reference langProfile timeUnit for estimated time to read the document; 
         *      Can be set to any of the `this.langProfile.fuzzytime.time_period` properties.
         *      Setting this to `auto` enables human readable output string
         */
        defaultTime: "auto",

        /**
         * @property {number} imgReadTime
         * @description Assumed average time, in seconds, for reader to review the first image.
         */
        imgReadTime: 12
    };



    /**
     * constructor
     *
     * @param {object} _langProfile imported profile data from ../Settings/ folder
     * @param {string} _text post.content data from HEXO
     * @param {object} _option override options from ../Settings/ folder
     */
    constructor(_langProfile, _text, _option) {

        this.text = _text;

        if (typeof (_langProfile) == "object" && _langProfile != null) this.langProfile = _langProfile;

        if (typeof (_option) == "object" && _option != null) {

            this.option = Object.assign(this.option, _option);
        }

        this.imgCounter();

        this.filterHTML();

        this.countCharacters();

        this.countWords();
    }

    /**
     * @function countCharacters
     * @desc Counts the number of UTF-8 characters in the post content
     * @private
     */
    countCharacters() {

        let cjkvRE = new RegExp("[" + this.langProfile.unicodeRange.join('') + "]", "ug");
        let cjkvMatches = this.text.match(cjkvRE) || [];
        this.charCount = this.text.length - cjkvMatches.length;
    }

    /**
     * @function countWords
     * @desc Counts the number of words in `text`
     * Note: supports UTF-8
     * @private
     */
    countWords() {

        // Matches word boundaries while excluding tabs, newlines, and uncommon whitespace characters.
        const wordRegex = /\b\S+\b/g;
        const matchedWords = this.text.trim().match(wordRegex);
        this.wordCount = matchedWords ? matchedWords.length : 0;
    }

    /**
     * @function countWhitespace
     * @desc Counts the number of words in `text`
     * Note: supports UTF-8
     * @return {number} - the whitespace count
     * @public
     */
    countWhitespace() {

        let wsArray = this.text.trim().match(this._whitespace);
        return (wsArray ? wsArray.length : 0);
    }

    /**
     * @function imgCounter
     * @desc count number of image tags in the HTML and markdown text
     * @private
     */
    imgCounter() {

        // Regex pattern to find <img> and <image> tags
        const imgRegex = /<img[^>]+>|<image[^>]+>|!\[(.*?)\]\((.*?)\)/gi;
        const imgMatches = this.text.match(imgRegex);

        // If there are images found, update the imgCount property
        if (imgMatches) {
            this.imgCount = imgMatches.length;
        }
    }

    /**
     * @function imgTime
     * @description counts the number of images in the document and calculates the estimated read time for the images. Assumes that images are evenly spaced throughout the document.
     * @returns {number} - the estimated read time for the images in seconds
     */
    imgTime() {

        let seconds = 0;

        if (this.imgCount > 0) {
            if (this.imgCount > 10) {
                seconds = ((this.imgCount / 2) * (this.option.imgReadTime + 3)) + (this.imgCount - 10) * 3; // n/2(a+b) + 3 sec/image
            } else {
                seconds = (this.imgCount / 2) * (2 * this.option.imgReadTime + (1 - this.imgCount)); // n/2[2a+(n-1)d]
            }
            // ensure a minimum of 3 seconds per image
            seconds = Math.max(seconds, this.imgCount * 3);
        }
        return seconds;
    }

    /**
     * @function filterHTML
     * @desc Filters out the HTML tags from `this.text`
     * @private
     */
    filterHTML() {

        this.text.replace(/(<([^>]+)>)/gi, "");
    }

    /**
     * @function getPluralStr
     * @desc Get the correct form of the unit (singular/plural) 
     * in different languages based on the given number
     * @private
     */
    getPluralStr() {

        let isPlural = this.timeUnit[this.timeUnit.length - 1] == 's';

        // Make it plural as default
        if (!isPlural && this.timeUnit != 'auto') this.timeUnit += 's'; // plural

        if (this.langProfile.name == "Arabic") {
            // In arabic, use plural form only with numbers [2-10]
            if (this.time > 10) {
                this.timeUnit = this.timeUnit.slice(0, this.timeUnit.length - 1); // singlular
            }
        }

        if (this.time < 2) {
            this.timeUnit = this.timeUnit.slice(0, this.timeUnit.length - 1); // singlular
        }
    }

    /**
     * @function getAutoFuzzyTime
     * @private
     * @desc Calculate the fuzzy time based on the least "count" time for the {this.time}. Ex, 90sec becomes "almost 1min"
     * @return {Object} { timeUnit: String, timeCount: Number }
     */
    getAutoFuzzyTime() {

        let prevTU = "seconds",
            timeUnit = {
                "seconds": 1, // base unit
                "minutes": 60,
                "hours": 3600, // 60*60,
                "days": 86400, // 60*60*24
                "months": 2592000, // 60*60*24*30
                "years": 31557600, // 60*60*24*365.25
            };

        for (let tu in timeUnit) {
            // Find the lowest {timeUnit} that would 
            // make the {timeCount} greater than 1.
            if (this.time >= timeUnit[tu]) {
                prevTU = tu;

                // Don't skip the rest of the code if the {timeCount} 
                // could be calculated by the "years".
                if (tu != 'years') continue;
            }

            // Calculate the time after finding the suitable timeUnit
            this.time = this.time / timeUnit[prevTU];
            this.timeUnit = prevTU;
            break;
        }

    }

    /**
     * @function getUnitTime
     * @desc Calculate the time based on the given `this.option.defaultTime`
     * @private
     */
    getUnitTime() {
        let divisor = 12; // months per year

        switch (this.option.defaultTime) {
            case 'year', 'years':
                this.time /= divisor;
            case 'month', 'months':
                divisor = 30;
                this.time /= divisor;
            case 'day', 'days':
                divisor = 24;
                this.time /= divisor;
            case 'hour', 'hours':
                divisor = 60;
                this.time /= divisor;
            case 'minute', 'minutes':
                divisor = 60;
                this.time /= divisor;
            default: //seconds
                break;
        }
    }

    /**
     * @function calculate
     * @public
     * @description builds the analytic metrics
     * @returns {string} readTime
     */
    calculate() {

        // add word (in minutes) and img times (in seconds)
        this.time = Math.round((this.wordCount * 60 / this.langProfile.wordsPerMin) + this.imgTime());

        // make human readable?
        if (this.option.defaultTime == "auto") {
            this.getAutoFuzzyTime();
        } else {
            this.getUnitTime();
        }

        // get the correct time_period string per language
        this.getPluralStr();

        // build string pattern
        this.fuzzyTime = sprintf(this.langProfile.fuzzyTime.pattern, {
            approx: this.langProfile.fuzzyTime.approx,
            count: this.time,
            time_period: this.langProfile.fuzzyTime.time_period[this.timeUnit]
        });

        return this.fuzzyTime;
    }

}

module.exports = readTime;