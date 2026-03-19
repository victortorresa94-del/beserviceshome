import React from 'react';
import { AbsoluteFill } from 'remotion';
import { TransitionSeries, linearTiming, springTiming } from '@remotion/transitions';
import { fade } from '@remotion/transitions/fade';
import { slide } from '@remotion/transitions/slide';
import { wipe } from '@remotion/transitions/wipe';
import { SceneIntro } from './scenes/SceneIntro';
import { SceneMicrosoft365 } from './scenes/SceneMicrosoft365';
import { SceneCloud } from './scenes/SceneCloud';
import { SceneAI } from './scenes/SceneAI';
import { SceneTransformation } from './scenes/SceneTransformation';
import { SceneCTA } from './scenes/SceneCTA';

// Scene durations (gross, before transition overlap is subtracted by TransitionSeries)
const INTRO_DURATION = 160;
const M365_DURATION = 130;
const CLOUD_DURATION = 130;
const AI_DURATION = 140;
const TRANSFORM_DURATION = 130;
const CTA_DURATION = 130;

// Transition duration
const TRANSITION_FRAMES = 20;

export const BeservicesVideo: React.FC = () => {
  return (
    <AbsoluteFill>
      <TransitionSeries>
        {/* Scene 1: Intro */}
        <TransitionSeries.Sequence durationInFrames={INTRO_DURATION}>
          <SceneIntro />
        </TransitionSeries.Sequence>

        {/* Intro → M365: fade */}
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
        />

        {/* Scene 2: Microsoft 365 */}
        <TransitionSeries.Sequence durationInFrames={M365_DURATION}>
          <SceneMicrosoft365 />
        </TransitionSeries.Sequence>

        {/* M365 → Cloud: slide from right */}
        <TransitionSeries.Transition
          presentation={slide({ direction: 'from-right' })}
          timing={springTiming({ config: { damping: 200 }, durationInFrames: TRANSITION_FRAMES })}
        />

        {/* Scene 3: Cloud */}
        <TransitionSeries.Sequence durationInFrames={CLOUD_DURATION}>
          <SceneCloud />
        </TransitionSeries.Sequence>

        {/* Cloud → AI: wipe */}
        <TransitionSeries.Transition
          presentation={wipe()}
          timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
        />

        {/* Scene 4: AI */}
        <TransitionSeries.Sequence durationInFrames={AI_DURATION}>
          <SceneAI />
        </TransitionSeries.Sequence>

        {/* AI → Transform: slide from right */}
        <TransitionSeries.Transition
          presentation={slide({ direction: 'from-right' })}
          timing={springTiming({ config: { damping: 200 }, durationInFrames: TRANSITION_FRAMES })}
        />

        {/* Scene 5: Transformation */}
        <TransitionSeries.Sequence durationInFrames={TRANSFORM_DURATION}>
          <SceneTransformation />
        </TransitionSeries.Sequence>

        {/* Transform → CTA: fade */}
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
        />

        {/* Scene 6: CTA */}
        <TransitionSeries.Sequence durationInFrames={CTA_DURATION}>
          <SceneCTA />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
