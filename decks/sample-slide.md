---
marp: true
title: "Marp カスタムテーマの使い方"
description: カスタムテーマの使い方・活用例まとめ
date: 2025-05-28
theme: hack
paginate: true
---

# Marp カスタムテーマの使い方

---

<!-- class: split-60-40 -->

<div class="left">

## プロフィール

- 名前: yudppp
- エンジニア
- Go, TypeScript, フロントエンド・バックエンド開発
- 技術発信・コミュニティ活動が好き
- [GitHub](https://github.com/yudppp)

</div>

<div class="right">

<img src="/static/profile.svg" alt="Profile" style="width: 140px;border-radius: 50%;" />

</div>

---

<!-- class: normal -->


## このテーマを使いこなす！

---

## 1. テーマの指定方法

スライド冒頭のYAMLフロントマターで `theme: hack` を指定します。

```yaml
---
marp: true
theme: hack
---
```

---

## 2. Splitレイアウトの使い方

左右にテキストと画像を分けたいときは、スライド先頭にクラスを指定します。

```markdown
<!-- class: split -->
```

- `split` : 50/50
- `split-60-40` : 左6割/右4割
- `split-40-60` : 左4割/右6割

---

<!-- class: split -->

<div class="left">

### 例: splitレイアウト

- テキストを左側に
- 画像や図を右側に
- レスポンシブ対応

</div>
<div class="right">

<img src="/static/profile.svg" alt="profile" style="max-width: 80%;" />

</div>

---
<!-- class: normal -->

## 3. コードブロックの装飾

このテーマでは、コードブロックの上下に「```」が自動で付きます。

```go
package main

import "fmt"

func main() {
	fmt.Println("Hello, 世界")
}
```

---
<!-- class: split-40-60 -->

<div class="left">

## 3. コードブロックの装飾

- `split-40-60` とセット

</div>
<div class="right">

```js
function VideoList({ videos, emptyHeading }) {
  const count = videos.length;
  let heading = emptyHeading;
  if (count > 0) {
    const noun = count > 1 ? 'Videos' : 'Video';
    heading = count + ' ' + noun;
  }
  return (
    <section>
      <h2>{heading}</h2>
      {videos.map(video =>
        <Video key={video.id} video={video} />
      )}
    </section>
  );
}
```

</div>

---

<!-- class: normal -->

## 4. リスト・見出しのカスタマイズ

- リストはCSSでマーカーを制御（`-`や`1.`が一つだけ表示）
- 見出しには自動で `##` などが付きます

---

## 5. 日本語フォント・レスポンシブ

- Noto Sans JP, YakuhanJP で日本語も美しく
- スマホでも見やすい大きめフォント

---

## 6. 画像の使い方

- 画像は `/static/` フォルダに置く
- 例: `<img src="/static/profile.svg" />`
- Markdown記法もOK: `![alt](/static/profile.svg)`

---

<!-- class: split-40-60 -->

<div class="left">

### 例: プロフィール紹介

- split-40-60 で画像を大きく
- テキストは左側

</div>
<div class="right">

<img src="/static/profile.svg" alt="profile" style="max-width: 100%; max-height: 60vh; border-radius: 50%; box-shadow: 0 4px 16px rgba(0,0,0,0.08);" />

</div>

---
<!-- class: normal -->

## 7. カスタムCSSの追加

`theme.css` を編集すれば、
- 色やフォント
- レイアウト
- コード装飾
など自由に拡張できます。

---

## 注意事項・Tips

- `<!-- class: split -->` などでレイアウトを切り替えた後、
  - 通常のスライドに戻したい場合は `<!-- class: normal -->` を明示的に指定してください
- split系レイアウトは全体が左右分割されるので、
  - 1カラムに戻したい場合は必ず `<!-- class: normal -->` を使う
- クラス指定を忘れると、前のレイアウトが引き継がれることがあります
- 画像パスは `/static/` 配下を推奨
- カスタムCSSを追加した場合は、Marpのキャッシュやビルドをリフレッシュしてください

---

## まとめ

- YAMLでテーマ指定
- split系でレイアウト自在
- コード・リスト・日本語も美しく
- 画像はstatic/に置く
- CSSでどんどんカスタマイズ！

