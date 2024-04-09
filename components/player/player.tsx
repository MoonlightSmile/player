"use client";

import { useMemo, useState, useCallback, useRef, useEffect } from "react";
import { useWavesurfer } from "@wavesurfer/react";
import Timeline from "wavesurfer.js/dist/plugins/timeline.esm.js";
import { Button } from "../ui/button";
import { useHotkeys } from "react-hotkeys-hook";
import { findMatchingItem } from "./util";
import { throttle } from "lodash-es";
import { useThrottle } from "@uidotdev/usehooks";

// a: 上一个
// s: 重复
// d: 下一个
// space: 播放/暂停
// q: 开启/ 关闭自动暂时

// timeline
// https://static.ssr8.cn/player/timeline.json
// const audioUrls = ["https://static.ssr8.cn/player/jobs.mp3"];
const audioUrls = ["https://static.ssr8.cn/player/segment.wav"];

const loadJSON = async () => {
  return await fetch("https://static.ssr8.cn/player/segment.json")
    .then((response) => {
      // Check if the request was successful
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      // Parse the JSON response body
      return response.json();
    })
    .then((data) => {
      // 'data' is the JavaScript object you want
      // console.log(data);
      return data;
      // You can work with your JavaScript object here
    })
    .catch((error) => {
      // Handle any errors that occurred during the fetch
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
  const containerRef = useRef(null);
  const bindEventRef = useRef(false);
  const timeRef = useRef(0);
  const framesRef = useRef<any>([]);
  const autoPauseRef = useRef<boolean>(true);
  const [status, setStatus] = useState<string | null>(null);
  const [transcription, setTranscription] = useState<any>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [urlIndex, setUrlIndex] = useState(0);

  const { wavesurfer, isPlaying, currentTime } = useWavesurfer({
    container: containerRef,
    height: 100,
    waveColor: "rgb(200, 0, 200)",
    progressColor: "rgb(100, 0, 100)",
    url: audioUrls[urlIndex],
    // plugins: useMemo(() => [Timeline.create()], []),
  });

  useEffect(() => {
    (async () => {
      const data: any = await loadJSON();
      framesRef.current = data?.transcription ?? [];
    })();
  }, []);

  useHotkeys(
    ["space", "a", "d", "q"],
    (keyboardEvent, hotkeyEvent) => {
      if (!wavesurfer) return;
      keyboardEvent.preventDefault();

      switch (hotkeyEvent.keys!.join("")) {
        case "space":
          console.log("useHotkeys space");
          document?.getElementById("play")?.click();
          break;
        case "a":
          document?.getElementById("prev")?.click();
          break;
        case "d":
          console.log("useHotkeys d");
          document?.getElementById("next")?.click();
          break;
        case "q":
          console.log("useHotkeys q");
          document?.getElementById("auto-pause")?.click();
          break;
      }
    },
    [wavesurfer]
  );

  const onPlayPause = useCallback(() => {
    console.log("onPlayPause", wavesurfer);
    wavesurfer && wavesurfer.playPause();
  }, [wavesurfer]);

  const onTimeupdate = useCallback(
    (currentTime: number) => {
      // 人体感受
      const _index = findMatchingItem(currentTime + 1.2, framesRef.current);
      // onPlayPause();
      console.log(
        "currentTime::",
        currentTime,
        currentIndex,
        _index,
        autoPauseRef.current,
        wavesurfer
      );

      if (currentIndex !== _index) {
        if (autoPauseRef.current) {
          wavesurfer!.playPause();
        } else {
          setCurrentIndex(_index);
        }
      }
    },
    [autoPauseRef, currentIndex, wavesurfer, framesRef]
  );

  useEffect(() => {
    if (!wavesurfer || bindEventRef.current) return;

    console.log("wavesurfer on event", wavesurfer);
    wavesurfer.on("play", () => {
      setStatus("play");
      console.log("wavesurfer play");
    });
    wavesurfer.on("pause", () => {
      setStatus("pause");
      console.log("wavesurfer pause");
    });
    wavesurfer.on("seeking", () => {
      console.log("seeking");
    });
    wavesurfer.on("timeupdate", (currentTime) => {
      console.log("timeupdate", currentTime);
      // throttleTimeupdate(currentTime);
      if (currentTime - timeRef.current <= 0.05) return;
      timeRef.current = currentTime;
      onTimeupdate(currentTime);
    });
    wavesurfer.on("ready", () => {
      console.log("wavesurfer ready");
    });
    wavesurfer.on("destroy", () => {
      console.log("wavesurfer destroy");
    });
    bindEventRef.current = true;

    return () => {
      console.log("unmount wavesurfer");
      bindEventRef.current = false;
      wavesurfer?.unAll();
      wavesurfer?.destroy();
    };
  }, [wavesurfer]);

  const onUrlChange = useCallback(() => {
    setUrlIndex((index) => (index + 1) % audioUrls.length);
  }, []);

  const handlePrevSegment = useCallback(() => {
    if (currentIndex === 0) return;

    if (isPlaying) {
      onPlayPause();
    }
    const prevFrame = framesRef.current[currentIndex - 1];
    const prevFrom = prevFrame?.offsets?.from ?? 0;
    const dest = prevFrom / 1000 / wavesurfer!.getDuration();
    wavesurfer?.seekTo(dest);
    setCurrentIndex((i) => i - 1);
    onPlayPause();
  }, [currentIndex, isPlaying, framesRef, wavesurfer, onPlayPause]);

  const handleNextSegment = useCallback(() => {
    if (currentIndex === frames.length - 1) return;
    if (isPlaying) {
      onPlayPause();
    }
    console.log("status", status);
    const nextFrame = framesRef.current[currentIndex + 1];
    const nextFrom = nextFrame?.offsets?.from ?? 0;
    const dest = nextFrom / 1000 / wavesurfer!.getDuration();

    wavesurfer?.seekTo(dest);
    setCurrentIndex((i) => i + 1);
    onPlayPause();
  }, [currentIndex, framesRef, isPlaying, status, wavesurfer, onPlayPause]);

  const handleLoopConfig = useCallback(() => {
    console.log("handleLoopConfig");
    autoPauseRef.current = !autoPauseRef.current;
  }, []);

  // console.log("frames", frames);
  console.log("currentIndex", currentIndex, autoPauseRef.current);

  return (
    <>
      <div ref={containerRef} />

      <p>Current audio: {audioUrls[urlIndex]}</p>

      <p>Current time: {formatTime(currentTime)}</p>

      <div style={{ margin: "1em 0", display: "flex", gap: "1em" }}>
        <button onClick={onUrlChange}>Change audio</button>

        <button id="play" onClick={onPlayPause} style={{ minWidth: "5em" }}>
          {isPlaying ? "Pause" : "Play"}
        </button>
      </div>
      <Button id="prev" onClick={handlePrevSegment}>
        Prev
      </Button>
      <Button id="next" onClick={handleNextSegment}>
        Next
      </Button>
      <Button
        id="seek"
        onClick={() => {
          wavesurfer?.seekTo(0.10868267048847487);
        }}
      >
        Seek
      </Button>
      <Button
        id="loop"
        onClick={() => {
          wavesurfer?.seekTo(0.10868267048847487);
        }}
      >
        重复此 segment
      </Button>
      <Button id="auto-pause" onClick={handleLoopConfig}>
        {autoPauseRef.current ? "关闭" : "开启"}自动暂时
      </Button>
    </>
  );
};
