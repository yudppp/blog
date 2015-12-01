---
title: RIOT 2.0
date: 2015-01-25
tags: ["js"]
excerpt: RIOT 2.0がリリースされました。PolymerのようなカスタムタグとReactぽい仮想DOMで軽量なフレームワークのようです。
---

## はじめに

RIOT 2.0がリリースされました。

PolymerのようなカスタムタグとReactぽい仮想DOMで軽量なフレームワークのようです。

https://muut.com/blog/technology/riot-2.0/index.html

最近2.0に上がってから、すごい勢いでstarがついていて、すごく軽くて色々とできるそうなので見ていきます。

## RIOT2.0とは

Reactはtemplateとテクノロジーを分離していてすばらしい考え方だったが、minifyされた状態でも124KBと大きく、コードも複雑になっているのだろう。jsxでテンプレートを簡略化してくれていたがもっと楽な方法を探した。

Riot2.0のideaは Riot1.0のミニマリズムとReactの仮想DOMやコンポーネントの考え方とHTML5のカスタムタグの考えかたからできている。

riotを除いたHTMLやjsのみを書いた小さなAPIを欲していた。

Riot 2.0 は予想していたもの以上に、とても小さく簡単になっていた。完全なアプリケーションスタックで9つしかpublicなメソッドがなく、React.jsの10分の1どころか24分の1以下のfilesizeになった。


## RIOTのすごいところ
- IE8以降のすべてのブラウザでカスタムタグを扱える。
- カスタムタグがコンパイル後も人に読みやすい形になっている。
- virtual domのおかげでDOMの更新に無駄が少なくパフォーマンスがよい。

### Close to standards
- 独自のイベントシステム
- IE8のためのイベント標準化
- renderされたDOMを他から勝手にアクセスされること
- jQueryを上手く使うこと

### Growing ecosystem

- [Gulp](https://github.com/e-jigsaw/gulp-riot) and [Grunt](https://github.com/ariesjia/grunt-riot) plugins
- Hosted on [cdnjs](https://cdnjs.com/libraries/riot) and [jsdelivr](http://www.jsdelivr.com/#!riot)


### Minimal


###### シンプルな構文
できる限り小さなボイラープレートによって強力なタグシンタックスを導入することをひとつの目標にしていた。

- Power shortcuts: `class={ enabled: is_enabled, hidden: hasErrors() }`.
- No extra brain load such as `getInitialState` or `shouldComponentUpdate`
- Interpolation: `Add #{ items.length + 1 }`
- No render method, no state object.
- Compact ES6 method syntax.

###### シンプルなAPI
Riotは他の10分の1から100分の1ほどAPIが少ない

- そのため学習コストが低い
- やれることが少ないのでコードが統一されやすい


###### 小さいファイルサイズ
![](/blog/img/posts/riot-size.png)

ファイルサイズが小さいことはバグが起きにくくダウンロードもすぐされるしメンテナンスも楽。

###### 小さいけれど完成している

Riotは現代のクライアントサイドのアプリケーションのために必須な要素を構成している。

- ユーザーインターフェースを作るためのReactiveなView
- APIをつくるためのライブラリは独立しったモジュールになっている。
- urlのパスを変更してくれるルーター


## まとめ

RiotはReact,Polymer,models,routingを大きくさせずにまとめたものである。IE8にさえすぐに動かすことができる。使うことは簡単ですごく軽い。再発明せずいいパーツを組み合わせたものだ。

## 感想

だいたいこんな感じのものなんですかねー
実際にちょっと触ってみましたが簡単に使えそうでした。

なによりファイルサイズが軽いことが魅力です。ただ心配なのが仮想DOMとしてのパフォーマンスとかが悪いのではないのかが軽いだけに心配です。
次回にでももっとちゃんと使ってみたいと思います。


## 参考にしたもの

https://muut.com/riotjs/
