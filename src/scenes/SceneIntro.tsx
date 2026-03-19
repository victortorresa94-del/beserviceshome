import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from 'remotion';
import { COLORS } from '../colors';
import { GlassCard } from '../components/GlassCard';
import { NodeNetwork } from '../components/NodeNetwork';
import { TypeWriter } from '../components/TypeWriter';

// ─── Glow Orb ─────────────────────────────────────────────────────────────────

interface GlowOrbProps {
  x: number;
  y: number;
  radius: number;
  color: string;
  opacity: number;
}

const GlowOrb: React.FC<GlowOrbProps> = ({ x, y, radius, color, opacity }) => (
  <div
    style={{
      position: 'absolute',
      left: x - radius,
      top: y - radius,
      width: radius * 2,
      height: radius * 2,
      borderRadius: '50%',
      background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
      opacity,
      filter: `blur(${Math.round(radius * 0.4)}px)`,
      pointerEvents: 'none',
    }}
  />
);

// ─── Particle Grid ────────────────────────────────────────────────────────────

const ParticleGrid: React.FC<{ opacity: number }> = ({ opacity }) => {
  const cols = 24;
  const rows = 14;
  const dots: React.ReactNode[] = [];

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = (c / (cols - 1)) * 100;
      const y = (r / (rows - 1)) * 100;
      const seed = (r * cols + c) * 137.508;
      const dotOpacity = 0.08 + (Math.sin(seed) * 0.5 + 0.5) * 0.18;
      dots.push(
        <div
          key={`dot-${r}-${c}`}
          style={{
            position: 'absolute',
            left: `${x}%`,
            top: `${y}%`,
            width: 3,
            height: 3,
            borderRadius: '50%',
            background: COLORS.cyan,
            opacity: dotOpacity * opacity,
            transform: 'translate(-50%, -50%)',
          }}
        />
      );
    }
  }

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      {dots}
    </div>
  );
};

// ─── Hex Logo SVG ─────────────────────────────────────────────────────────────

interface HexLogoProps {
  frame: number;
  fps: number;
}

const HexLogo: React.FC<HexLogoProps> = ({ frame, fps }) => {
  const R = 80;
  const hexPoints: [number, number][] = Array.from({ length: 6 }, (_, i) => {
    const angle = (Math.PI / 180) * (60 * i - 30);
    return [R * Math.cos(angle), R * Math.sin(angle)];
  });

  const hexPath =
    'M ' +
    hexPoints.map(([px, py]) => `${px.toFixed(2)},${py.toFixed(2)}`).join(' L ') +
    ' Z';

  // Approximate perimeter of regular hexagon = 6 * side length = 6 * R
  const hexPerimeter = 6 * R;

  const drawProgress = interpolate(frame, [10, 55], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const strokeDashoffset = hexPerimeter * (1 - drawProgress);

  // Subtle 3D CSS oscillation via sin
  const rotateX = Math.sin(frame * 0.04) * 6;
  const rotateY = Math.sin(frame * 0.025 + 1) * 4;

  // Glow pulse
  const glowPulse = 0.6 + Math.sin(frame * 0.08) * 0.4;

  const logoOpacity = interpolate(frame, [10, 30], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Spring scale for a "pop" on entry
  const logoScale = spring({
    frame: frame - 10,
    fps,
    config: { damping: 10, stiffness: 80, mass: 1 },
  });

  const letterOpacity = interpolate(frame, [30, 55], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        position: 'absolute',
        left: '50%',
        top: '38%',
        transform: `translate(-50%, -50%) perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${logoScale})`,
        opacity: logoOpacity,
      }}
    >
      {/* Outer cyan glow */}
      <div
        style={{
          position: 'absolute',
          inset: -30,
          borderRadius: '50%',
          background: `radial-gradient(circle, rgba(0,212,255,${0.15 * glowPulse}) 0%, transparent 70%)`,
          filter: 'blur(20px)',
        }}
      />
      {/* Inner violet glow */}
      <div
        style={{
          position: 'absolute',
          inset: -15,
          borderRadius: '50%',
          background: `radial-gradient(circle, rgba(123,47,255,${0.12 * glowPulse}) 0%, transparent 60%)`,
          filter: 'blur(12px)',
        }}
      />

      <svg width={220} height={220} viewBox="-110 -110 220 220">
        <defs>
          <linearGradient id="logoGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={COLORS.cyan} />
            <stop offset="100%" stopColor={COLORS.violet} />
          </linearGradient>
        </defs>

        {/* Subtle fill */}
        <path d={hexPath} fill="rgba(0,212,255,0.04)" />

        {/* Ghost hex border */}
        <path
          d={hexPath}
          fill="none"
          stroke={COLORS.cyan}
          strokeWidth={1.5}
          opacity={0.25}
        />

        {/* Animated draw-on stroke */}
        <path
          d={hexPath}
          fill="none"
          stroke={COLORS.cyan}
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={hexPerimeter}
          strokeDashoffset={strokeDashoffset}
          style={{ filter: `drop-shadow(0 0 10px ${COLORS.cyan})` }}
        />

        {/* B letter */}
        <text
          x={0}
          y={0}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={62}
          fontWeight={900}
          fontFamily="Montserrat, Arial Black, Arial, sans-serif"
          fill="url(#logoGrad)"
          opacity={letterOpacity}
          style={{ filter: `drop-shadow(0 0 16px rgba(0,212,255,0.8))` }}
        >
          B
        </text>
      </svg>
    </div>
  );
};

