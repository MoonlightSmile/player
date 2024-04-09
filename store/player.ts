import WaveSurfer from "wavesurfer.js";
import { create } from "zustand";

interface PlayerStore {
    ws: WaveSurfer | null; // WaveSurfer instance
    isPlaying: boolean; // Indicates if the player is currently playing
    currentTime: number;
    currentSegmentIndex: number; // The index of the current segment being played
    timelines: any[]; // Array of timeline segments, replace any with a more specific type if possible
    autoPause: boolean; // Configuration to auto pause the player or not

    // Setter methods
    setWs: (ws: WaveSurfer) => void; // Sets the WaveSurfer instance
    setIsPlaying: (isPlaying: boolean) => void; // Sets the playing state
    setCurrentSegmentIndex: (currentSegmentIndex: number) => void; // Sets the current segment index
    setTimelines: (timelines: any[]) => void; // Sets the timelines, replace any with a more specific type if possible
    setConfigAutoPause: (autoPause: boolean) => void; // Sets the auto pause configuration

    // Methods
    onTimeupdate: (currentTime: number) => void; // Method to handle time update events
}

export const usePlayerStore = create<PlayerStore>((set, get) => ({
    ws: null,
    isPlaying: false,
    currentTime: 0,
    currentSegmentIndex: 0,
    timelines: [],
    // config
    autoPause: false,

    setWs: (ws: WaveSurfer) => set({ ws }),
    setIsPlaying: (isPlaying: boolean) => set({ isPlaying }),
    setCurrentSegmentIndex: (currentSegmentIndex: number) =>
        set({ currentSegmentIndex }),
    setTimelines: (timelines: any[]) => set({ timelines }),
    setConfigAutoPause: (s: boolean) => set({ autoPause: s }),
    onTimeupdate: (currentTime: number) => {
        console.log("onTimeupdate", currentTime, get().isPlaying);
        set({ currentTime });
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
}));
