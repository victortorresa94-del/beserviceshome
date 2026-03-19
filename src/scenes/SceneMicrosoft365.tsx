import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from 'remotion';
import { GlassCard } from '../components/GlassCard';
import { AnimatedCounter } from '../components/AnimatedCounter';

const COLORS = {
  background: '#080D18',
  white: '#FFFFFF',
  softWhite: 'rgba(255,255,255,0.92)',
  muted: 'rgba(255,255,255,0.55)',
  microsoftBlue: '#0078D4',
  microsoftPurple: '#7719AA',
  microsoftGreen: '#7FBA00',
  cyan: '#00D4FF',
  fontDisplay: "'Montserrat', 'Arial Black', Arial, sans-serif",
  fontBody: "'Inter', Arial, sans-serif",
};

const MicrosoftLogoSVG: React.FC = () => (
  <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
    <rect x="0" y="0" width="16" height="16" fill="#F25022" />
    <rect x="20" y="0" width="16" height="16" fill="#7FBA00" />
    <rect x="0" y="20" width="16" height="16" fill="#00A4EF" />
    <rect x="20" y="20" width="16" height="16" fill="#FFB900" />
  </svg>
);

interface ShieldSVGProps {
  progress: number;
  glowScale: number;
}

const ShieldSVG: React.FC<ShieldSVGProps> = ({ progress, glowScale }) => {
  const dashOffset = interpolate(progress, [0, 1], [220, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const checkOpacity = interpolate(progress, [0.6, 1], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        position: 'relative',
        width: 120,
        height: 140,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: -20,
          borderRadius: '50%',
          background: `radial-gradient(circle, rgba(0,120,212,${0.12 + glowScale * 0.18}) 0%, transparent 70%)`,
          transform: `scale(${1 + glowScale * 0.08})`,
        }}
      />
      <svg width="100" height="120" viewBox="0 0 100 120" fill="none">
        <path
          d="M50 5 L90 22 L90 55 C90 80 72 102 50 115 C28 102 10 80 10 55 L10 22 Z"
          stroke={COLORS.microsoftBlue}
          strokeWidth="3"
          fill="rgba(0,120,212,0.08)"
          strokeDasharray="220"
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M35 58 L46 70 L68 45"
          stroke={COLORS.microsoftBlue}
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={checkOpacity}
        />
      </svg>
    </div>
  );
};

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
  accentColor: string;
  delay: number;
  frame: number;
  fps: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
  accentColor,
  delay,
  frame,
  fps,
}) => {
  const cardSpring = spring({
    frame: Math.max(0, frame - delay),
    fps,
    config: { damping: 20, stiffness: 120, mass: 1 },
    durationInFrames: 40,
  });

  const translateY = interpolate(cardSpring, [0, 1], [40, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const opacity = interpolate(cardSpring, [0, 1], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        transform: `translateY(${translateY}px)`,
        opacity,
        height: '100%',
      }}
    >
      <GlassCard
        accentColor={accentColor}
        accentPosition="left"
        glowColor={`${accentColor}20`}
        padding={20}
        style={{ height: '100%', boxSizing: 'border-box' }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          <span style={{ fontSize: 26, lineHeight: 1, flexShrink: 0 }}>{icon}</span>
          <div>
            <div
              style={{
                fontFamily: COLORS.fontDisplay,
                fontWeight: 700,
                fontSize: 14,
                color: COLORS.softWhite,
                marginBottom: 6,
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
      </GlassCard>
    </div>
  );
};

export const SceneMicrosoft365: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const shieldProgress = interpolate(frame, [10, 60], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  const glowScale = Math.sin(frame * 0.05) * 0.5 + 0.5;

  const leftPanelSpring = spring({
    frame,
    fps,
    config: { damping: 18, stiffness: 100, mass: 1 },
    durationInFrames: 50,
  });

  const leftPanelY = interpolate(leftPanelSpring, [0, 1], [40, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const leftPanelOpacity = interpolate(leftPanelSpring, [0, 1], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const tagOpacity = interpolate(frame, [5, 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const features: Array<{
    icon: string;
    title: string;
    description: string;
    accentColor: string;
    delay: number;
  }> = [
    {
      icon: '🔐',
      title: 'Azure AD Premium',
      description: 'Identidad segura con MFA, SSO y acceso condicional',
      accentColor: COLORS.microsoftBlue,
      delay: 30,
    },
    {
      icon: '🛡️',
      title: 'Microsoft Defender',
      description: 'Protección avanzada contra amenazas y ransomware',
      accentColor: COLORS.microsoftGreen,
      delay: 45,
    },
    {
      icon: '📧',
      title: 'Exchange + Purview',
      description: 'Email corporativo con DLP y compliance integrado',
      accentColor: COLORS.microsoftPurple,
      delay: 60,
    },
    {
      icon: '☁️',
      title: 'Intune MDM/MAM',
      description: 'Gestión de dispositivos desde la nube',
      accentColor: COLORS.cyan,
      delay: 75,
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
      {/* Background radial glow - left side */}
      <div
        style={{
          position: 'absolute',
          left: -200,
          top: '50%',
          transform: 'translateY(-50%)',
          width: 700,
          height: 700,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,120,212,0.14) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Section tag top-left */}
      <div
        style={{
          position: 'absolute',
          top: 40,
          left: 56,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          opacity: tagOpacity,
          zIndex: 10,
        }}
      >
        <div
          style={{
            width: 3,
            height: 22,
            background: COLORS.microsoftBlue,
            borderRadius: 2,
          }}
        />
        <span
          style={{
            fontFamily: COLORS.fontBody,
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: '0.22em',
            color: COLORS.microsoftBlue,
            textTransform: 'uppercase',
          }}
        >
          SEGURIDAD EMPRESARIAL
        </span>
      </div>

      {/* Main content */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          padding: '88px 56px 48px',
          gap: 56,
        }}
      >
        {/* Left Panel - 40% */}
        <div
          style={{
            width: '40%',
            flexShrink: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: 24,
            transform: `translateY(${leftPanelY}px)`,
            opacity: leftPanelOpacity,
          }}
        >
          {/* Logo + label */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <MicrosoftLogoSVG />
            <span
              style={{
                fontFamily: COLORS.fontBody,
                fontSize: 16,
                fontWeight: 500,
                color: COLORS.muted,
              }}
            >
              Microsoft 365
            </span>
          </div>

          {/* Headline */}
          <div>
            <div
              style={{
                fontFamily: COLORS.fontDisplay,
                fontSize: 50,
                fontWeight: 900,
                color: COLORS.white,
                lineHeight: 1.05,
                letterSpacing: '-0.02em',
              }}
            >
              Seguridad Total
            </div>
            <div
              style={{
                fontFamily: COLORS.fontDisplay,
                fontSize: 50,
                fontWeight: 900,
                color: COLORS.microsoftBlue,
                lineHeight: 1.05,
                letterSpacing: '-0.02em',
              }}
            >
              en la Nube
            </div>
          </div>

          {/* Shield */}
          <div style={{ display: 'flex', justifyContent: 'flex-start', marginLeft: 8 }}>
            <ShieldSVG progress={shieldProgress} glowScale={glowScale} />
          </div>

          {/* Stat blocks */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <GlassCard accentColor={COLORS.microsoftBlue} accentPosition="left" padding={16}>
              <AnimatedCounter
                from={0}
                to={99.9}
                decimals={1}
                suffix="%"
                startFrame={20}
                style={{
                  fontFamily: COLORS.fontDisplay,
                  fontSize: 30,
                  fontWeight: 800,
                  color: COLORS.microsoftBlue,
                  display: 'block',
                }}
              />
              <div
                style={{
                  fontFamily: COLORS.fontBody,
                  fontSize: 12,
                  color: COLORS.muted,
                  marginTop: 4,
                }}
              >
                SLA disponibilidad
              </div>
            </GlassCard>

            <GlassCard accentColor={COLORS.microsoftGreen} accentPosition="left" padding={16}>
              <AnimatedCounter
                from={0}
                to={50000}
                suffix="+"
                startFrame={30}
                style={{
                  fontFamily: COLORS.fontDisplay,
                  fontSize: 30,
                  fontWeight: 800,
                  color: COLORS.microsoftGreen,
                  display: 'block',
                }}
              />
              <div
                style={{
                  fontFamily: COLORS.fontBody,
                  fontSize: 12,
                  color: COLORS.muted,
                  marginTop: 4,
                }}
              >
                usuarios gestionados
              </div>
            </GlassCard>
          </div>
        </div>

        {/* Right Panel - 55% */}
        <div
          style={{
            flex: 1,
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gridTemplateRows: '1fr 1fr',
            gap: 16,
            height: 420,
          }}
        >
          {features.map((feature, i) => (
            <FeatureCard
              key={i}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              accentColor={feature.accentColor}
              delay={feature.delay}
              frame={frame}
              fps={fps}
            />
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};
