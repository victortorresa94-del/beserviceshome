import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';

type TypeWriterProps = {
  text: string;
  startFrame?: number;
  framesPerChar?: number;
  style?: React.CSSProperties;
  cursorStyle?: React.CSSProperties;
  showCursor?: boolean;
};

export const TypeWriter: React.FC<TypeWriterProps> = ({
  text,
  startFrame = 0,
  framesPerChar = 2,
  style,
  cursorStyle,
  showCursor = true,
}) => {
  const frame = useCurrentFrame();
  const elapsed = Math.max(0, frame - startFrame);
  const charsVisible = Math.min(
    text.length,
    Math.floor(elapsed / framesPerChar)
  );
  const isDone = charsVisible >= text.length;

  // Cursor blink: every 15 frames
  const cursorVisible = showCursor && !isDone
    ? true
    : showCursor && Math.floor(frame / 15) % 2 === 0;

  return (
    <span style={{ display: 'inline', ...style }}>
      {text.slice(0, charsVisible)}
      {cursorVisible && (
        <span
          style={{
            display: 'inline-block',
            width: 2,
            height: '1em',
            background: 'currentColor',
            marginLeft: 2,
            verticalAlign: 'middle',
            ...cursorStyle,
          }}
        />
      )}
    </span>
  );
};
