#!/usr/bin/env node
/**
 * BeServices AI Video Clip Generator
 * Uses fal.ai (Wan 2.6 / Kling 2.1) — the best free API for AI video generation
 *
 * Setup:
 *   1. Get FREE credits at https://fal.ai/dashboard/keys (new accounts get $10 free)
 *   2. export FAL_KEY="your-key-here"
 *   3. node generate-clips.js
 *
 * Generated clips go to /public/clips/ and are picked up by Remotion automatically.
 */

const { fal } = require('@fal-ai/client');
const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

// ─── CONFIG ────────────────────────────────────────────────────────────────────
const FAL_KEY = process.env.FAL_KEY;
const OUT_DIR = path.join(__dirname, 'public', 'clips');
const MANIFEST_PATH = path.join(__dirname, 'public', 'clips-manifest.json');

// ─── MODEL OPTIONS ──────────────────────────────────────────────────────────────
//
//  FAL_MODEL=wan          Wan 2.6       ~$0.05/sec  | Fast, cheap, great quality
//  FAL_MODEL=longcat      LongCat       ~$0.10/sec  | Meituan 13.6B, up to 15min video (BEST)
//  FAL_MODEL=kling        Kling 2.1     ~$0.30/sec  | Premium commercial quality
//
//  LongCat is also installed locally at ~/LongCat-Video but requires:
//    - 24GB VRAM GPU + conda env setup + 50GB+ model weights from HuggingFace
//    - Run: bash run-longcat-local.sh  (after setup)
//
const MODEL_MAP = {
  wan:     'fal-ai/wan/v2.1/t2v',
  longcat: 'fal-ai/longcat-video/image-to-video/720p',  // LongCat hosted on fal.ai
  kling:   'fal-ai/kling-video/v2.1/standard/text-to-video',
};
const MODEL_KEY = process.env.FAL_MODEL || 'wan';
const MODEL = MODEL_MAP[MODEL_KEY] || MODEL_MAP.wan;

// ─── CLIPS DEFINITION ─────────────────────────────────────────────────────────
// Each clip designed with Risto (brand POV) + Pedro (virality triggers) methodology
const CLIPS = [
  {
    id: 'intro_bg',
    scene: 'SceneIntro',
    duration: 6,
    prompt:
      'Cinematic aerial view of a smart city at night, glowing digital network connections flowing between buildings, deep navy blue and electric cyan color palette, ultra smooth camera drift forward, 4K premium tech aesthetic, no people, no text',
    negative_prompt: 'text, watermark, logo, blurry, shaky, low quality, cartoon',
  },
  {
    id: 'microsoft365_bg',
    scene: 'SceneMicrosoft365',
    duration: 5,
    prompt:
      'Modern corporate office interior, glass walls, employees working on holographic screens showing Microsoft 365 dashboards, clean minimalist design, blue accent lighting, cinematic shallow depth of field, smooth slow push-in',
    negative_prompt: 'text, watermark, logo, blurry, shaky, low quality',
  },
  {
    id: 'cloud_bg',
    scene: 'SceneCloud',
    duration: 5,
    prompt:
      'Abstract 3D cloud data center visualization, glowing server racks, data streams flowing upward as light particles, dark background, electric blue and violet tones, smooth rotation, ultra cinematic',
    negative_prompt: 'text, watermark, logo, blurry, cartoon, low quality',
  },
  {
    id: 'ai_bg',
    scene: 'SceneAI',
    duration: 5,
    prompt:
      'Neural network visualization in 3D space, glowing nodes connected by light beams, pulsing energy flow, deep black background, electric cyan and violet colors, smooth orbital camera movement, ultra high definition',
    negative_prompt: 'text, watermark, logo, blurry, cartoon, low quality',
  },
  {
    id: 'transformation_bg',
    scene: 'SceneTransformation',
    duration: 5,
    prompt:
      'Spanish business professionals in a premium modern office, confident team looking at large data screens showing growth metrics, sunrise through floor-to-ceiling windows, warm gold and cool blue tones, cinematic documentary style',
    negative_prompt: 'text, watermark, logo, blurry, amateur, low quality',
  },
  {
    id: 'cta_bg',
    scene: 'SceneCTA',
    duration: 6,
    prompt:
      'Abstract corporate brand reveal, dark background with glowing concentric energy rings expanding outward, electric cyan and deep violet, premium motion graphics aesthetic, smooth slow pulse, no objects just pure light energy',
    negative_prompt: 'text, watermark, logo, blurry, cartoon, low quality',
  },
];

