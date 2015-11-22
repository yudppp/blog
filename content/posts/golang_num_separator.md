---
title: golangで数字を三桁ごとでカンマ区切りにする
date: 2015-08-18
excerpt: golangで金額扱うときに三桁ごとにカンマ区切りするあれがめんどくさかったのでメモgolangはstringsパッケージにも文字列の反転がないので極力反転もさせず実装してみました。
---

golangで金額扱うときに三桁ごとにカンマ区切りするあれがめんどくさかったのでメモ

golangはstringsパッケージにも文字列の反転がないので極力反転もさせず実装してみました。

```go
func cast(price uint32) string {

	groupingSize := 3
	groupingSeparator := ","

	priceStr := fmt.Sprint(price)
	size := len(priceStr)
	sliceSize := (len(priceStr) + groupingSize - 1) / groupingSize
	priceSlice := make([]string, sliceSize)

	for i, _ := range priceSlice {
		start := size - (sliceSize-i)*groupingSize
		end := start + groupingSize
		if start < 0 {
			start = 0
		}
		priceSlice[i] = priceStr[start:end]
	}

	return strings.Join(priceSlice, groupingSeparator)
}
```

こんな感じになりました。

jsとかrubyとかだったら一行で書けるだろうに冗長的になってしまった。


[追記]
tjの[go-config](https://github.com/tj/go-config)のcodeを追っていたら[dustin/go-humanize](https://github.com/dustin/go-humanize)というものがでてきて

```go
fmt.Println(humanize.Comma(1234567890))
// output: 1,234,567,890
```
と出力されるようです。

全然知らなかったのですがスターが500以上ついていたので有名なのでしょうか
