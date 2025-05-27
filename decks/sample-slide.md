---
marp: true
title: "Marp カスタムテーマ作ってみた"
description: LLMブームで再注目！Markdownでスライドを作る時代へ
date: 2025-05-27
theme: hack
---

# Marp カスタムテーマ作ってみた

---

## Marpとは？

- **Markdownでスライドが作れる**オープンソースツール
- CSSでデザインを自由にカスタマイズ可能
- GitHub連携・CI/CDとの相性抜群
- **CLI / VS Code / Marp Web** など複数の使い方あり

---

## なぜ今Marpが注目されているのか？

- **LLMブームでMarkdown文化が再燃**  
  → ChatGPTなどでMarkdown出力が一般的に  
- 技術系プレゼンで「コード重視」の需要が増加  
- Markdownベースなので**再利用性が高く、修正も簡単**

---

## きっかけ

- 以前はFigmaでスライド作成 →  
  コードハイライトや更新が面倒だった…
- 技術ブログや発表資料で統一感を持たせたい
- Marpなら**Markdown＋CSSで簡単に**テーマが作れる！

---

## Marpテーマの作り方（基本）

1. `theme.css` を作成（今回は [hack.css](https://github.com/egoist/hack) を参考）
2. `@theme` ディレクティブでテーマ名を宣言
3. Marp CLIで `--theme` オプションを使ってビルド

```css
/* decks/theme/theme.css */
@theme hack;
@import "default";

:root {
  --key-color: #ffd936;
  --accent-color: #2e6eff;
}

/* ...カスタムCSS... */
````

---

## カスタムの工夫ポイント

* フォントや色の統一
* 見出し・リスト・表のスタイル変更
* コードブロックやblockquoteのデザイン改善
* **日本語フォント対応・レスポンシブ対応**も可能！

---

## コードブロックの工夫（例）

````css
section pre code:before {
  content: "```";
  display: block;
}
section pre code:after {
  content: "```";
  display: block;
  margin-top: 0.5rem;
}
````

---

## Goのコードサンプル（syntax highlight）

```go
package main

import "fmt"

func main() {
  fmt.Println("Hello, Marp!")
}
```

---

## TypeScriptのコードサンプル

```ts
type User = {
  id: number
  name: string
}

const fetchUser = async (id: number): Promise<User> => {
  const res = await fetch(`/api/users/${id}`)
  return res.json()
}
```

---

## スライドの見た目（例）

* タイトル、表、リスト、画像、数式まで美しく表示可能！

![Marp Logo](https://raw.githubusercontent.com/marp-team/marp/master/marp.png)

---

## 使ってみてよかったこと

* スライドの**更新が圧倒的に楽に！**
* デザインの再利用性が高い
* バージョン管理しやすい
* **チームでの共有やコラボレーションにも最適**

---

## まとめ

* FigmaからMarpに移行して大満足
* Markdownでスライドが書けると、**作成・更新がとても楽！**
* カスタムテーマでデザインも統一できる
* LLMとの相性も◎

---

## 参考リンク集

* 📘 [Marp公式](https://marp.app/)
* 🎨 [Marpテーマ作成ガイド](https://marp.app/theme-css)
* 🛠️ [GitHub: marp-team/marp](https://github.com/marp-team/marp)
* 💡 [hack.css](https://github.com/egoist/hack)
