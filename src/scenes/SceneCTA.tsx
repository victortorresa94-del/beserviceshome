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

type ContactItemProps = {
  icon: string;
  label: string;
  value: string;
  frame: number;
  fps: number;
  delay: number;
  color: string;
};

const ContactItem: React.FC<ContactItemProps> = ({ icon, label, value, frame, fps, delay, color }) => {
  const s = spring({ frame: frame - delay, fps, config: { damping: 200 } });
  const opacity = interpolate(s, [0, 1], [0, 1]);
  const y = interpolate(s, [0, 1], [20, 0]);

  return (
    <div
      style={{
        opacity,
        transform: `translateY(${y}px)`,
        display: "flex",
        alignItems: "center",
        gap: 16,
        padding: "16px 24px",
        background: "rgba(255,255,255,0.04)",
        border: `1px solid rgba(255,255,255,0.08)`,
        borderLeft: `3px solid ${color}`,
        borderRadius: 12,
      }}
    >
      <span style={{ fontSize: 24 }}>{icon}</span>
      <div>
        <div style={{ fontSize: 12, color: COLORS.gray, fontFamily: "Arial, sans-serif", letterSpacing: 1, textTransform: "uppercase", marginBottom: 2 }}>
          {label}
        </div>
        <div style={{ fontSize: 18, color: COLORS.white, fontFamily: "Arial, sans-serif", fontWeight: 600 }}>
          {value}
        </div>
      </div>
    </div>
  );
};

