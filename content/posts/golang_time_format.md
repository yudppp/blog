---
date: 2016-12-06T00:00:00+09:00
title: Go言語の忘れがちなtime fomatの話
tags: ["golang"]
---

この記事は[Go Advent Calendar 2016 - Qiita](http://qiita.com/advent-calendar/2016/go)の7日目の記事です。
[apex](https://github.com/apex/apex)の話でもしようと思ったのですが時間がなく別の記事を書くことにしました。


Golangを仕事で書き始めて、もう丸2年になりますが、未だに必要になると毎回ググって調べてから利用するものがあります。
その一つが`time`パッケージのフォーマットです。
Golangではいわゆる`YYYYMMDD`のような形式ではなく`20060102`といった特定の日時をベースにした文字列で表す必要があります。

123の順で振られていること、2006年なこと等なんとなくは覚えてきているのですが、確認をしないと不安で仕方なくなります。

この2年間で最低でも10回以上は`golang time format`でググり、その度にmattnさんの[記事](http://mattn.kaoriya.net/software/lang/go/20130620173712.html)に辿り着いていました。
同じ記事を何度も見るのは自分に負けた気になるので悲しいです。

Golangの本家の実装を見るとわかるのですが[time/format.go](https://golang.org/src/time/format.go)の130行目あたりの`nextStdChunk`という関数でパースをしています。

これを基に判別表を作成しました。

| format | about |
|:-----------|:------------|
| January    | Month(long) |
| Jan        | Month(short)|
| 1          | Month Number       |
| 01         | Month Number(zero埋め) |
| Monday     | WeekDay(long)|
| Mon        | WeekDay(short)|
| 2          | Day         |
| _2         | Day(space埋め)|
| 02         | Day(zero埋め)|
| 15         | Hour(24h)   |
| 3          | Hour(12h)   |
| 03         | Hour(12h,zero埋め)|
| 4          | Minute      |
| 04         | Minute(zero埋め)|
| 5          | Second      |
| 05         | Second(zero埋め)|
| 2006       | Year(long)  |
| 06         | Year(short) |
| PM         | AM or PM    |
| pm         | am or pm    |
| MST        | TimeZone    |
| Z0700      | ISO8601TZ   |
| Z070000    | ISO8601TZ(seconds)|
| Z07        | ISO8601TZ(short)|
| Z07:00     | ISO8601TZ(colon)|
| Z07:00:00  | ISO8601TZ(seconds/colon)|
| -0700      | NumTimeZone   |
| -070000    | NumTimeZone(seconds)|
| -07        | NumTimeZone(short)|
| -07:00     | NumTimeZone(colon)|
| -07:00:00  | NumTimeZone(seconds/colon)|
| .0, .00, .000, ...| FracSecond(trailing zeros included)|
| .9, .99, .999, ...| FracSecond(trailing zeros omitted)|


またさっとYYYYMMDDで書いた時ものを置換したりしたいので、その場合のための簡単な[ツール](https://github.com/yudppp/gotimefmt)を作成しました。

```sh
$ go get github.com/yudppp/gotimefmt/cmd/gotimefmt
$ gotimefmt YYYYMMDD
------------------------------------
format: 20060102
now:    20161206
------------------------------------
```

のようにさっとFormatと現在時間を出力されるようにしました。

timeのformatに悩まされずに済むようになりたいです。