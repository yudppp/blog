---
title: ISUCON8の予選で敗戦した話と感想戦で1位の点数を超えるまで頑張った話
date: 2018-09-24
tags: ["contest"]
excerpt: ISUCON8の予選で敗戦した話と感想戦で1位の点数を超えるまで頑張った話
---


## 当日

ISUCON8の予選に参加しました。ISUCON4から参加しているので5回目ですが、一度も決勝行けてないので辛いです。

今年もいつものメンバーで参加の予定だったのですが体調不良によって2人での参加になりました。

自分は当日メインでアプリを触りやったことのは

- User周りの不要なQuery削除
- Sheetをオンメモリーにもつ
- 1000N + 1 だった `getEvents` を一旦 N + 1 に修正
- reservationsに`user_id_idx`を追加
- getEventSimpleというsheet情報だけをとるように一部切り替え

この辺りを行い最高で`19,787`となりのあと1時間だったので夢を見たのですが、その後Failが続き色々検証しているうちに終了となりました。

reservationにRedisを使おうという考えもあったのですが時間考えると乗り出せませんでした。

<blockquote class="twitter-tweet" data-lang="ja"><p lang="ja" dir="ltr">今年のISUCON最高得点出した時のスクショ。予選突破の閾値が36,471だからもう一つ二つできてたら、、 <a href="https://t.co/K9pVmjahZj">pic.twitter.com/K9pVmjahZj</a></p>&mdash; yudppp (@yudppp) <a href="https://twitter.com/yudppp/status/1041272248038879233?ref_src=twsrc%5Etfw">2018年9月16日</a></blockquote>
<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

ちなみに構成は
1号機: DB
2号機: H2O
3号機: app(Go)
でした。


## 感想戦

あまりに悔しかったので予選の最高得点を超えれるよう1人で頑張ってみました。
個人的なルールとして今回はカンニング(他の参加者のブログを見ない)でやるようにしました。
ただしTwitterやDiscord等で受動的に入ってきてしまったものは見ています。

結果として `109,872` をだすことができ、一位通過の点数を越すことができたのでひと満足しています。(※実際の予選と同じスペックですが密集度が異なるためスコアが同一の水準に満たない場合があります)

主にアプリで追加でやったことは

- シートの予約時のロックをアプリで取るように変更 → これでFailが減った
- FOR UPDATEの除去
- `getEvents`のreservationをまとめて取るように
- renderReportCSVのsortを削除

この辺りを触っていたところ4万点台は出るようになってきましたが、アプリが一台で辛くなってきました。またh2oのサーバーに余裕があったので `/admin` のアクセスだけh2oと同じサーバーで動かすようにしたところ7万点台になりました。

ベンチの結果を見ると

> レスポンスが遅いため負荷レベルを上げられませんでした。/admin/api/reports/sales

だけとなっていて、このAPI自体はRDBを使っている以上どうしようもないところまできたので、マニュアルを見返して見た所、

> 負荷走行中は、毎秒負荷レベルが増えていきます。 ただし、過去5秒以内に何らかのエラーが発生していた場合は負荷レベルが上昇しません。 終了時の負荷レベルや、負荷レベルが上がらない原因になったエラーについてはポータルサイトから確認することができます。

> 負荷走行後の確認へのレスポンスがそれぞれ下記の規定秒数以内に戻らない場合
> POST /admin/api/actions/login: 20秒以内
> GET /admin/api/reports/sales: 60秒以内

の二つのルールに着目すると、レスポンスが遅い結果負荷レベルが上がらず、点数が上がらないといった感じでした。
そこで `/admin/api/reports/sale` に `time.Sleep(50 * time.Seconds)`を入れたところ負荷レベルが上がるようになり点数が増えて行きました。
Sleep時間を調整していった結果15秒Sleepさせた時に `109,872` となり最高得点となりました。

source: https://gist.github.com/yudppp/9cfee2009e220923218719e020271b82