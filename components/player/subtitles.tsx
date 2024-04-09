export const Subtitle = ({ text }: { text: string }) => {
  return (
    <div className="inline-block font-medium text-lg py-1 px-3 rounded-md bg-black/70 text-white">
      {text}
    </div>
  );
};
