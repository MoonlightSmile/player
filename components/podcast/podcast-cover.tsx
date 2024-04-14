import Image from "next/image";
import Link from "next/link";

interface Props {
  imageUrl: string;
  title: string;
  channel: string;
  id: number;
}

export const PodcastCover = ({ imageUrl, title, channel, id }: Props) => {
  return (
    <Link href={`/series/${id}`}>
      <div className="mb-2 w-[176px] h-[176px] rounded-lg overflow-hidden">
        <Image
          src={imageUrl}
          className="w-[176px] h-[176px]"
          width={176}
          height={176}
          alt={title}
        />
      </div>
      <div className="font-normal text-base">{title}</div>
      <div className="text-[#a7a7a7] text-sm text-cap uppercase">{channel}</div>
    </Link>
  );
};
