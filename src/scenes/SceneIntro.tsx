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

const ParticleGrid: React.FC<{ frame: number }> = ({ frame }) => {
  const dots = [];
  const cols = 20;
  const rows = 12;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const delay = (r * cols + c) * 0.3;
      const opacity = interpolate(
        frame,
        [delay, delay + 20, 80, 100],
        [0, 0.15, 0.15, 0],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
      );
      dots.push(
        <div
          key={`${r}-${c}`}
          style={{
            position: "absolute",
            left: `${(c / (cols - 1)) * 100}%`,
            top: `${(r / (rows - 1)) * 100}%`,
            width: 3,
            height: 3,
            borderRadius: "50%",
            backgroundColor: COLORS.cyan,
            opacity,
            transform: "translate(-50%, -50%)",
          }}
        />
      );
    }
  }
  return <div style={{ position: "absolute", inset: 0 }}>{dots}</div>;
};

const GlowOrb: React.FC<{
  x: string;
  y: string;
  color: string;
  size: number;
  frame: number;
  delay: number;
}> = ({ x, y, color, size, frame, delay }) => {
  const opacity = interpolate(frame, [delay, delay + 40], [0, 0.25], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: size,
        height: size,
        borderRadius: "50%",
        background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        opacity,
        transform: "translate(-50%, -50%)",
        filter: "blur(40px)",
      }}
    />
  );
};

