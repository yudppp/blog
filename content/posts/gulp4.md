---
title: gulp 4.0について
date: 2015-07-16
excerpt: gulp v4.0がそろそろリリースされそうなので、どんなことができるようになるのか調べてみようと思いました。
---

## はじめに

[gulp](https://github.com/gulpjs/gulp)v4.0がそろそろリリースされそうなので、どんなことができるようになるのか調べてみようと思いました。

https://github.com/gulpjs/gulp/milestones/gulp%204
マイルストーンを見てみると78%くらい終わっていてあと少しという感じでしょうか


## gulp 4.0を先にinstallしてみる

直接gitから落としてくれば4.0を使うことができます。

```
$ npm install git://github.com/gulpjs/gulp.git#4.0 --save-dev
$ npm install git://github.com/gulpjs/gulp-cli.git#4.0 –g
```

## 4.0の変更内容

機能の変更内容については[CHANGELOG](https://github.com/gulpjs/gulp/blob/f076c407ae057bd72c03019aca69eaadd7e67cc5/CHANGELOG.md)に記載されています。

大きいところでいうとmethodがいくつか追加されていて`gulp.series`,`gulp.parallel`,`gulp.tree`,`gulp.registry`などがあります。


#### series/parallelについて

今までだと`runSequence`を使って行っていた並列/直列の処理が簡単に書けるようになります。

##### use runSequence
```
var gulp = require('gulp');
var runSequence = require('run-sequence');

gulp.task('build', function(callback) {
  runSequence('build-clean',
              ['build-scripts', 'build-styles'],
              'build-html',
              callback);
});
```
runSequenceを使っていた場合だいたいこのように使われていたと思います。

##### use gulp#v4.0

```
var gulp = require('gulp'); // gulp 4

gulp.task(
  'build',
  gulp.series(
    'build-clean',
    gulp.parallel('build-scripts', 'build-styles'),
    'build-html'
  )
);
```

こんな感じに書き換えることができました。
パフォーマンスはどちらがよいのでしょうか。暇なときに調べて見ようと思います。

#### gulp.treeについて

[API#gulptreeoptions](https://github.com/gulpjs/gulp/blob/aaed69d1fd73750227e803035b2a75d0f49e7de0/docs/API.md)こちらに詳細が書いてありますがgulp.treeを使うと登録してあるtaskの一覧を取得することができます。

また下記のようにオプションでdeepをtrueにしておくと
```
gulp.tree({ deep: true })
/*output: [
   {
      "label":"one",
      "type":"task",
      "nodes":[]
   },
   {
      "label":"two",
      "type":"task",
      "nodes":[]
   },
   {
      "label":"three",
      "type":"task",
      "nodes":[]
   },
   {
      "label":"four",
      "type":"task",
      "nodes":[
          {
            "label":"<series>",
            "type":"function",
            "nodes":[
               {
                  "label":"one",
                  "type":"task",
                  "nodes":[]
               },
               {
                  "label":"two",
                  "type":"task",
                  "nodes":[]
               }
            ]
         }
      ]
   },
   {
      "label":"five",
      "type":"task",
      "nodes":[
         {
            "label":"<series>",
            "type":"function",
            "nodes":[
               {
                  "label":"four",
                  "type":"task",
                  "nodes":[
                     {
                        "label":"<series>",
                        "type":"function",
                        "nodes":[
                           {
                              "label":"one",
                              "type":"task",
                              "nodes":[]
                           },
                           {
                              "label":"two",
                              "type":"task",
                              "nodes":[]
                           }
                        ]
                     }
                  ]
               },
               {
                  "label":"<parallel>",
                  "type":"function",
                  "nodes":[
                     {
                        "label":"three",
                        "type":"task",
                        "nodes":[]
                     },
                     {
                        "label":"<anonymous>",
                        "type":"function",
                        "nodes":[]
                     }
                  ]
               }
            ]
         }
      ]
   }
]
*/
```

タスクとそのタスクに依存するタスクがわかるようになります。

またCLI用にも用意されていて
[CLI.md](https://github.com/gulpjs/gulp/blob/d2217b82f3690101d3bd5691326186a77f70efc3/docs/CLI.md#-t-or---tasks)

```
$ gulp -T // or gulp --tasks
[20:58:55] Tasks for ~\exampleProject\gulpfile.js
[20:58:55] ├── one
[20:58:55] ├── two
[20:58:55] ├── three                    
[20:58:55] ├─┬ four
[20:58:55] │ └─┬ <series>
[20:58:55] │   ├── one
[20:58:55] │   └── two
[20:58:55] ├─┬ five
[20:58:55] │ └─┬ <series>
[20:58:55] │   ├─┬ four
[20:58:55] │   │ └─┬ <series>
[20:58:55] │   │   ├── one
[20:58:55] │   │   └── two
[20:58:55] │   └─┬ <parallel>
[20:58:55] │     ├── three
[20:58:55] │     └── <anonymous>
```

でこのように先ほど同様の依存関係がでます。

また`--tasks-simple`で簡単なタスク一覧がみれます。
```
$ gulp --tasks-simple
one
two
three
four
five
```

CLIでみれるのは、あのタスクだけ回したいと思ったときに、しょっちゅうタスク名忘れてgulpfile読んでたひとからするとありがたいです。

#### gulp.registryについて

今までだとひとつのgulpfileが大きくなってしまって分割したくなったときに
[requireDir](https://github.com/gulpjs/gulp/blob/master/docs/recipes/split-tasks-across-multiple-files.md)したり[gulp-load-plugins](https://github.com/jackfranklin/gulp-load-plugins)していたかと思います。

registryを使うと
```
//gulpfile.js
var gulp = require('gulp');

var companyTasks = require('./myCompanyTasksRegistry.js');

gulp.registry(companyTasks);

gulp.task('one', gulp.parallel('someCompanyTask', function(done) {
  console.log('in task one');
  done();
}));
```

```
//myCompanyTasksRegistry.js
var util = require('util');

var DefaultRegistry = require('undertaker-registry');

function MyCompanyTasksRegistry() {
  DefaultRegistry.call(this);

  this.set('clean', function(done) {
    done();
  });
  this.set('someCompanyTask', function(done) {
    console.log('performing some company task.');
    done();
  });
}
util.inherits(MyCompanyTasksRegistry, DefaultRegistry);

module.exports = new MyCompanyTasksRegistry();
```

registryを使って登録することによって自然?に追加できるようになりました。


## まとめ

結局いつリリースになるのかわからなかったのですが4.0への更新は今まで外部のプラグイン等で補っていた機能がgulpそのもので使える感じになったくらいなのでしょうか。


## 参考にした記事
- https://github.com/gulpjs/gulp
- https://blog.wearewizards.io/migrating-to-gulp-4-by-example
- http://macr.ae/article/splitting-gulpfile-multiple-files.html
