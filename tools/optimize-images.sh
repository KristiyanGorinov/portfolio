#!/usr/bin/env bash
# Builds the web-sized WebP copies the pages actually load.
# Originals are never modified. Re-run after adding a slide, certificate or photo:
#   bash tools/optimize-images.sh
# Requires ffmpeg (with libwebp) on PATH.
set -euo pipefail
cd "$(dirname "$0")/.."

# webp <src> <dest> <max-width> <quality>   (never upscales, skips up-to-date files)
webp() {
    local src="$1" dest="$2" width="$3" quality="$4"
    if [ ! -f "$src" ]; then echo "missing: $src" >&2; return 1; fi
    if [ -f "$dest" ] && [ "$dest" -nt "$src" ]; then return 0; fi
    mkdir -p "$(dirname "$dest")"
    ffmpeg -v error -y -i "$src" -vf "scale='min($width,iw)':-2:flags=lanczos" \
        -c:v libwebp -quality "$quality" -compression_level 6 -frames:v 1 "$dest"
    echo "  $dest"
}

# ---- awards carousel: "<desktop source>|<mobile source>" per slide, in slide order ----
SLIDES=(
    "1 tumb.png|1.png"
    "2 tumb.png|2.png"
    "3 tumb.png|3.png"
    "4 tumb.png|4.png"
    "5 tumb.png|5.png"
    "6 tumb.png|6.png"
    "7 tumb.png|7.png"
    "8 tumb.png|9.png"
    "9 tumb.png|8.png"
    "10 tumb.png|10.png"
    "11 tumb.png|11.png"
    "13.png|13.jpg"
)
echo "carousel slides"
n=0
for pair in "${SLIDES[@]}"; do
    n=$((n + 1)); id=$(printf '%02d' "$n")
    webp "img/activities/${pair%%|*}" "img/activities/opt/slide-$id-d.webp" 1920 82   # desktop background
    webp "img/activities/${pair##*|}" "img/activities/opt/slide-$id-m.webp" 900 82    # mobile background
    webp "img/activities/${pair##*|}" "img/activities/opt/slide-$id-t.webp" 300 78    # thumbnail strip
done

# ---- certificates: every numbered scan, in two widths for srcset ----
echo "certificates"
for src in sertificates/[0-9]*.png sertificates/[0-9]*.jpg; do
    name=$(basename "${src%.*}")
    webp "$src" "sertificates/opt/$name-600.webp" 600 78
    webp "$src" "sertificates/opt/$name-1200.webp" 1200 80
done

# ---- home page: "<source>|<output name>|<max width>" ----
HOME_IMAGES=(
    "img/kris snimki/kris snimki/15.3.2025/DSC03942-modified.png|hero|800"
    "img/kris snimki/kris snimki/15.3.2025/about-me.png|about-me|666"
    "img/kris snimki/snimki/3-30-2025/blog.png|proposal|666"
    "img/activities/Untitled design (18).png|flags-bg|894"
    "img/activities/erasmus.jpg|student-erasmus|1280"
    "img/activities/IMG-8464f8b8a0a16d60bf1793d23d3071c4-V.jpg|student-camp|1280"
    "img/activities/AUBG.jpg|student-aubg|1280"
    "img/blog/modeling.png|hobby-modeling|800"
    "img/blog/gym.jpg|hobby-gym|800"
    "img/blog/salsa.jpg|hobby-salsa|800"
    "img/activities/swimming.png|hobby-swimming|800"
    "img/blog/climbing.jpg|hobby-climbing|800"
    "img/blog/guitar.jpg|hobby-guitar|800"
    "img/kris snimki/kris snimki/15.3.2025/TFT.png|hobby-tft|752"
    "img/blog/books.jpg|hobby-books|800"
    "img/kris snimki/kris snimki/15.3.2025/Perfomalis.jpg|blog-perfomalis|900"
    "img/kris snimki/kris snimki/15.3.2025/BoulderCup.jpg|blog-bouldercup|900"
    "img/portfolio/trees.jpg|blog-trees|900"
    "img/portfolio/Interact.jpg|blog-interact|900"
    "img/kris snimki/kris snimki/15.3.2025/JA BULGARIA.jpg|blog-ja-bulgaria|900"
    "img/kris snimki/kris snimki/15.3.2025/IT Bulgarche.jpg|blog-it-bulgarche|900"
    "img/kris snimki/kris snimki/15.3.2025/Beach.jpg|blog-beach|900"
)
echo "home page"
for entry in "${HOME_IMAGES[@]}"; do
    IFS='|' read -r src name width <<< "$entry"
    webp "$src" "img/opt/$name.webp" "$width" 82
done

echo "done"
