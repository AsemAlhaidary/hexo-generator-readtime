'use strict';

/**
 * @author Richie Bartlett
 * @version 1.0.0
 * @class readTime
 * @classdesc parses hexo `post.content` and provides analytics on the read time to review the document.
 * * supports UTF-8 characters - includes Chinese, Japanese, Korean, and Vietnamese
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
     * @property {object} langProfile
     * @description estimated time to read the document
     */
    langProfile = {};

    /**
     * @property {string} text
     * @description HTML string to process read time
     */
    text = "";

    /**
     * @property {object} rE
     * @description regular expression representing the Japanese, Chinese, Korean, and English characters (UTF-8)
     //TODO: consolidate from langProfile.unicodeRange
    */
    rE = {};



    /**
     * constructor
     *
     * @param {object} langProfile imported profile data from ../Settings/ folder
     * @param {string} lang default language to process the read times.
     */
    constructor(langProfile, text) {
        this.langProfile = langProfile;
        this.text = text;
    }

    /**
     * @function extractText
     * @desc Filters out the HTML tags from the string
     * @param {Object} string - The post data
     * @return {string} - processed post contents
     */
    extractText(string) {

    }

    /**
     * @function countImages
     * @desc count number of image tags in the HTML
     * @param {Object} string - The post data
     * @return {string} - processed post contents
     */
    countImages() {

    }


}

module.exports = readTime;