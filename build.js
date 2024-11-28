const contentful = require('contentful');
const Prism = require('prismjs');
require('prismjs/components/prism-go');
require('prismjs/components/prism-javascript');
require('prismjs/components/prism-typescript');
require('prismjs/components/prism-sql');
const fs = require('fs-extra');
const path = require('path');
const markdownIt = require('markdown-it');
const handlebars = require('handlebars');

const md = markdownIt({
  math: true,
  options: {
    typographer: true,
  },
  highlight: (str, lang) => {
    if (lang && Prism.languages[lang]) {
      return `<pre class="language-${lang}"><code class="language-${lang}">${Prism.highlight(str, Prism.languages[lang], lang)}</code></pre>`;
    }
    return `<pre class="language-plaintext"><code>${md.utils.escapeHtml(str)}</code></pre>`;
  },
});

// Contentfulの設定
const client = contentful.createClient({
  space: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
});

// 共通のヘッダー、フッター、ヘッド、レイアウトのテンプレート
const headerTemplate = `<header>
    <div class="nav">
        <div class="nav__left">
            <span class="nav__item">
                <a href="/" class="nocolor">
                    <canvas class="blog-logo" width="300" height="100"></canvas>
                </a>
            </span>
        </div>
    </div>
</header>`;

const footerTemplate = `<footer>
    <a href="/posts/whoami">
        <div class="media profile">
            <div class="media-left">
                <img class="avatarholder" src="/static/profile.svg" />
            </div>
            <div class="media-body">
                <div class="media-heading">@yudppp</div>
                <div class="media-content">Web engineer.</div>
            </div>
        </div>
    </a>
</footer>`;

const headTemplate = `<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{title}}</title>
    <link rel="shortcut icon" href="/static/favicon.png">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.23.0/themes/prism.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/hack/0.8.1/hack.css" />
    <link rel="stylesheet" href="/static/styles.css">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/rough.js/2.1.1/rough.min.js"></script>
    <script>
      document.addEventListener('DOMContentLoaded', function() {
      var roughness = Math.random() * Math.random();
        var logos = document.getElementsByClassName("blog-logo");
        if (logos.length !== 0) {
          for (var i = 0; i < logos.length; i++) {
            var rc = rough.canvas(logos[i]);
            rc.circle(60, 55, 79, {
              roughness: roughness,
              stroke: "#111",
              fill: "#ff2e88",
              strokeWidth: 3,
              fillWeight: 3
            });
            rc.polygon([
              [155, 20.71],
              [115, 90],
              [195, 90]
            ], {
              roughness: roughness,
              stroke: "#111",
              fill: "#ffd936",
              strokeWidth: 3,
              fillWeight: 3
            });
            rc.rectangle(220, 20, 70, 70, {
              roughness: roughness,
              stroke: "#111",
              fill: "#2e6eff",
              strokeWidth: 3,
              fillWeight: 3
            });
          }
        }
      });
    </script>
</head>`;

const layoutTemplate = `<!DOCTYPE html>
<html lang="ja">
${headTemplate}
<body class="hack">
    <div class="container">
        ${headerTemplate}
        {{{body}}}
        ${footerTemplate}
    </div>
</body>
</html>`;

// ビルド時にデータを取得して静的ファイルとして保存
const buildData = async () => {
  try {
    // Contentfulからブログ記事を取得
    const entries = await client.getEntries({ content_type: 'posts', order: '-fields.date' });

    if (!entries.items) {
      throw new Error('No entries found for the content type: posts');
    }

    // 記事本文にPrismでシンタックスハイライトを適用
    const posts = entries.items.map((item) => {
      return {
        id: item.fields.slug,
        title: item.fields.title,
        date: item.fields.date,
        content: md.render(item.fields.contents),
      };
    });

    // 日付の新しい順にソート
    posts.sort((a, b) => new Date(b.date) - new Date(a.date));

    // 前後の記事の情報をシンプルに保持
    const postsData = posts.map((post, index) => {
      return {
        ...post,
        prev: index > 0 ? { id: posts[index - 1].id, title: posts[index - 1].title } : null,
        next: index < posts.length - 1 ? { id: posts[index + 1].id, title: posts[index + 1].title } : null
      };
    });

    // 前後の記事を追加
    posts.forEach((post, index) => {
      post.prev = index > 0 ? posts[index - 1] : null;
      post.next = index < posts.length - 1 ? posts[index + 1] : null;
    });

    // 各ページを静的ファイルとして保存
    const postsOutputPath = path.join(__dirname, 'build', 'data', 'posts.json');
    await fs.outputJson(postsOutputPath, postsData);

    // Handlebarsテンプレートの設定
    const indexTemplate = `
<div class="posts">
    {{#each posts}}
    <div class="posts-item">
        <a href="/posts/{{id}}.html">
            <h2>{{title}} - <span>{{date}}</span></h2>
        </a>
    </div>
    {{/each}}
</div>`;
    const indexCompiled = handlebars.compile(layoutTemplate);
    const indexHtml = indexCompiled({
      title: '○△□ - yudppp techblog',
      body: handlebars.compile(indexTemplate)({ posts })
    });
    const indexPath = path.join(__dirname, 'build', 'index.html');
    await fs.outputFile(indexPath, indexHtml);

    // 各記事詳細ページを生成
    postsData.forEach(async (post) => {
      const postTemplate = `
<h1>{{title}}</h1>
<p>{{date}}</p>
<div class="content">{{{content}}}</div>
<div class="prevnext">
    {{#if next}}
    <div class="pull-left">
        <a href="/posts/{{next.id}}.html">
            <span>&lt;&lt; {{next.title}}</span>
        </a>
    </div>
    {{/if}}
    {{#if prev}}
    <div class="pull-right">
        <a href="/posts/{{prev.id}}.html">
            <span>{{prev.title}} &gt;&gt;</span>
        </a>
    </div>
    {{/if}}
</div>`;
      const postCompiled = handlebars.compile(layoutTemplate);
      const postHtml = postCompiled({
        title: post.title,
        body: handlebars.compile(postTemplate)(post)
      });
      const postPath = path.join(__dirname, 'build', 'posts', `${post.id}.html`);
      await fs.outputFile(postPath, postHtml);
    });

    console.log('Data and pages have been built and saved successfully');
  } catch (error) {
    console.error('Error fetching entries from Contentful:', error);
  }
};

buildData();
