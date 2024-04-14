import { episodeListAction } from "@/actions/episode/list";
import MaxWidthWrapper from "../max-width-wrapper";
import { EpisodeItem } from "./episode-item";

export const EpisodeList = async ({ seriesId }: { seriesId: string }) => {
  const episodeList = await episodeListAction({
    seriesId: Number(seriesId),
  });
  console.log("episodeList", episodeList);
  return (
    <MaxWidthWrapper>
      <div className="flex flex-wrap gap-6 mt-10">
        {(episodeList ?? []).map((episode: any) => {
          return <EpisodeItem key={episode.id} episode={episode} />;
        })}
      </div>
    </MaxWidthWrapper>
  );
};
