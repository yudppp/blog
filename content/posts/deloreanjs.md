---
title: FluxなフレームワークDeLoreanjsを触る
date: 2015-01-15
excerpt: Fluxなフレームワークを触ってみたかったのでDeLoreanjsをさわってみることにしました。
---

## はじめに

[Flux](http://facebook.github.io/flux/)なフレームワークを触ってみたかったので[DeLoreanjs](http://deloreanjs.com/)をさわってみることにしました。


## Fluxとは
MVCに変わる新しいデータフローです。
大規模なアプリケーションになるとMVCではMとVの関係が特に複雑化してしまう。
Fluxは下記のような一方向のデータフローとなるため複雑になりにくいそうです。
大まかな構成としては既存のMVCをイベント稼働型にしたイメージです。
![](/blog/img/posts/flux.png)

## DeLoreanとは
>DeLorean is a tiny Flux pattern implementation.

DeLoreanはFluxのパターンを小さな構成で実装したものになります。他にもfluxなフレームワークは多々ありますが,その中でもsimpleで軽量なフレームワークにあたります。


> **Unidirectional data flow**, it makes your app logic **simpler than MVC**,

一方向のデータフローによりMVCよりもアプリのロジックをきれいにする。

> Automatically listens to data changes and keeps your data updated,

データの変更されると、自動的にデータを更新された状態に保つ

> Makes data more **consistent** across your whole application,

アプリケーション全体でデータの一貫性が保たれる。

> It's framework agnostic, completely. There's **no view framework dependency**.

このフレームワークは完全に独断的でない。viewフレームワークに依存していない。

> Very small, just **5K** gzipped.

とても小さくgzipすると５kになる。

> Built-in **React.js** integration, easy to use with **Flight.js** and **Ractive.js** and probably all others.

内蔵されているReact.jsだけでなくFlight.jsやRactive.jsなどでも使いやすい。他のすべてでも多分使いやすいはずだ。

> Improve your UI/data consistency using **rollbacks**.

ロールバックを使うことによりUIやデータの一貫性が改良される。

Fluxの綺麗な一方向のデータ方向でviewがreactに依存していなく軽量であることがポイントかと思います。


## 主な機能

viewの機能は外部に委託していてdefaultではreactjsを使っている。

FluxのDispatchersとStoresの二つのコンセプトを実装している。
 Action Creatorsは単にhelperとして実装していてフレームワークの抽象化したレベルの必要がない。


### Dispatchers

> The dispatcher is the central hub that manages all data flow in a Flux application. It is essentially a registry of callbacks into the stores. Each store registers itself and provides a callback. When the dispatcher responds to an action, all stores in the application are sent the data payload provided by the action via the callbacks in the registry.


dispertcherはfluxのアプリケーションのデータフローを管理するハブとなっている。本質的にはstoresへのコールバックの登録です。それぞれのstoreは自身を登録しコールバックを提供する。dispatcherがactionに反応するときは、アプリケーションのすべてのstoreで登録のコールバックに送られるアクションによってデータベースに送られる。

簡単なDispatcherはこのよに書ける。
```
var Dispatcher = Flux.createDispatcher({
  setData: function (data) {
    this.dispatch('incoming-data', data);
  },
  getStores: function () {
    return {increment: store};
  }
});
```

### Stores

> Stores contain the application state and logic. Their role is somewhat similar to a model in a traditional MVC, but they manage the state of many objects. Unlike MVC models, they are not instances of one object, nor are they the same as Backbone's collections. More than simply managing a collection of ORM-style objects, stores manage the application state for a particular domain within the application.

Storeはアプリケーションのstateとロジックを扱う。これらの役割はMVCのModelに似ているが、Storeは多くのobjectの状態管理している。多くのobjectを管理しているのはバックボーンのcollectionとは違う。objectを単に管理するよりもアプリケーション内の特定の範囲のための状態を管理する。

storeの使われ方
```
var Store = Flux.createStore({
  data: null,
  setData: function (data) {
    this.data = data;
    this.emit('change');
  },
  actions: {
    'incoming-data': 'setData'
  }
});
var store = new Store();
```


Actionとして下記のように設定する
```
var Actions = {
  setData: function (data) {
    Dispatcher.setData(data);
  }
};
```

Actionで定義したイベントを適当にviewにつけていけば簡単なデータをfluxで登録できるようになりました。

## 感想
簡単に使えそうですが、ロジックの含む処理をstoreにたくさんかけてしまいそうでした。

## 参考にしたもの
- https://github.com/facebook/flux
- https://github.com/deloreanjs/delorean
- https://www.youtube.com/watch?v=nYkdrAPrdcw
- [https://www.bountysource.com/issues](https://www.bountysource.com/issues/5059362-which-flux-implementation-to-use-flux-reflux-fluxxor-mcfly-delorean)
- [http://saneyukis.hatenablog.com/entry](http://saneyukis.hatenablog.com/entry/2014/09/26/174750)
