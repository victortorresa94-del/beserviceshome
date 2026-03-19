import React from 'react';
import { COLORS } from '../colors';

type GlassCardProps = {
  children: React.ReactNode;
  style?: React.CSSProperties;
  accentColor?: string;
  accentPosition?: 'top' | 'left' | 'bottom' | 'right';
  glowColor?: string;
  padding?: string | number;
};

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  style,
  accentColor = COLORS.cyan,
  accentPosition = 'top',
  glowColor,
  padding = '28px 32px',
}) => {
  const accentStyle: React.CSSProperties = {
    top: accentPosition === 'top' ? 0 : undefined,
    bottom: accentPosition === 'bottom' ? 0 : undefined,
    left: accentPosition === 'left' ? 0 : undefined,
    right: accentPosition === 'right' ? 0 : undefined,
    width: accentPosition === 'top' || accentPosition === 'bottom' ? '100%' : 3,
    height: accentPosition === 'left' || accentPosition === 'right' ? '100%' : 3,
  };

  return (
    <div
      style={{
        position: 'relative',
        background: COLORS.glass,
        border: `1px solid ${COLORS.glassBorder}`,
        borderRadius: 20,
        padding,
        overflow: 'hidden',
        backdropFilter: 'blur(12px)',
        ...style,
      }}
    >
      {/* Glow background */}
      {glowColor && (
        <div
          style={{
            position: 'absolute',
            top: -80,
            left: -80,
            width: 300,
            height: 300,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)`,
            filter: 'blur(40px)',
            pointerEvents: 'none',
          }}
        />
      )}
      {/* Accent edge */}
      <div
        style={{
          position: 'absolute',
          background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`,
          ...accentStyle,
        }}
      />
      {children}
    </div>
  );
};
