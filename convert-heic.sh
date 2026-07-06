#!/bin/bash
SRC="$HOME/Downloads/China Photos 2026/China Photos  - ALL GOOD ONES"
DEST="$HOME/Documents/GitHub/irina-love/website_source/uploads/photography/streets-raw"

mkdir -p "$DEST"
CONVERTED=0

while IFS= read -r -d '' f; do
  base=$(basename "${f%.*}")
  out="$DEST/$base.jpg"

  # Step 1: convert format (HEIC→JPG or JPG copy)
  sips -s format jpeg "$f" --out "$out"
  if [ $? -ne 0 ]; then
    echo "ERR converting $(basename "$f")"; continue
  fi

  # Step 2: resize in place if longer side > 1600
  sips -Z 1600 "$out"

  echo "ok  $base.jpg"
  ((CONVERTED++))
done < <(find "$SRC" -maxdepth 1 -type f \( -iname "*.heic" -o -iname "*.jpg" -o -iname "*.jpeg" \) -print0)

echo ""
echo "Done — $CONVERTED files → $DEST"
