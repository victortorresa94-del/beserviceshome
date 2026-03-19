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
import { AnimatedCounter } from '../components/AnimatedCounter';

// ─── Types ────────────────────────────────────────────────────────────────────

interface OrbitalNode {
  radius: number;
  speed: number;         // radians per frame
  phaseOffset: number;   // starting angle in radians
  size: number;
  color: string;
}

// ─── Pulsing Ring ────────────────────────────────────────────────────────────

interface PulsingRingProps {
  frame: number;
  startFrame: number;
  cx: number;
  cy: number;
  baseRadius: number;
  color: string;
}

const PulsingRing: React.FC<PulsingRingProps> = ({
  frame,
  startFrame,
  cx,
  cy,
  baseRadius,
  color,
}) => {
  const localFrame = frame - startFrame;
  const duration = 60;
  const t = ((localFrame % duration) + duration) % duration;

  const scale = interpolate(t, [0, duration], [1, 2.8], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const opacity = interpolate(t, [0, duration * 0.2, duration * 0.8, duration], [0, 0.6, 0.3, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const r = baseRadius * scale;

  return (
    <div
      style={{
        position: 'absolute',
        left: cx - r,
        top: cy - r,
        width: r * 2,
        height: r * 2,
        borderRadius: '50%',
        border: `1.5px solid ${color}`,
        opacity: frame < startFrame ? 0 : opacity,
        pointerEvents: 'none',
      }}
    />
  );
};

// ─── Orbital System ──────────────────────────────────────────────────────────

interface OrbitalSystemProps {
  frame: number;
  fps: number;
  cx: number;
  cy: number;
}

const ORBITAL_NODES: OrbitalNode[] = [
  {
    radius: 90,
    speed: 0.025,
    phaseOffset: 0,
    size: 14,
    color: COLORS.cyan,
  },
  {
    radius: 130,
    speed: 0.016,
    phaseOffset: (Math.PI * 2) / 3,
    size: 11,
    color: COLORS.violet,
  },
  {
    radius: 165,
    speed: 0.011,
    phaseOffset: (Math.PI * 4) / 3,
    size: 9,
    color: COLORS.fuchsia,
  },
];

const OrbitalSystem: React.FC<OrbitalSystemProps> = ({ frame, fps, cx, cy }) => {
  const systemOpacity = interpolate(frame, [10, 40], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Whole system subtle rotation (slow)
  const systemRotation = frame * 0.003;

  // Glow pulse for center
  const centerPulse = 0.7 + Math.sin(frame * 0.07) * 0.3;
  const centerScale = spring({
    frame: frame - 5,
    fps,
    config: { damping: 10, stiffness: 60, mass: 1.2 },
  });

  // Center radius
  const centerR = 38;

  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
        opacity: systemOpacity,
        pointerEvents: 'none',
      }}
    >
      {/* Orbit rings (static circles) */}
      {ORBITAL_NODES.map((node, i) => (
        <div
          key={`orbit-ring-${i}`}
          style={{
            position: 'absolute',
            left: cx - node.radius,
            top: cy - node.radius,
            width: node.radius * 2,
            height: node.radius * 2,
            borderRadius: '50%',
            border: `1px solid rgba(255,255,255,0.08)`,
          }}
        />
      ))}

      {/* Pulsing rings — multiple at staggered offsets */}
      <PulsingRing frame={frame} startFrame={60} cx={cx} cy={cy} baseRadius={centerR + 10} color={COLORS.cyan} />
      <PulsingRing frame={frame} startFrame={80} cx={cx} cy={cy} baseRadius={centerR + 10} color={COLORS.violet} />
      <PulsingRing frame={frame} startFrame={100} cx={cx} cy={cy} baseRadius={centerR + 10} color={COLORS.cyan} />

      {/* SVG layer: connecting lines + orbital nodes */}
      <svg
        style={{ position: 'absolute', inset: 0 }}
        width="100%"
        height="100%"
      >
        <defs>
          <radialGradient id="centerGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={COLORS.cyanBright} stopOpacity={0.95} />
            <stop offset="60%" stopColor={COLORS.cyan} stopOpacity={0.7} />
            <stop offset="100%" stopColor={COLORS.violet} stopOpacity={0} />
          </radialGradient>
          <filter id="orbitGlow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Center glow circle */}
        <circle
          cx={cx}
          cy={cy}
          r={centerR * 1.8 * centerPulse}
          fill="url(#centerGrad)"
          opacity={0.25}
        />

        {/* Center core */}
        <circle
          cx={cx}
          cy={cy}
          r={centerR * centerScale}
          fill="none"
          stroke={COLORS.cyan}
          strokeWidth={2}
        />
        <circle
          cx={cx}
          cy={cy}
          r={(centerR - 8) * centerScale}
          fill={`rgba(0,212,255,0.12)`}
          stroke={COLORS.cyanBright}
          strokeWidth={1}
        />

        {/* Orbiting nodes */}
        {ORBITAL_NODES.map((node, i) => {
          const angle = frame * node.speed + node.phaseOffset + systemRotation;
          const nx = cx + node.radius * Math.cos(angle);
          const ny = cy + node.radius * Math.sin(angle);

          const nodeOpacity = interpolate(frame, [10 + i * 10, 40 + i * 10], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });

          return (
            <g key={`orbital-${i}`} opacity={nodeOpacity} filter="url(#orbitGlow)">
              {/* Connecting line from center */}
              <line
                x1={cx}
                y1={cy}
                x2={nx}
                y2={ny}
                stroke={node.color}
                strokeWidth={1}
                opacity={0.3}
              />
              {/* Node outer glow */}
              <circle cx={nx} cy={ny} r={node.size * 1.8} fill={node.color} opacity={0.15} />
              {/* Node core */}
              <circle
                cx={nx}
                cy={ny}
                r={node.size}
                fill={node.color}
                opacity={0.9}
              />
              <circle cx={nx} cy={ny} r={node.size * 0.4} fill={COLORS.white} opacity={0.6} />
            </g>
          );
        })}
      </svg>
    </div>
  );
};

