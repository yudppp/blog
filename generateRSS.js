const { Feed } = require("feed");
const fs = require("fs-extra");
const path = require("path");
const getSiteConfig = require('./siteConfig');

function generateRSS({ posts, decks }) {
  const config = getSiteConfig();
  const { siteUrl, siteTitle, author, description, output } = config;
  const feed = new Feed({
    title: siteTitle,
    description: description || "yudpppの技術ブログ",
    id: siteUrl,
    link: siteUrl,
    language: "ja",
    author: author || "yudppp",
    updated: new Date(),
    feedLinks: {
      rss: `${siteUrl}/rss.xml`,
    },
  });
  posts.forEach((post) => {
    const postUrl = `${siteUrl}/posts/${post.id}`;
    const shortDescription = post.content.replace(/<[^>]+>/g, '').substring(0, 200);
    feed.addItem({
      title: post.title,
      id: postUrl,
      link: postUrl,
      description: shortDescription,
      content: post.content,
      date: new Date(post.date),
    });
  });
  decks.forEach(deck => {
    feed.addItem({
      title: deck.title,
      id: siteUrl + deck.url,
      link: siteUrl + deck.url,
      description: `${deck.title}${deck.author ? ' by ' + deck.author : ''}`,
      content: `<a href='${deck.url}'>${deck.title}</a>`,
      date: deck.date ? new Date(deck.date) : new Date(),
    });
  });
  const rssXml = feed.rss2();
  fs.outputFileSync(output.rss, rssXml);
}

module.exports = generateRSS;
