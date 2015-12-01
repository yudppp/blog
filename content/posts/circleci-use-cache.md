---
title: CircleCIでcacheを利用する
date: 2015-08-22
tags: ["ci"]
aliases: ["circleci_use_cache"]
excerpt: 仕事でcircleciを使ってテストが時間が掛かるようになってしまったので修正したい。cacheを使って手軽に高速化させる。
---

## はじめに

仕事でcircleciを使ってテストが時間が掛かるようになってしまったので修正したい。
テスト自体を並列で動かして短縮することも可能であろうが、並列ではしることをあまり考慮されていないテストに現状なってしまっているため初期コストが高そうなので後回しにする
またdockerの導入も大変そうなので後回しにしてできるところから手をつける。

毎回ダウンロードしてきているものをcacheにいれることにする。


## How cache works
circleciのcacheの概要はこちらに書いてある。
https://circleci.com/docs/how-cache-works

#### cacheについて

cacheの方法は二つあります

###### 1, cache_directories
`circle.yml`に`dependencies: cache_directories`のセクションを追加してディレクトリを指定すれば、そこのディレクトリはcacheとして次回のインスタンスにも同じものが残る。

###### 2, cache_directories
- Bower
- Bundler
- CocoaPods
- Go
- Gradle
- Maven
- NPM

これらのようなもmanagerを使っていた場合自動的にcacheされる。

#### Per-branch cache

cacheされる粒度はbranchごとにされる。ブランチを切って最初のpushの場合Githubのデフォルトブランチが使えわれる。デフォルトブランチにcacheがなかった場合他のブランチからのcacheが使われる。

#### Clearing the cache
cacheを消すためには`circle.yml`に下記のようにかけばcacheを消してくれる。
```
dependencies:
  post:
    - rm -r ~/.gradle
```

普通に消すだけですね。はい。
勝手にcacheされてるものを消すためにはこのようにかけばよいのでしょうか。


## 検証してみてわかったこと/思ったこと

- `without cache`で行った場合cacheを使わないだけでcacheを消してくれることはしない。
- `without cache`かつ`with ssh`はできない。(探したが見つからなかった。)
- 運用していてcache自体を一度消したくなったときは`with ssh`で入って手で消すしかなさそう
- 何度もcircleCIの挙動を確認したい場合は確認するための最小限の`circle.yaml`で確認した方がよい。

## まとめ

circleCIのチューニングは確認に時間が掛かったり挙動がよくわからなかったりして大変だが、将来を考えると時間が減っていいことしかないのでもっと早めにやるべきだった。
