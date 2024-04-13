import db from "@/db";

export async function GET(request: Request) {
  const series = await db.series.findMany();
  return Response.json(series);
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
