---
title: io.jsをnvmで管理する
date: 2015-10-23
---

## やってみた

nvm側でio.jsに対応されるかも知れないですが、早めに触ってみた買ったのとnvmで管理させないとめんどくさいことになりそうだったのでやってみました。

[creationix/nvm/issues/590](https://github.com/creationix/nvm/issues/590)


```
$ git clone git@github.com:iojs/io.js.git
$ cd io.js/
$ git tag -l	#最新versionを確認
$ git checkout refs/tags/v1.0.1-release
$ ./configure --prefix=/path/to/.nvm/v1.0.1-iojs	# 既存の.nvm下に配置させる。
$ make -j10	#　並列で行う
$ make install
$ nvm ls
$ nvm use v1.0.1-iojs
$ iojs -v
```

諸々無駄な作業とかしましたがなんとかiojsが動きました。

[https://iojs.org/dist/v1.0.1/](https://iojs.org/dist/v1.0.1/)ここから落としてきてもよかったですね。はい

もっとこうした方がいいとかありましたらご指導お願いします。

[hokaccha/nodebrew](https://github.com/hokaccha/nodebrew)はもう対応しているらしいですね。

## 追記(2015年01月20日)
nvmが対応したそうなのでやってみることにしました。

```
$ cd ~/.nvm
$ git pull origin master
$ source nvm.sh
$ nvm ls-remote
	...
    v0.11.14
    iojs-v1.0.0
    iojs-v1.0.1
    iojs-v1.0.2
    iojs-v1.0.3
$ nvm install iojs-v1.0.3
$ nvm ls
->  iojs-v1.0.3
```
とできました。

checksumは現在サポートしていないいようです。
https://github.com/iojs/io.js/issues/368

io.jsのインストールはまだsourceから直接取得していないがすぐ追加されるそう。


## 参考にしたもの

- [iojs/io.js](https://github.com/iojs/io.js)
- [qiita.com/laiso](http://qiita.com/laiso/items/b3e543f85679928caec4)
