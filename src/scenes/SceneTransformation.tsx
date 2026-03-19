import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from 'remotion';
import { GlassCard } from '../components/GlassCard';
import { AnimatedCounter } from '../components/AnimatedCounter';

const COLORS = {
  background: '#080D18',
  white: '#FFFFFF',
  softWhite: 'rgba(255,255,255,0.92)',
  muted: 'rgba(255,255,255,0.55)',
  subtle: 'rgba(255,255,255,0.28)',
  dim: 'rgba(255,255,255,0.10)',
  cyan: '#00D4FF',
  violet: '#7B2FFF',
  googleBlue: '#4285F4',
  googleGreen: '#34A853',
  fontDisplay: "'Montserrat', 'Arial Black', Arial, sans-serif",
  fontBody: "'Inter', Arial, sans-serif",
};

interface StatCardProps {
  children: React.ReactNode;
  label: string;
  accentColor: string;
  delay: number;
  frame: number;
  fps: number;
}

const StatCard: React.FC<StatCardProps> = ({
  children,
  label,
  accentColor,
  delay,
  frame,
  fps,
}) => {
  const s = spring({
    frame: Math.max(0, frame - delay),
    fps,
    config: { damping: 18, stiffness: 140, mass: 0.9 },
    durationInFrames: 40,
  });

  const scale = interpolate(s, [0, 1], [0.5, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const opacity = interpolate(s, [0, 1], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        transform: `scale(${scale})`,
        opacity,
        flex: 1,
      }}
    >
      <GlassCard
        accentColor={accentColor}
        accentPosition="top"
        glowColor={`${accentColor}18`}
        padding={24}
        style={{ textAlign: 'center', height: '100%', boxSizing: 'border-box' }}
      >
        <div
          style={{
            fontFamily: COLORS.fontDisplay,
            fontSize: 38,
            fontWeight: 900,
            color: accentColor,
            lineHeight: 1,
            marginBottom: 8,
          }}
        >
          {children}
        </div>
        <div
          style={{
            fontFamily: COLORS.fontBody,
            fontSize: 12,
            color: COLORS.muted,
            lineHeight: 1.4,
          }}
        >
          {label}
        </div>
      </GlassCard>
    </div>
  );
};

interface StepProps {
  number: string;
  title: string;
  description: string;
  accentColor: string;
  delay: number;
  frame: number;
  fps: number;
  showConnector?: boolean;
}

