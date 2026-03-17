import "./index.css";
import { Composition } from "remotion";
import { Master } from "./Master";
import { LogoCombo } from "./LogoCombo";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="SkillsAnnouncement"
        component={Master}
        durationInFrames={240}
        fps={30}
        width={1080}
        height={700}
      />
      <Composition
        id="LogoCombo"
        component={LogoCombo}
        durationInFrames={90}
        fps={30}
        width={1080}
        height={400}
      />
    </>
  );
};
