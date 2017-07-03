---
title: 外部のAPI叩くときの話
date: 2017-07-03
tags: ["slide"]
excerpt: yudppp
---

<script layout="title" type="text/x-markdown">
golang.tokyo #7 LT

2017/07/03
</script>

<script layout="title" type="text/x-markdown">
## 外部のAPI叩くときの話

yudppp

</script>

<template layout type="text/x-markdown">
早速ですが,私は久留米の天気をどうしても知りたい。
</template>

<template layout type="text/x-markdown">
旅行で今日から三日行くので,今日/明日/明後日の最低気温と最高気温が知りたい。
</template>

<template layout type="text/x-markdown">
こんなことはよくあるかと思います。
</template>

<template layout type="text/x-markdown">
どこかに落ちている[お天気API](http://weather.livedoor.com/weather_hacks/webservice)を叩きましょう。
</template>

<script layout="code" type="text/x-markdown">
```golang
package main

import (
	"fmt"
	"io/ioutil"
	"net/http"
)

const targetURL = "http://weather.livedoor.com/forecast/webservice/json/v1?city=400040"

func main() {
	resp, _ := http.Get(targetURL)
	defer resp.Body.Close()
	// この後どうしますか
}
```
</script>

<template layout="bullets" type="text/x-markdown">
1. interface{}で頑張る
2. structの定義を書く
3. [jsonq](https://github.com/jmoiron/jsonq)のようなものを使う
</template>

<template layout type="text/x-markdown">
### 1. interface{}で頑張る

interfaceでやるのはGoぽくないし。可読性悪いしなんか面倒くさい。
</template>

<template layout type="text/x-markdown">
### 2. structの定義を書く

structを指定してやるのが個人的には一番だと思うが書くのがただただ面倒くさい
</template>

<template layout type="text/x-markdown">
### 3. [jsonq](https://github.com/jmoiron/jsonq)のようなものを使う

JSONの形式決まっているのであればわざわざ使わなくても。またよく分からないパッケージをコードに入れたくない。使うなら一回コードの内部確認したいが面倒くさい。
</template>

<template layout type="text/x-markdown">
どうしよう
</template>

<template layout type="text/x-markdown">
全部面倒くさい
</template>


<template layout type="text/x-markdown">
面倒くさいことは自動化しましょう
</template>

<template layout type="text/x-markdown">
JSONをGoのstructに変形するものを作りました。
</template>

<template layout type="text/x-markdown">
```
$ go get github.com/yudppp/json2struct/cmd/json2struct
```
</template>

<template layout type="text/x-markdown">
```
$ http http://weather.livedoor.com/forecast/webservice/json/v1?city=400040 | json2struct -name weather -suffix response
```
</template>

<template layout type="text/x-markdown">
[playground](https://yudppp.github.io/json2struct/)もあります。

GopherJSで作りました。
</template>


<template layout type="text/x-markdown">
自動でstructの定義を出してくれる。
後はコピペして良い感じに使うだけ
</template>

<template layout type="text/x-markdown">
## 工夫したところ

- 低レベルな型推論
- Categories: [] → Category
- image_url → ImageURL
</template>


<template layout type="text/x-markdown">
## 使いどころ

- 先にJSONの形式が決まっていた場合に
- 外部のAPIと連携する際に
</template>

<script layout="code" type="text/x-markdown">
```golang
package main

import "github.com/yudppp/structs"

type User struct {
    Name string `example:"ichiro" default:"suzuki"`
}

func main() {
    user := structs.NewExample(User{}).(User)
    fmt.Println(user.Name) # -> ichiro
    user = structs.NewDefault(User{}).(User)
    fmt.Println(user.Name) # -> suzuki
}
```
</script>

<template layout type="text/x-markdown">
## WIP

- 絶賛リファクタリング中なのでCLIのインターフェースは変えないが中身が雑すぎて恥ずかしいので絶対に見ないでほしい。
- 欲しい機能やバグ等あればissueかTwitterにでも連絡ください。
- GopherJSでplaygroundのCSSも雑なので修正したい。クリップボードにコピーするやつやりたい。
</template>
