---
title: Facebookのflowtypeについて
date: 2015-05-24
tags: ["js", "flow"]
excerpt: 最近babelやらES6やらがかなり盛り上がってる中facebookのflow(flowtype)をちゃんと触ってみようと思います。TypeScriptと比べると型推論が賢かったり、コンパイルが速いらしいです。

eyecatch: /img/posts/flow.png

---

## はじめに

最近babelやらES6やらがかなり盛り上がってる中facebookの[flow(flowtype)](http://flowtype.org/)をちゃんと触ってみようと思います。
TypeScriptと比べると型推論が賢かったり、コンパイルが速いらしいです。

## インストール

Macだとbrewでさっとinstallできるようです。

```
$ brew update
$ brew install flow
```

windows等ではzip等で落としてくるそうです。

[こちら](http://flowtype.org/docs/getting-started.html#_)をみれば簡単にinstallできました。

## flowを触ってみる

#### HelloWorld

fileのはじめに`/* @flow */`でflowを使うことを宣言します。


```
/* @flow */

function foo(x) {
  return x * 10;
}

foo('Hello, world!');
```

このように数値をいれて使いたい関数に間違って文字列をいててしまった場合に`$ flow check`でチェックしてみます。すると
```
$ flow check

/Users/.../examples/01_HelloWorld/hello.js:7:5,19: string
This type is incompatible with
/Users/.../examples/01_HelloWorld/hello.js:4:10,13: number
```

7行目(foo('Hello, world!');)で文字列代入してるけど4行目(return x * 10;)で計算してるから数字でないとだめだよと、ちゃんと怒られました。

またES6にも一部対応していて

```
/* @flow */

var foo = (x) => x*10

foo('Hello, world!');
```

このようなファイルもちゃんとみてくれました。

これらの`foo('Hello, world!');`を正しく計算できるよう`foo(10);`等に修正し再び`flow check`してみると

```
$ flow check

Found 0 errors
```

とエラーがないことを教えてくれました。


#### 型付け
先ほどは型推論していたので今回は自分で型をつけてみます。

```
/* @flow */

// Changing the return type to number fixes the error
function foo(x: string, y: number): number {
  return x.length * y;
}

foo('Hello', 42);
```
このように引数の後に型を宣言することができる。

宣言できる型の種類は
jsの基本の型としては

- number
- string
- boolean
- void

の4つとコンストラクタ名と`mixed`と`any`になります。

mixedはすべての型の上位の型(supertype)でanyは動的な型でなにでも使えるものになっています。
ここの違いが自分の中で曖昧なので今後ちゃんと調べてみようと思います。

このあたりはdocsに書いてあります。

http://flowtype.org/docs/base-types.html


#### nullの扱い

flowtypeではnullをちゃんと処理しないといけないようです。

```
/* @flow */

function length(x) {
  return x.length;
}

var total = length('Hello') + length(null);
```

このようなfileをチェックすると

```
$ flow check

/Users/.../examples/03_Null/nulls.js:4:10,17: property length
Property cannot be accessed on possibly null value
  /Users/.../examples/03_Null/nulls.js:7:38,41: null
```

nullの値にはアクセスできないと教えてくれます。

```
/* @flow */

function length(x) {
  if (x !== null) {
    return x.length;
  } else {
    return 0;
  }
}

var total = length('Hello') + length(null);
```

上記のようにちゃんとnullの場合の処理をしてあげることによってエラーがなくなります。


#### Arrayについて

Arrayの中身に対して型付けを行う場合、`Array<number>`と宣言します。


```
/* @flow */

function total(numbers: Array<number>) {
  var result = 0;
  for (var i = 0; i < numbers.length; i++) {
    result += numbers[i];
  }
  return result;
}

total([1, 2, 3, 'Hello']);
```

このようなfileをチェックするとちゃんと怒ってくれました。

#### 型が動的なコードについて

極力避けるべきだとは思いますが時には型を動的にしたい場合がでてくると思います。

そんなときはこのように場合わけをすれば、flowtypeがちゃんとみてくれます。


```
/* @flow */

function foo(x) {
  if (typeof x === 'string') {
    return x.length;
  } else {
    return x;
  }
}

var res = foo('Hello') + foo(42);
```

`typeof`を読み取ってエラーをださずに動いてくれます。

## まとめ

flowtypeの言語仕様?をなんとなく勉強してみました。
少ししか触って見ていないのでイメージでしかないのですが、
altJSというよりも型をちゃんと見てくれるjsLintやjsHintなイメージになりました。

次回は新しいプロジェクトを作ってみたいと思います。

## 参考文献

http://flowtype.org/
