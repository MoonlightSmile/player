import WaveSurfer from "wavesurfer.js";
import { create } from "zustand";

interface PlayerStore {
  ws: WaveSurfer | null | any;
  isInitialized: boolean;
  isReady: boolean;
  stopReason: null | string;
  isPlaying: boolean;
  loadProgress: number;
  currentTime: number;
  currentSegmentIndex: number;
  timelines: any[];
  autoPause: boolean;
  subtitleVisible: boolean;

  // Setter methods
  setWs: (ws: WaveSurfer | any) => void;
  setIsInitialized: (isInitialized: boolean) => void;
  setIsReady: (isReady: boolean) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  setLoadProgress: (loadProgress: number) => void;
  setCurrentSegmentIndex: (currentSegmentIndex: number) => void;
  setTimelines: (timelines: any[]) => void;
  setConfigAutoPause: (autoPause: boolean) => void;
  setConfigSubtitleVisible: (visible: boolean) => void;

  // Methods
  onTimeupdate: (currentTime: number) => void;
  handleAutoPause: (currentTime: number) => void;
  handlePointNextSegment: (currentTime: number) => void;
  playPause: () => void;
}

export const usePlayerStore = create<PlayerStore>((set, get) => ({
  stopReason: null,
  ws: null,
  isInitialized: false,
  isReady: false,
  isPlaying: false,
  loadProgress: 0,
  currentTime: 0,
  currentSegmentIndex: 0,
  timelines: [],
  // config
  autoPause: false,
  subtitleVisible: true,

  setWs: (ws: WaveSurfer) => set({ ws }),
  setIsInitialized: (isInitialized: boolean) => set({ isInitialized }),
  setIsReady: (isReady: boolean) => set({ isReady }),
  setIsPlaying: (isPlaying: boolean) => set({ isPlaying }),
  setLoadProgress: (loadProgress: number) => set({ loadProgress }),
  setCurrentSegmentIndex: (currentSegmentIndex: number) =>
    set({ currentSegmentIndex }),
  setTimelines: (timelines: any[]) => set({ timelines }),
  setConfigAutoPause: (s: boolean) => set({ autoPause: s }),
  setConfigSubtitleVisible: (s: boolean) => set({ subtitleVisible: s }),
  onTimeupdate: (currentTime: number) => {
    set({ currentTime });
    get().handleAutoPause(currentTime);
    get().handlePointNextSegment(currentTime);
  },
  handlePointNextSegment: (currentTime: number) => {
    // 调整当前 currentSegmentIndex
    const timelines = get().timelines;
    const currentSegmentIndex = get().currentSegmentIndex;

    const matchedIndex = timelines.findIndex(
      (item: any) =>
        currentTime >= item.startTime && currentTime <= item.endTime
    );
    if (matchedIndex !== -1) {
      if (matchedIndex !== currentSegmentIndex) {
        set({ currentSegmentIndex: matchedIndex });
      }
    }
  },
  // auto pause 的逻辑需要柔和
  handleAutoPause: (currentTime: number) => {
    const timelines = get().timelines;
    const currentSegmentIndex = get().currentSegmentIndex;
    const autoPause = get().autoPause;
    const ws = get().ws;
    const currentSegment = timelines[currentSegmentIndex];
    const nextSegment = timelines[currentSegmentIndex + 1];
    const nextStartTime = nextSegment?.startTime ?? currentSegment?.endTime;
    // languagereactor have same problem
    if (currentTime >= (currentSegment.endTime + nextStartTime) / 2) {
      if (autoPause) {
        set({ stopReason: "autoPauseAndSegmentEnd" });
        ws?.pause();
      }
    }
  },

  playPause: () => {
    const ws = get().ws;
    const stopReason = get().stopReason;
    const currentSegmentIndex = get().currentSegmentIndex;
    const timelines = get().timelines;
    if (stopReason === "autoPauseAndSegmentEnd") {
      set({
        currentSegmentIndex:
          currentSegmentIndex < timelines.length - 1
            ? currentSegmentIndex + 1
            : 0,
      });
      set({ stopReason: null });
    }
    ws?.playPause();
  },
}));
