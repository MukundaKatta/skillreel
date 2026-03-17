import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import { MacTerminal } from "./MacTerminal";
import { LogoCombo } from "./LogoCombo";

const OUTPUT_DONE_FRAME = 120;

export const Master: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames, fps } = useVideoConfig();

  // Spring animation for terminal sliding in from bottom
  const slideIn = spring({
    frame,
    fps,
    config: {
      damping: 200,
      stiffness: 100,
    },
  });

  // Spring animation for terminal flipping out
  const flipOut = spring({
    frame: frame - OUTPUT_DONE_FRAME,
    fps,
    config: {
      damping: 200,
      stiffness: 100,
    },
  });

  const translateY = interpolate(slideIn, [0, 1], [700, 100]);

  const rotateY = interpolate(frame, [0, durationInFrames], [10, -10]);
  const scale = interpolate(frame, [0, durationInFrames], [0.9, 1]);

  // Flip the terminal towards camera when output is done
  const flipRotateX =
    frame >= OUTPUT_DONE_FRAME
      ? interpolate(flipOut, [0, 1], [0, -90])
      : 0;

  return (
    <AbsoluteFill className="bg-[#f8fafc]" style={{ perspective: 1000 }}>
      {/* LogoCombo behind the terminal */}
      <Sequence
        from={OUTPUT_DONE_FRAME}
        durationInFrames={durationInFrames - OUTPUT_DONE_FRAME}
      >
        <LogoCombo />
      </Sequence>

      {/* Terminal on top */}
      <Sequence
        durationInFrames={durationInFrames}
        style={{
          transform: `translateY(${translateY}px) rotateX(20deg) rotateY(${rotateY}deg) scale(${scale})`,
        }}
      >
        {/* Flip wrapper with transform origin at bottom */}
        <div
          style={{
            width: "100%",
            height: "100%",
            perspective: 1000,
          }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              transformOrigin: "center bottom",
              transform: `rotateX(${flipRotateX}deg)`,
            }}
          >
            <MacTerminal />
          </div>
        </div>
      </Sequence>
    </AbsoluteFill>
  );
};
