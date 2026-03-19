# CONTEXTO DEL PROYECTO — BeServices Video Corporativo 2026

> Documento de contexto completo para retomar el proyecto desde cualquier PC.
> Actualizado: 2026-03-20

---

## ¿QUÉ ES ESTE PROYECTO?

Video corporativo de BeServices hecho con **Remotion** (React → video).
BeServices es una empresa española de transformación digital — socios **Google Premier** y **Microsoft** — que vende servicios cloud, Microsoft 365, IA y consultoría a empresas medianas y grandes.

El objetivo del video: flipar a toda la empresa y usarlo para LinkedIn, web, presentaciones de ventas y eventos.

---

## REPOSITORIOS

| Repositorio | URL | Uso |
|---|---|---|
| **Principal (activo)** | `https://github.com/victortorresa94-del/beserviceshome.git` | Aquí está todo el código actual |
| Origen/referencia | `https://github.com/victortorresa94-del/remotion` | Repo base del que se partió |

Para clonar en el nuevo PC:
```bash
git clone https://github.com/victortorresa94-del/beserviceshome.git remotion-beservices
cd remotion-beservices
npm install
npm run dev  # → http://localhost:3000
```

---

## ESTRUCTURA DEL PROYECTO

```
remotion-beservices/
│
├── src/
│   ├── Root.tsx                  # Composición raíz — inyecta fuentes Google
│   ├── BeservicesVideo.tsx       # Orquesta las 6 escenas con TransitionSeries
│   ├── colors.ts                 # Sistema de color "Tech-Clarity" de BeServices
│   ├── index.ts                  # Entry point Remotion
│   │
│   ├── scenes/
│   │   ├── SceneIntro.tsx        # Escena 1: Logo + nombre + partners (160f)
│   │   ├── SceneMicrosoft365.tsx # Escena 2: Seguridad Total en la Nube (130f)
│   │   ├── SceneCloud.tsx        # Escena 3: Google Cloud + Azure (130f)
│   │   ├── SceneAI.tsx           # Escena 4: Agentes IA + orbitales (140f)
│   │   ├── SceneTransformation.tsx # Escena 5: Stats + proceso (130f)
│   │   └── SceneCTA.tsx          # Escena 6: CTA + contacto (130f)
│   │
│   └── components/
│       ├── GlassCard.tsx         # Tarjeta con glassmorphism + accent
│       ├── AnimatedCounter.tsx   # Contador numérico animado con spring
│       ├── NodeNetwork.tsx       # Red de nodos tipo grafo (fondo SceneCloud)
│       ├── TypeWriter.tsx        # Efecto typewriter para taglines
│       └── VideoBackground.tsx   # Overlay de video IA generado (fal.ai/LongCat)
│
├── agents/                       # Definiciones de los 3 agentes creativos
│   ├── risto-provocador.md       # Brand Architect — coherencia de marca
│   ├── gary-content-machine.md   # Content Machine — distribución social
│   └── pedro-arquitecto.md       # Attention Architect — viralidad
│
├── dashboard.js                  # Dashboard terminal en vivo — 8 agentes
├── generate-clips.js             # Generador de clips IA via fal.ai
├── run-longcat-local.sh          # Runner local de LongCat (requiere GPU)
└── package.json
```

---

## SPECS DEL VIDEO

| Parámetro | Valor |
|---|---|
| Resolución | 1920×1080 (Full HD) |
| FPS | 30 |
| Duración total | 720 frames = 24 segundos |
| Transiciones | 5 transiciones × 20 frames = fade/slide |
| Composición ID | `BeservicesVideo` |
| Fuentes | Montserrat (400–900) + Inter (300–700) via Google Fonts |

### Secuencia de escenas

```
SceneIntro (160f) →fade→ SceneMicrosoft365 (130f) →slide→ SceneCloud (130f)
→wipe→ SceneAI (140f) →slide→ SceneTransformation (130f) →fade→ SceneCTA (130f)
```

---

## BRANDING BESERVICES

### Sistema de Color "Tech-Clarity"

| Color | Hex | Uso |
|---|---|---|
| Background | `#080D18` | Fondo base (casi negro azulado) |
| Navy | `#001A41` | Fondos secundarios |
| **Cyan** | `#00D4FF` | Acento principal — textos destacados, bordes |
| CyanBright | `#00E5FF` | Elementos primarios en hover/activo |
| **Violet** | `#7B2FFF` | Acento secundario — gradientes, glows |
| Fuchsia | `#E040FB` | Acento terciario — decorativo |
| White | `#FFFFFF` | Textos principales |
| Muted | `rgba(255,255,255,0.55)` | Textos secundarios |
| Glass | `rgba(255,255,255,0.04)` | Fondo glassmorphism |

