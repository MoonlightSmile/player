import { EpisodeDetail } from "@/components/episode/episode-detail";
import MaxWidthWrapper from "@/components/max-width-wrapper";

export default async function Page({
  params,
}: {
  params: { episodeSlug: string; seriesSlug: string };
}) {
  const { episodeSlug } = params;
  return (
    <MaxWidthWrapper>
      <EpisodeDetail episodeId={Number(episodeSlug)} />
    </MaxWidthWrapper>
  );
}
