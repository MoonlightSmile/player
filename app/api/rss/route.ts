import db from "@/db";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const searchParams = new URLSearchParams(url.search);
  const rssId = searchParams.get("rssId");
  if (rssId) {
    const rss = await db.rss.findUnique({
      where: { id: Number(rssId) },
    });
    console.log("rss:", rss);
    return Response.json(rss);
  } else {
    const rssList = await db.rss.findMany();
    return Response.json(rssList);
  }
}

export async function POST(req: Request) {
  const {} = await req.json();
}