### Tipografía
- **Display / Títulos**: Montserrat (600, 700, 800, 900)
- **Body / UI**: Inter (400, 500, 600)

### Identidad visual
- Logo: Hexágono SVG con letra "B" — color cyan, glow effect
- Partners: Google Premier + Microsoft
- Tagline: "Transformamos negocios con tecnología" (u otras según escena)
- Estética: dark tech, glassmorphism, electric glow, premium corporate

---

## COMPONENTES REUTILIZABLES

### `GlassCard`
Tarjeta con fondo glassmorphism, borde semitransparente, y acento de color en un lado.
```tsx
<GlassCard accentColor={COLORS.cyan} accentPosition="left">
  <p>Contenido</p>
</GlassCard>
```

### `AnimatedCounter`
Contador numérico que anima de 0 a N con spring.
```tsx
<AnimatedCounter from={0} to={180} startFrame={30} suffix="+" />
```

### `TypeWriter`
Efecto typewriter letra a letra.
```tsx
<TypeWriter text="Transformamos negocios" startFrame={50} />
```

### `NodeNetwork`
Red de nodos animados en SVG (decorativo de fondo).
```tsx
<NodeNetwork opacity={0.3} />
```

### `VideoBackground`
Renderiza un clip MP4 generado por IA como fondo atmosférico.
```tsx
<VideoBackground clipId="cloud_bg" opacity={0.35} />
```
*Requiere que el clip esté en `public/clips/cloud_bg.mp4` y listado en `AVAILABLE_CLIPS`.*

---

## SISTEMA DE AGENTES (EQUIPO)

### Ver el equipo en tiempo real
```bash
node dashboard.js
```
Muestra un dashboard terminal con los 8 agentes, sus tareas, barras de progreso, y log de actividad en vivo. ~3 minutos de timeline animado.

### Los 8 agentes

| # | Nombre | Rol | Inspiración |
|---|---|---|---|
| 1 | Director de Arte | Diseño visual | — |
| 2 | Motion Designer | Animaciones | — |
| 3 | Brand Strategist | Estrategia | — |
| 4 | Sound Engineer | Audio | — |
| 5 | VFX Artist | Efectos | — |
| 6 | **Risto el Provocador** | Brand Architect | Risto Mejide |
| 7 | **Gary el Máquina** | Content Machine | Gary Vaynerchuk |
| 8 | **Pedro el Arquitecto** | Attention Architect | Pedro Buerbaum |

---

## GENERACIÓN DE VIDEO IA

### Opción A — fal.ai (recomendado, sin GPU)

fal.ai es la mejor API de video IA en 2026. Tiene LongCat, Kling, Wan y más de 600 modelos. **Nuevas cuentas reciben $10 en créditos gratis.**

```bash
# 1. Regístrate y obtén API key gratuita:
#    https://fal.ai/dashboard/keys

# 2. Configurar modelo:
export FAL_KEY="fal-xxxxxxxxxxxx"
export FAL_MODEL=wan       # Wan 2.6 — $0.05/seg — MÁS BARATO (6 clips ≈ $1.50)
# export FAL_MODEL=longcat # LongCat 13.6B Meituan — mejor calidad larga duración
# export FAL_MODEL=kling   # Kling 2.1 — calidad premium (~$0.30/seg)

# 3. Generar los 6 clips (uno por escena):
node generate-clips.js

# 4. Los clips se guardan en public/clips/
#    Activar en VideoBackground: editar AVAILABLE_CLIPS en src/components/VideoBackground.tsx
```

### Opción B — LongCat local (el modelo chino que tienes)

El modelo **LongCat-Video** de Meituan (13.6B params, MIT license) está clonado en:
```
C:\Users\Usuario\LongCat-Video\
```

**Requisitos para usarlo localmente:**
- GPU con 24GB+ VRAM (NVIDIA)
- conda env `longcat-video` (Python 3.10)
- Pesos descargados (~50GB) desde HuggingFace: `meituan-longcat/LongCat-Video`

```bash
# Una vez configurado:
bash run-longcat-local.sh
```

**En el PC actual NO está listo** (sin conda env, sin pesos, sin GPU CUDA detectada).

### Integrar clips generados en Remotion

Una vez generados los clips en `public/clips/`:

