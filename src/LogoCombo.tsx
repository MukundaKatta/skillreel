import {
  AbsoluteFill,
  Img,
  staticFile,
  Series,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
} from "remotion";

const AnnouncementText: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = interpolate(frame, [0, fps * 0.5], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  return (
    <AbsoluteFill className="flex items-center justify-center">
      <span
        style={{
          fontFamily: "GT Planar, system-ui, sans-serif",
          fontSize: 60,
          fontWeight: 700,
          color: "#333",
          transform: `scale(${scale})`,
        }}
      >
        Agent Skills now available
      </span>
    </AbsoluteFill>
  );
};

const Logos: React.FC = () => {
  return (
    <AbsoluteFill className="flex items-center justify-center">
      <div className="flex items-center gap-12">
        <Img
          src={staticFile("remotion-logo.svg")}
          className="h-32"
          alt="Remotion"
        />
        <span className="text-6xl font-light text-gray-600">+</span>
        <Img
          src={staticFile("claude-logo.svg")}
          className="h-24"
          alt="Claude Code"
        />
        <Img
          src={staticFile("opencode-logo.svg")}
          className="h-16"
          alt="OpenCode"
        />
      </div>
    </AbsoluteFill>
  );
};

export const LogoCombo: React.FC = () => {
  return (
    <Series>
      <Series.Sequence durationInFrames={60}>
        <AnnouncementText />
      </Series.Sequence>
      <Series.Sequence durationInFrames={120}>
        <Logos />
      </Series.Sequence>
    </Series>
  );
};
