#!/usr/bin/env node
'use strict';

// ─── ANSI Color Codes ────────────────────────────────────────────────────────
const C = {
  reset:   '\x1b[0m',
  bold:    '\x1b[1m',
  dim:     '\x1b[2m',
  cyan:    '\x1b[36m',
  magenta: '\x1b[35m',
  yellow:  '\x1b[33m',
  green:   '\x1b[32m',
  blue:    '\x1b[34m',
  white:   '\x1b[37m',
  gray:    '\x1b[90m',
  bgDark:  '\x1b[48;5;234m',
  cyanBr:  '\x1b[96m',
  greenBr: '\x1b[92m',
  redBr:   '\x1b[91m',
  red:     '\x1b[31m',
  magentaBr: '\x1b[95m',
};

// ─── Agent Definitions ───────────────────────────────────────────────────────
const AGENTS = {
  victor: { emoji: '🎬', name: 'Victor', role: 'Director ', color: C.cyan,       startPct: 20 },
  elena:  { emoji: '🎨', name: 'Elena',  role: 'Art Dir. ', color: C.magenta,    startPct: 15 },
  marco:  { emoji: '✨', name: 'Marco',  role: 'Animador ', color: C.yellow,     startPct: 10 },
  sara:   { emoji: '📝', name: 'Sara',   role: 'Copy     ', color: C.green,      startPct: 25 },
  alex:   { emoji: '🔧', name: 'Alex',   role: 'Tech Lead', color: C.blue,       startPct: 30 },
  risto:  { emoji: '🔥', name: 'Risto',  role: 'Provoc.  ', color: C.red,        startPct:  0 },
  gary:   { emoji: '📢', name: 'Gary',   role: 'Content  ', color: C.yellow,     startPct:  0 },
  pedro:  { emoji: '🏗️', name: 'Pedro',  role: 'Arquitec.', color: C.magentaBr,  startPct:  0 },
};

