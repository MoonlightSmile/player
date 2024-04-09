import WaveSurfer from "wavesurfer.js";
import { create } from "zustand";

interface PlayerStore {
    ws: WaveSurfer | null; // WaveSurfer instance
    isInitialized: boolean; // Whether the player has been initialized
    stopReason: null | string; // The reason the player was stopped
    isPlaying: boolean; // Indicates if the player is currently playing
    currentTime: number;
    currentSegmentIndex: number; // The index of the current segment being played
    timelines: any[]; // Array of timeline segments, replace any with a more specific type if possible
    autoPause: boolean; // Configuration to auto pause the player or not

    // Setter methods
    setWs: (ws: WaveSurfer) => void; // Sets the WaveSurfer instance
    setIsInitialized: (isInitialized: boolean) => void; // Sets the initialized state
    setIsPlaying: (isPlaying: boolean) => void; // Sets the playing state
    setCurrentSegmentIndex: (currentSegmentIndex: number) => void; // Sets the current segment index
    setTimelines: (timelines: any[]) => void; // Sets the timelines, replace any with a more specific type if possible
    setConfigAutoPause: (autoPause: boolean) => void; // Sets the auto pause configuration

    // Methods
    onTimeupdate: (currentTime: number) => void; // Method to handle time update events
    handleAutoPause: (currentTime: number) => void;
    handlePointNextSegment: (currentTime: number) => void;
    playPause: () => void
}


export const usePlayerStore = create<PlayerStore>((set, get) => ({
    stopReason: null,
    ws: null,
    isInitialized: false,
    isPlaying: false,
    currentTime: 0,
    currentSegmentIndex: 0,
    timelines: [],
    // config
    autoPause: false,

    setWs: (ws: WaveSurfer) => set({ ws }),
    setIsInitialized: (isInitialized: boolean) => set({ isInitialized }),
    setIsPlaying: (isPlaying: boolean) => set({ isPlaying }),
    setCurrentSegmentIndex: (currentSegmentIndex: number) =>
        set({ currentSegmentIndex }),
    setTimelines: (timelines: any[]) => set({ timelines }),
    setConfigAutoPause: (s: boolean) => set({ autoPause: s }),
    onTimeupdate: (currentTime: number) => {
        set({ currentTime });
        get().handleAutoPause(currentTime)
        get().handlePointNextSegment(currentTime)

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
                set({ stopReason: 'autoPauseAndSegmentEnd' })
                ws?.pause()
            }
        }
    },

    playPause: () => {
        const ws = get().ws;
        const stopReason = get().stopReason;
        const currentSegmentIndex = get().currentSegmentIndex;
        const timelines = get().timelines;
        if (stopReason === 'autoPauseAndSegmentEnd') {
            set({ currentSegmentIndex: currentSegmentIndex < timelines.length - 1 ? currentSegmentIndex + 1 : 0 })
            set({ stopReason: null })
        }
        ws?.playPause();
    }
}));
