---
title: RESTfulなAPIがつらくなってきた話
date: 2015-12-13
excerpt: RESTが徐々に辛くなってきてFalcorを使ってみたい話
eyecatch: /img/posts/falcor.png
---

この記事は[CyberAgent エンジニア Advent Calendar 2015](http://www.adventar.org/calendars/863)の13日目の記事です。
<iframe src="//hatenablog-parts.com/embed?url=http%3A%2F%2Fwww.adventar.org%2Fcalendars%2F863" title="CyberAgent エンジニア Advent Calendar 2015 - Adventar" class="embed-card embed-webcard" scrolling="no" frameborder="0" style="display: block; width: 100%; height: 155px; max-width: 500px; margin: 10px 0px;"></iframe>

昨日は同期のmatsuokahさんの[ブログ](http://blog.matsuokah.jp/entry/2015/12/12/134717)でした。明日はhuydxさんです。



## はじめに
新卒3年目の鈴木([@yudppp](https://twitter.com/yudppp))です。
入社してからJavaやったりNode.jsやったりフロントかじったりしていました。
ここ1年はGolangでサーバーサイドのエンジニアをしていました。最近は[Netflix](http://www.netflix.com)を見てゆったりした休日を過ごしています。
会社関連のちゃんとしたブログを書くのはじめてなので柔らかめなマサカリください。

2年以上RESTを意識してAPIを作りつづけていました。
RESTful APIについては同期の鈴木が紹介していたので[こちら](http://www.atmarkit.co.jp/ait/articles/1511/19/news022.html)を参考にしてください。
また悩んだときは[WEB+DB PRESS Vol.82](http://gihyo.jp/magazine/wdpress/archive/2014/vol82)の特集を読み返したりしてました。


ただ開発を進めていくうちに、だんだんと**RESTが辛くなってきました。**

single page application(SPA)の場合、完全にRESTなAPIになりすぎるとクライアント側で多くのAjaxリクエストが必要になってしまい、結局レンダリングするまでの時間が掛かってしまったり、
WebだけでなくiOSやandroidなどのクライアントがある場合、アプリではこのプロパティ使うけどWebからは使わないとか、このちょっとした情報をWebで使いたいから追加してとかで追加していくとレスポンスが肥大化していってしまったり、かっちりRESTにしたつもりがいろんなものに振り回されてしまいます。

Webとアプリでエンドポイント分けたり、UAで返す内容変えたり、どんと構えて別のAPIを叩いてもらえば済む話なのかもしれないのですが、どうしたって無駄が生じてしまいます。

またクライアント側からみても、同じ情報を再度取得しないようにクライアント側にstore層をもって、二回目からそこから取得するようにしたり書くのも飽きてきました。

それらのRESTの辛さを解決するものとしてFacebookの考案した[GraphQL](http://facebook.github.io/graphql/)/[relay](https://facebook.github.io/relay/)や[Netflix](http://www.netflix.com/)の[Falcor](http://netflix.github.io/falcor/)などがあります。
GraphQLについては以前弊社のブログで秋葉原ラボの鈴木さんが「[GraphQLについて調べてみた](http://ameblo.jp/principia-ca/entry-12060337336.html)」で書いています。

今回はFalcorのすばらしさとGraphQLとの違い、実際に触ってみた触感について書いていきたいと思います。

## Falcorとは

> [A JavaScript library for efficient data fetching](http://netflix.github.io/falcor/)

効率よくデータを取得できるライブラリです。
サーバーサイドはNode.jsで実装されています。

サーバーの実装自体は他の言語でも可能でGithubを見る限り,[Dart](https://github.com/Pajn/falcor_dart),[PHP](https://github.com/brenelz/falcor-php-server)とかありそうです。(どのくらいちゃんと動くかは未確認です)


### 特徴

#### 1. One Model Everywhere

すべてのバックエンドのデータを１つの仮想JSONオブジェクトとして扱うことができます。
クライアントはJSONの一部の要素をメモリーに乗っているJSONを取得するかのように取得することができます。

```js
model.json?paths=["user.name", "user.surname", "user.address"]

// GET /model.json?paths=["user.name", "user.surname", "user.address"]
{
  user: {
    name: "Frank",
    surname: "Underwood",
    address: "1600 Pennsylvania Avenue, Washington, DC"
  }
}
```

サーバーのエンドポイントがひとつだけなので、まとめて様々なリソースのリクエストを送ることが可能になり、RESTのときに問題になっていた多くのAjaxリクエストが必要になってしまっていた件が解消されます。

#### 2. The Data is the API

FalcorではクライアントでJSONデータを扱う際に直接JSONを取得することはできません。代わりに下記のように`getValue`することによって値を取得できます。
```js
// this data is
// user: {
//   name: "Frank",
//   surname: "Underwood",
//   address: "1600 Pennsylvania Avenue, Washington, DC"
// }

var model = new falcor.Model({
  source: new falcor.HttpDataSource(“/model.json”)
});

// prints “Underwood” eventually
model.
  getValue(“user.surname”).
  then(function(surname) {
    console.log(surname);
  });
```

JavaScriptでよくあるget,set,call等の操作を知っていれば簡単に扱うことができます。
データの構造さえ知っていればAPIから取得することができます。

#### 3. Bind to the Cloud

キャッシュの機構があり、`get`したときに一度も取得していないデータであればAPIを叩き取得し、取得したことのあるデータであればAPIリクエストは走らずクライアントのCacheから勝手に取得してきてくれます。
仮想DOMといい、仮想なんちゃらは人間様が考えるべきことを本質だけにしてくれて本当にありがたいです。

またバッチの機能もあり下記のようにバッチのモデルを定義するとこの3つの問い合わせをまとめて受け付けることができます。

```js
var log = console.log.bind(console);
var httpDataSource = new falcor.HttpDataSource("/model.json");
var model = new falcor.Model({ source: httpDataSource });
var batchModel = model.batch();

batchModel.getValue("todos[0].name").then(log);
batchModel.getValue("todos[1].name").then(log);
batchModel.getValue("todos[2].name").then(log);

// The previous three model requests only send a single request
// to the httpDataSource: "todos[0..2].name"
```

上記のサンプルの場合キャッシュに乗っていなくてもAPIのリクエスト数は最大1回までとなります。

<!-- いわゆるMVCではサーバーからデータを取得する責務をコントローラーがもつことが多いです。
Falcorでアプリケーションを作成するパターンのひとつとして、ViewとModelの通信が非同期になる**Async MVC**があります。
この場合サーバーからのデータの取得はコントローラーではなくモデルが勝手に行ってくれる。そのためコントローラーが素結合になります。
またViewに必要な情報をデータ取り出し必要な情報だけを描画するため、データの取得に無駄がなく完全に必要なもののみリクエストされることになります。 -->


## GraphQLとの違い(個人の感想)

GraphQLもFalcorもRESTが辛くなってきたときの解決法です。
GraphQL(relay)はQuery言語として色々な値を取得することができますが、複雑で学習コストが高いです。
```js
// relay sample
var fragment = Relay.QL`
  fragment on User {
    name,
    surname,
    address
  }
`;
```

Falcorは比較すると簡単なことしかできないため、学習コストが低く見通しがよい。

```js
// falcor sample
model.
  getValue('user.["name", "surname","address"]').
  then(function(val) {
    console.log(val);
  });
```


個人的にはよくわからないQueryを毎回書きたくなく、Falcorを使ってシンプルに書ける恩恵の方が大きいと思います。

サーバーの実装はGraphQLの方が言語の種類も多く、採用事例も多いような気がします。


## まとめ
ちゃんとRESTにしようとすると色々と辛くなっていった。
解決策としてGraphQLやFalcorを使って、そのあたりを気にしないで実装できるようになりたいです。
プロダクト環境で使ったことがないので使うタイミングがあれば使ってみたいなーと思ってます。

## 参考文献

- http://www.netflix.com
- http://netflix.github.io/falcor
- https://facebook.github.io/relay/
