const generateOGPImage = require('./ogpGenerator');
const path = require('path');
const fs = require('fs-extra');

async function generateOGPForPosts(posts, ogpDir) {
  for (const post of posts) {
    const ogpImagePath = path.join(ogpDir, `${post.id}.png`);
    await generateOGPImage(
      post.title,
      new Date(post.date).toLocaleDateString('ja-JP'),
      ogpImagePath
    );
    post.ogpImage = `/ogp/${post.id}.png`;
  }
}

module.exports = generateOGPForPosts;
