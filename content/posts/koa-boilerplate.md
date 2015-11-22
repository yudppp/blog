---
title: koaのboilerplate的なのを作る
date: 2015-02-11
excerpt: koajsはkoa自体は薄くmiddlewareを好きに組み込めるような設計になっているので最初の書き始める時、いろいろめんどくさくなるので自分用にboilerplate的ななにかを作成しました。
---

## はじめに
[koajs](http://koajs.com/)はkoa自体は薄くmiddlewareを好きに組み込めるような設計になっているので最初の書き始める時、いろいろめんどくさくなるので自分用にboilerplate的ななにかを作成しました。

https://github.com/yudppp/koa-boilerplate

## 使用したmiddleware
- [config](https://github.com/lorenwest/node-config)
- [ect](https://github.com/baryshev/ect)
- [koa-bodyparser](https://github.com/koajs/bodyparser)
- [koa-json](https://github.com/koajs/json)
- [koa-logger](https://github.com/koajs/logger)
- [koa-qs](https://github.com/koajs/qs)
- [koa-response-time](https://github.com/koajs/response-time)
- [koa-router](https://github.com/alexmingoia/koa-router)


だいたいこのくらいは毎回いれて書きそうだったので入れました。

やっぱりrouterはkoa-routerがrestなAPI書くには楽な気がします。

最近はectが早いと聞くのでviewのtemplateはect入れています。

なんとなく大枠を作れたのでなにかあったときにぱっとkoa導入できるはず。。
