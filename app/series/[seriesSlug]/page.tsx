import { EpisodeList } from "@/components/episode/episode-list";

export default async function Page({
  params,
}: {
  params: { episodeSlug: string; seriesSlug: string };
}) {
  const { seriesSlug } = params;
  return (
    <main>
      <EpisodeList seriesId={seriesSlug} />
    </main>
  );
}