// ─── Floating AI Label ────────────────────────────────────────────────────────

interface FloatingLabelProps {
  frame: number;
  fps: number;
  startFrame: number;
  text: string;
  x: number;
  y: number;
  color: string;
}

const FloatingLabel: React.FC<FloatingLabelProps> = ({
  frame,
  fps,
  startFrame,
  text,
  x,
  y,
  color,
}) => {
  const progress = spring({
    frame: frame - startFrame,
    fps,
    config: { damping: 14, stiffness: 100, mass: 0.7 },
  });
  const labelOpacity = interpolate(frame, [startFrame, startFrame + 10], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Subtle float oscillation
  const floatY = Math.sin((frame - startFrame) * 0.04) * 5;

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y + floatY * progress,
        transform: `scale(${progress}) translateY(${(1 - progress) * 20}px)`,
        opacity: labelOpacity,
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          background: `rgba(0,0,0,0.5)`,
          border: `1px solid ${color}`,
          borderRadius: 6,
          padding: '4px 10px',
          fontFamily: COLORS.fontBody,
          fontSize: 12,
          fontWeight: 600,
          color,
          letterSpacing: '0.06em',
          whiteSpace: 'nowrap',
          boxShadow: `0 0 10px ${color}40`,
        }}
      >
        {text}
      </div>
    </div>
  );
};

// ─── AI Capability Card ───────────────────────────────────────────────────────

interface AICardProps {
  frame: number;
  fps: number;
  startFrame: number;
  icon: string;
  title: string;
  desc: string;
  accentColor: string;
}

const AICard: React.FC<AICardProps> = ({
  frame,
  fps,
  startFrame,
  icon,
  title,
  desc,
  accentColor,
}) => {
  const progress = spring({
    frame: frame - startFrame,
    fps,
    config: { damping: 12, stiffness: 110, mass: 0.85 },
  });
  const cardOpacity = interpolate(frame, [startFrame, startFrame + 10], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        transform: `translateX(${(1 - progress) * 60}px)`,
        opacity: cardOpacity,
      }}
    >
      <GlassCard
        accentColor={accentColor}
        accentPosition="left"
        glowColor={accentColor}
        padding={16}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          <div
            style={{
              fontSize: 26,
              lineHeight: 1,
              flexShrink: 0,
              marginTop: 2,
            }}
          >
            {icon}
          </div>
          <div>
            <div
              style={{
                fontFamily: COLORS.fontDisplay,
                fontSize: 14,
                fontWeight: 700,
                color: COLORS.white,
                marginBottom: 4,
              }}
            >
              {title}
            </div>
            <div
              style={{
                fontFamily: COLORS.fontBody,
                fontSize: 11,
                color: COLORS.muted,
                lineHeight: 1.4,
              }}
            >
              {desc}
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};

// ─── Tech Tag ────────────────────────────────────────────────────────────────

interface TechTagProps {
  label: string;
  color: string;
  opacity: number;
  delay?: number;
  frame: number;
  fps: number;
  startFrame: number;
}

