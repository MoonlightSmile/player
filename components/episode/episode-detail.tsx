import { episodeItemAction } from "@/actions/episode/item";
import Image from "next/image";
import { Player } from "../player/player";

// const buildUrl = (key: string) => `https://upload-v.lingowise.xyz/${key}`;
const buildUrl = (key: string) => `https://r2.asdpodcast.com/${key}`;

export const EpisodeDetail = async ({ episodeId }: { episodeId: number }) => {
  const item = await episodeItemAction({
    episodeId: Number(episodeId),
  });

  console.log("item", item);
  if (!item) return null;
  const { title, description, thumbnail, mediaUrl, alignUrl, audioUrl } =
    (item ?? {}) as any;
  console.log("mediaUrl", mediaUrl, audioUrl);
  return (
    <div className="flex flex-col px-6 py-4 gap-x-8 rounded-lg overflow-hidden shadow-sm border border-gray-200 cursor-pointer">
      <div className="flex items-center">
        <Image
          className="rounded shadow bg-gray-100 object-contain mr-2"
          width={150}
          height={150}
          src={thumbnail}
          alt={title}
        />
        <div className="line-clamp-2 text-4xl font-semibold">{title}</div>
      </div>

      <div className="my-6">
        <Player
          audioUrl={buildUrl(mediaUrl)}
          // audioUrl={audioUrl}
          timelineUrl={buildUrl(alignUrl)}
        />
      </div>

      <h2 className="mt-8 text-black text-2xl font-bold">
        Episode Description
      </h2>
      <div>
        <div
          dangerouslySetInnerHTML={{ __html: description }}
          className="mt-1 line-clamp-6 text-[#b3b3b3]"
        />
      </div>
    </div>
  );
};
