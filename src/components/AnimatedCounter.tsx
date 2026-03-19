import React from 'react';
import { interpolate, useCurrentFrame, useVideoConfig, spring } from 'remotion';

type AnimatedCounterProps = {
  from?: number;
  to: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  startFrame?: number;
  style?: React.CSSProperties;
};

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  from = 0,
  to,
  prefix = '',
  suffix = '',
  decimals = 0,
  startFrame = 0,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const s = spring({
    frame: frame - startFrame,
    fps,
    config: { damping: 80, stiffness: 60, mass: 1 },
  });

  const value = interpolate(s, [0, 1], [from, to]);
  const display = value.toFixed(decimals);

  return (
    <span style={style}>
      {prefix}{display}{suffix}
    </span>
  );
};
