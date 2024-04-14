"use server";

import db from "@/db";

export const episodeListAction = async ({ seriesId }: { seriesId: number }) => {
  const list = await db.episode.findMany({
    where: {
      deleted: false,
      seriesId,
    },
    orderBy: {
      order: "desc",
    },
  });
  return list;
};
