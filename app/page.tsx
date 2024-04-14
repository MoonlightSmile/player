import { Player } from "@/components/player/player";
import { PodcastCover } from "@/components/podcast/podcast-cover";
import { PodcastList } from "@/components/podcast/podcast-list";

export default async function Home() {
  return (
    <main>
      <PodcastList />
      {/* <Player
        audioUrl="https://upload-v.lingowise.xyz/2.mp3"
        timelineUrl="https://upload-v.lingowise.xyz/2_timeline.json"
      /> */}
    </main>
  );
}
