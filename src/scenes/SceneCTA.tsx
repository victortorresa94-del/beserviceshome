import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from 'remotion';
import { GlassCard } from '../components/GlassCard';

const COLORS = {
  background: '#080D18',
  white: '#FFFFFF',
  softWhite: 'rgba(255,255,255,0.92)',
  muted: 'rgba(255,255,255,0.55)',
  subtle: 'rgba(255,255,255,0.28)',
  cyan: '#00D4FF',
  cyanGlowStrong: 'rgba(0,212,255,0.3)',
  violet: '#7B2FFF',
  googleGreen: '#34A853',
  googleBlue: '#4285F4',
  microsoftBlue: '#0078D4',
  fontDisplay: "'Montserrat', 'Arial Black', Arial, sans-serif",
  fontBody: "'Inter', Arial, sans-serif",
};

const HexagonLogo: React.FC<{ scale: number; opacity: number }> = ({ scale, opacity }) => (
  <div
    style={{
      transform: `scale(${scale})`,
      opacity,
      transformOrigin: 'left center',
    }}
  >
    <svg width="64" height="72" viewBox="0 0 64 72" fill="none">
      <path
        d="M32 2 L60 18 L60 54 L32 70 L4 54 L4 18 Z"
        stroke="url(#hexGrad)"
        strokeWidth="2.5"
        fill="rgba(0,212,255,0.06)"
      />
      <path
        d="M32 16 L48 26 L48 46 L32 56 L16 46 L16 26 Z"
        fill="url(#hexGradFill)"
        opacity="0.6"
      />
      <text
        x="32"
        y="38"
        textAnchor="middle"
        dominantBaseline="middle"
        fill="white"
        fontSize="14"
        fontWeight="900"
        fontFamily="Montserrat, Arial, sans-serif"
      >
        BE
      </text>
      <defs>
        <linearGradient id="hexGrad" x1="0" y1="0" x2="64" y2="72" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={COLORS.cyan} />
          <stop offset="100%" stopColor={COLORS.violet} />
        </linearGradient>
        <linearGradient id="hexGradFill" x1="0" y1="0" x2="64" y2="72" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={COLORS.cyan} stopOpacity="0.3" />
          <stop offset="100%" stopColor={COLORS.violet} stopOpacity="0.3" />
        </linearGradient>
      </defs>
    </svg>
  </div>
);

interface ContactCardProps {
  icon: string;
  label: string;
  value: string;
  accentColor: string;
  delay: number;
  frame: number;
  fps: number;
}