const TechTag: React.FC<TechTagProps> = ({
  label,
  color,
  frame,
  fps,
  startFrame,
}) => {
  const progress = spring({
    frame: frame - startFrame,
    fps,
    config: { damping: 10, stiffness: 90, mass: 0.6 },
  });
  const tagOpacity = interpolate(frame, [startFrame, startFrame + 8], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        transform: `scale(${progress})`,
        opacity: tagOpacity,
        display: 'inline-flex',
        alignItems: 'center',
        background: `${color}18`,
        border: `1px solid ${color}50`,
        borderRadius: 20,
        padding: '4px 12px',
        fontFamily: COLORS.fontBody,
        fontSize: 11,
        fontWeight: 600,
        color,
        letterSpacing: '0.05em',
      }}
    >
      {label}
    </div>
  );
};

// ─── AI Capability Cards data ─────────────────────────────────────────────────

interface CardData {
  icon: string;
  title: string;
  desc: string;
  accentColor: string;
  startFrame: number;
}

const AI_CARDS: CardData[] = [
  {
    icon: '🤖',
    title: 'Claude Code',
    desc: 'Automatización avanzada con IA generativa',
    accentColor: COLORS.violet,
    startFrame: 40,
  },
  {
    icon: '✨',
    title: 'Copilot M365',
    desc: 'IA embebida en Word, Excel, Teams y Outlook',
    accentColor: COLORS.microsoftBlue,
    startFrame: 52,
  },
  {
    icon: '🔮',
    title: 'Agent 365',
    desc: 'Agentes autónomos que ejecutan tareas completas',
    accentColor: COLORS.fuchsia,
    startFrame: 64,
  },
  {
    icon: '🧠',
    title: 'Gemini Workspace',
    desc: 'IA de Google en todos tus documentos',
    accentColor: COLORS.googleBlue,
    startFrame: 76,
  },
];

// ─── Tech Tags data ───────────────────────────────────────────────────────────

interface TagData {
  label: string;
  color: string;
  startFrame: number;
}

const TECH_TAGS: TagData[] = [
  { label: 'Claude', color: COLORS.violet, startFrame: 88 },
  { label: 'Copilot', color: COLORS.microsoftBlue, startFrame: 96 },
  { label: 'Gemini', color: COLORS.googleBlue, startFrame: 104 },
  { label: 'Agent 365', color: COLORS.fuchsia, startFrame: 112 },
];

// ─── Main Scene ───────────────────────────────────────────────────────────────

