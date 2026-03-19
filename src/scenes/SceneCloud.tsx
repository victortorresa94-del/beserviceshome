import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from 'remotion';
import { GlassCard } from '../components/GlassCard';
import { NodeNetwork } from '../components/NodeNetwork';

const COLORS = {
  background: '#080D18',
  darkNavy: '#0A0F1A',
  white: '#FFFFFF',
  softWhite: 'rgba(255,255,255,0.92)',
  muted: 'rgba(255,255,255,0.55)',
  subtle: 'rgba(255,255,255,0.28)',
  cyan: '#00D4FF',
  googleBlue: '#4285F4',
  googleRed: '#EA4335',
  googleYellow: '#FBBC04',
  googleGreen: '#34A853',
  microsoftBlue: '#0078D4',
  fontDisplay: "'Montserrat', 'Arial Black', Arial, sans-serif",
  fontBody: "'Inter', Arial, sans-serif",
};

const GoogleLogoSVG: React.FC = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <path
      d="M30.5 16.3c0-1.1-.1-2.1-.3-3.1H16v5.9h8.1c-.4 1.9-1.5 3.5-3.1 4.6v3.8h5c2.9-2.7 4.5-6.6 4.5-11.2z"
      fill="#4285F4"
    />
    <path
      d="M16 31c4.1 0 7.5-1.3 10-3.6l-5-3.8c-1.4.9-3.1 1.5-5 1.5-3.8 0-7.1-2.6-8.2-6.1H2.6v3.9C5.1 27.9 10.2 31 16 31z"
      fill="#34A853"
    />
    <path
      d="M7.8 19c-.3-.9-.5-1.9-.5-2.9s.2-2 .5-2.9V9.3H2.6C1.5 11.5 1 13.7 1 16s.5 4.5 1.6 6.7L7.8 19z"
      fill="#FBBC04"
    />
    <path
      d="M16 6.9c2.1 0 4 .7 5.5 2.1l4.1-4.1C23.4 2.7 20 1 16 1 10.2 1 5.1 4.1 2.6 9.3l5.2 3.8c1.1-3.5 4.4-6.2 8.2-6.2z"
      fill="#EA4335"
    />
  </svg>
);

const AzureLogoSVG: React.FC = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <path d="M13.5 2L2 28h8.5l3-7.5L22 28h8L18.5 2z" fill="#0078D4" />
    <path d="M18 2l-8 10 4.5 11.5L22 28h8L18 2z" fill="#0050A0" opacity="0.7" />
  </svg>
);

interface ServicePillProps {
  label: string;
  index: number;
  frame: number;
  fps: number;
  startDelay: number;
  accentColor: string;
}

