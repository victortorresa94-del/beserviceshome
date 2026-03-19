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

type StatBlockProps = {
  value: string;
  label: string;
  color: string;
  frame: number;
  fps: number;
  delay: number;
};

const StatBlock: React.FC<StatBlockProps> = ({ value, label, color, frame, fps, delay }) => {
  const s = spring({ frame: frame - delay, fps, config: { damping: 200 } });
  const opacity = interpolate(s, [0, 1], [0, 1]);
  const scale = interpolate(s, [0, 1], [0.7, 1]);

  return (
    <div
      style={{
        opacity,
        transform: `scale(${scale})`,
        textAlign: "center",
        padding: "32px 24px",
        background: "rgba(255,255,255,0.03)",
        border: `1px solid rgba(255,255,255,0.08)`,
        borderRadius: 20,
        borderBottom: `3px solid ${color}`,
        flex: 1,
      }}
    >
      <div
        style={{
          fontSize: 56,
          fontWeight: 900,
          color,
          fontFamily: "'Arial Black', Arial, sans-serif",
          lineHeight: 1,
          marginBottom: 10,
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontSize: 15,
          color: COLORS.offWhite,
          fontFamily: "Arial, sans-serif",
          lineHeight: 1.4,
        }}
      >
        {label}
      </div>
    </div>
  );
};

type ProcessStepProps = {
  num: string;
  title: string;
  desc: string;
  frame: number;
  fps: number;
  delay: number;
  isLast?: boolean;
};

const ProcessStep: React.FC<ProcessStepProps> = ({ num, title, desc, frame, fps, delay, isLast }) => {
  const s = spring({ frame: frame - delay, fps, config: { damping: 200 } });
  const opacity = interpolate(s, [0, 1], [0, 1]);
  const x = interpolate(s, [0, 1], [-30, 0]);

  return (
    <div
      style={{
        opacity,
        transform: `translateX(${x}px)`,
        display: "flex",
        gap: 20,
        alignItems: "flex-start",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: "50%",
            background: `linear-gradient(135deg, ${COLORS.lightBlue}, ${COLORS.cyan})`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 16,
            fontWeight: 900,
            color: COLORS.white,
            fontFamily: "Arial, sans-serif",
            flexShrink: 0,
          }}
        >
          {num}
        </div>
        {!isLast && (
          <div
            style={{
              width: 2,
              flex: 1,
              minHeight: 30,
              background: "rgba(255,255,255,0.1)",
              margin: "6px 0",
            }}
          />
        )}
      </div>
      <div style={{ paddingBottom: isLast ? 0 : 20 }}>
        <div
          style={{
            fontSize: 18,
            fontWeight: 700,
            color: COLORS.white,
            fontFamily: "Arial, sans-serif",
            marginBottom: 4,
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
    </div>
  );
};

export const SceneTransformation: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleS = spring({ frame, fps, config: { damping: 200 } });
  const titleOpacity = interpolate(titleS, [0, 1], [0, 1]);
  const titleY = interpolate(titleS, [0, 1], [40, 0]);

  const lineW = interpolate(frame, [5, 35], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });

  const stats = [
    { value: "+180", label: "Empresas transformadas digitalmente", color: COLORS.googleBlue, delay: 30 },
    { value: "100%", label: "Compromiso con cada cliente", color: COLORS.cyan, delay: 45 },
    { value: "24/7", label: "Soporte técnico especializado", color: COLORS.lightBlue, delay: 60 },
    { value: "#1", label: "Google Cloud Premier en España", color: COLORS.googleGreen, delay: 75 },
  ];

  const steps = [
    { num: "01", title: "Consultoría Estratégica", desc: "Analizamos tu negocio y diseñamos una hoja de ruta personalizada", delay: 35 },
    { num: "02", title: "Implementación Cloud", desc: "Migramos y configuramos tu infraestructura con cero interrupciones", delay: 50 },
    { num: "03", title: "Seguridad y Cumplimiento", desc: "Protegemos tus datos con las mejores prácticas del sector", delay: 65 },
    { num: "04", title: "Soporte Continuo", desc: "Acompañamiento permanente para maximizar tu inversión tecnológica", delay: 80 },
  ];

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(150deg, #08101E 0%, ${COLORS.darkNavy} 60%, #0C1825 100%)`,
      }}
    >
      {/* Background glow */}
      <div
        style={{
          position: "absolute",
          right: -100,
          top: "50%",
          transform: "translateY(-50%)",
          width: 700,
          height: 700,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${COLORS.cyan}18 0%, transparent 70%)`,
          filter: "blur(80px)",
        }}
      />

      {/* Header */}
      <div
        style={{
          position: "absolute",
          top: 50,
          left: 80,
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
        }}
      >
        <span
          style={{
            fontSize: 13,
            letterSpacing: 4,
            color: COLORS.googleGreen,
            fontFamily: "Arial, sans-serif",
            textTransform: "uppercase",
            fontWeight: 600,
          }}
        >
          Transformación Digital
        </span>
        <h2
          style={{
            fontSize: 52,
            fontWeight: 900,
            color: COLORS.white,
            fontFamily: "'Arial Black', Arial, sans-serif",
            margin: "8px 0 0 0",
            lineHeight: 1.1,
          }}
        >
          Tu negocio,{" "}
          <span style={{ color: COLORS.cyan }}>potenciado</span>
          <br />
          por la tecnología
        </h2>
        <div
          style={{
            width: lineW + "%",
            height: 2,
            background: `linear-gradient(90deg, ${COLORS.cyan}, transparent)`,
            marginTop: 12,
            maxWidth: 500,
          }}
        />
      </div>

      {/* Stats row */}
      <div
        style={{
          position: "absolute",
          left: 80,
          right: 80,
          top: 230,
          display: "flex",
          gap: 16,
        }}
      >
        {stats.map((s) => (
          <StatBlock key={s.label} {...s} frame={frame} fps={fps} />
        ))}
      </div>

      {/* Process steps */}
      <div
        style={{
          position: "absolute",
          left: 80,
          right: 80,
          top: 460,
          bottom: 60,
          display: "flex",
          gap: 60,
        }}
      >
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontSize: 13,
              letterSpacing: 3,
              color: COLORS.gray,
              fontFamily: "Arial, sans-serif",
              textTransform: "uppercase",
              marginBottom: 24,
              opacity: interpolate(frame, [25, 45], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
            }}
          >
            Nuestro Proceso
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {steps.slice(0, 2).map((s, i) => (
              <ProcessStep key={s.num} {...s} frame={frame} fps={fps} isLast={i === 1} />
            ))}
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ height: 37 }} />
          <div style={{ display: "flex", flexDirection: "column" }}>
            {steps.slice(2).map((s, i) => (
              <ProcessStep key={s.num} {...s} frame={frame} fps={fps} isLast={i === 1} />
            ))}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
