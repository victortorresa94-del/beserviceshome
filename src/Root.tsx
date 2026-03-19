import { Composition } from "remotion";
import { BeservicesVideo } from "./BeservicesVideo";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="BeservicesVideo"
      component={BeservicesVideo}
      durationInFrames={540}
      fps={30}
      width={1920}
      height={1080}
    />
  );
};