// ─── UTILS ─────────────────────────────────────────────────────────────────────
const RESET = '\x1b[0m';
const CYAN = '\x1b[36m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const MAGENTA = '\x1b[35m';
const RED = '\x1b[31m';
const BOLD = '\x1b[1m';

function log(color, prefix, msg) {
  console.log(`${color}${BOLD}[${prefix}]${RESET} ${msg}`);
}

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const proto = url.startsWith('https') ? https : http;
    const file = fs.createWriteStream(dest);
    proto
      .get(url, (res) => {
        if (res.statusCode === 301 || res.statusCode === 302) {
          file.close();
          downloadFile(res.headers.location, dest).then(resolve).catch(reject);
          return;
        }
        res.pipe(file);
        file.on('finish', () => file.close(resolve));
      })
      .on('error', (err) => {
        fs.unlink(dest, () => {});
        reject(err);
      });
  });
}

function progressBar(pct, width = 20) {
  const filled = Math.round((pct / 100) * width);
  return '█'.repeat(filled) + '░'.repeat(width - filled);
}

// ─── MAIN ──────────────────────────────────────────────────────────────────────
async function main() {
  console.clear();
  console.log(`\n${BOLD}${CYAN}╔══════════════════════════════════════════════════════╗${RESET}`);
  console.log(`${BOLD}${CYAN}║   BeServices AI Video Generator — powered by fal.ai  ║${RESET}`);
  console.log(`${BOLD}${CYAN}╚══════════════════════════════════════════════════════╝${RESET}\n`);

  // Check API key
  if (!FAL_KEY) {
    console.log(`${RED}${BOLD}✗ FAL_KEY not set!${RESET}`);
    console.log(`\n  1. Get FREE credits at ${CYAN}https://fal.ai/dashboard/keys${RESET}`);
    console.log(`  2. Run: ${YELLOW}export FAL_KEY="fal-xxxxxxxx"${RESET}`);
    console.log(`  3. Run: ${YELLOW}node generate-clips.js${RESET}\n`);
    console.log(`  Using model: ${MAGENTA}${MODEL}${RESET}`);
    console.log(`  Cost estimate: ~${GREEN}$0.25–$1.50 total${RESET} for all 6 clips\n`);

    // Write demo manifest so Remotion knows clips aren't ready yet
    if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });
    const demo = { generated: false, clips: {}, model: MODEL, note: 'Run generate-clips.js with FAL_KEY to generate real AI video clips' };
    fs.writeFileSync(MANIFEST_PATH, JSON.stringify(demo, null, 2));
    log(YELLOW, 'INFO', 'Demo manifest written — Remotion will use animated backgrounds until clips are generated.');
    return;
  }

  // Configure fal client
  fal.config({ credentials: FAL_KEY });

  // Ensure output dir exists
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

  const manifest = { generated: true, clips: {}, model: MODEL, generatedAt: new Date().toISOString() };
  const results = [];

  log(CYAN, 'START', `Generating ${CLIPS.length} clips with ${MAGENTA}${MODEL}${RESET}`);
  log(YELLOW, 'COST', `Estimated cost: ~$${(CLIPS.length * 5 * 0.05).toFixed(2)}–$${(CLIPS.length * 5 * 0.30).toFixed(2)} total\n`);

  for (let i = 0; i < CLIPS.length; i++) {
    const clip = CLIPS[i];
    const outPath = path.join(OUT_DIR, `${clip.id}.mp4`);

    // Skip if already generated
    if (fs.existsSync(outPath)) {
      log(GREEN, 'SKIP', `${clip.id} already exists — skipping`);
      manifest.clips[clip.id] = { scene: clip.scene, file: `clips/${clip.id}.mp4`, status: 'cached' };
      continue;
    }

    console.log(`\n${BOLD}[${i + 1}/${CLIPS.length}]${RESET} ${CYAN}${clip.scene}${RESET} → ${clip.id}`);
    console.log(`  ${YELLOW}Prompt:${RESET} ${clip.prompt.substring(0, 80)}...`);

    try {
      let lastProgress = 0;

      const result = await fal.subscribe(MODEL, {
        input: {
          prompt: clip.prompt,
          negative_prompt: clip.negative_prompt,
          duration: clip.duration,
          // Wan 2.6 params
          num_inference_steps: 30,
          guidance_scale: 7.5,
          // Kling params (used if model is kling)
          aspect_ratio: '16:9',
        },
        logs: true,
        onQueueUpdate(update) {
          if (update.status === 'IN_PROGRESS' && update.logs) {
            const last = update.logs[update.logs.length - 1];
            if (last && last.message) {
              const pct = last.message.match(/(\d+)%/)?.[1];
              if (pct && pct !== String(lastProgress)) {
                lastProgress = Number(pct);
                process.stdout.write(`\r  ${progressBar(lastProgress)} ${lastProgress}%   `);
              }
            }
          }
        },
      });

      process.stdout.write('\n');

      // Extract video URL from result (fal.ai response format varies by model)
      const videoUrl =
        result?.data?.video?.url ||
        result?.data?.video_url ||
        result?.data?.videos?.[0]?.url ||
        result?.video?.url;

      if (!videoUrl) {
        log(RED, 'ERROR', `No video URL in response for ${clip.id}`);
        log(YELLOW, 'DEBUG', JSON.stringify(result?.data || result, null, 2).substring(0, 300));
        manifest.clips[clip.id] = { scene: clip.scene, status: 'failed' };
        continue;
      }

      log(CYAN, 'DOWNLOAD', `Saving ${clip.id}.mp4...`);
      await downloadFile(videoUrl, outPath);

      const size = (fs.statSync(outPath).size / 1024 / 1024).toFixed(1);
      log(GREEN, 'DONE', `${clip.id}.mp4 saved (${size} MB)`);

      manifest.clips[clip.id] = {
        scene: clip.scene,
        file: `clips/${clip.id}.mp4`,
        status: 'ready',
        url: videoUrl,
      };
      results.push(clip.id);
    } catch (err) {
      log(RED, 'ERROR', `Failed to generate ${clip.id}: ${err.message}`);
      manifest.clips[clip.id] = { scene: clip.scene, status: 'failed', error: err.message };
    }
  }

  // Write manifest
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));

  console.log(`\n${BOLD}${GREEN}╔══════════════════════════════╗${RESET}`);
  console.log(`${BOLD}${GREEN}║  Generation complete!         ║${RESET}`);
  console.log(`${BOLD}${GREEN}╚══════════════════════════════╝${RESET}`);
  console.log(`  ${GREEN}✓${RESET} ${results.length}/${CLIPS.length} clips generated`);
  console.log(`  ${CYAN}→${RESET} Manifest: ${MANIFEST_PATH}`);
  console.log(`  ${CYAN}→${RESET} Clips: ${OUT_DIR}`);
  console.log(`\n  Open Remotion Studio to see the updated video:`);
  console.log(`  ${YELLOW}npm run dev${RESET}\n`);
}

main().catch((err) => {
  console.error(`\n${RED}Fatal error:${RESET}`, err);
  process.exit(1);
});
