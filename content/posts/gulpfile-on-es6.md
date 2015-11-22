---
title: gulpfileそのものをES6で書く
date: 2015-02-21
excerpt: 最近になってfrontのコードやサーバーのコードは生のjs(ES5)で書かかずbabeljs(旧6to5)とかで書くことが体感ですが増えてきました。しかしgulpfileは生のjsで書いたり、coffeescriptで書くことが多いように感じます。
---

最近になってfrontのコードやサーバーのコードは生のjs(ES5)で書かかず[babeljs](https://babeljs.io)(旧6to5)とかで書くことが体感ですが増えてきました。

しかしgulpfileは生のjsで書いたり、coffeescriptで書くことが多いように感じます。

そこで試しにES6で書いたらどんな感じになるか見てみたかったので適当なgulpfileをES6に書き換えてみようと思いました。

まず適当なgulpfileが欲しかったのでYeomanでとってきました。
```
$ npm install -g yo
$ npm install -g generator-react-gulp-browserify
$ yo react-gulp-browserify
```
https://github.com/randylien/generator-react-gulp-browserify/

適当なそれなりに書かれているgulpfileが手に入りました。

```
'use strict';

var gulp = require('gulp');

// Load plugins
var $ = require('gulp-load-plugins')();
var browserify = require('browserify');
var watchify = require('watchify');
var source = require('vinyl-source-stream'),
    sourceFile = './app/scripts/app.coffee';

// Scripts
gulp.task('scripts', function () {
    var bundler = watchify(browserify({
        entries: [sourceFile],
        insertGlobals: true,
        cache: {},
        packageCache: {},
        fullPaths: true
    }));
    bundler.on('update', rebundle);
    ...
});
...

```

長いので一部省略しましたがこんな感じです。

新たに作るgulpfileについて考えていきます。
babeljsのページをみてみると、requireでも扱いかたは、こちらにかいてありました。

https://babeljs.io/docs/usage/require/

> One of the ways you can use babel is through the require hook. The require hook will bind itself to node's require and automatically transpile files on the fly. This is equivalent to CoffeeScript's coffee-script/register.

babelはrequireフックで使うことができ、自動的にnodeで変換され、coffee scriptの`coffee-script/register`と同じように扱えるそう。


```
$ npm install --save-dev babel
```

gulpfile.jsにこれだけ書く
```
require("babel/register");
require('./gulpfile.es6');
```

そして`gulpfile.es6`を作って
```
'use strict';

var gulp = require('gulp');

// Load plugins
var $ = require('gulp-load-plugins')();
var browserify = require('browserify');
var watchify = require('watchify');
var source = require('vinyl-source-stream'),
    sourceFile = './app/scripts/app.coffee';

// Scripts
gulp.task('scripts', () => {
    let bundler = watchify(browserify({
        entries: [sourceFile],
        insertGlobals: true,
        cache: {},
        packageCache: {},
        fullPaths: true
    }));
    bundler.on('update', rebundle);
    ...
});
...

```


無事arrow function等を使うことができ、ES6で動かせました。


## まとめ
gulpfile書き換えるだけなのでプロダクトに全く影響与えないので簡単に始められそう。
ただあまりロジックを書かないのでES6をそこまで書いている感じはしなかったです。(ES6を使いこなせていないだけかもしれないですが)
そこまで恩恵を受けられていない気がしました。gulpfileを`.coffee`で書いたときほどの感動はなかったです。ほかのところもES6で書いてるから、そのまま書きたいとかにならない限りcoffeeで自分は書いてしまう気がします。


gulpのissueみてみると[gulpjs/gulp/issues/830](https://github.com/gulpjs/gulp/issues/830)に書いてあるよいにgulp4で対応してくれるみたいですね。今回楽にES6のfileをわかりやすくするために`.es6`という拡張子にしましたが、世間的にはそこまで推奨されていない感じなんでかね。
ここissueではES6か判断するために正規表現で`.6to5.js`にしようぜっていってる間にbabelになっていたことが面白かったです。結局`gulpfile.babel.js`とかになるのでしょうか

## 追記(20150313)
上記だと現状watchがうまく動かないらしいです。
詳細はこちらに書いてあります。
http://pirosikick.hateblo.jp/entry/2015/03/11/005925

## 追記2(20150715)
gulp自体が3.9.0からちゃんと対応してくれるようになりました。
https://github.com/gulpjs/gulp/issues/830

こちらにあるように`gulpfile.babel.js`とfile名を変更すれば勝手にbabelで解決してくれるようです。


こちらにやり方を書いてくださってる方がいたので参考にしてみてください。

http://stephensauceda.com/es6-in-your-gulp-tasks/
