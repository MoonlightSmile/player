"use client";

import { Howl, Howler } from "howler";

export default function Page() {
  // "https://static.ssr8.cn/m3u8/npr6144207838.m3u8"
  //   https://upload-v.lingowise.xyz/1.mp3
  var sound = new Howl({
    // src: ["https://upload-v.lingowise.xyz/1.mp3"],
    src: ["https://static.ssr8.cn/m3u8/npr6144207838.m3u8"],
    volume: 0.5,
  });
  sound.once("load", function () {
    sound.play();
  });

  // Fires when the sound finishes playing.
  sound.on("end", function () {
    console.log("Finished!");
  });

  return (
    <main>
      <h1>HOW</h1>
    </main>
  );
}
