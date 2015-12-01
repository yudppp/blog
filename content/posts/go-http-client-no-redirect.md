---
title: net/httpでRedirectさせない
date: 2015-10-26
tags: ["golang"]
excerpt: golangで302がちゃんとかえっているか確認したい。
---

## はじめに

302がちゃんとかえっているか確認したい。みたいな要件があり、なにも考えず

```
resp, err := http.Get(url)
```
のようにするとRedirectしたあとの結果を勝手にとってきてくれていた。

[net/http/client.go](https://golang.org/src/net/http/client.go)をみてみるとdoFollowingRedirectsでリダイレクトを考慮して色々やっているようだった。

## 対応方法

下記のように`CheckRedirect`を実装し、ハンドリングしてあげればよい。


```golang
package main

import (
	"errors"
	"net/http"
	"net/url"
)

var RedirectAttemptedError = errors.New("redirect")

func Check(urlApiEndPoint string) error {
	client := &http.Client{}
	client.CheckRedirect = func(req *http.Request, via []*http.Request) error {
		return RedirectAttemptedError
	}
	_, err := client.Get(urlApiEndPoint)
	if urlError, ok := err.(*url.Error); ok && urlError.Err == RedirectAttemptedError {
		return nil
	}
	return errors.New("don't redirect")
}

```


## 参考にしたもの
- [golang.org](https://golang.org/src/net/http/client.go)
- [stackoverflow](http://stackoverflow.com/questions/23297520/how-can-i-make-the-go-http-client-not-follow-redirects-automatically)
