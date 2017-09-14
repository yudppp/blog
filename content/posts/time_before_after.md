---
date: 2017-09-14T00:00:00+09:00
title: Golangの時間のbefore/afterの話
tags: ["golang"]
---

英語の学が足らないので時間の比較を2回に1回間違えてしまうので、最近行っているバッドノウハウの共有します。


```go
package main

import (
	"fmt"
	"time"
)

func main() {
	now := time.Now()
	yesterday := now.Add(-24 * time.Hour)

	fmt.Println("now.After(yesterday) =>", now.After(yesterday))   // -> true
	fmt.Println("now.Before(yesterday) =>", now.Before(yesterday)) // -> false

	fmt.Println("yesterday.After(now) =>", yesterday.After(now))   // -> false
	fmt.Println("yesterday.Before(now) =>", yesterday.Before(now)) // -> true
}

```
https://play.golang.org/p/WkBHM4AO_X


毎回 `after school` は放課後だからと考えてよくわからなくなります。また含むのか含まないのかも毎回わからなくなります。

```go
package main

import (
	"fmt"
	"time"
)

func main() {
	now := time.Now()
	yesterday := now.Add(-24 * time.Hour)

	fmt.Println(now.UnixNano() > yesterday.UnixNano()) // -> true
}
```
https://play.golang.org/p/2yNW-X_P0Q

そこで1度 `Unix/UnixNano` に変換して比較してあげれば,自分でも簡単に判別できるので好んで使っています。

みなさんはパッとBefore/Afterでどっちが大きいと真かわかるものなんでしょうか