1. Editar `src/components/VideoBackground.tsx`
2. Añadir los IDs de clips a `AVAILABLE_CLIPS`:
```ts
const AVAILABLE_CLIPS = new Set<string>(['intro_bg', 'cloud_bg', 'ai_bg']);
```
3. Los clips aparecen automáticamente como fondo en las escenas correspondientes.

---

## SKILLS / METODOLOGÍAS DEL EQUIPO

Los 3 agentes creativos están basados en skills instalados en este Claude Code:

| Agent | Skill | Framework clave |
|---|---|---|
| Risto el Provocador | `risto-mejide-brand-architect` | Las 3R (Relevancia/Resonancia/Reputación), "Aporta o Aparta", Marca con Punto de Vista |
| Gary el Máquina | `gary-vee-content-machine` | Day Trading Attention, Content Pyramid (1 pillar → 30+ piezas), Jab/Right Hook |
| Pedro el Arquitecto | `pedro-buerbaum-attention-architect` | Atención como activo, 5 Detonadores de Viralidad, Pirámide de Audiencia |

Para invocarlos en Claude Code:
```
/risto-mejide-brand-architect
/gary-vee-content-machine
/pedro-buerbaum-attention-architect
```

---

## COMANDOS RÁPIDOS

```bash
# Ver el video en el editor
npm run dev
# → http://localhost:3000

# Ver el dashboard de agentes en vivo
node dashboard.js

# Generar clips de video IA (requiere FAL_KEY)
export FAL_KEY="fal-xxx"
node generate-clips.js

# Compilar el video a MP4
npm run build

# Lanzar LongCat local (cuando esté configurado)
bash run-longcat-local.sh
```

---

## CONTEXTO DE LA SESIÓN DE TRABAJO (Marzo 2026)

### Lo que se construyó

Esta sesión fue la **segunda de desarrollo** del video (la primera dejó la base en el repo `remotion`).

En esta sesión se hizo:
1. Descarga del repo base y análisis del proyecto existente
2. **Reescritura completa** de las 6 escenas con animaciones avanzadas (spring, interpolate, SVG draw-on, TypeWriter, glassmorphism)
3. Creación de **4 componentes reutilizables** (GlassCard, AnimatedCounter, NodeNetwork, TypeWriter)
4. Creación del **dashboard terminal** (`dashboard.js`) con 5 agentes técnicos
5. Investigación y selección de la mejor API de video IA: **fal.ai** con soporte a **LongCat** (Meituan), **Wan 2.6**, **Kling 2.1**
6. Integración de **LongCat-Video** (repo local descubierto en `~/LongCat-Video`)
7. Creación del script `generate-clips.js` multi-modelo
8. Creación del componente `VideoBackground.tsx` para Remotion
9. Incorporación de **3 nuevos agentes creativos** (Risto, Gary, Pedro) al equipo y al dashboard
10. Push a `beserviceshome.git`

### Estado actual del video

El video funciona al 100% con animaciones CSS/React. Los clips de video IA están **pendientes de generar** — requieren ejecutar `generate-clips.js` con un `FAL_KEY` válido.

### Próximos pasos sugeridos

- [ ] Obtener `FAL_KEY` gratuito en fal.ai y ejecutar `generate-clips.js` para generar los 6 fondos atmosféricos
- [ ] Activar `VideoBackground` en las escenas editando `AVAILABLE_CLIPS`
- [ ] Añadir audio/música de fondo (Remotion soporta `<Audio src={staticFile("music.mp3")} />`)
- [ ] Ajustar copy de las escenas con más datos reales de BeServices
- [ ] Exportar a MP4 con `npm run build` cuando esté listo
- [ ] Crear variantes de formato: 9:16 para Reels, 1:1 para LinkedIn
- [ ] Configurar LongCat local cuando haya GPU disponible (`run-longcat-local.sh`)

---

## NOTAS TÉCNICAS IMPORTANTES

- El video usa `@remotion/transitions` para transiciones entre escenas (`TransitionSeries`)
- Todos los `interpolate()` usan `extrapolateLeft/Right: 'clamp'` sin excepción
- Las animaciones de entrada usan `spring({ frame, fps, config: { damping, stiffness } })`
- Los componentes están tipados con `React.FC` y sin `any`
- Las fuentes se inyectan a nivel de `Root.tsx` via `document.createElement('style')`
- `staticFile()` de Remotion apunta a `/public/` — los clips van en `/public/clips/`

---

*Documento generado por Claude Sonnet 4.6 en colaboración con el equipo BeServices.*
