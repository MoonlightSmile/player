"use client";

import { useCallback, useRef, useEffect } from "react";
import { Button } from "../ui/button";
import { useHotkeys } from "react-hotkeys-hook";
import { usePlayerStore } from "@/store/player";
import WaveSurfer from "wavesurfer.js";
import { TIMELINES } from "./data";
// import npr from "@/whisper/npr.wav";
import npr from "@/whisper/npr_mp3.mp3";
import { Subtitle } from "./subtitles";

// a: 上一个
// s: 重复
// d: 下一个
// space: 播放/暂停
// q: 开启/ 关闭自动暂时

// timeline
// https://static.ssr8.cn/player/timeline.json
// const audioUrls = ["https://static.ssr8.cn/player/jobs.mp3"];
// const audioUrl = "https://static.ssr8.cn/player/segment.wav";
const audioUrl = npr;

const loadJSON = async () => {
  // return await fetch("https://static.ssr8.cn/player/segment.json")
  return await fetch("https://static.ssr8.cn/player/timeline.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      return data;
    })
    .catch((error) => {
      console.error("Error fetching data: ", error);
    });
};

// https://static.ssr8.cn/player/segment.wav
// https://static.ssr8.cn/player/segment.json

const formatTime = (seconds: number) =>
  [seconds / 60, seconds % 60]
    .map((v) => `0${Math.floor(v)}`.slice(-2))
    .join(":");

// A React component that will render wavesurfer
export const Player = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const {
    ws,
    setWs,
    isInitialized,
    setIsInitialized,
    timelines,
    setTimelines,
    onTimeupdate,
    isPlaying,
    setIsPlaying,
    currentTime,
    currentSegmentIndex,
    autoPause,
    setConfigAutoPause,
    playPause,
  } = usePlayerStore();

  useEffect(() => {
    if (ws) return;

    const _ws = WaveSurfer.create({
      container: containerRef.current!,
      url: audioUrl,
      height: 100,
      waveColor: "rgb(200, 0, 200)",
      progressColor: "rgb(100, 0, 100)",
    });
    console.log("_ws", _ws);
    setWs(_ws);
  }, [setWs, ws]);

  useEffect(() => {
    (async () => {
      // const data: any = await loadJSON();
      // setTimelines(data?.timeline);
      setTimelines(TIMELINES.timeline);
    })();
  }, [setTimelines]);

  useHotkeys(
    ["space", "a", "d", "q", "s"],
    (keyboardEvent, hotkeyEvent) => {
      if (!ws || !isInitialized) return;

      keyboardEvent.preventDefault();
      console.log("keys", hotkeyEvent.keys!.join(""));
      switch (hotkeyEvent.keys!.join("")) {
        case "space":
          document?.getElementById("play")?.click();
          break;
        case "a":
          document?.getElementById("prev")?.click();
          break;
        case "d":
          document?.getElementById("next")?.click();
          break;
        case "q":
          document?.getElementById("auto-pause")?.click();
          break;
        case "s":
          document?.getElementById("loop")?.click();
          break;
      }
    },
    [ws, isInitialized]
  );

  useEffect(() => {
    if (!ws) return;

    const subscriptions = [
      ws.on("play", () => {
        setIsPlaying(true);
        console.log("wavesurfer play");
      }),
      ws.on("pause", () => {
        setIsPlaying(false);
        console.log("wavesurfer pause");
      }),
      ws.on("seeking", () => {
        console.log("seeking");
      }),
      ws.on("timeupdate", (currentTime) => {
        onTimeupdate(currentTime);
      }),
      ws.on("ready", () => {
        setIsInitialized(true);
        console.log("wavesurfer ready");
      }),
      ws.on("destroy", () => {
        console.log("wavesurfer destroy");
      }),
    ];

    return () => {
      subscriptions.forEach((s) => s());
      ws?.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ws]);

  const handlePrevSegment = useCallback(() => {
    if (currentSegmentIndex === 0) return;

    if (isPlaying) {
      playPause();
    }
    const prevSegment = timelines[currentSegmentIndex - 1];
    const prevStartTime = prevSegment?.startTime ?? 0;
    const dest = prevStartTime / ws!.getDuration();
    console.log("ws dest1", dest);
    ws?.seekTo(dest);
    playPause();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSegmentIndex, isPlaying, timelines, ws]);

  const handleNextSegment = useCallback(() => {
    if (currentSegmentIndex === timelines.length - 1) return;

    if (isPlaying) {
      playPause();
    }
    const nextSegment = timelines[currentSegmentIndex + 1];
    const nextStartTime = nextSegment?.startTime ?? 0;
    const dest = nextStartTime / ws!.getDuration();
    console.log("ws dest3", dest);
    ws?.seekTo(dest);
    playPause();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSegmentIndex, isPlaying, timelines, ws]);

  const handleLoopCurrentSegment = useCallback(() => {
    if (isPlaying) {
      playPause();
    }
    const currentSegment = timelines[currentSegmentIndex];
    const currentStartTime = currentSegment?.startTime ?? 0;
    const dest = currentStartTime / ws!.getDuration();
    console.log("ws dest2", dest);
    ws?.seekTo(dest);
    playPause();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSegmentIndex, isPlaying, timelines, ws]);

  const handleLoopConfig = useCallback(() => {
    setConfigAutoPause(!autoPause);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoPause]);

  return (
    <>
      <div ref={containerRef} />
      <p>Current audio: {audioUrl}</p>
      <p>Current time: {formatTime(currentTime)}</p>
      <Subtitle text={timelines[currentSegmentIndex]?.text} />

      <div className="flex gap-4 mx-4 my-4">
        <Button id="play" onClick={playPause}>
          {isPlaying ? "Pause" : "Play"}
        </Button>
        <Button id="prev" onClick={handlePrevSegment}>
          Prev
        </Button>
        <Button id="next" onClick={handleNextSegment}>
          Next
        </Button>
        <Button id="loop" onClick={handleLoopCurrentSegment}>
          重复此 segment
        </Button>
        <Button id="auto-pause" onClick={handleLoopConfig as any}>
          {autoPause ? "关闭" : "开启"}自动暂时
        </Button>
      </div>
    </>
  );
};
