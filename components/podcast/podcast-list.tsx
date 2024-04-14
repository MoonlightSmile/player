import { seriesListAction } from "@/actions/series/list";
import { PodcastCover } from "./podcast-cover";
import MaxWidthWrapper from "../max-width-wrapper";

export const PodcastList = async () => {
  const seriesList = await seriesListAction();
  console.log("seriesList", seriesList);
  return (
    <MaxWidthWrapper>
      <div className="flex gap-6 mt-10">
        {(seriesList ?? []).map((series: any) => {
          return (
            <PodcastCover
              {...{
                id: series.id,
                imageUrl: series.thumbnail,
                title: series.title,
                channel: series.channel,
              }}
              key={series.id}
            />
          );
        })}
      </div>
    </MaxWidthWrapper>
  );
};
