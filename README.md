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
  fields: ['content']
  humanReadable: true
  defaultTime: seconds
  imgReadTime: 12
  countLangProfile:
    ar:
      charPerMin: 612
      wordsPerMin: 138
      fuzzyTime:
        pattern: {time_period} %d {about}
        about: حوالي
        time_period:
          second: ثانية
          seconds: ثواني
          minute: دقيقة
          minutes: دقائق
          hour: ساعة
          hours: ساعات
          day: يوم
          days: أيام
          month: شهر
          months: شهور
          year: سنة
          years: سنوات
    en:
      charPerMin: 987
      wordsPerMin: 228
      fuzzyTime:
        pattern: {about} %d {time_period}
        about: About
        time_period:
          second: second
          seconds: seconds
          minute: minute
          minutes: minutes
          hour: hour
          hours: hours
          day: day
          days: days
          month: month
          months: months
          year: year
          years: years
    jp:
      charPerMin: 357
      wordsPerMin: 193
    zh:
      charPerMin: 255
      wordsPerMin: 158
```

- **fields** - Any variable contains text in your front-matter to count its words, `(DEFAULT: content)`.
- **humanReadable** - The result will be easy to read.
- **defaultTime** - The time unit that will be used for the calculation. (***NOTE:*** You can only use one of the plural units form inside `fuzzyTime.time_period` list.)
- **imgReadTime** - The time user might spend watching the image in *seconds*.
- **charPerMin** - The time user might spend reading a character in *seconds*.
- **wordsPerMin** - The time user might spend reading a word in *seconds*.

***NOTE:*** You can add a custom settings for your language by adding the language and your preferred settings like this.

``` yaml
readtime:
  countLangProfile:
    it:
      charPerMin: 950
      wordsPerMin: 188
      fuzzyTime:
        time_period:
          second: secondo
          minute: minuto
```

## Sponsor
I have created and used this package in my sponsor's [Blog](https://blog.richiebartlett.com/), you can find him at his [Website](https://richiebartlett.com/), also [Github](https://github.com/lorezyra)