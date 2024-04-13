import db from "@/db";

export async function GET(request: Request) {
  const series = await db.series.findMany();
  return Response.json(series);
}

export async function POST(request: Request) {
  // Extract data from the request body
  const { channel, title, link, description, thumbnail, category } =
    await request.json();

  // Try to find the existing series
  const existingSeries = await db.series.findFirst({
    where: {
      channel,
    },
  });

  // Check if the series already exists
  if (existingSeries) {
    console.log("Series found:", existingSeries);
    // If exists, update the series with new data
    await db.series.updateMany({
      where: { channel },
      data: { channel, title, link, description, thumbnail, category },
    });
  } else {
    console.log("No existing series found. Creating a new series.");
    // If not exists, create a new series
    await db.series.create({
      data: { channel, title, link, description, thumbnail, category },
    });
  }
  const item = await db.series.findFirst({
    where: {
      channel,
    },
  });
  return Response.json(item);
}
