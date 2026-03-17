import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";

interface CursorProps {
  blinking: boolean;
}

export const Cursor: React.FC<CursorProps> = ({ blinking }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  let opacity = 1;
  if (blinking) {
    const blinkCycle = Math.floor((frame / fps) * 2) % 2;
    opacity = blinkCycle === 0 ? 1 : 0;
  }

  return (
    <span
      className="w-4 h-10 bg-[#333] ml-0.5 inline-block"
      style={{ opacity }}
    />
  );
};