const ContactCard: React.FC<ContactCardProps> = ({
  icon,
  label,
  value,
  accentColor,
  delay,
  frame,
  fps,
}) => {
  const s = spring({
    frame: Math.max(0, frame - delay),
    fps,
    config: { damping: 22, stiffness: 130, mass: 0.9 },
    durationInFrames: 35,
  });

  const translateX = interpolate(s, [0, 1], [30, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const opacity = interpolate(s, [0, 1], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div style={{ transform: `translateX(${translateX}px)`, opacity }}>
      <GlassCard accentColor={accentColor} accentPosition="left" padding={14}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 20 }}>{icon}</span>
          <div>
            <div
              style={{
                fontFamily: COLORS.fontBody,
                fontSize: 10,
                color: COLORS.subtle,
                marginBottom: 2,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
              }}
            >
              {label}
            </div>
            <div
              style={{
                fontFamily: COLORS.fontBody,
                fontSize: 14,
                fontWeight: 600,
                color: COLORS.softWhite,
              }}
            >
              {value}
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};

export const SceneCTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Central glow breathing
  const glowOpacity = interpolate(
    Math.sin(frame * 0.04),
    [-1, 1],
    [0.1, 0.35],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Top line sweep
  const topLineWidth = interpolate(frame, [5, 40], [0, 100], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Bottom line sweep
  const bottomLineWidth = interpolate(frame, [20, 55], [0, 100], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Left panel slide in
  const leftPanelSpring = spring({
    frame,
    fps,
    config: { damping: 20, stiffness: 110, mass: 1 },
    durationInFrames: 50,
  });

  const leftPanelX = interpolate(leftPanelSpring, [0, 1], [-40, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const leftPanelOpacity = interpolate(leftPanelSpring, [0, 1], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Logo scale spring
  const logoSpring = spring({
    frame: Math.max(0, frame - 10),
    fps,
    config: { damping: 14, stiffness: 180, mass: 0.8 },
    durationInFrames: 40,
  });

  const logoScale = interpolate(logoSpring, [0, 1], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const logoOpacity = interpolate(logoSpring, [0, 1], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // CTA button spring - bouncy
  const ctaSpring = spring({
    frame: Math.max(0, frame - 50),
    fps,
    config: { damping: 15, stiffness: 200, mass: 0.9 },
    durationInFrames: 45,
  });

  const ctaScale = interpolate(ctaSpring, [0, 1], [0.5, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const ctaOpacity = interpolate(ctaSpring, [0, 1], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Button glow pulse
  const buttonGlowOpacity = Math.sin(frame * 0.08) * 0.5 + 0.5;

  const contactCards = [
    { icon: '🌐', label: 'Web', value: 'www.beservices.es', accentColor: COLORS.cyan, delay: 40 },
    { icon: '📧', label: 'Email', value: 'info@beservices.es', accentColor: COLORS.violet, delay: 52 },
    { icon: '📍', label: 'Location', value: 'España · Madrid', accentColor: COLORS.googleGreen, delay: 64 },
  ];

  return (
    <AbsoluteFill
      style={{
        background: COLORS.background,
        overflow: 'hidden',
        fontFamily: COLORS.fontBody,
      }}
    >
      {/* Big central radial glow - cyan + violet breathing */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          width: 900,
          height: 900,
          borderRadius: '50%',
          background: `radial-gradient(circle, rgba(0,212,255,${glowOpacity}) 0%, rgba(123,47,255,${glowOpacity * 0.6}) 40%, transparent 70%)`,
          pointerEvents: 'none',
        }}
      />

      {/* Top horizontal line sweep */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: `${topLineWidth}%`,
          height: 2,
          background: `linear-gradient(90deg, transparent, ${COLORS.cyan}, ${COLORS.violet}, transparent)`,
        }}
      />

      {/* Bottom horizontal line sweep */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          width: `${bottomLineWidth}%`,
          height: 2,
          background: `linear-gradient(270deg, transparent, ${COLORS.cyan}, ${COLORS.violet}, transparent)`,
        }}
      />

      {/* Main content */}
      <div
        style={{
          position: 'absolute',
          inset: '12px 48px',
          display: 'flex',
          alignItems: 'center',
          gap: 48,
        }}
      >
        {/* Left Panel - 55% */}
        <div
          style={{
            width: '55%',
            flexShrink: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: 20,
            transform: `translateX(${leftPanelX}px)`,
            opacity: leftPanelOpacity,
          }}
        >
          {/* Logo + domain */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <HexagonLogo scale={logoScale} opacity={logoOpacity} />
            <div>
              <div
                style={{
                  fontFamily: COLORS.fontBody,
                  fontSize: 12,
                  color: COLORS.muted,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                }}
              >
                beservices.es
              </div>
            </div>
          </div>

          {/* Headline */}
          <div
            style={{
              fontFamily: COLORS.fontDisplay,
              fontSize: 52,
              fontWeight: 900,
              lineHeight: 1.05,
              letterSpacing: '-0.025em',
            }}
          >
            <span style={{ color: COLORS.white }}>¿Listo para </span>
            <span
              style={{
                background: `linear-gradient(90deg, ${COLORS.cyan}, ${COLORS.violet})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              transformar
            </span>
            <br />
            <span style={{ color: COLORS.white }}>tu empresa?</span>
          </div>

          {/* Body text */}
          <div
            style={{
              fontFamily: COLORS.fontBody,
              fontSize: 15,
              color: COLORS.muted,
              lineHeight: 1.65,
              maxWidth: 480,
            }}
          >
            Somos tu partner tecnológico de confianza. Google Premier Partner y especialistas
            Microsoft con más de 10 años transformando empresas en España.
          </div>

          {/* CTA Button */}
          <div
            style={{
              transform: `scale(${ctaScale})`,
              opacity: ctaOpacity,
              transformOrigin: 'left center',
              display: 'inline-flex',
            }}
          >
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '18px 36px',
                borderRadius: 50,
                background: `linear-gradient(90deg, ${COLORS.cyan}, ${COLORS.violet})`,
                fontFamily: COLORS.fontDisplay,
                fontSize: 16,
                fontWeight: 700,
                color: COLORS.white,
                cursor: 'pointer',
                boxShadow: `0 0 ${20 + buttonGlowOpacity * 20}px ${COLORS.cyanGlowStrong}, 0 8px 32px rgba(123,47,255,0.4)`,
                letterSpacing: '0.01em',
              }}
            >
              Solicita tu consultoría gratuita →
            </div>
          </div>
        </div>

        {/* Right Panel - 40% */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: 20,
          }}
        >
          {/* Contact label */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              opacity: interpolate(frame, [15, 30], [0, 1], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              }),
            }}
          >
            <div style={{ width: 3, height: 18, background: COLORS.cyan, borderRadius: 2 }} />
            <span
              style={{
                fontFamily: COLORS.fontBody,
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: '0.22em',
                color: COLORS.muted,
                textTransform: 'uppercase',
              }}
            >
              CONTACTA CON NOSOTROS
            </span>
          </div>

          {/* Contact cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {contactCards.map((card, i) => (
              <ContactCard
                key={i}
                icon={card.icon}
                label={card.label}
                value={card.value}
                accentColor={card.accentColor}
                delay={card.delay}
                frame={frame}
                fps={fps}
              />
            ))}
          </div>

          {/* Partners label */}
          <div
            style={{
              marginTop: 8,
              opacity: interpolate(frame, [70, 90], [0, 1], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              }),
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                marginBottom: 12,
              }}
            >
              <div style={{ width: 3, height: 18, background: COLORS.violet, borderRadius: 2 }} />
              <span
                style={{
                  fontFamily: COLORS.fontBody,
                  fontSize: 10,
                  fontWeight: 600,
                  letterSpacing: '0.22em',
                  color: COLORS.muted,
                  textTransform: 'uppercase',
                }}
              >
                PARTNERS CERTIFICADOS
              </span>
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              {/* Google Premier badge */}
              <GlassCard accentColor={COLORS.googleBlue} padding={14} style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <svg width="22" height="22" viewBox="0 0 32 32" fill="none">
                    <path d="M30.5 16.3c0-1.1-.1-2.1-.3-3.1H16v5.9h8.1c-.4 1.9-1.5 3.5-3.1 4.6v3.8h5c2.9-2.7 4.5-6.6 4.5-11.2z" fill="#4285F4" />
                    <path d="M16 31c4.1 0 7.5-1.3 10-3.6l-5-3.8c-1.4.9-3.1 1.5-5 1.5-3.8 0-7.1-2.6-8.2-6.1H2.6v3.9C5.1 27.9 10.2 31 16 31z" fill="#34A853" />
                    <path d="M7.8 19c-.3-.9-.5-1.9-.5-2.9s.2-2 .5-2.9V9.3H2.6C1.5 11.5 1 13.7 1 16s.5 4.5 1.6 6.7L7.8 19z" fill="#FBBC04" />
                    <path d="M16 6.9c2.1 0 4 .7 5.5 2.1l4.1-4.1C23.4 2.7 20 1 16 1 10.2 1 5.1 4.1 2.6 9.3l5.2 3.8c1.1-3.5 4.4-6.2 8.2-6.2z" fill="#EA4335" />
                  </svg>
                  <div>
                    <div style={{ fontFamily: COLORS.fontDisplay, fontSize: 11, fontWeight: 700, color: COLORS.white }}>
                      Google Premier
                    </div>
                    <div style={{ fontFamily: COLORS.fontBody, fontSize: 9, color: COLORS.muted }}>Partner</div>
                  </div>
                </div>
              </GlassCard>

              {/* Microsoft badge */}
              <GlassCard accentColor={COLORS.microsoftBlue} padding={14} style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <svg width="22" height="22" viewBox="0 0 36 36" fill="none">
                    <rect x="0" y="0" width="16" height="16" fill="#F25022" />
                    <rect x="20" y="0" width="16" height="16" fill="#7FBA00" />
                    <rect x="0" y="20" width="16" height="16" fill="#00A4EF" />
                    <rect x="20" y="20" width="16" height="16" fill="#FFB900" />
                  </svg>
                  <div>
                    <div style={{ fontFamily: COLORS.fontDisplay, fontSize: 11, fontWeight: 700, color: COLORS.white }}>
                      Microsoft
                    </div>
                    <div style={{ fontFamily: COLORS.fontBody, fontSize: 9, color: COLORS.muted }}>Certified Partner</div>
                  </div>
                </div>
              </GlassCard>
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