const ProcessStep: React.FC<StepProps> = ({
  number,
  title,
  description,
  accentColor,
  delay,
  frame,
  fps,
  showConnector,
}) => {
  const s = spring({
    frame: Math.max(0, frame - delay),
    fps,
    config: { damping: 22, stiffness: 120, mass: 1 },
    durationInFrames: 40,
  });

  const translateX = interpolate(s, [0, 1], [-30, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const opacity = interpolate(s, [0, 1], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        transform: `translateX(${translateX}px)`,
        opacity,
        display: 'flex',
        flexDirection: 'column',
        gap: 0,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
        {/* Number circle */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${accentColor}CC, ${accentColor}44)`,
              border: `2px solid ${accentColor}80`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: COLORS.fontDisplay,
              fontSize: 14,
              fontWeight: 800,
              color: COLORS.white,
              flexShrink: 0,
              boxShadow: `0 0 16px ${accentColor}40`,
            }}
          >
            {number}
          </div>
          {showConnector && (
            <div
              style={{
                width: 1,
                flex: 1,
                minHeight: 20,
                background: `repeating-linear-gradient(to bottom, ${accentColor}50 0px, ${accentColor}50 4px, transparent 4px, transparent 8px)`,
                marginTop: 6,
              }}
            />
          )}
        </div>

        {/* Content */}
        <div style={{ paddingBottom: showConnector ? 16 : 0 }}>
          <div
            style={{
              fontFamily: COLORS.fontDisplay,
              fontSize: 15,
              fontWeight: 700,
              color: COLORS.softWhite,
              marginBottom: 4,
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontFamily: COLORS.fontBody,
              fontSize: 12,
              color: COLORS.muted,
              lineHeight: 1.55,
            }}
          >
            {description}
          </div>
        </div>
      </div>
    </div>
  );
};

export const SceneTransformation: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headerSpring = spring({
    frame,
    fps,
    config: { damping: 20, stiffness: 110, mass: 1 },
    durationInFrames: 45,
  });

  const headerOpacity = interpolate(headerSpring, [0, 1], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const headerY = interpolate(headerSpring, [0, 1], [30, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const steps = [
    {
      number: '01',
      title: 'Consultoría Estratégica',
      description: 'Analizamos tu negocio y diseñamos tu hoja de ruta',
      accentColor: COLORS.googleBlue,
      delay: 55,
    },
    {
      number: '02',
      title: 'Implementación Cloud',
      description: 'Migramos tu infraestructura con cero interrupciones',
      accentColor: COLORS.cyan,
      delay: 65,
    },
    {
      number: '03',
      title: 'BeSafe Security',
      description: 'Protegemos tus datos con las mejores prácticas',
      accentColor: COLORS.violet,
      delay: 75,
    },
    {
      number: '04',
      title: 'Soporte Continuo',
      description: 'Acompañamiento permanente para maximizar tu ROI',
      accentColor: COLORS.googleGreen,
      delay: 85,
    },
  ];

  return (
    <AbsoluteFill
      style={{
        background: COLORS.background,
        overflow: 'hidden',
        fontFamily: COLORS.fontBody,
      }}
    >
      {/* Background cyan glow bottom-right */}
      <div
        style={{
          position: 'absolute',
          right: -150,
          bottom: -150,
          width: 600,
          height: 600,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,212,255,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Header */}
      <div
        style={{
          position: 'absolute',
          top: 48,
          left: 0,
          right: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 10,
          transform: `translateY(${headerY}px)`,
          opacity: headerOpacity,
        }}
      >
        <span
          style={{
            fontFamily: COLORS.fontBody,
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: '0.28em',
            color: COLORS.cyan,
            textTransform: 'uppercase',
          }}
        >
          TRANSFORMACIÓN DIGITAL
        </span>
        <div
          style={{
            fontFamily: COLORS.fontDisplay,
            fontSize: 40,
            fontWeight: 900,
            color: COLORS.white,
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
            textAlign: 'center',
          }}
        >
          Resultados que{' '}
          <span style={{ color: COLORS.cyan }}>hablan por sí solos</span>
        </div>
      </div>

      {/* Stats row */}
      <div
        style={{
          position: 'absolute',
          top: 210,
          left: 48,
          right: 48,
          display: 'flex',
          gap: 16,
          height: 120,
        }}
      >
        <StatCard
          label="Empresas transformadas"
          accentColor={COLORS.googleBlue}
          delay={30}
          frame={frame}
          fps={fps}
        >
          <AnimatedCounter
            from={0}
            to={180}
            prefix="+"
            startFrame={30}
            style={{ fontFamily: COLORS.fontDisplay, fontSize: 38, fontWeight: 900, color: COLORS.googleBlue }}
          />
        </StatCard>

        <StatCard
          label="Compromiso con el cliente"
          accentColor={COLORS.cyan}
          delay={45}
          frame={frame}
          fps={fps}
        >
          <AnimatedCounter
            from={0}
            to={100}
            suffix="%"
            startFrame={45}
            style={{ fontFamily: COLORS.fontDisplay, fontSize: 38, fontWeight: 900, color: COLORS.cyan }}
          />
        </StatCard>

        <StatCard
          label="Soporte especializado"
          accentColor={COLORS.cyan}
          delay={58}
          frame={frame}
          fps={fps}
        >
          <span style={{ fontFamily: COLORS.fontDisplay, fontSize: 38, fontWeight: 900, color: COLORS.cyan }}>
            24/7
          </span>
        </StatCard>

        <StatCard
          label="Google Cloud Premier España"
          accentColor={COLORS.googleGreen}
          delay={60}
          frame={frame}
          fps={fps}
        >
          <AnimatedCounter
            from={0}
            to={8}
            prefix="#"
            startFrame={60}
            style={{ fontFamily: COLORS.fontDisplay, fontSize: 38, fontWeight: 900, color: COLORS.googleGreen }}
          />
        </StatCard>
      </div>

      {/* Process steps - 2 columns */}
      <div
        style={{
          position: 'absolute',
          bottom: 40,
          left: 48,
          right: 48,
          top: 360,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '0 48px',
        }}
      >
        {/* Left column: steps 1 & 2 */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <ProcessStep
            number={steps[0].number}
            title={steps[0].title}
            description={steps[0].description}
            accentColor={steps[0].accentColor}
            delay={steps[0].delay}
            frame={frame}
            fps={fps}
            showConnector
          />
          <ProcessStep
            number={steps[1].number}
            title={steps[1].title}
            description={steps[1].description}
            accentColor={steps[1].accentColor}
            delay={steps[1].delay}
            frame={frame}
            fps={fps}
            showConnector={false}
          />
        </div>

        {/* Right column: steps 3 & 4 */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <ProcessStep
            number={steps[2].number}
            title={steps[2].title}
            description={steps[2].description}
            accentColor={steps[2].accentColor}
            delay={steps[2].delay}
            frame={frame}
            fps={fps}
            showConnector
          />
          <ProcessStep
            number={steps[3].number}
            title={steps[3].title}
            description={steps[3].description}
            accentColor={steps[3].accentColor}
            delay={steps[3].delay}
            frame={frame}
            fps={fps}
            showConnector={false}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};
