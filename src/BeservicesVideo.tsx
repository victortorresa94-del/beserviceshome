import React from "react";
import { AbsoluteFill } from "remotion";
import { TransitionSeries, linearTiming, springTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { wipe } from "@remotion/transitions/wipe";
import { SceneIntro } from "./scenes/SceneIntro";
import { SceneMicrosoft365 } from "./scenes/SceneMicrosoft365";
import { SceneCloud } from "./scenes/SceneCloud";
import { SceneTransformation } from "./scenes/SceneTransformation";
import { SceneCTA } from "./scenes/SceneCTA";

// Total: 540 frames @ 30fps = 18s
// Scene durations (accounting for transitions of 20 frames each):
// Intro: 130, M365: 110, Cloud: 110, Transformation: 110, CTA: 100
// Transitions: 4 x 20 = 80 subtracted → 130+110+110+110+100 - 80 = 480?
// Let me recalculate:
// We have 5 scenes and 4 transitions of 20 frames each
// total = sum_scenes - sum_transitions
// 540 = S1+S2+S3+S4+S5 - 4*20
// 540 + 80 = 620 → each scene roughly 124 frames
// Adjusted: 140+120+120+120+120 - 80 = 540 ✓

export const BeservicesVideo: React.FC = () => {
  return (
    <AbsoluteFill>
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={140}>
          <SceneIntro />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 20 })}
        />

        <TransitionSeries.Sequence durationInFrames={120}>
          <SceneMicrosoft365 />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={slide({ direction: "from-right" })}
          timing={springTiming({ config: { damping: 200 }, durationInFrames: 20 })}
        />

        <TransitionSeries.Sequence durationInFrames={120}>
          <SceneCloud />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={slide({ direction: "from-right" })}
          timing={springTiming({ config: { damping: 200 }, durationInFrames: 20 })}
        />

        <TransitionSeries.Sequence durationInFrames={120}>
          <SceneTransformation />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 20 })}
        />

        <TransitionSeries.Sequence durationInFrames={120}>
          <SceneCTA />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
