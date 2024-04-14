import db from "@/db";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const searchParams = new URLSearchParams(url.search);
  const status = searchParams.get("status");
  const seriesId = searchParams.get("seriesId");
  const limit = searchParams.get("limit");
  let whereClause: any = {};
  if (status) {
    whereClause.status = status;
  }
  if (seriesId) {
    whereClause.seriesId = Number(seriesId);
  }
  const queryOptions: any = {
    where: whereClause,
    orderBy: {
      order: "desc",
    },
  };

  if (limit && !isNaN(Number(limit))) {
    queryOptions.take = parseInt(limit, 10);
  }

  const episodes = await db.episode.findMany(queryOptions);
  return Response.json(episodes);
}

export async function POST(request: Request) {
  const { seriesId, episodes } = await request.json();

  const results = [];

  for (const episode of episodes) {
    console.log("episode:", episode);
    const existingEpisode = await db.episode.findFirst({
      where: { title: episode.title },
      select: { status: true, id: true }, // 只查询 status 字段
    });
    // 如果状态不是 "DONE"，则进行更新
    if (existingEpisode && existingEpisode.status !== "DONE") {
      const updatedEpisode = await db.episode.update({
        where: { id: existingEpisode.id },
        data: {
          mediaUrl: episode.mediaUrl,
          alignUrl: episode.alignUrl,
          whisperUrl: episode.whisperUrl,
          title: episode.title,
          episodeId: episode.episodeId,
          link: episode.link,
          description: episode.description,
          audioUrl: episode.audioUrl,
          thumbnail: episode.thumbnail,
          seriesId: seriesId,
          order: episode.order,
        },
      });
      results.push(updatedEpisode);
    }
    // TODO: TASK的更新

    if (!existingEpisode) {
      // 创建新的 Episode
      const newEpisode = await db.episode.create({
        data: {
          mediaUrl: episode.mediaUrl,
          alignUrl: episode.alignUrl,
          whisperUrl: episode.whisperUrl,
          status: "INIT",
          title: episode.title,
          episodeId: episode.episodeId,
          link: episode.link,
          description: episode.description,
          audioUrl: episode.audioUrl,
          thumbnail: episode.thumbnail,
          seriesId: seriesId,
          order: episode.order,
        },
      });
      results.push(newEpisode);
    }
  }

  return Response.json(results); // 返回新建或更新的结果数组
}

export async function PUT(request: Request) {
  const { episodeId, audioKey, whisperKey, timelineKey } = await request.json();
  console.log(episodeId, audioKey, whisperKey, timelineKey);
  const episode = await db.episode.update({
    where: { id: episodeId },
    data: {
      status: "DONE",
      mediaUrl: audioKey,
      alignUrl: timelineKey,
      whisperUrl: whisperKey,
    },
  });

  return Response.json(episode);
}
