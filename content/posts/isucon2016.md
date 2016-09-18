---
date: 2016-09-10
title: isucon2016
---

## はじめに

ISUCON6の予選に初日で参加しました。結果としては35000点くらいで人権を失いました。



<iframe src="//hatenablog-parts.com/embed?url=http://isucon.net/archives/48475110.html" title="ISUCON6 本選出場者決定のお知らせ : ISUCON公式Blog" class="embed-card embed-webcard" scrolling="no" frameborder="0" style="display: block; width: 100%; height: 155px; max-width: 500px; margin: 10px 0px;"></iframe>


[昨年](/posts/isucon2015)と一昨年と同じメンバーで今年も予選に参加しました。
前準備をいくつかしたのでその内容は来年のためにしたの方に残しておきます。

## 当日
はてなのキーワードやはてなスターみたいな問題でした。

お昼すぎまでGolangで動かすと0点で他チームが点数出てるので、とても焦っていました。

Golangの正規表現が辛いことがわかったので`htmlify`ないのコードの

```golang
re := regexp.MustCompile("("+strings.Join(keywords, "|")+")")
kw2sha := make(map[string]string)
content = re.ReplaceAllStringFunc(content, func(kw string) string {
	kw2sha[kw] = "isuda_" + fmt.Sprintf("%x", sha1.Sum([]byte(kw)))
	return kw2sha[kw]
})
content = html.EscapeString(content)
for kw, hash := range kw2sha {
	u, err := r.URL.Parse(baseUrl.String()+"/keyword/" + pathURIEscape(kw))
	panicIf(err)
	link := fmt.Sprintf("<a href=\"%s\">%s</a>", u, html.EscapeString(kw))
	content = strings.Replace(content, hash, link, -1)
}
```

のコードを

```golang
kw2sha := make(map[string]string, len(keywords))
for _, kw := range keywords {
	if strings.Contains(content, kw) {
		kw2sha[kw] = "isuda_" + fmt.Sprintf("%x", sha1.Sum([]byte(kw)))
		content = strings.Replace(content, kw, kw2sha[kw], -1)
	}
}
 
content = html.EscapeString(content)
for kw, hash := range kw2sha {
	u, err := r.URL.Parse(baseUrl.String() + "/keyword/" + pathURIEscape(kw))
	panicIf(err)
	content = strings.Replace(content, hash, fmt.Sprintf("<a href=\"%s\">%s</a>", u, html.EscapeString(kw)), -1)
}
```

のように一個ずつreplaceするように変更したところ1万点くらいのスコアが初めて出て一安心しました。

ただよくメッセージを見てみると１つずつやっているのでhash変換時の値に`12`などが含まれていた場合に再度変換されてしまうバグがありました。
またsha1等でわざわざ暗号化する必要もなかったので

```golang
kw2sha := make(map[string]string, len(keywords))
for _, kw := range keywords {
	if strings.Contains(content, kw) {
		kw2sha[kw] = "isuda_" + random()
		content = strings.Replace(content, kw, kw2sha[kw], -1)
	}
}
content = html.EscapeString(content)
for kw, hash := range kw2sha {
	u, err := r.URL.Parse(baseUrl.String() + "/keyword/" + pathURIEscape(kw))
	panicIf(err)
	content = strings.Replace(content, hash, fmt.Sprintf("<a href=\"%s\">%s</a>", u, html.EscapeString(kw)), -1)
}
```
```golang
var letterRunes = []rune("@#_=$%`~?!")

func random() string {
	b := make([]rune, 12)
	for i := range b {
		b[i] = letterRunes[rand.Intn(len(letterRunes))]
	}
	return string(b)
}
```

のようにkeywordに出てこなさそうな記号を元に乱数を作るようにしました。
上記の対応で3万点を超え出しました。

またその他に行ったこととして、

- isutarをisudaに統合(DBも合わせる)
- starテーブルのkeywordのindexを貼る
- Cookieに`user_name`も詰める
- SQLのpool数増やしたりしました。
- 静的fileをnginxでキャッシュ


## やろうと思ってできなかったこと

- fasthttpの利用。
- isupamのキャッシュ
- pprof

## 感想

今年はピザを冷まさず食べれた。

結果は悔しいので、来年こそ頑張る

---

## 前準備(チーム)

- Golangでいくことの決定
- Azureの管理画面を少し触ってみる
- 迷った時はやる
- 17時半からは最終調整
- bitbucketの準備

## 前準備(個人)

### snipet作り

並列実行(待つ)
```golang
var wg sync.WaitGroup
for i:=0; i<10; i++ {
    wg.Add(1)
    go func(i int) {
        fmt.Println(i)
        wg.Done()
    }(i)
}
wg.Wait()
```
並列実行(待たない)
```golang
for i:=0; i<10; i++ {
    go func(i int) {
        fmt.Println(i)
    }(i)
}
```

### 使いそうなパッケージ

- [patrickmn/go-cache](https://github.com/patrickmn/go-cache)
- [valyala/fasthttp](https://github.com/valyala/fasthttp)
- [valyala/quicktemplate](https://github.com/valyala/quicktemplate)
- [goware/httpcoala](https://github.com/goware/httpcoala)

### その他始まったら確認すること

- httpクライアントのキャッシュ
- 正規表現重いから可能なら`strings.HasPrefix`等使う
- closeとか漏れてないか
- defer重いので極力使わない
- not use reflectntlnt
- Goのversionあげる
- alloc減らす
- map indexは100を超えてから
- css,jsにgzip聞いているか