// ─── Staggered Letters ────────────────────────────────────────────────────────

interface StaggeredTitleProps {
  frame: number;
  fps: number;
  text: string;
  startFrame: number;
  staggerFrames: number;
  style?: React.CSSProperties;
}

const StaggeredTitle: React.FC<StaggeredTitleProps> = ({
  frame,
  fps,
  text,
  startFrame,
  staggerFrames,
  style,
}) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', ...style }}>
      {text.split('').map((char, i) => {
        const letterStart = startFrame + i * staggerFrames;
        const progress = spring({
          frame: frame - letterStart,
          fps,
          config: { damping: 14, stiffness: 140, mass: 0.8 },
        });
        const charOpacity = interpolate(frame, [letterStart, letterStart + 8], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });

        return (
          <span
            key={`char-${i}`}
            style={{
              display: 'inline-block',
              transform: `translateY(${(1 - progress) * 40}px) scale(${0.5 + progress * 0.5})`,
              opacity: charOpacity,
              color: COLORS.white,
              width: char === ' ' ? '0.4em' : undefined,
              fontFamily: COLORS.fontDisplay,
              fontSize: 72,
              fontWeight: 900,
              letterSpacing: '0.12em',
              textShadow: `0 0 30px rgba(0,212,255,0.45), 0 0 60px rgba(0,212,255,0.2)`,
            }}
          >
            {char === ' ' ? '\u00A0' : char}
          </span>
        );
      })}
    </div>
  );
};

// ─── Divider Line (sweeps in) ─────────────────────────────────────────────────

interface DividerLineProps {
  frame: number;
  width: number;
}

const DividerLine: React.FC<DividerLineProps> = ({ frame, width }) => {
  const progress = interpolate(frame, [50, 90], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        position: 'absolute',
        left: '50%',
        top: '59%',
        transform: 'translateX(-50%)',
        width: width * 0.6 * progress,
        height: 1,
        background: `linear-gradient(90deg, transparent, ${COLORS.cyan}, ${COLORS.violet}, transparent)`,
        opacity: progress,
        boxShadow: `0 0 8px 2px rgba(0,212,255,0.3)`,
      }}
    />
  );
};

// ─── Scanning Line (sweeps top to bottom) ────────────────────────────────────

