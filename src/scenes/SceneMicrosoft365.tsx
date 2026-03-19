import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
  Sequence,
} from "remotion";
import { COLORS } from "../colors";

type FeatureCardProps = {
  icon: string;
  title: string;
  desc: string;
  color: string;
  frame: number;
  fps: number;
  delay: number;
};

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, desc, color, frame, fps, delay }) => {
  const s = spring({ frame: frame - delay, fps, config: { damping: 200 } });
  const opacity = interpolate(s, [0, 1], [0, 1]);
  const y = interpolate(s, [0, 1], [40, 0]);

  return (
    <div
      style={{
        opacity,
        transform: `translateY(${y}px)`,
        background: "rgba(255,255,255,0.04)",
        border: `1px solid rgba(255,255,255,0.1)`,
        borderRadius: 16,
        padding: "28px 24px",
        flex: 1,
        borderTop: `3px solid ${color}`,
      }}
    >
      <div style={{ fontSize: 36, marginBottom: 12 }}>{icon}</div>
      <div
        style={{
          fontSize: 18,
          fontWeight: 700,
          color: COLORS.white,
          fontFamily: "Arial, sans-serif",
          marginBottom: 8,
        }}
      >
        {title}
      </div>
      <div
        style={{
          fontSize: 14,
          color: COLORS.gray,
          fontFamily: "Arial, sans-serif",
          lineHeight: 1.5,
        }}
      >
        {desc}
      </div>
    </div>
  );
};

const ShieldIcon: React.FC<{ progress: number }> = ({ progress }) => {
  const dashOffset = interpolate(progress, [0, 1], [200, 0]);
  return (
    <svg width="140" height="140" viewBox="0 0 100 100">
      <defs>
        <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={COLORS.microsoftBlue} />
          <stop offset="100%" stopColor={COLORS.cyan} />
        </linearGradient>
      </defs>
      <path
        d="M50 8 L85 22 L85 50 C85 68 68 82 50 90 C32 82 15 68 15 50 L15 22 Z"
        fill="url(#shieldGrad)"
        fillOpacity="0.15"
        stroke="url(#shieldGrad)"
        strokeWidth="2"
        strokeDasharray="200"
        strokeDashoffset={dashOffset}
      />
      <path
        d="M35 50 L45 62 L65 40"
        fill="none"
        stroke={COLORS.cyan}
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="60"
        strokeDashoffset={interpolate(progress, [0.3, 1], [60, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })}
      />
    </svg>
  );
};

export const SceneMicrosoft365: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Title animation
  const titleSpring = spring({ frame, fps, config: { damping: 200 } });
  const titleOpacity = interpolate(titleSpring, [0, 1], [0, 1]);
  const titleY = interpolate(titleSpring, [0, 1], [-40, 0]);

  // Shield progress
  const shieldProgress = interpolate(frame, [10, 60], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });

  // Glow pulse
  const glowScale = interpolate(
    Math.sin((frame / fps) * Math.PI * 2),
    [-1, 1],
    [0.95, 1.05]
  );

  const features = [
    {
      icon: "🔐",
      title: "Azure AD Premium",
      desc: "Identidad segura con MFA, SSO y acceso condicional para toda tu organización",
      color: COLORS.microsoftBlue,
      delay: 40,
    },
    {
      icon: "🛡️",
      title: "Microsoft Defender",
      desc: "Protección avanzada contra amenazas, ransomware y ataques de día cero",
      color: "#7FBA00",
      delay: 55,
    },
    {
      icon: "📧",
      title: "Exchange + Purview",
      desc: "Email seguro con DLP, cifrado de mensajes y compliance integrado",
      color: COLORS.microsoftPurple,
      delay: 70,
    },
    {
      icon: "☁️",
      title: "Intune MDM/MAM",
      desc: "Gestión de dispositivos móviles y aplicaciones desde la nube",
      color: COLORS.cyan,
      delay: 85,
    },
  ];

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg, ${COLORS.darkNavy} 0%, #0D1F3C 60%, #0A1628 100%)`,
      }}
    >
      {/* Left glow */}
      <div
        style={{
          position: "absolute",
          left: "-10%",
          top: "50%",
          transform: "translateY(-50%)",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${COLORS.microsoftBlue}33 0%, transparent 70%)`,
          filter: "blur(60px)",
        }}
      />

      {/* Section tag */}
      <div
        style={{
          position: "absolute",
          top: 50,
          left: 80,
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <div style={{ width: 4, height: 30, background: COLORS.microsoftBlue, borderRadius: 2 }} />
        <span
          style={{
            fontSize: 13,
            letterSpacing: 4,
            color: COLORS.microsoftBlue,
            fontFamily: "Arial, sans-serif",
            textTransform: "uppercase",
            fontWeight: 600,
          }}
        >
          Seguridad Empresarial
        </span>
      </div>

      {/* Left panel: shield + title */}
      <div
        style={{
          position: "absolute",
          left: 80,
          top: "50%",
          transform: "translateY(-50%)",
          width: 420,
        }}
      >
        {/* Microsoft 365 logo area */}
        <div
          style={{
            opacity: titleOpacity,
            transform: `translateY(${titleY}px)`,
            marginBottom: 30,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
            <svg width="48" height="48" viewBox="0 0 21 21">
              <rect x="0" y="0" width="10" height="10" fill="#F25022" />
              <rect x="11" y="0" width="10" height="10" fill="#7FBA00" />
              <rect x="0" y="11" width="10" height="10" fill="#00A4EF" />
              <rect x="11" y="11" width="10" height="10" fill="#FFB900" />
            </svg>
            <span
              style={{
                fontSize: 20,
                color: COLORS.gray,
                fontFamily: "Arial, sans-serif",
                letterSpacing: 2,
                textTransform: "uppercase",
              }}
            >
              Microsoft 365
            </span>
          </div>

          <h2
            style={{
              fontSize: 52,
              fontWeight: 900,
              color: COLORS.white,
              fontFamily: "'Arial Black', Arial, sans-serif",
              lineHeight: 1.1,
              margin: 0,
            }}
          >
            Seguridad
            <br />
            <span style={{ color: COLORS.microsoftBlue }}>Total</span>
            <br />
            en la Nube
          </h2>
        </div>

        {/* Shield animated */}
        <div
          style={{
            transform: `scale(${glowScale})`,
            display: "inline-block",
          }}
        >
          <ShieldIcon progress={shieldProgress} />
        </div>

        {/* Stat */}
        <Sequence from={70}>
          <div
            style={{
              marginTop: 20,
              padding: "16px 24px",
              background: "rgba(0,120,212,0.1)",
              border: `1px solid ${COLORS.microsoftBlue}44`,
              borderRadius: 12,
              display: "inline-flex",
              gap: 16,
              alignItems: "center",
            }}
          >
            <span style={{ fontSize: 36, fontWeight: 900, color: COLORS.microsoftBlue, fontFamily: "Arial, sans-serif" }}>
              99.9%
            </span>
            <span style={{ fontSize: 14, color: COLORS.offWhite, fontFamily: "Arial, sans-serif", lineHeight: 1.4 }}>
              SLA de<br />disponibilidad
            </span>
          </div>
        </Sequence>
      </div>

      {/* Right panel: feature cards */}
      <div
        style={{
          position: "absolute",
          right: 80,
          top: "50%",
          transform: "translateY(-50%)",
          width: 900,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 16,
        }}
      >
        {features.map((f) => (
          <FeatureCard key={f.title} {...f} frame={frame} fps={fps} />
        ))}
      </div>
    </AbsoluteFill>
  );
};