// ─── Scripted Timeline (ms from start) ───────────────────────────────────────
const TIMELINE = [
  { t:     0, agent: 'victor', msg: 'Leyendo brief de BeServices en Notion...',                       pct: 22 },
  { t:  1200, agent: 'alex',   msg: 'Instalando @remotion/google-fonts v4.0.257',                     pct: 32 },
  { t:  2500, agent: 'elena',  msg: 'Cargando paleta Tech-Clarity: #001A41 + #00D4FF',                 pct: 20 },
  { t:  3800, agent: 'marco',  msg: 'Diseñando sistema de partículas para SceneIntro',                 pct: 15 },
  { t:  5000, agent: 'sara',   msg: 'Tagline confirmado: "Scaling Your Digital World"',               pct: 30 },
  { t:  6200, agent: 'victor', msg: 'SceneIntro: 160 frames, 5.3 segundos ✓ Aprobado',                pct: 28 },
  { t:  7500, agent: 'alex',   msg: 'SceneIntro.tsx compilado sin errores',                            pct: 38 },
  { t:  8800, agent: 'elena',  msg: 'Aplicando glassmorphism: backdrop-filter blur(12px)',             pct: 28 },
  { t: 10000, agent: 'marco',  msg: 'Animación TypeWriter lista: 2 frames por carácter',               pct: 24 },
  { t: 11500, agent: 'sara',   msg: 'Copy SceneMicrosoft365: "Seguridad Total en la Nube" ✓',         pct: 36 },
  { t: 13000, agent: 'victor', msg: 'SceneMicrosoft365: shield draw-on aprobado, muy dinámico',       pct: 35 },
  { t: 14500, agent: 'elena',  msg: 'Cards glassmorphism: 4 features con accent colors únicos',       pct: 38 },
  { t: 16000, agent: 'marco',  msg: 'AnimatedCounter: 99.9% SLA — spring damping 80, stiffness 60',   pct: 35 },
  { t: 17500, agent: 'alex',   msg: 'SceneMicrosoft365.tsx ✓ | SceneCloud.tsx en proceso...',         pct: 48 },
  { t: 19000, agent: 'sara',   msg: 'SceneCloud: "Tu infraestructura, nuestra responsabilidad"',      pct: 44 },
  { t: 20500, agent: 'elena',  msg: 'NodeNetwork SVG: 12 nodos + 17 aristas de baja densidad',        pct: 48 },
  { t: 22000, agent: 'marco',  msg: 'Service pills stagger in: delay +5 frames cada tag',             pct: 46 },
  { t: 23500, agent: 'victor', msg: 'SceneCloud dual-panel: Google Cloud + Azure. Épico.',            pct: 44 },
  { t: 25000, agent: 'alex',   msg: 'SceneCloud.tsx ✓ | Iniciando SceneAI.tsx...',                    pct: 58 },
  { t: 26500, agent: 'sara',   msg: 'SceneAI headline: "Agentes que trabajan por ti" 🤖',             pct: 52 },
  { t: 28000, agent: 'elena',  msg: 'Paleta IA: violet #7B2FFF + fuchsia para acentos IA',            pct: 58 },
  { t: 29500, agent: 'marco',  msg: 'Orbital system: 3 nodos en sin/cos a r=100,140,180px',           pct: 56 },
  { t: 31000, agent: 'victor', msg: 'Pulsing rings: 4 anillos expansivos con fade-out. WOW',          pct: 54 },
  { t: 32500, agent: 'alex',   msg: 'GlassCard AI: Claude Code, Copilot, Agent 365, Gemini',          pct: 65 },
  { t: 34000, agent: 'sara',   msg: 'Copy AI: "10x productividad · 180+ empresas automatizadas"',     pct: 62 },
  { t: 35500, agent: 'marco',  msg: 'SceneAI completo: 140 frames de IA pura 🤖✨',                   pct: 68 },
  { t: 37000, agent: 'victor', msg: 'SceneAI aprobada. Es la escena más potente del video',           pct: 64 },
  { t: 38500, agent: 'alex',   msg: 'SceneTransformation.tsx: AnimatedCounters x4 en proceso',        pct: 72 },
  { t: 40000, agent: 'marco',  msg: '+180 empresas animando... spring damping 80, slow reveal',       pct: 78 },
  { t: 41500, agent: 'elena',  msg: 'Process steps: círculos gradient + connector lines ✓',           pct: 70 },
  { t: 43000, agent: 'sara',   msg: '"BeSafe Security" añadido al proceso. Diferenciador clave.',     pct: 72 },
  { t: 44500, agent: 'alex',   msg: 'SceneTransformation ✓ | Último: SceneCTA.tsx',                   pct: 80 },
  { t: 46000, agent: 'marco',  msg: 'CTA button: gradient cyan→violet + pulsing box-shadow',          pct: 86 },
  { t: 47500, agent: 'elena',  msg: 'Breathing glow: sin wave en opacity, 0.1→0.35. Elegante.',       pct: 80 },
  { t: 49000, agent: 'sara',   msg: '"¿Listo para transformar tu empresa?" — CTA aprobado',           pct: 82 },
  { t: 50500, agent: 'victor', msg: 'SceneCTA: todo en su sitio. Cerramos fuerte.',                   pct: 78 },
  { t: 52000, agent: 'alex',   msg: 'BeservicesVideo.tsx: 6 escenas, 720 frames totales ✓',           pct: 88 },
  { t: 53500, agent: 'marco',  msg: 'Transiciones: fade, slide×2, wipe, slide, fade. Variedad ✓',    pct: 92 },
  { t: 55000, agent: 'victor', msg: 'Root.tsx: Google Fonts Montserrat + Inter cargando ✓',           pct: 86 },
  { t: 56500, agent: 'alex',   msg: 'npm install completado. 0 vulnerabilidades 🟢',                  pct: 94 },
  { t: 58000, agent: 'elena',  msg: 'Coherencia visual: 6 escenas, 1 identidad. Tech-Clarity ✓',     pct: 90 },
  { t: 59500, agent: 'sara',   msg: 'Review final del copy: "Scaling Your Digital World" 💙',         pct: 94 },
  { t: 61000, agent: 'marco',  msg: 'orbital · typewriter · counters · glassmorphism · SVG · 3D 🔥',  pct: 98 },
  { t: 62500, agent: 'victor', msg: '26 segundos que van a flipar a toda la empresa. ¡Listos!',       pct: 96 },
  { t: 64000, agent: 'alex',   msg: 'remotion studio corriendo en localhost:3000 🚀',                 pct: 100 },
  { t: 65500, agent: 'elena',  msg: 'Abre el navegador y disfruta del show, Victor 🎬',               pct: 100 },
  // ── New agents enter the scene ───────────────────────────────────────────
  { t:  75000, agent: 'risto',  msg: 'Escena Intro rechazada. Demasiado genérica. Reescribiendo copy...',                    pct: 20 },
  { t:  87500, agent: 'gary',   msg: 'Identificados 7 micro-clips virales en 720 frames...',                                  pct: 20 },
  { t: 100000, agent: 'pedro',  msg: 'Trigger de identidad activado en frame 45. Empresarios españoles reconocen la escena.', pct: 20 },
  { t: 112500, agent: 'risto',  msg: 'Test de sustitución: SUPERADO. BeServices tiene punto de vista.',                       pct: 55 },
  { t: 125000, agent: 'gary',   msg: 'Hook del segundo 0-3: 94% scroll-stop probability.',                                    pct: 55 },
  { t: 137500, agent: 'pedro',  msg: 'Diseño viral: emoción + utilidad en SceneCTA = alta compartibilidad.',                  pct: 55 },
  { t: 150000, agent: 'risto',  msg: 'Video aprobado. Aporta. No se aparta.',                                                 pct: 95 },
  { t: 162500, agent: 'gary',   msg: 'Content pyramid: 1 master → 34 derivative pieces ready.',                               pct: 95 },
  { t: 175000, agent: 'pedro',  msg: 'Atención convertida en activo. Funnel: frío → cliente en 4 pasos.',                    pct: 95 },
  { t: 180000, agent: 'victor', msg: 'Equipo completo: 8 agentes. 1 video. Toda la empresa va a flipar. 🎬',                  pct: 100 },
];

