---
title: ISUCON5の予選に参加した話
date: 2015-10-05
tags: ["contest"]
excerpt: 昨年のISUCON4では初めてGolangを触り、ワーカー数を増やせることに気づかず負荷余裕なのになーっていていたのの雪辱をはらすべき、去年もおんぶに抱っこさせてもらった先輩がたと一緒に参加しました。
---

## はじめに
昨年のISUCON4では初めてGolangを触り、ワーカー数を増やせることに気づかず負荷余裕なのになーっていていたのの雪辱をはらすべき、去年もおんぶに抱っこさせてもらった先輩がたと一緒に参加しました。

## メンバー

- NW周りとか色々やっているインフラの先輩
- Javaをメインで書いてるアプリケーションエンジニアの先輩
- go書いたりjs書いたりしている自分

## 前準備したこと

重い処理があったときにCacheしようとしていたのでmemcachedやRedisをすぐに導入できるようにgoのfileを準備

[gist.github.com](https://gist.github.com/yudppp/e3e3cbbe0bdd2143ec50)

## 当日

#### 11:00
- GCEのイメージ持ってきて、なんとかサーバーに入る(だれもGCP未経験)

#### 11:30
- 現状動いているアプリケーションとversionの洗い出し
- githubのprivate repositoryにアプリケーションをいれて開発しやすいように

#### 12:00
- 一旦Javaで動かしてみる
- Score: 8xxで一瞬トップに

#### 12:30
- slow queryを一秒超えたものをでるようにしてもらう。
- my.confがどうのこうのやっていた。
- アプリケーションの概要を把握していく

#### 13:00

```
SELECT user_id, owner_id, DATE(created_at) AS date, MAX(created_at) AS updated FROM footprints WHERE user_id = 4881 GROUP BY user_id, owner_id, DATE(created_at) ORDER BY updated DESC LIMIT 50;
```

と足跡のところでIndexがなくslowqueryがでていたのでindex追加

なぜかJavaとGoを両方試していく

#### 13:30
```
SELECT * FROM relations WHERE one = 3992 OR another = 3992 ORDER BY created_at DESC;
```
relationsがORを使っていてslowqueryでていたので
```
SELECT * FROM relations WHERE one = 3992;
```
と
```
SELECT * FROM relations WHERE another = 3992;
```
を叩きアプリ側でcreated_atでソートするように変更

anotherにもindex貼るように変更

bootstrapをcacheさせる

#### 14:00

entryの取得がなんか思いと言い出す

```
SELECT * FROM entries WHERE user_id = 2705 AND private=0 ORDER BY created_at DESC LIMIT 20;
```

がindex使ってるし重い理由がよくわからなかったので一旦放置

relationsをredisとかにのせたいと言い出すが初期化とか時間考えると手を出せずにいる

#### 14:30
なんどもqueryを叩いていた`isFriend`を先に取得させた友達一覧から調べるように変更

#### 15:00
人生で初めてピザ頼む(ドミノピザ)

#### 15:30
user数が5000件しかいなかったので
userとprofileをアプリのメモリにのせる

#### 16:30
`/`でN+1queryになっていたところを直していく


#### 17:00
ピザが冷める

#### 17:30
nginxがそもそも不要なんではないかという話になり外してみたがあまりスコアは変わらず

#### 18:00

ルールの再確認

#### 18:30
更新系が一秒以内に変わっていればよいみたいな話だったので更新は非同期にする。


#### 19:00
終了

## 結果
決勝進出した方の半分以下の点数しか出せず敗退


## やるべきだったこと

- アプリケーションの更新をする際にローカルで作成したfileを直接コピペしていたので、リリースしやすくしておくべきだった。
- goとjavaを同時に動かしていた関係上どちらかしか動かせず無駄があった。
localで動くようにするか開発用のインスタンスを作っておくべきだった。
- slowqueryを中心に見ていたが、どのページにアクセスしたときにどんなqueryが走るかを見ておくべきだった。
- dump取った上でもうすこし思い切りをもって大きな変更をしていくべきたった。

## まとめ

来年こそ予選突破し優勝できるようにこの一年がんばっていこうと思います。
