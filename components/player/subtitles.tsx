import { cn } from "@/lib/utils";
import { usePlayerStore } from "@/store/player";
import { useCallback } from "react";

export const Subtitle = ({
  text,
  visible,
}: {
  text: string;
  visible: boolean;
}) => {
  const { subtitleVisible, setConfigSubtitleVisible } = usePlayerStore();
  const handleSubtitleVisibility = useCallback(() => {
    setConfigSubtitleVisible(!subtitleVisible);
  }, [setConfigSubtitleVisible, subtitleVisible]);

  return (
    <div className="min-h-28 mt-4">
      <div
        onClick={handleSubtitleVisibility}
        id="subtitle"
        className={cn(
          "max-w-5xl  font-medium text-2xl py-1 px-3 rounded-md bg-black/70 text-white",
          visible ? "visible" : "invisible"
        )}
      >
        {text}
      </div>
    </div>
  );
};
