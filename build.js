const contentful = require('contentful');
const Prism = require('prismjs');
require('prismjs/components/prism-go');
require('prismjs/components/prism-javascript');
require('prismjs/components/prism-typescript');
require('prismjs/components/prism-sql');
const markdownIt = require('markdown-it');
const markdownItKatex = require('markdown-it-katex');
const fs = require('fs-extra');
const path = require('path');
const handlebars = require('handlebars');

// Contentfulの設定
const client = contentful.createClient({
  space: process.env.CONTENTFUL_SPACE,
  accessToken: process.env.CONTENTFUL_TOKEN,
});

// Markdownの設定
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
}).use(markdownItKatex, { throwOnError: false, errorColor: 'red' });

// Register partials
handlebars.registerPartial('header', fs.readFileSync(path.resolve(__dirname, './templates/header.hbs'), 'utf8'));
handlebars.registerPartial('footer', fs.readFileSync(path.resolve(__dirname, './templates/footer.hbs'), 'utf8'));
handlebars.registerPartial('head', fs.readFileSync(path.resolve(__dirname, './templates/head.hbs'), 'utf8'));
const layoutTemplate = fs.readFileSync(path.resolve(__dirname, './templates/layout.hbs'), 'utf8');

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

    // 各ページを静的ファイルとして保存
    const postsOutputPath = path.join(__dirname, './build/data/posts.json');
    await fs.outputJson(postsOutputPath, postsData);

    // Handlebarsテンプレートの設定
    const indexTemplate = fs.readFileSync(path.resolve(__dirname, './templates/index.hbs'), 'utf8');
    const indexCompiled = handlebars.compile(layoutTemplate);
    const indexHtml = indexCompiled({
      title: '○△□ - yudppp techblog',
      body: handlebars.compile(indexTemplate)({ posts })
    });
    const indexPath = path.join(__dirname, './build/index.html');
    await fs.outputFile(indexPath, indexHtml);

    // 各記事詳細ページを生成
    postsData.forEach(async (post) => {
      const postTemplate = fs.readFileSync(path.resolve(__dirname, './templates/post.hbs'), 'utf8');
      const postCompiled = handlebars.compile(layoutTemplate);
      const postHtml = postCompiled({
        title: post.title,
        body: handlebars.compile(postTemplate)(post)
      });
      const postPath = path.join(__dirname, './build/posts', `${post.id}.html`);
      await fs.outputFile(postPath, postHtml);
    });

    console.log('Data and pages have been built and saved successfully');
  } catch (error) {
    console.error('Error fetching entries from Contentful:', error);
  }
};

buildData();
