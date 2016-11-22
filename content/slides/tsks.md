---
title: マイクロサービスの辛さ その① 起動時編
date: 2016-11-22
tags: ["slide"]
excerpt: yudppp
---

<script layout="title" type="text/x-markdown">
## マイクロサービスの辛さ
### その① 起動時編
yudppp
</script>


<template layout type="text/x-markdown">
[Microservices Meetup vol.4](http://microservices-meetup.connpass.com/event/44428/)
</template>

<template layout type="text/x-markdown">
マイクロサービスで作るようになって

圧倒的に1日に扱うプロジェクトの数が増えた。
</template>

<template layout type="text/x-markdown">
1日に起動するプロジェクトが増えた。
</template>

<template layout type="text/x-markdown">
1日に3~5プロジェクトくらい。

自分が元々作ってないプロジェクトも触る
</template>

<template layout type="text/x-markdown">
使っているタスクランナーもバラバラ
</template>

<template layout="bullets" type="text/x-markdown">
- npm script
- Grunt
- gulp
- Make
- Rake
</template>

<template layout type="text/x-markdown">
毎回lsして,

どのタスクランナー使ってるか確認して

catして起動タスクを確認する
</template>

<template layout type="text/x-markdown">
やだ
</template>

<template layout type="text/x-markdown">
したくない
</template>

<template layout type="text/x-markdown">
それをしないための

タスクランナーマネージャー作りました。
</template>

<template layout type="text/x-markdown">
## [yudppp/tsks](https://github.com/yudppp/tsks)
```
$ npm i tsks -g
```
</template>

<template layout type="text/x-markdown">
```
$ cd hoge-project
hoge-project $ tsks
🐚 tsks
npm run start
npm run build
gulp watch
gulp build
```
</template>

<template layout type="text/x-markdown">
npm script, Grunt, gulp, Make, Rake

これらのタスクランナーのタスクを一覧表示してくれる。
</template>

<template layout type="text/x-markdown">
## DEMO
</template>

<template layout type="text/x-markdown">
なんとこのプロジェクト

☆が[ひとつ](https://github.com/yudppp/tsks/stargazers)(自分でつけただけ)
</template>

<template layout type="text/x-markdown">
☆くれたら喜びます

[yudppp/tsks](https://github.com/yudppp/tsks/stargazers)
</template>

<template layout type="text/x-markdown">
以上

ありがとうございました。
</template>