const fs = require("fs-extra");
const execSync = require('child_process').execSync;
const loadPosts = require('./loadPosts');
const loadDecks = require('./loadDecks');
const generatePages = require('./generatePages');
const generateRSS = require('./generateRSS');
const generateOGPForPosts = require('./generateOGP');
const getSiteConfig = require('./siteConfig');


async function buildData() {
  try {
    const config = getSiteConfig();
    // 1. Load posts
    const posts = await loadPosts();
    // 2. Generate OGP images for posts
    await generateOGPForPosts(posts, config.output.ogpDir);
    // 3. Build slides (decks)
    try {
      execSync(`npx @marp-team/marp-cli -I ${config.output.decksDir} -o ${config.output.slidesOutDir} --theme ${config.output.decksDir}/theme/theme.css`);
      console.log('Slides built successfully.');
    } catch (e) {
      console.error('Error building slides with Marp:', e.message);
    }
    // 4. Load decks
    const decks = loadDecks(config.output.decksDir, config.output.slidesOutDir);
    // 5. Generate pages (index, deckIndex, etc.)
    await generatePages({ posts, decks });
    // 6. Generate RSS
    generateRSS({ posts, decks });
    // 7. Save posts data as JSON
    await fs.outputJson(config.output.postsJson, posts);
    console.log("Data and pages have been built and saved successfully");
  } catch (error) {
    console.error("Error in build process:", error);
  }
}
buildData();
