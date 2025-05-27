const contentful = require("contentful");
const Prism = require("prismjs");
require("prismjs/components/prism-go");
require("prismjs/components/prism-javascript");
require("prismjs/components/prism-typescript");
require("prismjs/components/prism-sql");
const markdownIt = require("markdown-it");
const markdownItKatex = require("markdown-it-katex");

const client = contentful.createClient({
  space: process.env.CONTENTFUL_SPACE,
  accessToken: process.env.CONTENTFUL_TOKEN,
});

const md = markdownIt({
  options: {
    typographer: true,
  },
  highlight: (str, lang) => {
    if (lang && Prism.languages[lang]) {
      return `<pre class="language-${lang}"><code class="language-${lang}">${Prism.highlight(str, Prism.languages[lang], lang)}</code></pre>`;
    }
    return `<pre class="language-plaintext"><code>${md.utils.escapeHtml(str)}</code></pre>`;
  },
}).use(markdownItKatex, { 
  throwOnError: true, 
  errorColor: "red",
  delimiters: [
    {left: "$", right: "$", display: false},
    {left: "$$", right: "$$", display: true}
  ]
});

async function loadPosts() {
  const entries = await client.getEntries({
    content_type: "posts",
    order: "-fields.date",
  });
  if (!entries.items) throw new Error("No entries found for the content type: posts");
  const posts = entries.items.map((item) => ({
    id: item.fields.slug,
    title: item.fields.title,
    date: item.fields.date,
    content: md.render(item.fields.contents),
    noindex: item.fields.noindex,
  }));
  posts.sort((a, b) => new Date(b.date) - new Date(a.date));
  return posts;
}

module.exports = loadPosts;
