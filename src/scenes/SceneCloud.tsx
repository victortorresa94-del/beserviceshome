import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from "remotion";
import { COLORS } from "../colors";

type ServicePillProps = {
  label: string;
  frame: number;
  fps: number;
  delay: number;
  color: string;
};

const ServicePill: React.FC<ServicePillProps> = ({ label, frame, fps, delay, color }) => {
  const s = spring({ frame: frame - delay, fps, config: { damping: 200 } });
  const opacity = interpolate(s, [0, 1], [0, 1]);
  const x = interpolate(s, [0, 1], [30, 0]);
  return (
    <div
      style={{
        opacity,
        transform: `translateX(${x}px)`,
        background: `${color}18`,
        border: `1px solid ${color}55`,
        borderRadius: 40,
        padding: "8px 20px",
        fontSize: 14,
        color: COLORS.offWhite,
        fontFamily: "Arial, sans-serif",
        display: "inline-block",
      }}
    >
      {label}
    </div>
  );
};

type CloudPanelProps = {
  title: string;
  subtitle: string;
  badge: string;
  badgeColor: string;
  logo: React.ReactNode;
  services: string[];
  serviceColor: string;
  frame: number;
  fps: number;
  side: "left" | "right";
  glowColor: string;
};

const CloudPanel: React.FC<CloudPanelProps> = ({
  title, subtitle, badge, badgeColor, logo, services, serviceColor,
  frame, fps, side, glowColor,
}) => {
  const delay = side === "left" ? 0 : 20;
  const s = spring({ frame: frame - delay, fps, config: { damping: 200 } });
  const opacity = interpolate(s, [0, 1], [0, 1]);
  const x = interpolate(s, [0, 1], [side === "left" ? -60 : 60, 0]);

  return (
    <div
      style={{
        opacity,
        transform: `translateX(${x}px)`,
        background: "rgba(255,255,255,0.03)",
        border: `1px solid rgba(255,255,255,0.08)`,
        borderRadius: 24,
        padding: "50px 48px",
        flex: 1,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Glow */}
      <div
        style={{
          position: "absolute",
          top: -100,
          [side]: -100,
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${glowColor}22 0%, transparent 70%)`,
          filter: "blur(40px)",
        }}
      />

      {/* Badge */}
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          background: `${badgeColor}22`,
          border: `1px solid ${badgeColor}55`,
          borderRadius: 40,
          padding: "6px 16px",
          marginBottom: 32,
        }}
      >
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: badgeColor }} />
        <span style={{ fontSize: 12, color: badgeColor, fontFamily: "Arial, sans-serif", fontWeight: 600, letterSpacing: 1, textTransform: "uppercase" }}>
          {badge}
        </span>
      </div>

      {/* Logo */}
      <div style={{ marginBottom: 24 }}>{logo}</div>

      {/* Title */}
      <h3
        style={{
          fontSize: 36,
          fontWeight: 900,
          color: COLORS.white,
          fontFamily: "'Arial Black', Arial, sans-serif",
          margin: "0 0 8px 0",
          lineHeight: 1.1,
        }}
      >
        {title}
      </h3>
      <p
        style={{
          fontSize: 16,
          color: COLORS.gray,
          fontFamily: "Arial, sans-serif",
          margin: "0 0 32px 0",
          lineHeight: 1.5,
        }}
      >
        {subtitle}
      </p>

      {/* Services */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
        {services.map((s, i) => (
          <ServicePill
            key={s}
            label={s}
            frame={frame}
            fps={fps}
            delay={40 + i * 8 + (side === "right" ? 20 : 0)}
            color={serviceColor}
          />
        ))}
      </div>
    </div>
  );
};

const GoogleLogo: React.FC = () => (
  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
    <svg width="32" height="32" viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
    <span style={{ fontSize: 20, fontWeight: 700, fontFamily: "Arial, sans-serif" }}>
      <span style={{ color: COLORS.googleBlue }}>G</span>
      <span style={{ color: COLORS.googleRed }}>o</span>
      <span style={{ color: COLORS.googleYellow }}>o</span>
      <span style={{ color: COLORS.googleBlue }}>g</span>
      <span style={{ color: COLORS.googleGreen }}>l</span>
      <span style={{ color: COLORS.googleRed }}>e</span>
      <span style={{ color: COLORS.white }}> Cloud</span>
    </span>
  </div>
);

const AzureLogo: React.FC = () => (
  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
    <svg width="32" height="32" viewBox="0 0 96 96">
      <defs>
        <linearGradient id="az1" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#114A8B"/>
          <stop offset="100%" stopColor="#0669BC"/>
        </linearGradient>
        <linearGradient id="az2" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#3CCBF4"/>
          <stop offset="100%" stopColor="#2892DF"/>
        </linearGradient>
      </defs>
      <path d="M33.34 6.27H58.5L33.8 90.43a4 4 0 01-3.8 2.73H8a4 4 0 01-3.78-5.28L29.54 9.01a4 4 0 013.8-2.74z" fill="url(#az1)"/>
      <path d="M63.34 57.74H34.1l-8.16 22.94A4 4 0 0129.7 85l50.16.43a4 4 0 013.24 6.37z" fill="url(#az2)"/>
      <path d="M33.34 6.27a3.95 3.95 0 00-3.81 2.78L4.25 87.88A4 4 0 008 93.16h22.3a4.28 4.28 0 003.29-2.78l5.33-15.71 19.1 17.6a4.12 4.12 0 002.61.95H83l-9.41-26.81-27.3.06L63.5 6.27z" fill="#0078D4" fillOpacity="0.9"/>
    </svg>
    <span style={{ fontSize: 20, fontWeight: 700, fontFamily: "Arial, sans-serif", color: COLORS.white }}>
      Microsoft Azure
    </span>
  </div>
);

export const SceneCloud: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleS = spring({ frame, fps, config: { damping: 200 } });
  const titleOpacity = interpolate(titleS, [0, 1], [0, 1]);
  const titleY = interpolate(titleS, [0, 1], [-30, 0]);

  const lineWidth = interpolate(frame, [5, 40], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(150deg, #06111F 0%, ${COLORS.darkNavy} 50%, #0A1A30 100%)`,
      }}
    >
      {/* Top header */}
      <div
        style={{
          position: "absolute",
          top: 50,
          left: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
        }}
      >
        <span
          style={{
            fontSize: 13,
            letterSpacing: 5,
            color: COLORS.cyan,
            fontFamily: "Arial, sans-serif",
            textTransform: "uppercase",
            fontWeight: 600,
            marginBottom: 8,
          }}
        >
          Servicios Cloud
        </span>
        <h2
          style={{
            fontSize: 52,
            fontWeight: 900,
            color: COLORS.white,
            fontFamily: "'Arial Black', Arial, sans-serif",
            margin: 0,
          }}
        >
          Tu infraestructura en la <span style={{ color: COLORS.cyan }}>nube</span>
        </h2>
        {/* Underline */}
        <div
          style={{
            width: lineWidth + "%",
            height: 2,
            background: `linear-gradient(90deg, transparent, ${COLORS.cyan}, transparent)`,
            marginTop: 12,
          }}
        />
      </div>

      {/* Two panels */}
      <div
        style={{
          position: "absolute",
          left: 80,
          right: 80,
          top: 200,
          bottom: 60,
          display: "flex",
          gap: 24,
        }}
      >
        <CloudPanel
          title="Premier Partner"
          subtitle="La máxima certificación de Google Cloud. Infraestructura, datos y productividad con Google Workspace."
          badge="Google Cloud"
          badgeColor={COLORS.googleBlue}
          logo={<GoogleLogo />}
          services={[
            "Compute Engine",
            "Cloud Storage",
            "BigQuery",
            "Kubernetes",
            "Google Workspace",
            "Cloud SQL",
            "Looker Studio",
          ]}
          serviceColor={COLORS.googleBlue}
          frame={frame}
          fps={fps}
          side="left"
          glowColor={COLORS.googleBlue}
        />

        {/* Center divider */}
        <div
          style={{
            width: 1,
            background: "rgba(255,255,255,0.08)",
            alignSelf: "stretch",
          }}
        />

        <CloudPanel
          title="Azure Specialist"
          subtitle="Soluciones Microsoft Azure para empresas. Active Directory, Business Central e integración completa."
          badge="Microsoft Azure"
          badgeColor={COLORS.microsoftBlue}
          logo={<AzureLogo />}
          services={[
            "Azure AD",
            "Azure DevOps",
            "Business Central",
            "Dynamics 365",
            "Azure Functions",
            "Power Platform",
            "Teams + SharePoint",
          ]}
          serviceColor={COLORS.microsoftBlue}
          frame={frame}
          fps={fps}
          side="right"
          glowColor={COLORS.microsoftBlue}
        />
      </div>
    </AbsoluteFill>
  );
};
