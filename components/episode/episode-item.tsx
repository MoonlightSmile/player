import Image from "next/image";
import Link from "next/link";
import { Badge } from "../ui/badge";

export const EpisodeItem = async ({ episode }: { episode: any }) => {
  const { title, description, thumbnail, status } = episode ?? {};
  return (
    <div className="flex flex-col px-6 py-4 gap-x-8 rounded-lg overflow-hidden shadow-sm border border-gray-200 cursor-pointer">
      <div className="flex items-center">
        <Image
          className="rounded shadow bg-gray-100 object-contain mr-2"
          width={48}
          height={48}
          src={thumbnail}
          alt={title}
        />
        <div className="flex items-center">
          <Link
            href={`/series/1/episode/${episode.id}`}
            className="line-clamp-2 text-base font-semibold"
          >
            {title}
          </Link>
          <Badge
            variant={status === "DONE" ? "default" : "secondary"}
            className="ml-4"
          >
            {status === "DONE" ? "已处理" : "未处理"}
          </Badge>
        </div>
      </div>

      <div
        dangerouslySetInnerHTML={{ __html: description }}
        className="mt-1 line-clamp-3 text-color-secondary"
      ></div>
    </div>
  );
};