export const SceneIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Background gradient animation
  const bgOpacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Logo line reveal
  const lineWidth = interpolate(frame, [20, 60], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });

  // BESERVICES title
  const titleSpring = spring({ frame: frame - 30, fps, config: { damping: 200 } });
  const titleY = interpolate(titleSpring, [0, 1], [60, 0]);
  const titleOpacity = interpolate(titleSpring, [0, 1], [0, 1]);

  // Tagline
  const taglineSpring = spring({ frame: frame - 55, fps, config: { damping: 200 } });
  const taglineOpacity = interpolate(taglineSpring, [0, 1], [0, 1]);
  const taglineY = interpolate(taglineSpring, [0, 1], [30, 0]);

  // Badge
  const badgeSpring = spring({ frame: frame - 80, fps, config: { damping: 200 } });
  const badgeScale = interpolate(badgeSpring, [0, 1], [0.6, 1]);
  const badgeOpacity = interpolate(badgeSpring, [0, 1], [0, 1]);

  // Divider line
  const dividerWidth = interpolate(frame, [50, 90], [0, 300], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });

  // Partnership badges
  const partnerOpacity = interpolate(frame, [90, 110], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg, ${COLORS.darkNavy} 0%, ${COLORS.navy} 50%, ${COLORS.gradientEnd} 100%)`,
        opacity: bgOpacity,
      }}
    >
      {/* Particle grid */}
      <ParticleGrid frame={frame} />

      {/* Glow orbs */}
      <GlowOrb x="15%" y="30%" color={COLORS.lightBlue} size={600} frame={frame} delay={10} />
      <GlowOrb x="85%" y="70%" color={COLORS.cyan} size={500} frame={frame} delay={20} />
      <GlowOrb x="50%" y="50%" color={COLORS.blue} size={800} frame={frame} delay={5} />

      {/* Horizontal accent line top */}
      <div
        style={{
          position: "absolute",
          top: 80,
          left: "50%",
          transform: "translateX(-50%)",
          width: lineWidth + "%",
          height: 1,
          background: `linear-gradient(90deg, transparent, ${COLORS.cyan}, transparent)`,
        }}
      />

      {/* Center content */}
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 0,
        }}
      >
        {/* Logo mark */}
        <div
          style={{
            opacity: titleOpacity,
            transform: `translateY(${titleY}px)`,
            marginBottom: 20,
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}
        >
          {/* Hexagon logo mark */}
          <svg width="80" height="80" viewBox="0 0 80 80">
            <polygon
              points="40,4 74,22 74,58 40,76 6,58 6,22"
              fill="none"
              stroke={COLORS.cyan}
              strokeWidth="2"
            />
            <polygon
              points="40,14 66,28 66,52 40,66 14,52 14,28"
              fill={COLORS.lightBlue}
              fillOpacity="0.15"
              stroke={COLORS.lightBlue}
              strokeWidth="1"
              strokeOpacity="0.4"
            />
            <text
              x="40"
              y="47"
              textAnchor="middle"
              fill={COLORS.white}
              fontSize="22"
              fontWeight="bold"
              fontFamily="Arial, sans-serif"
            >
              B
            </text>
          </svg>
        </div>

        {/* Company Name */}
        <div
          style={{
            opacity: titleOpacity,
            transform: `translateY(${titleY}px)`,
          }}
        >
          <span
            style={{
              fontSize: 96,
              fontWeight: 900,
              fontFamily: "'Arial Black', Arial, sans-serif",
              color: COLORS.white,
              letterSpacing: 14,
              textTransform: "uppercase",
              lineHeight: 1,
            }}
          >
            BESERVICES
          </span>
        </div>

        {/* Divider */}
        <div
          style={{
            width: dividerWidth,
            height: 2,
            background: `linear-gradient(90deg, transparent, ${COLORS.cyan}, ${COLORS.lightBlue}, transparent)`,
            margin: "24px 0",
          }}
        />

        {/* Tagline */}
        <div
          style={{
            opacity: taglineOpacity,
            transform: `translateY(${taglineY}px)`,
            textAlign: "center",
          }}
        >
          <span
            style={{
              fontSize: 28,
              fontWeight: 300,
              fontFamily: "Arial, sans-serif",
              color: COLORS.offWhite,
              letterSpacing: 6,
              textTransform: "uppercase",
            }}
          >
            Transformación Digital · Cloud · Seguridad
          </span>
        </div>

        {/* Partner badges */}
        <div
          style={{
            opacity: partnerOpacity,
            transform: `scale(${badgeScale})`,
            display: "flex",
            gap: 40,
            marginTop: 60,
            alignItems: "center",
          }}
        >
          {/* Google Cloud Premier */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              background: "rgba(255,255,255,0.06)",
              border: `1px solid rgba(255,255,255,0.15)`,
              borderRadius: 40,
              padding: "10px 24px",
            }}
          >
            {/* Google logo colors */}
            <span style={{ fontSize: 20, fontWeight: 700 }}>
              <span style={{ color: COLORS.googleBlue }}>G</span>
              <span style={{ color: COLORS.googleRed }}>o</span>
              <span style={{ color: COLORS.googleYellow }}>o</span>
              <span style={{ color: COLORS.googleBlue }}>g</span>
              <span style={{ color: COLORS.googleGreen }}>l</span>
              <span style={{ color: COLORS.googleRed }}>e</span>
            </span>
            <span
              style={{
                fontSize: 13,
                color: COLORS.offWhite,
                fontFamily: "Arial, sans-serif",
                letterSpacing: 1,
              }}
            >
              Cloud Premier Partner
            </span>
          </div>

          {/* Separator */}
          <div style={{ width: 1, height: 30, background: "rgba(255,255,255,0.2)" }} />

          {/* Microsoft */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              background: "rgba(255,255,255,0.06)",
              border: `1px solid rgba(255,255,255,0.15)`,
              borderRadius: 40,
              padding: "10px 24px",
            }}
          >
            <svg width="20" height="20" viewBox="0 0 21 21">
              <rect x="0" y="0" width="10" height="10" fill="#F25022" />
              <rect x="11" y="0" width="10" height="10" fill="#7FBA00" />
              <rect x="0" y="11" width="10" height="10" fill="#00A4EF" />
              <rect x="11" y="11" width="10" height="10" fill="#FFB900" />
            </svg>
            <span
              style={{
                fontSize: 13,
                color: COLORS.offWhite,
                fontFamily: "Arial, sans-serif",
                letterSpacing: 1,
              }}
            >
              Microsoft Partner
            </span>
          </div>
        </div>
      </AbsoluteFill>

      {/* Bottom accent line */}
      <div
        style={{
          position: "absolute",
          bottom: 80,
          left: "50%",
          transform: "translateX(-50%)",
          width: lineWidth + "%",
          height: 1,
          background: `linear-gradient(90deg, transparent, ${COLORS.cyan}, transparent)`,
        }}
      />

      {/* Website watermark */}
      <div
        style={{
          position: "absolute",
          bottom: 30,
          right: 60,
          opacity: partnerOpacity * 0.6,
          fontSize: 14,
          color: COLORS.gray,
          fontFamily: "Arial, sans-serif",
          letterSpacing: 2,
        }}
      >
        www.beservices.es
      </div>
    </AbsoluteFill>
  );
};
