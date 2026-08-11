#!/usr/bin/env bash
# strip-image-metadata.sh
# Removes all embedded metadata (EXIF, XMP, IPTC, Content Credentials) from
# every image in public/images/ so browsers don't show the "cr" Content
# Credentials pin over AI-generated images.
#
# Run automatically as a prebuild / predev step via package.json scripts.
# Safe to run repeatedly — magick mogrify -strip is idempotent.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
IMAGES_DIR="$SCRIPT_DIR/../public/images"

if [ ! -d "$IMAGES_DIR" ]; then
  echo "[strip-image-metadata] Directory not found: $IMAGES_DIR — skipping."
  exit 0
fi

# Collect all image files
mapfile -t images < <(find "$IMAGES_DIR" -maxdepth 1 -type f \( \
  -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" -o \
  -iname "*.webp" -o -iname "*.avif" -o -iname "*.gif" \
\))

if [ ${#images[@]} -eq 0 ]; then
  echo "[strip-image-metadata] No images found — nothing to do."
  exit 0
fi

echo "[strip-image-metadata] Stripping metadata from ${#images[@]} image(s)…"
failed=0
for img in "${images[@]}"; do
  if ! magick mogrify -strip "$img" 2>/dev/null; then
    echo "[strip-image-metadata] WARNING: could not strip $img (corrupt or unreadable) — skipping."
    failed=$((failed + 1))
  fi
done
echo "[strip-image-metadata] Done (${failed} skipped)."
# Never block dev/build on a bad image — the pin is cosmetic.
exit 0
