---
title: npmで公開する
date: 2015-04-12
tags: ["js", "npm"]
excerpt: 今までnpmで公開したことがなかったのですが、はじめて公開してみることにしました。
eyecatch: /blog/img/posts/npm.png
---

## はじめに
今までnpmで公開したことがなかったのですが、はじめて公開してみることにしました。

作ったものは[gulp-xto6](https://github.com/yudppp/gulp-xto6)というものでES5のコードをES6にコンパイルできるbabelの逆のような[xto6](https://github.com/mohebifar/xto6)を扱いgulpで扱いやすいようにしたものになります。

xto6についてはまた別の記事で紹介させていただきます。



## npmアカウントを作成する

npmのサイトでアカウントを作成します。

![](/blog/img/posts/npm-ss.png)

こちらを入力して登録しました。

## localでユーザー設定

```
$ npm adduser
```

username,password,email addressを登録すると`~/`下に`.npmrc`というfileができていました。

```
//registry.npmjs.org/:_password=hogeABCEFGHIhuga
//registry.npmjs.org/:username=username
//registry.npmjs.org/:email=mail@address.co.jp
//registry.npmjs.org/:always-auth=false
```

こんな感じになっていました。

これで公開する準備は終わりました。


## 公開する

公開したいディレクトリまで移動して

```
$ npm publish
```
で完了です。

## 非公開にする

基本的に確認してあげているので大丈夫だとは思いますが、間違えたものをあげてしまったりしたときのために確認しておきました。

```
$ npm unpublish
```
で非公開にできるそうです。(試していない)

基本的にどこかで使われているかも知れないのでunpublishは使わないでdeprecateとかにしましょうとのこと。

またそもそもあがって困るようなものは`package.json`に`private: true`と書いておきましょう。

## まとめ

npmの公開をいままでしたことがなかったが、簡単に公開することができた。

また大したものは作っていないのですが、ダウンロードされていて、何人かの方に使われているのかと思うとうれしいです。

まだテスト書き中だったりちゃんとメンテしていきます。

https://www.npmjs.com/package/gulp-xto6


## 参考にしたもの
- https://docs.npmjs.com/getting-started/publishing-npm-packages
- https://docs.npmjs.com/cli/unpublish
