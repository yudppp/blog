---
title: はじめてのReact.js
date: 2015-01-04
tags: ["js"]
aliases: ["react-js"]
excerpt: 最近仮想DOMが世間で流行ってる感あるのではじめることにしました。
---

## はじめに

最近仮想DOMが世間で流行ってる感あるのではじめることにしました。

 [Matt-Esch/virtual-dom](https://github.com/Matt-Esch/virtual-dom)とか[segmentio/deku](https://github.com/segmentio/deku)とか[Raynos/mercury](https://github.com/Raynos/mercury)とかから勉強してもよかったのですが、星が1番ついていたことと、以前Atomのpackageを弄った際に少し触ったこともあった[facebook/react](https://github.com/facebook/react)から勉強していくことにしました。


## 仮想DOMとは

 仮想DOMはHTMLのDOM構造をjsのオブジェクトで表していてDOM変更時に差分だけを変更してくれる。


## Reactとは

facebook社の作っているUI層をつくるjavascriptフレームワークです。



## 特徴

###### Just the UI
> Lots of people use React as the V in MVC. Since React makes no assumptions about the rest of your technology stack, it's easy to try it out on a small feature in an existing project.

MVCのVとしてReactは使われる。残りのM,Cについて働くことはなく、Reactは既存の小さな機能にも導入しやすくなっている。

###### Virtual DOM
> React uses a virtual DOM diff implementation for ultra-high performance. It can also render on the server using Node.js — no heavy browser DOM required.

Reactはマジ神なパフォーマンスのために、仮想DOMの差分実行を行っている。重いブラウザーDOMを使う必要なくNode.jsのサーバーで行うことができる。

###### Data flow
> React implements one-way reactive data flow which reduces boilerplate and is easier to reason about than traditional data binding.

Reactは一方向のデータフローのため、お約束事が減り　昔からあるデータバインディングなので学習コストが低くなっている。


## jsx
#### jsxとは


Reactでは[jsx](http://facebook.github.io/jsx/)を使っています。

> JSX is a XML-like syntax extension to ECMAScript without any defined semantics.

jsxとはECMAScriptにXMLのようなシンタックスを拡張したものです。

    // Using JSX to express UI components.
    var dropdown =
      <Dropdown>
        A dropdown list
        <Menu>
          <MenuItem>Do Something</MenuItem>
          <MenuItem>Do Something Fun!</MenuItem>
          <MenuItem>Do Something Else</MenuItem>
        </Menu>
      </DropDown>;

    render(dropdown);

このようなHTMLのDOMのようなものをそのまま書くことができます。jsxで書いたコードをjsに変換して使う必要があります。


#### 変換方法

jsx　の変換方法は大きく2つあります。

###### JSXTransformer

jsxtransformer.jsを使ってブラウザ上で変換する方法です。

	<!-- In-browser JSX transformer, remove when pre-compiling JSX. -->
	<script src="http://fb.me/JSXTransformer-0.12.2.js"></script>

[jsdelivr](http://www.jsdelivr.com/#!react)にもあがっています。
こちらを読み込んであげれば`<script type="text/jsx">`がjsに変換されるので導入が簡単にできます。しかし、パフォーマンス的にいい理由が全くないのでプロダクト環境等ではおすすめしないです。

###### Offline Transform

jsxを使う前に変換して置く方法です。
[react-tools](https://www.npmjs.com/package/react-tools)を用います。

最初にnpmを用いてinstallしておきます。

	npm install -g react-tools

次に変換したいfileがsrc下にあるとすると（src/hello.js）

```nohighlight
jsx --watch src/ build/
```

とコマンドを打つことにより変換されたものがbuild下に配置されます。
またwatchしているのでfile変更後自動的に更新されます。

またビルドツールで行うことも可能です。[alexmingoia/gulp-jsx](https://github.com/alexmingoia/gulp-jsx)や[andreypopp/reactify](https://github.com/andreypopp/reactify)など様々な方法でpre-compileすることが可能です。

#### 変換内容

`#example`のエレメントにHello worldを描画させるjsxはこのようになる。

    React.render(
      <h1>Hello, world!</h1>,
      document.getElementById('example')
    );


 renderの第1引数にDOMの中身が書かれていて、第2引数に対象が書かれている。
 こちらをjsに変換すると、

    React.render(
      React.createElement('h1', null, 'Hello, world!'),
      document.getElementById('example')
    );

と変換される。
React#createElementは`createElementは(要素名, 属性のオブジェクト,子要素)`となるようです。
変換後の内容で実装することも可能ですが、nestが深くなるとめんどくさくなったのでやめることにしました。素直にjsx使った方がよさそうです。



## 感想

仮想DOMの大枠やreactの概要がなんとなくわかってきました。個人的にはjsxの書き方が気持ち悪く感じました。今回は大雑把な使い方を調べただけなので、今後はdiffやpatchのアルゴリズムがどうなっているかや他の仮想DOMとの違いをみていきたいです。


## 参考にした資料

- http://facebook.github.io/react/
- http://facebook.github.io/jsx/
