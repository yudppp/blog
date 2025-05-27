const fs = require("fs-extra");
const path = require("path");
const matter = require("gray-matter");

const speakerDecks = [
  {
    "title": "型安全なDrag and Dropの設計を考える",
    "url": "https://speakerdeck.com/yudppp/designing-type-safe-drag-and-drop",
    "date": "2025-05-23"
  },
  {
    "title": "未知のプログラミング言語にChatGPTと共に挑む",
    "url": "https://speakerdeck.com/yudppp/challenging-an-unknown-programming-language-with-chatgpt",
    "date": "2023-07-20"
  },
  {
    "title": "SaaSフロントエンド開発の現場で求められる技術",
    "url": "https://speakerdeck.com/yudppp/technologies-for-saas-frontend-development-in-the-field",
    "date": "2023-03-30"
  },
  {
    "title": "2019年 HRBrainの技術的挑戦",
    "url": "https://speakerdeck.com/yudppp/hrbain-technology-challenge-2019",
    "date": "2019-12-20"
  },
  {
    "title": "Web開発を支えるマイグレーションツールについて",
    "url": "https://speakerdeck.com/yudppp/sqldef-introduction-for-psql-users",
    "date": "2019-12-07"
  },
  {
    "title": "ISUCON向けのツールを作った話",
    "url": "https://speakerdeck.com/yudppp/isutools",
    "date": "2019-11-06"
  },
  {
    "title": "Row Level Securityはマルチテナントの銀の弾丸になりうるのか",
    "url": "https://speakerdeck.com/yudppp/row-level-security-is-silver-bullet-for-multitenancy",
    "date": "2019-09-14"
  },
  {
    "title": "Webサービス開発に必要な統計学入門",
    "url": "https://speakerdeck.com/yudppp/study-of-statistics-for-web-developers",
    "date": "2019-07-26"
  }
]


function loadDecks(decksMdDir, slidesOutDir) {
  // 1.1 Get all deck MD files and parse meta
  const deckMdFiles = fs.readdirSync(decksMdDir)
    .filter(f => f.endsWith('.md'));
  const deckMetaMap = {};
  deckMdFiles.forEach(mdFile => {
    const mdPath = path.join(decksMdDir, mdFile);
    const mdContent = fs.readFileSync(mdPath, 'utf8');
    const { data } = matter(mdContent);
    const base = path.basename(mdFile, '.md');
    deckMetaMap[base] = data;
  });

  // 1. Get all deck HTML files
  const deckFiles = fs.readdirSync(slidesOutDir)
    .filter(f => f.endsWith('.html') && f !== 'index.html');

  // 2. Extract title, author, date from meta if available
  const decks = deckFiles.map(filename => {
    const base = path.basename(filename, '.html');
    const meta = deckMetaMap[base] || {};
    // Format date as YYYY-MM-DD if possible
    let formattedDate = '';
    if (meta.date) {
      const d = new Date(meta.date);
      if (!isNaN(d)) {
        formattedDate = d.toISOString().slice(0, 10);
      } else {
        formattedDate = meta.date;
      }
    }
    return {
      filename,
      title: meta.title || filename,
      author: meta.author || '',
      date: formattedDate,
      url: `/decks/${filename}`
    };
  });
  decks.push(...speakerDecks.map(deck => ({
    id: deck.title,
    title: deck.title,
    date: deck.date,
    url: deck.url,
    noindex: false
  })));
  // Sort by date descending
  decks.sort((a, b) => {
    if (a.date && b.date) {
      return new Date(b.date) - new Date(a.date);
    }
    return a.title.localeCompare(b.title);
  });
  return decks;
}

module.exports = loadDecks;
