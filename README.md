# hexo-generator-readtime
A HEXO package that counts the number of words, number of charchters, number of images, and expect the read time of the post.

## Install

``` bash
$ npm install hexo-generator-readtime
```

## Options

You can configure this plugin in your root `_config.yml`.

``` yaml
readtime:
  wordCount:
    fields: [content] 
    wordsPerMinute: 15
  charCount:
    fields: [content]
  imgCount:
    fields: [content]
    imgsPerMinute: 4
```

- **wordCount** - settings for words counting.
  - **fields** - Any variable contains text in your front-matter to count its words, `(DEFAULT: content)`.
  - **wordsPerMinute** - The expected words the user can read per minute.
- **charCount** - settings for characters counting.
  - **fields** - Any variable contains text in your front-matter to count its characters, `(DEFAULT: content)`.
- **imgCount** - settings for images counting.
  - **fields** - Any variable contains text in your front-matter to count its images, `(DEFAULT: content)`.
  - **imgsPerMinute** - The expected images the user can see per minute.
  

## Sponsor
I have created and used this package in my sponsor's [Blog](https://blog.richiebartlett.com/), you can find him at his [Website](https://richiebartlett.com/), also [Github](https://github.com/lorezyra)