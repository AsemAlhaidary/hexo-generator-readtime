# hexo-generator-readtime

HEXO package that provides analytics on the read time to review the post. *Supports 41 languages!* Can add or override langProfile defaults.

## Install

``` bash
$ npm install hexo-generator-readtime
```

📝 When `defaultTime` is set to "`auto`," it will calculate the fuzzy time based on the least "count" time for `fuzzyTime.time_period`. Example: 590sec becomes "about 6 minutes".
If you define `defaultTime` as "seconds", "minutes", etc., the time returned is more precise whereas "auto" will provide a very rough estimation.


## How to use

After you have installed this plugin, it will run anytime you run `hexo server` or `hexo generate`. 

readTime will read the `lang` value in your front-matter to select the correct language profile. If this value is missing, it will attempt to read the `_config.yml` setting. If both of these are missing, then it will default to `en` (English).

It updates the front-matter of your posts to include the analytics data. The following parameters are added:

- readTime
- imgCount
- vidCount
- wordCount
- charCount

👉🏻 Note that it only reads the posts from the `/source/_posts/` folder. You can reference these values in your EJS template files from the object `post`. For example: `<%= post.readTime %>`. This plugin updates both in-memory `post` object and the markdown file.

## Parameter definitions

Below are the definitions for each parameter and expected values.

```yml
readtime: ## plugin config. Only define this if you need to override the built-in settings.
  defaultTime: auto ## Time unit used for calculating read time. Options: auto | seconds | minutes | days | months | years
  imgReadTime: 12 ## Time user may spend watching an image in *seconds*.
  langProfile: ## profile of the language
    "{your lang}": ## ISO-639-1 string is expected here. However, you can specify your custom language code here.
      name: "My Lang" ## name of your custom language as written in English
      nativeName: "myLanguage" ## name of your custom language as written in the language's native text
      family: "Earth-Moon" ## origins of the language.
      region: ["Earth", "Moon"] ## regions where this language is used
      unicodeRange: ["\u0021-\u007E"] ## array of unicode values that represent the language's native text
      charPerMin: 999 ## Number of characters user could read in one *minute*
      wordsPerMin: 333 ## Number of **words** user could read in one *minute*
      fuzzyTime: ## string object for representations of how time units are written 
        pattern: %(time_period)s %(count)d%(approx)s ## sprintf() string pattern for how to write the text
        approx: apx ## text to represent approximate time as a word. If no such word exist, use `""` a closed string as the value
        time_period: ## string object to define how each time unit is written in the language's native text
          second: sec
          seconds: secs
          minute: min
          minutes: mins
          hour: h
          hours: h
          day: d
          days: d
          month: m
          months: m
          year: y
          years: y

```

## Options

*Note: this is completely **optional** as the plugin already has several languages predefined.*
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
        pattern: %(time_period)s %(count)d %(approx)s
        approx: حوالي
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
        pattern: %(approx)s %(count)d %(time_period)s
        approx: About
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

## Custom Language

You can add a custom language in your root `_config.yml` file.

``` yaml
readtime:
  langProfile:
    "my-lang":
      charPerMin: 1500
      wordsPerMin: 300
      fuzzyTime:
        pattern: %(approx)s %(count)d%(time_period)s
        approx: appx
        time_period:
          second: sec
          minute: min
```

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
| Chinese (Singapore) | zh-SG |
| Chinese (Taiwan) | zh-TW |

## Sponsor
This package is sponsored by [LoreZyra](https://blog.richiebartlett.com/), you can find him at his [Website](https://richiebartlett.com/), also [Github](https://github.com/lorezyra)
