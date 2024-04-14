import db from "../db/index";

async function main() {
  const upsertRssEntry1 = await db.rss.upsert({
    where: {
      id: 1, // Specifying the ID to search for
    },
    update: {
      name: "npr",
      url: "https://feeds.npr.org/510289/podcast.xml",
      latestContentHash: "newhash1234",
      latestFileUrl: "",
      status: "active",
      updatedAt: new Date(),
    },
    create: {
      name: "npr",
      url: "https://feeds.npr.org/510289/podcast.xml",
      latestContentHash: "newhash1234",
      latestFileUrl: "",
      status: "active",
    },
  });
  // https://video-api.wsj.com/podcast/rss/wsj/the-journal
  const upsertRssEntry2 = await db.rss.upsert({
    where: {
      id: 2, // Specifying the ID to search for
    },
    update: {
      name: "Lex Fridman Podcast",
      url: "https://lexfridman.com/feed/podcast/",
      latestContentHash: "newhash1234",
      latestFileUrl: "",
      status: "active",
      updatedAt: new Date(),
    },
    create: {
      name: "Lex Fridman Podcast",
      url: "https://lexfridman.com/feed/podcast/",
      latestContentHash: "newhash1234",
      latestFileUrl: "",
      status: "active",
    },
  });
}

main()
  .then(async () => {
    await db.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await db.$disconnect();
    process.exit(1);
  });
