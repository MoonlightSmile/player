"use client";

import { useCallback, useRef, useEffect } from "react";
import { Button } from "../ui/button";
import { useHotkeys } from "react-hotkeys-hook";
import { usePlayerStore } from "@/store/player";
import WaveSurfer from "wavesurfer.js";
// import { TIMELINES } from "./data";
// import npr from "@/whisper/npr_mp3.mp3";
import { Subtitle } from "./subtitles";
import { Switch } from "@/components/ui/switch";

import {
  PauseIcon,
  PlayIcon,
  SkipBackIcon,
  SkipForwardIcon,
} from "lucide-react";
import { secondsToHMS } from "./util";

// a: 上一个
// s: 重复
// d: 下一个
// space: 播放/暂停
// q: 开启/ 关闭自动暂时

// const audioUrl = npr;

// https://static.ssr8.cn/player/timeline.json
const loadJSON = async ({ url }: { url: string }) => {
  return await fetch(url)
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

const formatTime = (seconds: number) =>
  [seconds / 60, seconds % 60]
    .map((v) => `0${Math.floor(v)}`.slice(-2))
    .join(":");

export const Player = ({
  audioUrl,
  timelineUrl,
}: {
  audioUrl: string;
  timelineUrl: string;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const {
    ws,
    setWs,
    isInitialized,
    isReady,
    setIsInitialized,
    setIsReady,
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
    subtitleVisible,
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
    setWs(_ws);
  }, [audioUrl, setWs, ws]);

  useEffect(() => {
    (async () => {
      const timelineData = await loadJSON({ url: timelineUrl });
      setTimelines(timelineData?.[0]?.timeline);
      setIsReady(true);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setTimelines, timelineUrl]);

  useHotkeys(
    ["space", "a", "d", "q", "s", "e"],
    (keyboardEvent, hotkeyEvent) => {
      if (!ws || !isInitialized || !isReady) return;

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
        case "e":
          console.log("e");
          document?.getElementById("subtitle")?.click();
          break;
      }
    },
    [ws, isInitialized, isReady]
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
      ws.on("decode", () => {
        console.log("wavesurfer decode");
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

  const onPrev: any = useCallback(() => {
    if (currentSegmentIndex === 0) return;

    if (isPlaying) {
      playPause();
    }
    const prevSegment = timelines[currentSegmentIndex - 1];
    const prevStartTime = prevSegment?.startTime ?? 0;
    const dest = prevStartTime / ws!.getDuration();
    ws?.seekTo(dest);
    playPause();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSegmentIndex, isPlaying, timelines, ws]);

  const onNext = useCallback(() => {
    if (currentSegmentIndex === timelines.length - 1) return;

    if (isPlaying) {
      playPause();
    }
    const nextSegment = timelines[currentSegmentIndex + 1];
    const nextStartTime = nextSegment?.startTime ?? 0;
    const dest = nextStartTime / ws!.getDuration();
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
    ws?.seekTo(dest);
    playPause();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSegmentIndex, isPlaying, timelines, ws]);

  const onAutoPause = useCallback(() => {
    setConfigAutoPause(!autoPause);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoPause]);

  return (
    <>
      <div ref={containerRef} />
      <p>
        {formatTime(currentTime)}/{secondsToHMS(ws?.getDuration() as number)}
      </p>

      <div className="flex gap-4 mx-4 my-4 items-center">
        <Button
          className="aspect-square p-0 h-10"
          id="prev"
          variant="ghost"
          size="lg"
          onClick={onPrev}
        >
          <SkipBackIcon className="w-6 h-6" />
        </Button>

        <Button
          variant="default"
          onClick={playPause}
          id="play"
          className="aspect-square p-0 h-12 rounded-full"
        >
          {!isPlaying ? (
            <PlayIcon fill="white" className="w-6 h-6" />
          ) : (
            <PauseIcon fill="white" className="w-6 h-6" />
          )}
        </Button>

        <Button
          variant="ghost"
          size="lg"
          onClick={onNext}
          id="next"
          className="aspect-square p-0 h-10"
        >
          <SkipForwardIcon className="w-6 h-6" />
        </Button>
        <Switch
          id="auto-pause"
          checked={autoPause}
          onCheckedChange={onAutoPause}
        />
        <Button
          id="loop"
          className="invisible"
          onClick={handleLoopCurrentSegment}
        ></Button>
      </div>
      <Subtitle
        visible={subtitleVisible}
        text={timelines?.[currentSegmentIndex]?.text}
      />
    </>
  );
};
