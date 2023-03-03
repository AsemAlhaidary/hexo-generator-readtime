# hexo-generator-readtime

A HEXO package that provides analytics on the read time to review the document. Supports 41 languages! Can add or override langProfile defaults.

## Install

``` bash
$ npm install hexo-generator-readtime
```

## Options

*Note: this is completely optional as the plugin already has several languages predefined.*
You can configure this plugin in your root `_config.yml`. 

``` yaml
readtime:
  defaultTime: seconds
  imgReadTime: 12
  langProfile:
    ar:
      name: "Arabic"
      nativeName: "العربية"
      family: "Afro-Asiatic"
      region: ["Middle East", "North Africa"]
      unicodeRange: ["\u0021-\u007E", "\u0600-\u06FF", "\u0750-\u077F", "\u0870-\u089F" "\u08A0-\u08FF", "\uFB50-\uFDFF", "\uFE70-\uFEFF"]
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
      name: "English"
      unicodeRange: ["a-zA-Z0-9"]
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

- **defaultTime** - Time unit used for calculating read time. (***NOTE:*** You can only use one of the plural units from inside `fuzzyTime.time_period` list.) Default is "`auto`."
- **imgReadTime** - Time user may spend watching the image in *seconds*.
- **charPerMin** - Number of characters user could read in one *minute*.
- **wordsPerMin** - Number of **words** user could read in one *minute*.

***NOTE:*** You can add a custom settings for your language by adding the language and your preferred settings like this.

``` yaml
readtime:
  langProfile:
    "my-lang":
      charPerMin: 1500
      wordsPerMin: 300
      fuzzyTime:
        time_period:
          second: sec
          minute: min
```

📝 When `defaultTime` is set to "`auto`," it will calculate the fuzzy time based on the least "count" time for `fuzzyTime.time_period`. Example: 590sec becomes "about 6 minutes".

## List of supported languages

| Language | [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) code |
| --- | --- |
| Arabic | ar |
| Bengali | bn |
| German | de |
| **English** | en |
| Spanish | es |
| Persian (Farsi) | fa |
| Finnish | fi |
| French | fr |
| Gujarati | gu |
| Hebrew | he |
| Hindi | hi |
| Italian | it |
| Jin | jin |
| Japanese | jp |
| Javanese | jv |
| Korean | kr |
| Nederlands | nl |
| Punjabi | pa |
| Polish | pl |
| Pashto | ps |
| Portuguese | pt |
| Southern Min (Hokkien, Teochew) | nan |
| Marathi | mr |
| Russian | ru |
| Slovenian | sl |
| Swedish | sv |
| Tamil | ta |
| Telugu | te |
| Thai | th |
| Turkish | tr |
| Vietnamese | vi |
| Urdu | ur |
| Yue Chinese | yue |
| Chinese (Mandarin) | zh-CN |
| Chinese (Simplified) | zh-Hans |
| Chinese (Traditional) | zh-Hant |
| Chinese (Hong Kong) | zh-HK |
| Chinese (Cantonese, Macau) | zh-MO |
| Chinese (Mandarin) | zh-SG |
| Chinese (Taiwan) | zh-TW |

## Sponsor
I have created and used this package in my sponsor's [Blog](https://blog.richiebartlett.com/), you can find him at his [Website](https://blog.richiebartlett.com/), also [Github](https://github.com/lorezyra)