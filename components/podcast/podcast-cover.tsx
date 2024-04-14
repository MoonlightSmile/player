import Image from "next/image";

interface Props {
  imageUrl: string;
  title: string;
  channel: string;
}

export const PodcastCover = ({ imageUrl, title, channel }: Props) => {
  return (
    <div>
      <div className="mb-2 w-[176px] h-[176px] rounded-lg overflow-hidden">
        <Image
          src={imageUrl}
          className="w-[176px] h-[176px]"
          width={176}
          height={176}
          alt="xx"
        />
      </div>
      <div className="font-normal text-base">{title}</div>
      <div className="text-[#a7a7a7] text-sm text-cap uppercase">{channel}</div>
    </div>
  );
};
