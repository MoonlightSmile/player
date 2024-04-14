import { EpisodeList } from "@/components/episode/episode-list";

export default async function Page({
  params,
}: {
  params: { episodeSlug: string; seriesSlug: string };
}) {
  const { episodeSlug, seriesSlug } = params;
  console.log("episodeSlug", episodeSlug, seriesSlug);
  return (
    <main>
      <EpisodeList seriesId={seriesSlug} />
    </main>
  );
}
