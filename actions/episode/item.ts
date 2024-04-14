"use server";

import db from "@/db";

export const episodeItemAction = async ({
  episodeId,
}: {
  episodeId: number;
}) => {
  const item = await db.episode.findFirst({
    where: {
      deleted: false,
      id: episodeId,
    },
  });
  return item;
};
