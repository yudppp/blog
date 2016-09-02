---
date: 2016-09-03
title: ブログのリニューアルしました。
---
ブログのリニューアルしました。

Hugoに移行してから、1記事しか書かずにスタイル書き直して、またの修正になります。


今回は極力シンプルに、エンジニアが見て見やすいように[hackcss](http://hackcss.com/)をベースに作成しました。

HTMLをスタイルの少し効いたマークダウンぽくしてくれます。

Hugoを使ってマークダウンで書いているので
マークダウンを一度HTMLに変換して、それにマークダウンぽいスタイルを当てていることになります。

またHugoでは[blackfriday](https://github.com/russross/blackfriday)を使ってマークダウンをHTMLに変換しています。
その際に外部リンクの場合aタグに`target="_blank"`をつけたりしたいのですができないようでした。
そのためJavaScriptでクライアントでつけるようにしました。

```
var hostname = window.location.hostname;
var tags = document.getElementsByTagName('a');
for (var i in tags) {
    var tag = tags[i]
    if (tag.href && tag.href.indexOf(hostname) == -1) {
        tag.target = '_blank';
    }
}
```
相対パス等で書くことないので一旦無視してしまってたり、ベストではないとは思うのですが、こんな感じでできました。
また外部リンクと内部リンクでaタグの色を変えるようにしました。内部リンクは黄色。外部リンクは赤となっています。


派手なブログもいいですが、シンプルで読みやすいブログになったかと思います。

ただGithubの調子が悪いのか画像がちゃんと上がらないことがあるのでちゃんと調べてみようと思います。

久しぶりのブログなので軽めで終わりにします。