export const SceneAI: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Center of the orbital system (center of the canvas)
  const orbCx = width * 0.5;
  const orbCy = height * 0.5;

  // Global fade
  const bgOpacity = interpolate(frame, [0, 18], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Left panel slide-in
  const leftPanelX = interpolate(frame, [20, 55], [-80, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const leftPanelOpacity = interpolate(frame, [20, 50], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Violet glow pulse
  const violetPulse = 0.7 + Math.sin(frame * 0.055) * 0.3;
  const cyanPulse = 0.75 + Math.sin(frame * 0.07 + 1.2) * 0.25;

  // Stat card spring
  const statProgress = spring({
    frame: frame - 95,
    fps,
    config: { damping: 12, stiffness: 100, mass: 0.9 },
  });
  const statOpacity = interpolate(frame, [95, 108], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Tag line opacity
  const tagLineOpacity = interpolate(frame, [55, 70], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse 130% 110% at 50% 50%, #0D0A1E 0%, #080D18 55%, #000408 100%)`,
        opacity: bgOpacity,
        overflow: 'hidden',
      }}
    >
      {/* ── Background glow orbs ── */}
      {/* Violet orb — center-left */}
      <div
        style={{
          position: 'absolute',
          left: width * 0.15,
          top: height * 0.3,
          width: 500,
          height: 500,
          borderRadius: '50%',
          background: `radial-gradient(circle, rgba(123,47,255,${0.18 * violetPulse}) 0%, transparent 70%)`,
          filter: 'blur(60px)',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
        }}
      />
      {/* Fuchsia orb — bottom */}
      <div
        style={{
          position: 'absolute',
          left: width * 0.5,
          top: height * 0.85,
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: `radial-gradient(circle, rgba(224,64,251,${0.12 * violetPulse}) 0%, transparent 70%)`,
          filter: 'blur(50px)',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
        }}
      />
      {/* Cyan orb — right */}
      <div
        style={{
          position: 'absolute',
          left: width * 0.82,
          top: height * 0.4,
          width: 360,
          height: 360,
          borderRadius: '50%',
          background: `radial-gradient(circle, rgba(0,212,255,${0.12 * cyanPulse}) 0%, transparent 70%)`,
          filter: 'blur(50px)',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
        }}
      />

      {/* ── Orbital system (center canvas) ── */}
      <OrbitalSystem frame={frame} fps={fps} cx={orbCx} cy={orbCy} />

      {/* ── Floating AI agent labels ── */}
      <FloatingLabel
        frame={frame}
        fps={fps}
        startFrame={80}
        text="Claude Agent"
        x={width * 0.53}
        y={height * 0.18}
        color={COLORS.violet}
      />
      <FloatingLabel
        frame={frame}
        fps={fps}
        startFrame={88}
        text="Copilot"
        x={width * 0.65}
        y={height * 0.62}
        color={COLORS.microsoftBlue}
      />
      <FloatingLabel
        frame={frame}
        fps={fps}
        startFrame={96}
        text="Gemini"
        x={width * 0.37}
        y={height * 0.72}
        color={COLORS.googleBlue}
      />
      <FloatingLabel
        frame={frame}
        fps={fps}
        startFrame={104}
        text="Agent 365"
        x={width * 0.56}
        y={height * 0.78}
        color={COLORS.fuchsia}
      />

      {/* ── LEFT PANEL ── */}
      <div
        style={{
          position: 'absolute',
          left: 60,
          top: 0,
          bottom: 0,
          width: 340,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          transform: `translateX(${leftPanelX}px)`,
          opacity: leftPanelOpacity,
        }}
      >
        {/* Category tag */}
        <div
          style={{
            fontFamily: COLORS.fontBody,
            fontSize: 11,
            fontWeight: 700,
            color: COLORS.violet,
            letterSpacing: '0.22em',
            textTransform: 'uppercase' as const,
            marginBottom: 16,
          }}
        >
          INTELIGENCIA ARTIFICIAL
        </div>

        {/* Big headline with gradient text */}
        <div
          style={{
            fontFamily: COLORS.fontDisplay,
            fontSize: 36,
            fontWeight: 900,
            lineHeight: 1.1,
            marginBottom: 16,
            background: `linear-gradient(135deg, ${COLORS.cyan} 0%, ${COLORS.cyanBright} 30%, ${COLORS.violet} 80%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          Agentes que trabajan por ti
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontFamily: COLORS.fontBody,
            fontSize: 14,
            color: COLORS.muted,
            lineHeight: 1.55,
            marginBottom: 28,
            opacity: tagLineOpacity,
          }}
        >
          Copilot + Claude + Gemini integrados en tu flujo de trabajo
        </div>

        {/* 10x counter */}
        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            gap: 8,
            marginBottom: 8,
          }}
        >
          <AnimatedCounter
            from={1}
            to={10}
            suffix="x"
            startFrame={100}
            style={{
              fontFamily: COLORS.fontDisplay,
              fontSize: 56,
              fontWeight: 900,
              color: COLORS.cyanBright,
              textShadow: `0 0 30px rgba(0,229,255,0.6)`,
            }}
          />
          <div
            style={{
              fontFamily: COLORS.fontBody,
              fontSize: 14,
              color: COLORS.muted,
              paddingBottom: 8,
            }}
          >
            productividad
          </div>
        </div>

        {/* 180+ stat GlassCard */}
        <div
          style={{
            transform: `scale(${statProgress})`,
            opacity: statOpacity,
            marginBottom: 24,
          }}
        >
          <GlassCard
            accentColor={COLORS.violet}
            accentPosition="left"
            glowColor={COLORS.violet}
            padding={14}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div
                style={{
                  fontFamily: COLORS.fontDisplay,
                  fontSize: 28,
                  fontWeight: 900,
                  color: COLORS.violet,
                  textShadow: `0 0 16px rgba(123,47,255,0.6)`,
                }}
              >
                180+
              </div>
              <div
                style={{
                  fontFamily: COLORS.fontBody,
                  fontSize: 12,
                  color: COLORS.muted,
                }}
              >
                empresas automatizadas
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Tech tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 8 }}>
          {TECH_TAGS.map((tag, i) => (
            <TechTag
              key={`tag-${i}`}
              label={tag.label}
              color={tag.color}
              opacity={1}
              frame={frame}
              fps={fps}
              startFrame={tag.startFrame}
            />
          ))}
        </div>
      </div>

      {/* ── RIGHT PANEL: AI Capability Cards 2×2 grid ── */}
      <div
        style={{
          position: 'absolute',
          right: 52,
          top: 0,
          bottom: 0,
          width: 320,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: 14,
        }}
      >
        {AI_CARDS.map((card, i) => (
          <AICard
            key={`ai-card-${i}`}
            frame={frame}
            fps={fps}
            startFrame={card.startFrame}
            icon={card.icon}
            title={card.title}
            desc={card.desc}
            accentColor={card.accentColor}
          />
        ))}
      </div>
    </AbsoluteFill>
  );
};
