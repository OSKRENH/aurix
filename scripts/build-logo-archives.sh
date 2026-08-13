#!/usr/bin/env bash
set -euo pipefail

ROOT="${1:-.}"
LOGOS_DIR="$ROOT/assets/logos"
DOWNLOADS_DIR="$ROOT/downloads"
BUILD_DIR="/tmp/AURIX_Logos_All_Formats"

rm -rf "$BUILD_DIR"
mkdir -p "$DOWNLOADS_DIR" "$BUILD_DIR"
ABS_DOWNLOADS="$(cd "$DOWNLOADS_DIR" && pwd)"

export_asset() {
  local input="$1"
  local output_dir="$2"
  local base_name="$3"
  local png_width="${4:-2400}"

  mkdir -p "$output_dir"
  cp "$input" "$output_dir/$base_name.svg"

  inkscape "$input" \
    --export-type=png \
    --export-filename="$output_dir/$base_name.png" \
    --export-background-opacity=0 \
    --export-width="$png_width" >/dev/null 2>&1

  inkscape "$input" \
    --export-type=pdf \
    --export-filename="$output_dir/$base_name.pdf" >/dev/null 2>&1

  if ! inkscape "$input" \
    --export-type=eps \
    --export-filename="$output_dir/$base_name.eps" >/dev/null 2>&1; then
    pdftops -eps "$output_dir/$base_name.pdf" "$output_dir/$base_name.eps"
  fi

  test -s "$output_dir/$base_name.svg"
  test -s "$output_dir/$base_name.png"
  test -s "$output_dir/$base_name.pdf"
  test -s "$output_dir/$base_name.eps"
}

make_tone_svg() {
  local source="$1"
  local color="$2"
  local output="$3"

  python3 - "$source" "$color" "$output" <<'PY'
from pathlib import Path
import sys

source, color, output = sys.argv[1:]
text = Path(source).read_text(encoding='utf-8')
for old in ('#1F0048', '#1f0048', '#1F0048FF', '#1f0048ff'):
    text = text.replace(old, color)
Path(output).write_text(text, encoding='utf-8')
PY
}

declare -A TYPE_SOURCE=(
  [With_Descriptor]="aurix-discover-stars.svg"
  [Wordmark]="wordmark-purple.svg"
  [Symbol]="symbol-purple.svg"
)

declare -A TYPE_LABEL=(
  [With_Descriptor]="AURIX_With_Descriptor"
  [Wordmark]="AURIX_Wordmark"
  [Symbol]="AURIX_Symbol"
)

declare -A COLORS=(
  [Deep_Purple]="#1F0048"
  [White]="#FFFFFF"
)

rm -f \
  "$ABS_DOWNLOADS/AURIX_Logos_All_Formats.zip" \
  "$ABS_DOWNLOADS/AURIX_Logos.zip" \
  "$ABS_DOWNLOADS"/AURIX_With_Descriptor_*.zip \
  "$ABS_DOWNLOADS"/AURIX_Wordmark_*.zip \
  "$ABS_DOWNLOADS"/AURIX_Symbol_*.zip

for type in With_Descriptor Wordmark Symbol; do
  source="$LOGOS_DIR/${TYPE_SOURCE[$type]}"
  test -s "$source"

  for tone in Deep_Purple White; do
    generated="/tmp/aurix-${type}-${tone}.svg"
    make_tone_svg "$source" "${COLORS[$tone]}" "$generated"
    target="$BUILD_DIR/$type/$tone"
    base_name="${TYPE_LABEL[$type]}_${tone}"

    if [[ "$type" == "Symbol" ]]; then
      export_asset "$generated" "$target" "$base_name" 1600
    else
      export_asset "$generated" "$target" "$base_name" 2400
    fi

    # Per-card download: selected type + selected color, exactly SVG / PNG / PDF.
    zip -jq "$ABS_DOWNLOADS/$base_name.zip" \
      "$target/$base_name.svg" \
      "$target/$base_name.png" \
      "$target/$base_name.pdf"
    unzip -t "$ABS_DOWNLOADS/$base_name.zip" >/dev/null
    per_count=$(unzip -Z1 "$ABS_DOWNLOADS/$base_name.zip" | grep -E '\.(svg|png|pdf)$' | wc -l)
    test "$per_count" -eq 3
  done
done

cat > "$BUILD_DIR/README.txt" <<'EOF'
AURIX — логотипы и фирменный символ в двух разрешённых цветах.

Типы:
With_Descriptor — логотип AURIX + DISCOVER STARS
Wordmark — логотип AURIX без дескриптора
Symbol — фирменный знак AURIX

Форматы полного архива:
SVG — редактируемый вектор
PNG — прозрачный фон
EPS — вектор для профессиональной печати
PDF — универсальный векторный формат

Индивидуальные архивы каждой карточки содержат SVG, PNG и PDF выбранного цвета.

Цвета логотипа:
Deep_Purple — #1F0048
White — #FFFFFF

Не изменяйте пропорции и взаимное расположение элементов логотипа.
EOF

(
  cd /tmp
  zip -qr "$ABS_DOWNLOADS/AURIX_Logos_All_Formats.zip" "$(basename "$BUILD_DIR")"
)

cp "$ABS_DOWNLOADS/AURIX_Logos_All_Formats.zip" "$ABS_DOWNLOADS/AURIX_Logos.zip"

unzip -t "$ABS_DOWNLOADS/AURIX_Logos_All_Formats.zip" >/dev/null
unzip -t "$ABS_DOWNLOADS/AURIX_Logos.zip" >/dev/null

test -s "$ABS_DOWNLOADS/AURIX_Logos_All_Formats.zip"
test -s "$ABS_DOWNLOADS/AURIX_Logos.zip"

# 3 types × 2 colors × 4 formats = 24 exported files, plus README.
count=$(unzip -Z1 "$ABS_DOWNLOADS/AURIX_Logos_All_Formats.zip" | grep -E '\.(svg|png|pdf|eps)$' | wc -l)
test "$count" -eq 24

# 3 types × 2 colors = 6 independent selected-color archives.
archive_count=$(find "$ABS_DOWNLOADS" -maxdepth 1 -type f \( -name 'AURIX_With_Descriptor_*.zip' -o -name 'AURIX_Wordmark_*.zip' -o -name 'AURIX_Symbol_*.zip' \) | wc -l)
test "$archive_count" -eq 6
