[![NPM version](https://badge.fury.io/js/hexo.svg)](https://www.npmjs.com/package/hexo)
![Required Node version](https://img.shields.io/node/v/hexo)
[![GitHub Stars](https://img.shields.io/github/stars/AsemAlhaidary/hexo-generator-readtime?style=for-the-badge&color=0e83cd&logo=github) [![GitHub Forks](https://img.shields.io/github/forks/AsemAlhaidary/hexo-generator-readtime?style=for-the-badge&color=0e83cd&logo=github)](https://github.com/AsemAlhaidary/hexo-generator-readtime) [![npm stats](https://img.shields.io/npm/dm/hexo-generator-readtime?style=for-the-badge&color=0e83cd&label=npm%20downloads&logo=npm)](https://www.npmjs.com/package/hexo-generator-readtime)

# hexo-generator-readtime

[HEXO](https://github.com/hexojs/hexo) package that provides analytics on the read time to review the post. *Supports 42 languages!* Can add or override langProfile defaults.

## Install

``` bash
$ npm install hexo-generator-readtime
```

📝 When `defaultTime` is set to "`auto`," it will calculate the fuzzy time based on the least "count" time for `fuzzyTime.time_period`. Example: 578sec becomes "about 10 minutes".
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
  vidReadTime: 60 ## Time user may spend watching a video in *seconds*.
  langProfile: ## profile of the language
    "{your lang}": ## ISO-639-1 string is expected here. However, you can specify your custom language code here.
      name: "My Lang" ## name of your custom language as written in English
      nativeName: "myLanguage" ## name of your custom language as written in the language's native text
      family: "Earth-Moon" ## origins of the language.
      region: ["Earth", "Moon"] ## regions where this language is used
      unicodeRange: ["\u0021-\u007E"] ## array of unicode values that represent the language's native text. See https://www.unicode.org/charts/
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
You can configure plugin overrides in your root `_config.yml`. For example:

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
        approx: "About"
        time_period:
          second: "second"
          seconds: "seconds"
          minute: "minute"
          minutes: "minutes"
          hour: "hour"
          hours: "hours"
          day: "day"
          days: "days"
          month: "month"
          months: "months"
          year: "year"
          years: "years"
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
        approx: "appx"
        time_period:
          second: "sec"
          minute: "min"
```

## List of supported languages

| Language | native text | [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) code |
| --- | --- | --- |
| Arabic | العربية | ar |
| Bengali | বাংলা | bn |
| German | Deutsch | de |
| **English** | English | en |
| Spanish | Español | es |
| Persian (Farsi) | فارسی | fa |
| Finnish | suomi | fi |
| French | Français | fr |
| Gujarati | ગુજરાતી | gu |
| Hebrew | עִבְרִית | he |
| Hindi | हिन्दी | hi |
| Italian | Italiano | it |
| Jin | 晋语 | jin |
| Japanese | 日本語 | ja |
| Javanese | Basa Jawa | jv |
| Korean | 한국어 | kr |
| Dutch | Nederlands | nl |
| Punjabi | ਪੰਜਾਬੀ | pa |
| Polish | polski | pl |
| Pashto | پښتو | ps |
| Portuguese | Português | pt |
| Southern Min (Hokkien, Teochew) | 閩南語 (福建話, 潮州話) | nan |
| Norwegian Norsk | Bokmål | nb |
| Norwegian Nynorsk | nynorsk | nn |
| Marathi | मराठी | mr |
| Russian | Русский | ru |
| Slovenian | slovenščina | sl |
| Swedish | Svenska | sv |
| Tamil | தமிழ் | ta |
| Telugu | తెలుగు | te |
| Thai | ไทย | th |
| Turkish | Türkçe | tr |
| Vietnamese | Tiếng Việt | vi |
| Urdu | اردو | ur |
| Yue Chinese | 粤语 | yue |
| Wu (including Shanghainese) | 吴语 (含上海话) | wuu |
| Chinese (Mandarin) | 中文 (普通话) | zh-CN |
| Chinese (Simplified) | 中文 (简体) | zh-Hans |
| Chinese (Traditional) | 中文 (繁體) | zh-Hant |
| Chinese (Hong Kong) | 中文 (香港) | zh-HK |
| Chinese (Cantonese, Macau) | 中文 (廣東話, 澳門) | zh-MO |
| Chinese (Singapore) | 中文 (普通话) | zh-SG |
| Chinese (Taiwan) | 中文 (繁體中文) | zh-TW |

## Don't see your language here?

Please submit an issue to [request your language](https://github.com/AsemAlhaidary/hexo-generator-readtime/issues/new/choose) to be added. It helps if you can suggest the profile details too. Otherwise, I need to research it and that can take time.

## Sponsor

This package is sponsored by [LoreZyra](https://blog.richiebartlett.com/), you can find him at his [Website](https://richiebartlett.com/), also [Github](https://github.com/lorezyra)

![LoreZyra](https://2022.blog.richiebartlett.com/img/logoImage.svg)