// ─── Scene Timeline ───────────────────────────────────────────────────────────
function getCurrentScene(elapsedMs) {
  const s = elapsedMs / 1000;
  if (s <  12) return 'SceneIntro';
  if (s <  25) return 'SceneMicrosoft365';
  if (s <  37) return 'SceneCloud';
  if (s <  50) return 'SceneAI';
  if (s <  58) return 'SceneTransformation';
  if (s <  67) return 'SceneCTA → COMPLETADO 🎉';
  if (s < 112) return 'POST-PRODUCCIÓN: Auditoría de marca';
  if (s < 150) return 'POST-PRODUCCIÓN: Arquitectura de viralidad';
  return 'POST-PRODUCCIÓN: Estrategia de contenido lista ✓';
}

// ─── Progress Bar ─────────────────────────────────────────────────────────────
function progressBar(percent, width = 10) {
  const filled = Math.round((percent / 100) * width);
  const empty  = width - filled;
  const bar    = '█'.repeat(filled) + '░'.repeat(empty);
  return bar;
}

// ─── Pad / Truncate to exact length ──────────────────────────────────────────
function pad(str, len) {
  // Strip ANSI codes to measure visual length
  const clean = str.replace(/\x1b\[[0-9;]*m/g, '').replace(/\x1b\[[\d]+;\d+;\d+m/g, '');
  const visLen = [...clean].length; // naive but fine for our use
  if (visLen >= len) {
    // Truncate visible chars (ignoring ANSI — simpler: just truncate clean)
    return clean.slice(0, len);
  }
  return str + ' '.repeat(len - visLen);
}

// ─── State ────────────────────────────────────────────────────────────────────
const startTime = Date.now();
const log       = [];
const agentPct  = {
  victor: AGENTS.victor.startPct,
  elena:  AGENTS.elena.startPct,
  marco:  AGENTS.marco.startPct,
  sara:   AGENTS.sara.startPct,
  alex:   AGENTS.alex.startPct,
  risto:  AGENTS.risto.startPct,
  gary:   AGENTS.gary.startPct,
  pedro:  AGENTS.pedro.startPct,
};
const agentStatus = {
  victor: 'Iniciando producción...',
  elena:  'Cargando paleta de colores...',
  marco:  'Preparando sistema de animación...',
  sara:   'Revisando brief de contenido...',
  alex:   'Configurando entorno Remotion...',
  risto:  'Validando coherencia de marca...',
  gary:   'Atomizando video en 30+ piezas...',
  pedro:  'Diseñando estrategia de viralidad...',
};

let lastEventIndex = -1;
let frameCounter   = 0;
let dots           = 0;

// ─── Spinner frames ───────────────────────────────────────────────────────────
const SPINNER = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];

// ─── Header ASCII Art ─────────────────────────────────────────────────────────
function renderHeader() {
  const lines = [];
  lines.push(C.cyan + C.bold + '╔══════════════════════════════════════════════════════════════════════════════╗' + C.reset);
  lines.push(C.cyan + C.bold + '║' + C.reset + C.bold + C.white + '  🎬 BESERVICES VIDEO STUDIO — EQUIPO DE PRODUCCIÓN EN DIRECTO               ' + C.reset + C.cyan + C.bold + '║' + C.reset);
  lines.push(C.cyan + C.bold + '║' + C.reset + C.gray  + '  Proyecto: Video Corporativo 2026 · 26s · 1920×1080 · 30fps · 8 AGENTES ACTIVOS ' + C.reset + C.cyan + C.bold + '║' + C.reset);
  lines.push(C.cyan + C.bold + '╚══════════════════════════════════════════════════════════════════════════════╝' + C.reset);
  return lines.join('\n');
}

// ─── Agent Row ────────────────────────────────────────────────────────────────
function renderAgentRow(agentKey) {
  const a    = AGENTS[agentKey];
  const pct  = agentPct[agentKey];
  const stat = agentStatus[agentKey];

  // Name col: 20 chars visible
  const nameRaw  = `${a.emoji} ${a.name} ${a.role}`;
  const namePad  = nameRaw.padEnd(20).slice(0, 20);

  // Status col: 30 chars
  const statClean = stat.replace(/\x1b\[[0-9;]*m/g, '');
  const statPad   = statClean.padEnd(30).slice(0, 30);

  // Bar + pct
  const bar    = progressBar(pct, 10);
  const pctStr = String(pct).padStart(3) + '%';

  // Assemble colored row
  const nameStr = a.color + C.bold + namePad + C.reset;
  const statStr = C.white + statPad + C.reset;
  const barStr  = pct === 100
    ? C.greenBr + bar + C.reset
    : a.color + bar + C.reset;
  const pctColor = pct === 100 ? C.greenBr + C.bold : C.white;
  const pctFmt  = pctColor + ' ' + pctStr + C.reset;

  return `  │ ${nameStr}  ${statStr}  ${barStr}${pctFmt}  │`;
}

// ─── Agents Table ─────────────────────────────────────────────────────────────
function renderAgentsTable() {
  const lines = [];
  lines.push(`  ${C.bold}${C.white}┌─ 8 AGENTES ACTIVOS ─────────────────────────────────────────────────────┐${C.reset}`);
  lines.push(`  ${C.gray}│ ${'Agente'.padEnd(20)}  ${'Estado'.padEnd(30)}  ${'Progreso'.padEnd(17)}│${C.reset}`);
  lines.push(`  ${C.bold}${C.white}├─────────────────────────────────────────────────────────────────────────┤${C.reset}`);
  for (const key of ['victor', 'elena', 'marco', 'sara', 'alex', 'risto', 'gary', 'pedro']) {
    lines.push(renderAgentRow(key));
  }
  lines.push(`  ${C.bold}${C.white}└─────────────────────────────────────────────────────────────────────────┘${C.reset}`);
  return lines.join('\n');
}

// ─── Log Entry Formatter ──────────────────────────────────────────────────────
function formatLogEntry(entry) {
  const a       = AGENTS[entry.agent];
  const timeStr = C.gray + `[${entry.time}]` + C.reset;
  const nameStr = a.color + C.bold + `${a.emoji} ${a.name.padEnd(6)}` + C.reset;
  // Message: truncate to keep full line ≤ 78 chars visible
  const msgClean = entry.msg.replace(/\x1b\[[0-9;]*m/g, '');
  const msgTrunc = msgClean.slice(0, 52).padEnd(52);
  return `  │ ${timeStr} ${nameStr} → ${C.white}${msgTrunc}${C.reset}  │`;
}

// ─── Activity Log ─────────────────────────────────────────────────────────────
function renderActivityLog() {
  const lines = [];
  lines.push(`  ${C.bold}${C.white}┌─ ACTIVIDAD EN DIRECTO ──────────────────────────────────────────────────┐${C.reset}`);

  const MAX_LINES = 6;
  const shown = log.slice(-MAX_LINES);
  // Pad to always show MAX_LINES rows
  while (shown.length < MAX_LINES) shown.unshift(null);

  for (const entry of shown) {
    if (!entry) {
      lines.push(`  ${C.gray}│${' '.repeat(75)}│${C.reset}`);
    } else {
      lines.push(formatLogEntry(entry));
    }
  }

  lines.push(`  ${C.bold}${C.white}└─────────────────────────────────────────────────────────────────────────┘${C.reset}`);
  return lines.join('\n');
}

// ─── Status Bar ───────────────────────────────────────────────────────────────
function renderStatusBar(elapsedMs) {
  const elapsed  = elapsedMs / 1000;
  const scene    = getCurrentScene(elapsedMs);
  const frame    = elapsed.toFixed(1) + 's';
  const spin     = SPINNER[frameCounter % SPINNER.length];
  const totalPct = Math.round(
    (agentPct.victor + agentPct.elena + agentPct.marco + agentPct.sara +
     agentPct.alex   + agentPct.risto + agentPct.gary  + agentPct.pedro) / 8
  );

  const isComplete = elapsed >= 180;
  const statusIcon = isComplete ? '🟢' : '🟡';
  const statusLabel = isComplete
    ? C.greenBr + C.bold + 'COMPLETADO' + C.reset
    : C.yellow  + C.bold + 'PRODUCCIÓN ACTIVA' + C.reset;

  const elapsedFormatted = formatElapsed(elapsedMs);

  const line1 = `  STATUS: ${statusIcon} ${statusLabel}  ·  Escena: ${C.cyanBr}${C.bold}${scene}${C.reset}  ·  Frame: ${C.yellow}${frame}${C.reset}`;
  const line2 = `  ${C.gray}${spin} Global: ${C.reset}${C.greenBr}${progressBar(totalPct, 20)}${C.reset} ${C.bold}${totalPct}%${C.reset}  ·  Tiempo: ${C.white}${elapsedFormatted}${C.reset}  ·  ${C.gray}Agentes: 8  ·  Ctrl+C para detener${C.reset}`;

  return line1 + '\n' + line2;
}

// ─── Elapsed Time Formatter ───────────────────────────────────────────────────
function formatElapsed(ms) {
  const totalSec = Math.floor(ms / 1000);
  const m = Math.floor(totalSec / 60).toString().padStart(2, '0');
  const s = (totalSec % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

// ─── Mini agent name strip at top ────────────────────────────────────────────
function renderSubtitle() {
  const parts = Object.values(AGENTS).map(a =>
    a.color + C.bold + a.emoji + ' ' + a.name + C.reset
  );
  const line = '  ' + parts.join(C.gray + '  ·  ' + C.reset) + '  ';
  return C.gray + '  ·  ' + C.reset +
    parts.join(C.gray + '  ·  ' + C.reset) +
    C.gray + '  ·' + C.reset;
}

// ─── Full Render ──────────────────────────────────────────────────────────────
function render() {
  const elapsedMs = Date.now() - startTime;

  // Process new timeline events
  for (let i = lastEventIndex + 1; i < TIMELINE.length; i++) {
    const ev = TIMELINE[i];
    if (elapsedMs >= ev.t) {
      const timeStr = new Date().toLocaleTimeString('es-ES');
      log.push({ time: timeStr, agent: ev.agent, msg: ev.msg });
      agentPct[ev.agent]    = ev.pct;
      agentStatus[ev.agent] = ev.msg;
      lastEventIndex        = i;
    } else {
      break;
    }
  }

  // Smooth progress interpolation for agents 6-8 between timeline checkpoints
  // Builds a per-agent list of {t, pct} keyframes from TIMELINE, then interpolates
  const lateAgents = ['risto', 'gary', 'pedro'];
  for (const key of lateAgents) {
    const keyframes = TIMELINE
      .filter(ev => ev.agent === key)
      .map(ev => ({ t: ev.t, pct: ev.pct }));
    if (keyframes.length === 0) continue;
    // Before first keyframe: interpolate from 0 at t=0
    const first = keyframes[0];
    const last  = keyframes[keyframes.length - 1];
    if (elapsedMs <= first.t) {
      agentPct[key] = Math.round((elapsedMs / first.t) * first.pct);
    } else if (elapsedMs >= last.t) {
      agentPct[key] = last.pct;
    } else {
      // Find surrounding keyframes and interpolate
      for (let k = 0; k < keyframes.length - 1; k++) {
        const a = keyframes[k];
        const b = keyframes[k + 1];
        if (elapsedMs >= a.t && elapsedMs <= b.t) {
          const ratio = (elapsedMs - a.t) / (b.t - a.t);
          agentPct[key] = Math.round(a.pct + ratio * (b.pct - a.pct));
          break;
        }
      }
    }
  }

  frameCounter++;

  // Build full screen output as single string for minimal flicker
  const out = [
    '',
    renderHeader(),
    renderSubtitle(),
    '',
    renderAgentsTable(),
    '',
    renderActivityLog(),
    '',
    renderStatusBar(elapsedMs),
    '',
  ].join('\n');

  process.stdout.write('\x1Bc');   // clear screen + reset cursor
  process.stdout.write(out);
}

// ─── Graceful Exit ────────────────────────────────────────────────────────────
process.on('SIGINT', () => {
  process.stdout.write('\x1Bc');
  process.stdout.write(
    '\n' + C.cyan + C.bold +
    '  BeServices Video Studio — Sesión terminada.\n' +
    C.reset + C.gray +
    '  El equipo de 8 agentes ha guardado su trabajo.\n\n' +
    C.reset
  );
  process.exit(0);
});

// ─── Start ────────────────────────────────────────────────────────────────────
render();
setInterval(render, 400);
