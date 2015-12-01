---
title: DockerをGUIで使えるKitematic
date: 2015-03-15
tags: ["docker"]
excerpt: つい先日Dockerの管理をGUIで簡単に管理できるKitematicをDockerが買収しました。今後どうなっていくかは、よくわかりませんが、どんなものなのか触ってみたいと思います。
eyecatch: /blog/img/posts/kitematic.png

---

## はじめに

つい先日Dockerの管理をGUIで簡単に管理できる[Kitematic](https://kitematic.com/)をDockerが買収しました。

[kitematic joins the docker family](https://blog.docker.com/2015/03/kitematic-a-docker-gui-joins-the-docker-family/)

今後どうなっていくかは、よくわかりませんが、どんなものなのか触ってみたいと思います。
また筆者はDocker初めて触りました。

## 準備

サイトからダウンロードしてきます。

https://kitematic.com/


zipがダウンロードされたので展開するとアプリケーションができました。

## 動かす
　アプリケーションを開くとこんな感じでした。

![](/blog/img/posts/kitematic-ss1.png)

最初にhello-world-nginxを作りたいと思います。
Createを押して少し待つとなんかできた。

![](/blog/img/posts/kitematic-ss2.png)

Web Previewを押してブラウザーで開くと

![](/blog/img/posts/kitematic-ss3.png)

すぐにnginxを建てることができました。
ダウンロードしてきて一つボタンを押しただけです。

ほかのものも試したくなったのでRethinkDBとかもボタン押すだけですぐにできました。

## まとめ
Kitematicを使うと今まで自分の行ってきた行為はだいぶ無駄だったのだと思うほどすぐに作ることができました。
簡単に始められるため、手順書さえ書けばエンジニアでなくても、誰でも扱えるような気がします。
またちょっとdbの検証とかしたいときにすぐ建てられるので便利そうです。


## 参考にしたもの
https://kitematic.com/
[http://jp.techcrunch.com](http://jp.techcrunch.com/2015/03/13/20150312kitematic-founders-barely-two-years-out-of-college-sell-to-docker/)
