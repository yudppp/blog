---
title: highlight.jsを使ってみる
date: 2015-01-11
tags: ["js"]
excerpt: codeにsyntax highlightが当たらないのが辛かったのでテーマを新たにつくっていい感じにsyntax highlightを効かせることにしました。
---

## はじめに

codeにsyntax highlightが当たらないのが辛かったのでテーマを新たにつくっていい感じにsyntax highlightを効かせることにしました。
syntax highlightについて調べてみると[isagalaev/highlight.js](https://github.com/isagalaev/highlight.js)というライブラリがよさそうだったのでこちらを使うことにしました。


## Ghostのcode blockの仕様

[TryGhost/Ghost/issues/2675](https://github.com/TryGhost/Ghost/issues/2675)で話し合われた結果

<pre><code class="hljs autohotkey"> <span class="hljs-escape">```</span>javascript
 <span class="hljs-escape">```</span>
</code></pre>

のように書くとprefixに`language-`が補完されるようになっています。

highligh.jsの実装をみてみると`language-`をのぞいて上手いこと言語の判断をしてくれるようだった。

[ErisDS/showdown/showdown.js#L1032-1036](https://github.com/ErisDS/showdown/blob/master/src/showdown.js#L1032-1036)

[src/highlight.js#L42-46](https://github.com/isagalaev/highlight.js/blob/master/src/highlight.js#L42-46)

## highlight.jsの特徴

 > 112 languages and 49 styles

 112の言語と49のスタイルに対応している。

 > automatic language detection

 自動的な言語検出を行う。

 > multi-language code highlighting

 マルチ言語のハイライト

 > available for node.js

 node.jsで利用可能である

 > works with any markup

 どのようなマークアップでも働く

 > compatible with any js framework

 どんなjsフレームワークでも使える(jQuery等に依存してない)


 こんな特徴があるらしいです。

## highlight.jsを使ってみる

最初に[isagalaev/highlight.js](https://github.com/isagalaev/highlight.js)に言われるがままに

```html
<link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/highlight.js/8.4/styles/default.min.css">
<script src="//cdnjs.cloudflare.com/ajax/libs/highlight.js/8.4/highlight.min.js"></script>
<script>hljs.initHighlightingOnLoad();</script>
```
をすべてのpageに対応させたかったのでdefault.hbs(もちろんthemeによっては変わってきますが)に入れました。
Casperであれば[default.hbs#L20](https://github.com/TryGhost/Casper/blob/master/default.hbs#L20)のあたりに追加しました。

その後確認してみるとhighlightが自分の予想していない場所についてしまったりしました。。

 > automatic language detection

 が勝手に働いてしまっていました。勝手についてしまっていたコードが自分があまり使わなそうな言語だったりしたので、

[download]( https://highlightjs.org/download/)から自分が使う必要最小限の言語を選択しダウンロードしたところ上手くハイライトがつくようになりました。




## highlightを消したいとき

highlightを付けたくないときhighlight.jsではnohighlightとかつければよいようです。

`/no(-?)highlight|plain|text/`こちらに含まれればよいのでtypo数的に`text`を積極的に使おうと思いました。


## まとめ

cssとjsを入れるだけで簡単にsyntax highligtが効くようになったので幸せでした。

## 参考にしたもの

https://highlightjs.org/
https://github.com/isagalaev/highlight.js
https://github.com/ErisDS/showdown