const ServicePill: React.FC<ServicePillProps> = ({
  label,
  index,
  frame,
  fps,
  startDelay,
  accentColor,
}) => {
  const pillSpring = spring({
    frame: Math.max(0, frame - startDelay - index * 5),
    fps,
    config: { damping: 22, stiffness: 160, mass: 0.8 },
    durationInFrames: 30,
  });

  const opacity = interpolate(pillSpring, [0, 1], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const scale = interpolate(pillSpring, [0, 1], [0.7, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        opacity,
        transform: `scale(${scale})`,
        display: 'inline-flex',
        alignItems: 'center',
        padding: '5px 12px',
        borderRadius: 20,
        background: `${accentColor}18`,
        border: `1px solid ${accentColor}40`,
        fontFamily: COLORS.fontBody,
        fontSize: 11,
        fontWeight: 500,
        color: COLORS.softWhite,
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </div>
  );
};

export const SceneCloud: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Header animations
  const headerSpring = spring({
    frame,
    fps,
    config: { damping: 20, stiffness: 120, mass: 1 },
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

  // Underline sweep
  const underlineWidth = interpolate(frame, [20, 60], [0, 60], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Left card slide in
  const leftCardSpring = spring({
    frame: Math.max(0, frame - 15),
    fps,
    config: { damping: 22, stiffness: 130, mass: 1 },
    durationInFrames: 50,
  });

  const leftCardX = interpolate(leftCardSpring, [0, 1], [-60, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const leftCardOpacity = interpolate(leftCardSpring, [0, 1], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Right card slide in
  const rightCardSpring = spring({
    frame: Math.max(0, frame - 20),
    fps,
    config: { damping: 22, stiffness: 130, mass: 1 },
    durationInFrames: 50,
  });

  const rightCardX = interpolate(rightCardSpring, [0, 1], [60, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const rightCardOpacity = interpolate(rightCardSpring, [0, 1], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const googleServices = [
    'Compute Engine',
    'Cloud Storage',
    'BigQuery',
    'Kubernetes',
    'Google Workspace',
    'Cloud SQL',
    'Looker Studio',
    'Cloud Run',
  ];

  const azureServices = [
    'Azure AD',
    'Azure DevOps',
    'Business Central',
    'Dynamics 365',
    'Power Platform',
    'Teams + SharePoint',
    'Azure Functions',
    'Intune',
  ];

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg, #080D18 0%, #0A0F20 50%, #080D18 100%)`,
        overflow: 'hidden',
        fontFamily: COLORS.fontBody,
      }}
    >
      {/* NodeNetwork background */}
      <div style={{ position: 'absolute', inset: 0, opacity: 0.3, pointerEvents: 'none' }}>
        <NodeNetwork frame={frame} width={width} height={height} color={COLORS.cyan} animated />
      </div>

      {/* Header */}
      <div
        style={{
          position: 'absolute',
          top: 52,
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
          SERVICIOS CLOUD
        </span>
        <div
          style={{
            fontFamily: COLORS.fontDisplay,
            fontSize: 42,
            fontWeight: 900,
            color: COLORS.white,
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
            textAlign: 'center',
          }}
        >
          Tu infraestructura,
          <br />
          <span style={{ color: COLORS.cyan }}>nuestra responsabilidad</span>
        </div>

        {/* Underline sweep */}
        <div
          style={{
            height: 2,
            width: `${underlineWidth}%`,
            background: `linear-gradient(90deg, transparent, ${COLORS.cyan}, transparent)`,
            borderRadius: 2,
            marginTop: 4,
          }}
        />
      </div>

      {/* Cards container */}
      <div
        style={{
          position: 'absolute',
          bottom: 40,
          left: 48,
          right: 48,
          top: 240,
          display: 'flex',
          gap: 24,
        }}
      >
        {/* Left Card - Google Cloud */}
        <div
          style={{
            flex: 1,
            transform: `translateX(${leftCardX}px)`,
            opacity: leftCardOpacity,
          }}
        >
          <GlassCard
            accentColor={COLORS.googleBlue}
            accentPosition="top"
            glowColor="rgba(66,133,244,0.08)"
            padding={28}
            style={{ height: '100%', boxSizing: 'border-box', position: 'relative', overflow: 'hidden' }}
          >
            {/* Glow orb top-left */}
            <div
              style={{
                position: 'absolute',
                top: -40,
                left: -40,
                width: 160,
                height: 160,
                borderRadius: '50%',
                background: `radial-gradient(circle, rgba(66,133,244,0.2) 0%, transparent 70%)`,
                pointerEvents: 'none',
              }}
            />

            {/* Logo + title row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <GoogleLogoSVG />
              <div>
                <div
                  style={{
                    fontFamily: COLORS.fontBody,
                    fontSize: 12,
                    color: COLORS.muted,
                    marginBottom: 2,
                  }}
                >
                  Google Cloud
                </div>
                <div
                  style={{
                    fontFamily: COLORS.fontDisplay,
                    fontSize: 18,
                    fontWeight: 800,
                    color: COLORS.white,
                  }}
                >
                  Premier Partner
                </div>
              </div>
              {/* Badge */}
              <div
                style={{
                  marginLeft: 'auto',
                  padding: '4px 10px',
                  borderRadius: 20,
                  background: `${COLORS.googleGreen}25`,
                  border: `1px solid ${COLORS.googleGreen}50`,
                  fontFamily: COLORS.fontBody,
                  fontSize: 10,
                  fontWeight: 700,
                  color: COLORS.googleGreen,
                  letterSpacing: '0.1em',
                }}
              >
                PREMIER PARTNER
              </div>
            </div>

            <div
              style={{
                fontFamily: COLORS.fontBody,
                fontSize: 13,
                color: COLORS.muted,
                lineHeight: 1.6,
                marginBottom: 20,
              }}
            >
              Soluciones cloud de primera clase con la potencia y escalabilidad de Google Cloud Platform.
            </div>

            {/* Service pills */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {googleServices.map((service, i) => (
                <ServicePill
                  key={service}
                  label={service}
                  index={i}
                  frame={frame}
                  fps={fps}
                  startDelay={40}
                  accentColor={COLORS.googleBlue}
                />
              ))}
            </div>
          </GlassCard>
        </div>

        {/* Right Card - Microsoft Azure */}
        <div
          style={{
            flex: 1,
            transform: `translateX(${rightCardX}px)`,
            opacity: rightCardOpacity,
          }}
        >
          <GlassCard
            accentColor={COLORS.microsoftBlue}
            accentPosition="top"
            glowColor="rgba(0,120,212,0.08)"
            padding={28}
            style={{ height: '100%', boxSizing: 'border-box', position: 'relative', overflow: 'hidden' }}
          >
            {/* Glow orb top-right */}
            <div
              style={{
                position: 'absolute',
                top: -40,
                right: -40,
                width: 160,
                height: 160,
                borderRadius: '50%',
                background: `radial-gradient(circle, rgba(0,120,212,0.2) 0%, transparent 70%)`,
                pointerEvents: 'none',
              }}
            />

            {/* Logo + title row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <AzureLogoSVG />
              <div>
                <div
                  style={{
                    fontFamily: COLORS.fontBody,
                    fontSize: 12,
                    color: COLORS.muted,
                    marginBottom: 2,
                  }}
                >
                  Microsoft Azure
                </div>
                <div
                  style={{
                    fontFamily: COLORS.fontDisplay,
                    fontSize: 18,
                    fontWeight: 800,
                    color: COLORS.white,
                  }}
                >
                  Azure Specialist
                </div>
              </div>
              {/* Badge */}
              <div
                style={{
                  marginLeft: 'auto',
                  padding: '4px 10px',
                  borderRadius: 20,
                  background: `${COLORS.microsoftBlue}25`,
                  border: `1px solid ${COLORS.microsoftBlue}50`,
                  fontFamily: COLORS.fontBody,
                  fontSize: 10,
                  fontWeight: 700,
                  color: COLORS.microsoftBlue,
                  letterSpacing: '0.1em',
                }}
              >
                AZURE SPECIALIST
              </div>
            </div>

            <div
              style={{
                fontFamily: COLORS.fontBody,
                fontSize: 13,
                color: COLORS.muted,
                lineHeight: 1.6,
                marginBottom: 20,
              }}
            >
              Ecosistema Microsoft completo: infraestructura, productividad y seguridad empresarial integradas.
            </div>

            {/* Service pills */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {azureServices.map((service, i) => (
                <ServicePill
                  key={service}
                  label={service}
                  index={i}
                  frame={frame}
                  fps={fps}
                  startDelay={45}
                  accentColor={COLORS.microsoftBlue}
                />
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </AbsoluteFill>
  );
};
