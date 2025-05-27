const fs = require("fs-extra");
const path = require("path");
const handlebars = require("handlebars");
const htmlMinifier = require("html-minifier").minify;
const getSiteConfig = require('./siteConfig');

function registerPartials() {
  handlebars.registerPartial(
    "head",
    fs.readFileSync(path.resolve(__dirname, "./templates/head.hbs"), "utf8"),
  );
  handlebars.registerPartial(
    "header",
    fs.readFileSync(path.resolve(__dirname, "./templates/header.hbs"), "utf8"),
  );
  handlebars.registerPartial(
    "footer",
    fs.readFileSync(path.resolve(__dirname, "./templates/footer.hbs"), "utf8"),
  );
  handlebars.registerPartial(
    "head",
    fs.readFileSync(path.resolve(__dirname, "./templates/head.hbs"), "utf8"),
  );
}

async function generatePages({ posts, decks }) {
  const config = getSiteConfig();
  const { siteTitle, siteUrl, author, description, output } = config;
  registerPartials();
  const layoutTemplate = fs.readFileSync(
    path.resolve(__dirname, "./templates/layout.hbs"),
    "utf8",
  );
  const indexTemplate = fs.readFileSync(
    path.resolve(__dirname, "./templates/index.hbs"),
    "utf8",
  );
  const deckIndexTemplate = fs.readFileSync(
    path.resolve(__dirname, "./templates/deckIndex.hbs"),
    "utf8",
  );
  const postTemplate = fs.readFileSync(
    path.resolve(__dirname, "./templates/post.hbs"),
    "utf8",
  );

  // Generate index.html (posts list)
  const indexCompiled = handlebars.compile(layoutTemplate);
  const indexHtml = indexCompiled({
    title: siteTitle,
    siteTitle,
    siteUrl,
    author,
    description,
    isIndex: true,
    isPosts: true,
    isDecks: false,
    body: handlebars.compile(indexTemplate)({ posts }),
  });
  const minifiedIndexHtml = htmlMinifier(indexHtml, {
    removeAttributeQuotes: true,
    collapseWhitespace: true,
    removeComments: true,
    minifyJS: true,
  });
  await fs.outputFile(output.index, minifiedIndexHtml);

  // Generate deckIndex.html (decks list)
  const deckIndexCompiled = handlebars.compile(layoutTemplate);
  const deckIndexHtml = deckIndexCompiled({
    title: 'Decks - ' + siteTitle,
    siteTitle,
    siteUrl,
    author,
    description,
    isIndex: true,
    isPosts: false,
    isDecks: true,
    body: handlebars.compile(deckIndexTemplate)({ decks }),
  });
  const minifiedDeckIndexHtml = htmlMinifier(deckIndexHtml, {
    removeAttributeQuotes: true,
    collapseWhitespace: true,
    removeComments: true,
    minifyJS: true,
  });
  await fs.outputFile(output.deckIndex, minifiedDeckIndexHtml);

  // Generate each post detail page
  // ナビゲーションを非表示にするためisDecks/isPostsを渡さない
  for (const post of posts) {
    // 記事の説明（最初の200文字）
    const description = post.content.replace(/<[^>]+>/g, '').substring(0, 200);
    const postCompiled = handlebars.compile(layoutTemplate);
    const postHtml = postCompiled({
      title: `${post.title} - ${siteTitle}`,
      siteTitle,
      siteUrl,
      author,
      description: description,
      body: handlebars.compile(postTemplate)(post),
      noindex: post.noindex,
      ogpImage: `/ogp/${post.id}.png`,
      pageUrl: `/posts/${post.id}`,
    });
    const minifiedPostHtml = htmlMinifier(postHtml, {
      removeAttributeQuotes: true,
      collapseWhitespace: true,
      removeComments: true,
      minifyJS: true,
    });
    await fs.outputFile(path.join(output.postsDir, `${post.id}.html`), minifiedPostHtml);
  }
}

module.exports = generatePages;