export const SceneCTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Background pulse
  const glowOpacity = interpolate(
    Math.sin((frame / fps) * Math.PI),
    [-1, 1],
    [0.1, 0.25]
  );

  // Main title
  const titleS = spring({ frame, fps, config: { damping: 200 } });
  const titleOpacity = interpolate(titleS, [0, 1], [0, 1]);
  const titleScale = interpolate(titleS, [0, 1], [0.85, 1]);

  // Subtitle
  const subS = spring({ frame: frame - 20, fps, config: { damping: 200 } });
  const subOpacity = interpolate(subS, [0, 1], [0, 1]);
  const subY = interpolate(subS, [0, 1], [20, 0]);

  // CTA button
  const btnS = spring({ frame: frame - 40, fps, config: { damping: 20, stiffness: 200 } });
  const btnScale = interpolate(btnS, [0, 1], [0.5, 1]);
  const btnOpacity = interpolate(btnS, [0, 1], [0, 1]);

  // Line width
  const lineW = interpolate(frame, [15, 50], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });

  // Beservices logo reveal
  const logoS = spring({ frame: frame - 5, fps, config: { damping: 200 } });
  const logoOpacity = interpolate(logoS, [0, 1], [0, 1]);

  const contacts = [
    { icon: "🌐", label: "Web", value: "www.beservices.es", color: COLORS.cyan, delay: 55 },
    { icon: "📧", label: "Email", value: "info@beservices.es", color: COLORS.lightBlue, delay: 65 },
    { icon: "📍", label: "Ubicación", value: "España · Madrid", color: COLORS.googleGreen, delay: 75 },
  ];

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg, ${COLORS.darkNavy} 0%, ${COLORS.navy} 50%, #0D1F40 100%)`,
      }}
    >
      {/* Central glow */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          width: 900,
          height: 900,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${COLORS.lightBlue} 0%, transparent 65%)`,
          opacity: glowOpacity,
          filter: "blur(80px)",
        }}
      />

      {/* Top line */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: lineW + "%",
          height: 2,
          background: `linear-gradient(90deg, transparent, ${COLORS.cyan}, ${COLORS.lightBlue}, transparent)`,
        }}
      />

      {/* Left panel: CTA */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: "55%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "0 80px",
        }}
      >
        {/* Logo mark */}
        <div style={{ opacity: logoOpacity, marginBottom: 32, display: "flex", alignItems: "center", gap: 16 }}>
          <svg width="52" height="52" viewBox="0 0 80 80">
            <polygon points="40,4 74,22 74,58 40,76 6,58 6,22" fill="none" stroke={COLORS.cyan} strokeWidth="2" />
            <polygon points="40,14 66,28 66,52 40,66 14,52 14,28" fill={COLORS.lightBlue} fillOpacity="0.15" stroke={COLORS.lightBlue} strokeWidth="1" strokeOpacity="0.4" />
            <text x="40" y="47" textAnchor="middle" fill={COLORS.white} fontSize="22" fontWeight="bold" fontFamily="Arial, sans-serif">B</text>
          </svg>
          <span style={{ fontSize: 13, letterSpacing: 4, color: COLORS.gray, fontFamily: "Arial, sans-serif", textTransform: "uppercase" }}>
            beservices.es
          </span>
        </div>

        {/* Main title */}
        <div
          style={{
            opacity: titleOpacity,
            transform: `scale(${titleScale})`,
            transformOrigin: "left center",
          }}
        >
          <h2
            style={{
              fontSize: 68,
              fontWeight: 900,
              color: COLORS.white,
              fontFamily: "'Arial Black', Arial, sans-serif",
              lineHeight: 1.05,
              margin: 0,
            }}
          >
            ¿Listo para{" "}
            <span
              style={{
                color: "transparent",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                backgroundImage: `linear-gradient(90deg, ${COLORS.cyan}, ${COLORS.lightBlue})`,
              }}
            >
              transformar
            </span>
            <br />
            tu empresa?
          </h2>
        </div>

        {/* Subtitle */}
        <div
          style={{
            opacity: subOpacity,
            transform: `translateY(${subY}px)`,
            marginTop: 24,
            marginBottom: 40,
          }}
        >
          <p
            style={{
              fontSize: 20,
              color: COLORS.gray,
              fontFamily: "Arial, sans-serif",
              lineHeight: 1.6,
              margin: 0,
              maxWidth: 520,
            }}
          >
            Hablemos de tu proyecto. Nuestro equipo de expertos en{" "}
            <span style={{ color: COLORS.offWhite }}>Microsoft 365</span>,{" "}
            <span style={{ color: COLORS.googleBlue }}>Google Cloud</span> y{" "}
            <span style={{ color: COLORS.cyan }}>Azure</span> está listo para ayudarte.
          </p>
        </div>

        {/* CTA Button */}
        <div
          style={{
            opacity: btnOpacity,
            transform: `scale(${btnScale})`,
            transformOrigin: "left center",
            display: "inline-flex",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 14,
              background: `linear-gradient(90deg, ${COLORS.lightBlue}, ${COLORS.cyan})`,
              borderRadius: 50,
              padding: "18px 40px",
              cursor: "pointer",
            }}
          >
            <span
              style={{
                fontSize: 18,
                fontWeight: 700,
                color: COLORS.white,
                fontFamily: "Arial, sans-serif",
                letterSpacing: 1,
              }}
            >
              Solicita una consultoría gratuita
            </span>
            <span style={{ fontSize: 20 }}>→</span>
          </div>
        </div>
      </div>

      {/* Right panel: Contact info + partners */}
      <div
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          bottom: 0,
          width: "40%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "0 80px 0 40px",
          gap: 16,
        }}
      >
        {/* Divider */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: "10%",
            bottom: "10%",
            width: 1,
            background: "rgba(255,255,255,0.06)",
          }}
        />

        <div
          style={{
            fontSize: 12,
            letterSpacing: 3,
            color: COLORS.gray,
            fontFamily: "Arial, sans-serif",
            textTransform: "uppercase",
            marginBottom: 8,
            opacity: interpolate(frame, [40, 60], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          }}
        >
          Contacta con nosotros
        </div>

        {contacts.map((c) => (
          <ContactItem key={c.label} {...c} frame={frame} fps={fps} />
        ))}

        {/* Partner logos bottom */}
        <div
          style={{
            marginTop: 32,
            opacity: interpolate(frame, [80, 100], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
            display: "flex",
            gap: 16,
            flexDirection: "column",
          }}
        >
          <div style={{ fontSize: 11, letterSpacing: 3, color: COLORS.gray, fontFamily: "Arial, sans-serif", textTransform: "uppercase" }}>
            Partners certificados
          </div>
          <div style={{ display: "flex", gap: 16 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 30,
                padding: "8px 16px",
              }}
            >
              <span style={{ fontSize: 14, fontWeight: 700 }}>
                <span style={{ color: COLORS.googleBlue }}>G</span>
                <span style={{ color: COLORS.googleRed }}>o</span>
                <span style={{ color: COLORS.googleYellow }}>o</span>
                <span style={{ color: COLORS.googleBlue }}>g</span>
                <span style={{ color: COLORS.googleGreen }}>l</span>
                <span style={{ color: COLORS.googleRed }}>e</span>
              </span>
              <span style={{ fontSize: 11, color: COLORS.gray, fontFamily: "Arial, sans-serif" }}>Premier</span>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 30,
                padding: "8px 16px",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 21 21">
                <rect x="0" y="0" width="10" height="10" fill="#F25022" />
                <rect x="11" y="0" width="10" height="10" fill="#7FBA00" />
                <rect x="0" y="11" width="10" height="10" fill="#00A4EF" />
                <rect x="11" y="11" width="10" height="10" fill="#FFB900" />
              </svg>
              <span style={{ fontSize: 11, color: COLORS.gray, fontFamily: "Arial, sans-serif" }}>Partner</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom line */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: lineW + "%",
          height: 2,
          background: `linear-gradient(90deg, transparent, ${COLORS.lightBlue}, ${COLORS.cyan}, transparent)`,
        }}
      />
    </AbsoluteFill>
  );
};
