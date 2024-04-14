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
      <div className="mt-24">
        <EpisodeDetail episodeId={Number(episodeSlug)} />
      </div>
    </MaxWidthWrapper>
  );
}
