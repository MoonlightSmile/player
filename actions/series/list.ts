"use server";

import db from "@/db";

export const seriesListAction = async () => {
  const list = await db.series.findMany({
    where: {
      deleted: false,
      status: "status",
    },
  });
  return list;
};
