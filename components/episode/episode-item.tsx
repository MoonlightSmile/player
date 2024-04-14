import Image from "next/image";
import Link from "next/link";

export const EpisodeItem = async ({ episode }: { episode: any }) => {
  const { title, description, thumbnail } = episode ?? {};
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
        <Link
          href={`/series/1/episode/${episode.id}`}
          className="line-clamp-2 text-base font-semibold sm:line-clamp-1 sm:text-lg"
        >
          {title}
        </Link>
      </div>

      <div
        dangerouslySetInnerHTML={{ __html: description }}
        className="mt-1 line-clamp-3 text-color-secondary"
      ></div>
    </div>
  );
};
