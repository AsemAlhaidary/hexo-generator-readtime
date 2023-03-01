'use strict';

/**
 * @author Richie Bartlett (Rich@RichieBartlett.com)
 * @version 1.0.0
 * @class readTime
 * @classdesc parses hexo `post.content` and provides analytics on the read time to review the document.
 * * supports UTF-8 characters - includes Arabic, Chinese, Japanese, Korean, and Vietnamese
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
     * @description estimated time to read the document
     */
    time = 0;

    /**
     * @property {string} text
     * @description HTML string to process
     */
    text = "";

    /**
     * @property {object} rE
     * @description regular expression representing the UTF-8 language profile
     */
    rE = "";

    /**
     * @property {object} langProfile
     * @description profile of the language to build metrics. Defaults to English.
     */
    langProfile = {
        "unicodeRange": ["\u0021-\u007E", "\u00A1-\u024F", "\u2C60-\u2C7F", "\uA720-\uA7FF"],
        "charPerMin": 987,
        "wordsPerMin": 228,
        "fuzzyTime": {
            "pattern": "%(about)s %(count)d %(time_period)s",
            "about": "About",
            "time_period": {
                "second": "second",
                "seconds": "seconds",
                "minute": "minute",
                "minutes": "minutes",
                "hour": "hour",
                "hours": "hours",
                "day": "day",
                "days": "days",
                "month": "month",
                "months": "months",
                "year": "year",
                "years": "years"
            }
        }
    };



    /**
     * constructor
     *
     * @param {object} langProfile imported profile data from ../Settings/ folder
     * @param {string} lang default language to process the read times.
     */
    constructor(langProfile, text) {
        this.text = text;

        if (typeof(langProfile) == "object" && langProfile != null) this.langProfile = langProfile;

        //TODO: build regEx
        // rE = langProfile.unicodeRange.join('|');

        //this.calculate();
    }

    /**
     * @function countCharacters
     * @desc Counts the number of UTF-8 characters in the post content
     * @return {number} - the character count
     */
    countCharacters() {
        const cjkvRE = new RegExp(this.rE, "ug");
        const cjkvMatches = this.text.match(cjkvRE) || [];
        return this.text.length - cjkvMatches.length;
    }

    /**
     * @function countWords
     * @desc Counts the number of words in the post content
     * ! only supports basic ASCII text upto \u00FF...
     * * TODO: add UTF-8 support
     * @return {number} - the word count
     */
    countWords() {
        const wordArray = this.text.match(/\b\S+\b/g);
        return wordArray ? wordArray.length : 0;
    }

    /**
     * @function imgCounter
     * @desc count number of image tags in the HTML
     * @return {null}
     */
    imgCounter() {
        // Regex pattern to find <img> and <image> tags
        const imgRegex = /<img[^>]+>|<image[^>]+>/gi;
        const imgMatches = this.text.match(imgRegex);

        // If there are images found, update the imgCount property
        if (imgMatches) {
            this.imgCount = imgMatches.length;
        }
    }

    /**
     * @function imgTime
     * @description counts the number of images in the document and calculates the estimated read time for the images
     * @returns {number} - the estimated read time for the images in seconds
     */
    imgTime() {

        // calculate the estimated read time for images using the formula
        const customImageTime = this.langProfile.imageReadTime || 12;
        let seconds = 0;

        if (this.imgCount > 10) {
            seconds = ((this.imgCount / 2) * (customImageTime + 3)) + (this.imgCount - 10) * 3; // n/2(a+b) + 3 sec/image
        } else {
            seconds = (this.imgCount / 2) * (2 * customImageTime + (1 - this.imgCount)); // n/2[2a+(n-1)d]
        }
        // ensure a minimum of 3 seconds per image
        seconds = Math.max(seconds, this.imgCount * 3);
        return seconds;
    }

    /**
     * @function filterHTML
     * @desc Filters out the HTML tags from this.text
     */
    filterHTML() {
        this.text.replace(/(<([^>]+)>)/gi, "");
    }

    /**
     * @function calculate
     * @description builds the analytic metrics
     * @returns {object} - 
     */
    calculate() {

        this.imgCounter();

        this.filterHTML();

        this.countCharacters();

        this.countWords();
    
        //TODO: let iT = this.imgTime();

        //TODO: add word and img counts

        //TODO: build string pattern

        //TODO: build return object

        return {};
    }

}

module.exports = readTime;