import React from 'react';
import { Composition } from 'remotion';
import { BeservicesVideo } from './BeservicesVideo';

// Load Google Fonts: Montserrat (display) + Inter (body)
// Injected at module level so fonts are available on first render
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800;900&family=Inter:wght@300;400;500;600;700&display=swap');`;
  document.head.appendChild(style);
}

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="BeservicesVideo"
      component={BeservicesVideo}
      // Total = 6 scenes (820 gross frames) − 5 transitions × 20 frames = 720 frames @ 30fps = 24s
      durationInFrames={720}
      fps={30}
      width={1920}
      height={1080}
    />
  );
};
