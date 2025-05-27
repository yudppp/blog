const path = require('path');

function getSiteConfig() {
  // SITE_URLは環境変数優先
  const envSiteUrl = process.env.SITE_URL;
  return {
    siteUrl: envSiteUrl || 'https://blog.yudppp.com',
    siteTitle: '○△□ - yudppp techblog',
    author: 'yudppp',
    description: 'yudpppの技術ブログ',
    output: {
      index: path.join(__dirname, './build/index.html'),
      postsDir: path.join(__dirname, './build/posts'),
      postsJson: path.join(__dirname, './build/data/posts.json'),
      rss: path.join(__dirname, './build/rss.xml'),
      decksDir: path.join(__dirname, 'decks'),
      slidesOutDir: path.join(__dirname, 'build/decks'),
      deckIndex: path.join(__dirname, 'build/decks/index.html'),
      ogpDir: path.join(__dirname, './build/ogp'),
    }
  };
}

module.exports = getSiteConfig;
