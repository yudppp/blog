---
title: I made get commonInitialisms library(Using go/ast)
date: 2019-08-24
tags: ["go", "en"]
excerpt: I made get commonInitialisms library. Using go/ast package
---

Hello. I made [get commonInitialisms](https://github.com/yudppp/commoninitialisms) library for Go.

`commonInitialism` is words that should be written in uppercase on Go. (e.g. ID, JSON, URL, SQL)

## Why need it

`commonInitialism` is defined `"golang.org/x/lint"` package.

```go
// commonInitialisms is a set of common initialisms.
// Only add entries that are highly unlikely to be non-initialisms.
// For instance, "ID" is fine (Freudian code is rare), but "AND" is not.
var commonInitialisms = map[string]bool{
	"ACL":   true,
	"API":   true,
	"ASCII": true,
	...
	"XSS":   true,
}
```
[golang/lint/lint.go](https://github.com/golang/lint/blob/8f45f776aaf18cebc8d65861cc70c33c60471952/lint.go#L768-L810)
<br />
<br />

I often think want to use it, when develop using ast.
<br />But this variable is unexported value. Also It will not change in the future.

Often copied and used it. [github.com/search?q=commonInitialisms](https://github.com/search?l=Go&q=commonInitialisms+API+ID&type=Code).

Everyone will be doing it unavoidably. If new word is added to commonInitialisms on lint pacakge, can't notice.

It is automatically updated in my library.(unless not change file name or variable name)

## How it was made

I used `golang.org/x/lint`, `go/ast`, `go/parser`, `go/token`, and `golang.org/x/tools/go/packages` libraries.

1. Blank import `golang.org/x/lint`
1. Search out `golang.org/x/lint/lint.go`, And get as Go file.(using packages)
1. Parsed it.(using go/token and go/parser)
1. Search commonInitialism variable.(using go/ast)

## Finally

Please create [Issue](https://github.com/yudppp/commoninitialisms/issues/new) and Pull Request.