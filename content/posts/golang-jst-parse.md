---
title: 【golang】JSTの時間をうまくParseする
date: 2015-06-08
excerpt: golangでJSTの時間の文字列を変換するときに困ったのでTipsとして残しておきます。
---

golangでJSTの時間の文字列を変換するときに困ったのでTipsとして残しておきます。

`2015-06-08 15:04:05 +0900`のように`+0900`とついていた場合`2006-01-02 15:04:05 -0700`をformatとしてParseすればうまくいきます

```golang
package main

import "fmt"
import "time"

func main() {
	target := `2015-06-08 15:04:05 +0900`
	t, _ := time.Parse(`2006-01-02 15:04:05 -0700`, target)
	fmt.Println(t.UTC())
}
```

上記は普通に指定すればできました。

問題はJSTで`2015-06-08 15:04:05`という値をParseしたい場合です。
色々実装をみてみたところ

```golang
package main

import "fmt"
import "time"

func main() {
	target := `2015-06-08 15:04:05`
    loc, _ := time.LoadLocation("Asia/Tokyo")
	t, _ := time.ParseInLocation (`2006-01-02 15:04:05`, target, loc)
	fmt.Println(t.UTC())
}
```

`time#ParseInLocation`でlocationを指定してParseできるようでした。

あやうくParseしたい文字列に`+0900`の文字列追加したり、`time.Date(t.Year(),...,loc)`のようにするところでした。