interface ScanningLineProps {
  frame: number;
  height: number;
}

const ScanningLine: React.FC<ScanningLineProps> = ({ frame, height }) => {
  const progress = interpolate(frame, [130, 160], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const opacity = interpolate(frame, [130, 138, 155, 160], [0, 0.75, 0.75, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const y = progress * height;

  return (
    <div
      style={{
        position: 'absolute',
        top: y,
        left: 0,
        right: 0,
        height: 2,
        background: `linear-gradient(90deg, transparent 0%, ${COLORS.cyan} 20%, ${COLORS.cyanBright} 50%, ${COLORS.cyan} 80%, transparent 100%)`,
        opacity,
        boxShadow: `0 0 14px 4px ${COLORS.cyan}`,
        pointerEvents: 'none',
      }}
    />
  );
};

// ─── Google Cloud Logo SVG ────────────────────────────────────────────────────

const GoogleCloudLogo: React.FC = () => (
  <svg width={38} height={30} viewBox="0 0 38 30">
    <path
      d="M24 8.5 C22-1 8-1 8 10 C2 10 2 19 8 19 L30 19 C35 19 35 10 29 10 C29 5 27 2 24 8.5z"
      fill="none"
      stroke={COLORS.googleBlue}
      strokeWidth={2}
    />
    <circle cx={10} cy={24} r={3} fill={COLORS.googleRed} />
    <circle cx={19} cy={24} r={3} fill={COLORS.googleYellow} />
    <circle cx={28} cy={24} r={3} fill={COLORS.googleGreen} />
  </svg>
);

// ─── Microsoft Logo SVG ───────────────────────────────────────────────────────

const MicrosoftLogo: React.FC = () => (
  <svg width={32} height={32} viewBox="0 0 32 32">
    <rect x={1} y={1} width={14} height={14} fill={COLORS.googleRed} rx={1} />
    <rect x={17} y={1} width={14} height={14} fill={COLORS.googleGreen} rx={1} />
    <rect x={1} y={17} width={14} height={14} fill={COLORS.googleBlue} rx={1} />
    <rect x={17} y={17} width={14} height={14} fill={COLORS.googleYellow} rx={1} />
  </svg>
);

// ─── Partner Badge ────────────────────────────────────────────────────────────

interface PartnerBadgeProps {
  frame: number;
  fps: number;
  startFrame: number;
  label: string;
  subLabel: string;
  accentColor: string;
  logo: React.ReactNode;
}

const PartnerBadge: React.FC<PartnerBadgeProps> = ({
  frame,
  fps,
  startFrame,
  label,
  subLabel,
  accentColor,
  logo,
}) => {
  const scaleProgress = spring({
    frame: frame - startFrame,
    fps,
    config: { damping: 12, stiffness: 120, mass: 0.9 },
  });
  const badgeOpacity = interpolate(frame, [startFrame, startFrame + 12], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        transform: `scale(${scaleProgress})`,
        opacity: badgeOpacity,
      }}
    >
      <GlassCard
        accentColor={accentColor}
        accentPosition="top"
        glowColor={accentColor}
        padding={16}
        style={{ minWidth: 220 }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ flexShrink: 0 }}>{logo}</div>
          <div>
            <div
              style={{
                fontFamily: COLORS.fontDisplay,
                fontSize: 13,
                fontWeight: 700,
                color: COLORS.white,
                letterSpacing: '0.04em',
              }}
            >
              {label}
            </div>
            <div
              style={{
                fontFamily: COLORS.fontBody,
                fontSize: 11,
                color: COLORS.muted,
                marginTop: 2,
              }}
            >
              {subLabel}
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};

// ─── Main Scene ───────────────────────────────────────────────────────────────

export const SceneIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Global background fade
  const bgOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Particle grid fade
  const particleOpacity = interpolate(frame, [5, 35], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Tagline fade
  const taglineOpacity = interpolate(frame, [75, 90], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Orb opacity + pulse
  const orb1Opacity = interpolate(frame, [0, 25], [0, 0.8], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const orb2Opacity = interpolate(frame, [5, 30], [0, 0.7], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const orbPulse = 0.85 + Math.sin(frame * 0.06) * 0.15;

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse 120% 100% at 50% 40%, ${COLORS.darkNavy} 0%, ${COLORS.navy} 60%, #000814 100%)`,
        opacity: bgOpacity,
        overflow: 'hidden',
      }}
    >
      {/* Node network — very subtle background layer */}
      <div style={{ position: 'absolute', inset: 0, opacity: 0.18 * particleOpacity }}>
        <NodeNetwork frame={frame} width={width} height={height} color={COLORS.cyan} animated />
      </div>

      {/* Particle dot grid */}
      <ParticleGrid opacity={particleOpacity * 0.65} />

      {/* ── Glow Orbs ── */}
      <GlowOrb
        x={width * 0.12}
        y={height * 0.22}
        radius={300}
        color={`rgba(0,212,255,${0.22 * orbPulse})`}
        opacity={orb1Opacity}
      />
      <GlowOrb
        x={width * 0.88}
        y={height * 0.78}
        radius={340}
        color={`rgba(123,47,255,${0.20 * orbPulse})`}
        opacity={orb2Opacity}
      />
      <GlowOrb
        x={width * 0.5}
        y={height * 0.38}
        radius={200}
        color={`rgba(0,212,255,${0.10 * orbPulse})`}
        opacity={orb1Opacity}
      />
      <GlowOrb
        x={width * 0.06}
        y={height * 0.82}
        radius={190}
        color={`rgba(224,64,251,${0.14 * orbPulse})`}
        opacity={orb2Opacity}
      />
      <GlowOrb
        x={width * 0.92}
        y={height * 0.15}
        radius={160}
        color={`rgba(123,47,255,${0.12 * orbPulse})`}
        opacity={orb1Opacity}
      />

      {/* ── Hex Logo with draw-on stroke + 3D oscillation ── */}
      <HexLogo frame={frame} fps={fps} />

      {/* ── BESERVICES letter-by-letter stagger ── */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: '57%',
          transform: 'translateY(-50%)',
        }}
      >
        <StaggeredTitle
          frame={frame}
          fps={fps}
          text="BESERVICES"
          startFrame={20}
          staggerFrames={4}
        />
      </div>

      {/* ── Horizontal divider sweep ── */}
      <DividerLine frame={frame} width={width} />

      {/* ── Tagline TypeWriter ── */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: '65%',
          display: 'flex',
          justifyContent: 'center',
          opacity: taglineOpacity,
        }}
      >
        <TypeWriter
          text="SCALING YOUR DIGITAL WORLD"
          startFrame={80}
          framesPerChar={2}
          style={{
            fontFamily: COLORS.fontBody,
            fontSize: 22,
            fontWeight: 400,
            letterSpacing: '0.28em',
            color: COLORS.muted,
          }}
          showCursor
        />
      </div>

      {/* ── Partner Badges ── */}
      <div
        style={{
          position: 'absolute',
          bottom: 54,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          gap: 24,
        }}
      >
        <PartnerBadge
          frame={frame}
          fps={fps}
          startFrame={100}
          label="Google Cloud"
          subLabel="Premier Partner"
          accentColor={COLORS.googleBlue}
          logo={<GoogleCloudLogo />}
        />
        <PartnerBadge
          frame={frame}
          fps={fps}
          startFrame={114}
          label="Microsoft"
          subLabel="Solutions Partner"
          accentColor={COLORS.microsoftBlue}
          logo={<MicrosoftLogo />}
        />
      </div>

      {/* ── Scanning line sweep (top to bottom) ── */}
      <ScanningLine frame={frame} height={height} />
    </AbsoluteFill>
  );
};
