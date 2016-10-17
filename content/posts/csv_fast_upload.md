---
date: 2016-10-17
title: Golangで大きなcsvのインポートを速くする
tags: ["golang"]
---

## はじめに

Golangで大きなcsvファイルをパースして諸々の処理をしてインポートをする処理を書いていたのですが、明らかに遅く5分以上かかる処理になっていました。
そこでgoルーチンを導入して並列で実行することによって効率化を図りました。

## 対応前

```go
func main() {
	// 1度に取得する量
	bulkCount := 100

	file, _ := os.Open("./data.csv")
	defer file.Close()

	reader := csv.NewReader(file)

	// ヘッダー行の取得
	header, _ := reader.Read()

	for {
		lines := make([][]string, 0, bulkCount)
		isLast := false
		for i := 0; i < bulkCount; i++ {
			line, err := reader.Read()
			if err == io.EOF {
				isLast = true
				break
			} else if err != nil {
				panic(err)
			}
			lines = append(lines, line)
		}
        
		exec(lines)

		if isLast {
			break
		}
	}
}

```

*一部のエラーは可読性のため捨てています

元のコードはこのようなになっていて、件数が多く、`exec(lines)`の処理が重いせいもあり、やたら時間がかかってしまっていました。

## 対応について

下記のコードはよくよくない例として出されるコードです。

```go
func main() {
	reader := csv.NewReader(file)
	...
	for {
		lines, isLast, err := getLines()
		...
		go exec(lines)
		...
	}
}

func getLines(reader io.Reader) ([]string, bool, err){
	lines := make([][]string, 0, bulkCount)
	isLast := false
	for i := 0; i < bulkCount; i++ {
		line, err := reader.Read(reader)
		if err == io.EOF {
			isLast = true
			break
		} else if err != nil {
			return nil, false, err
		}
		lines = append(lines, line)
	}
	return lines, isLast, err
}
```

ほとんどのコードは変えずに並列で実行したい関数のみgoroutineで動かします。
このようにするとgoroutineが増えすぎて問題が起きてしまいます。

そのためgoroutineの数が制御できるようにしていきます。

```
func main() {
	reader := csv.NewReader(file)
	var wg sync.WaitGroup
	for i := 0; i < 10; i++ {
		wg.Add(1)
		go func() {
			for {
				lines, isLast, err := getLines(reader)
				...
				exec(lines)
				if isLast {
					wg.Done()
				}
			}
		}
	}
}

func getLines(reader io.Reader) ([]string, bool, err){
	lines := make([][]string, 0, bulkCount)
	isLast := false
	for i := 0; i < bulkCount; i++ {
		line, err := reader.Read()
		if err == io.EOF {
			isLast = true
			break
		} else if err != nil {
			return nil, false, err
		}
		lines = append(lines, line)
	}
	return lines, isLast, err
}
```
のようにgoroutineを動かす固定すると安全に動かす事ができます。

ただし上記のようなコードを実行した際に

```
line, err := reader.Read()
```

の箇所でエラーが出てしまう事がありました。

これは`reader.Read()`が同時に実行された場合を保障されていないためでした。

このため`Read`の実行は同時に走らないようにするため

```
func main() {
	reader := csv.NewReader(file)
	var wg sync.WaitGroup
	m := new(sync.Mutex)
	for i := 0; i < 10; i++ {
		wg.Add(1)
		go func() {
			for {
				m.Lock()
				lines, isLast, err := getLines(reader)
				m.Unlock()
				...
				exec(lines)
				if isLast {
					wg.Done()
				}
			}
		}
	}
}
```

のようにLockをとって動かすようにしたところ問題なく動くようになりました。


## 結果

上記の並列の対応と一度に取得していた数を100から1000に変更したところ、5分以上かかっていたものが数秒で200を返すようになった。

また今回のインポートは順番を気にする必要なものではない場合のみ有効なものになります。