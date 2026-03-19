#!/bin/bash
# ─── LongCat-Video Local Runner ──────────────────────────────────────────────
# Runs LongCat locally at ~/LongCat-Video
# Requires: conda env + 24GB VRAM GPU + model weights downloaded
#
# Setup (one time):
#   cd ~/LongCat-Video
#   conda create -n longcat-video python=3.10 -y
#   conda activate longcat-video
#   pip install torch==2.6.0+cu124 torchvision==0.21.0+cu124 --index-url https://download.pytorch.org/whl/cu124
#   pip install ninja psutil packaging flash_attn==2.7.4.post1
#   pip install -r requirements.txt
#   huggingface-cli download meituan-longcat/LongCat-Video --local-dir ./weights/LongCat-Video
#
# Usage: bash run-longcat-local.sh

set -e
LONGCAT_DIR="$HOME/LongCat-Video"
WEIGHTS="$LONGCAT_DIR/weights/LongCat-Video"
OUT_DIR="$(dirname "$0")/public/clips"

mkdir -p "$OUT_DIR"

echo "╔══════════════════════════════════════════╗"
echo "║   LongCat-Video — Local Generator        ║"
echo "║   Meituan 13.6B — MIT License            ║"
echo "╚══════════════════════════════════════════╝"
echo ""

# Check weights
if [ ! -d "$WEIGHTS" ]; then
  echo "✗ Model weights not found at $WEIGHTS"
  echo ""
  echo "  Download with:"
  echo "  conda activate longcat-video"
  echo "  huggingface-cli download meituan-longcat/LongCat-Video --local-dir $WEIGHTS"
  echo ""
  echo "  Alternatively, use fal.ai (no GPU needed):"
  echo "  export FAL_KEY=your-key && FAL_MODEL=longcat node generate-clips.js"
  exit 1
fi

# Check conda env
if ! conda env list | grep -q longcat-video; then
  echo "✗ Conda env 'longcat-video' not found"
  echo "  Run setup commands in this script's comments first."
  exit 1
fi

conda activate longcat-video

cd "$LONGCAT_DIR"

# ─── BeServices clips to generate ─────────────────────────────────────────────
declare -A PROMPTS=(
  ["intro_bg"]="Cinematic aerial view of a smart city at night, glowing digital network connections, deep navy blue and electric cyan color palette, ultra smooth camera drift forward, 4K"
  ["cloud_bg"]="Abstract 3D cloud data center, glowing server racks, data streams flowing as light particles, dark background, electric blue and violet, smooth rotation, ultra cinematic"
  ["ai_bg"]="Neural network visualization in 3D space, glowing nodes connected by light beams, pulsing energy flow, black background, electric cyan and violet, smooth orbital camera"
  ["microsoft365_bg"]="Modern corporate office, glass walls, employees working on holographic Microsoft 365 screens, blue accent lighting, cinematic shallow depth of field, slow push-in"
  ["transformation_bg"]="Spanish business professionals in premium modern office, confident team looking at growth metrics on large screens, sunrise through floor-to-ceiling windows, cinematic"
  ["cta_bg"]="Abstract brand reveal, dark background with glowing concentric energy rings expanding outward, electric cyan and deep violet, premium motion graphics, smooth slow pulse"
)

for ID in "${!PROMPTS[@]}"; do
  OUT="$OUT_DIR/${ID}.mp4"
  if [ -f "$OUT" ]; then
    echo "✓ $ID already exists — skipping"
    continue
  fi

  echo "→ Generating $ID..."
  TMPOUT="$LONGCAT_DIR/output_${ID}.mp4"

  torchrun --nproc_per_node=1 run_demo_text_to_video.py \
    --checkpoint_dir "$WEIGHTS" \
    --prompt "${PROMPTS[$ID]}" \
    --output_path "$TMPOUT" \
    --height 720 \
    --width 1280 \
    --num_frames 150 \
    --fps 30 \
    2>&1

  if [ -f "$TMPOUT" ]; then
    cp "$TMPOUT" "$OUT"
    echo "✓ Saved to $OUT"
  else
    echo "✗ Generation failed for $ID"
  fi
done

echo ""
echo "Done! Open Remotion Studio: npm run dev (in remotion-beservices)"
