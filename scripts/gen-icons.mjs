/**
 * Generates the FitTrack app icon set from inline SVG — a lime barbell on a dark
 * background, matching the animated splash. Run: `node scripts/gen-icons.mjs`.
 *
 * Outputs (1024² unless noted):
 *   assets/images/icon.png                  full badge (iOS + base icon)
 *   assets/images/android-icon-foreground.png   barbell glyph, transparent (adaptive)
 *   assets/images/android-icon-background.png    solid dark fill (adaptive)
 *   assets/images/android-icon-monochrome.png    white glyph, transparent (themed)
 *   assets/images/splash-icon.png            barbell glyph, transparent (native splash)
 *   assets/images/favicon.png  (196²)        full badge, small
 */
import sharp from "sharp";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "assets", "images");

const LIME = "#A3E635";
const DARK = "#0A0C0B";
const SIZE = 1024;
const C = SIZE / 2;

// Barbell built from rounded rects, vertically centered. Left side is specified
// then mirrored across the canvas for perfect symmetry.
const LEFT = [
  { x: 250, w: 34, h: 120, r: 14 }, // outer end cap
  { x: 292, w: 46, h: 250, r: 20 }, // big plate
  { x: 346, w: 32, h: 172, r: 14 }, // inner plate
];
const HANDLE = { x: 378, w: 268, h: 46, r: 23 };

function rect({ x, w, h, r }, fill) {
  const y = C - h / 2;
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}"/>`;
}

function barbell(fill) {
  const parts = [];
  for (const p of LEFT) {
    parts.push(rect(p, fill));
    // mirror: x' = SIZE - (x + w)
    parts.push(rect({ ...p, x: SIZE - (p.x + p.w) }, fill));
  }
  parts.push(rect(HANDLE, fill));
  return `<g>${parts.join("")}</g>`;
}

// Full badge: dark gradient + soft lime glow + barbell.
const badgeSvg = `
<svg width="${SIZE}" height="${SIZE}" viewBox="0 0 ${SIZE} ${SIZE}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#14181A"/>
      <stop offset="1" stop-color="${DARK}"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="${LIME}" stop-opacity="0.35"/>
      <stop offset="0.6" stop-color="${LIME}" stop-opacity="0.08"/>
      <stop offset="1" stop-color="${LIME}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${SIZE}" height="${SIZE}" fill="url(#bg)"/>
  <ellipse cx="${C}" cy="${C}" rx="430" ry="300" fill="url(#glow)"/>
  ${barbell(LIME)}
</svg>`;

// Transparent glyph (barbell only) for adaptive foreground + splash.
function glyphSvg(fill, scale = 1) {
  return `
<svg width="${SIZE}" height="${SIZE}" viewBox="0 0 ${SIZE} ${SIZE}" xmlns="http://www.w3.org/2000/svg">
  <g transform="translate(${C} ${C}) scale(${scale}) translate(${-C} ${-C})">
    ${barbell(fill)}
  </g>
</svg>`;
}

const solidSvg = `<svg width="${SIZE}" height="${SIZE}" xmlns="http://www.w3.org/2000/svg"><rect width="${SIZE}" height="${SIZE}" fill="${DARK}"/></svg>`;

async function png(svg, file, size = SIZE) {
  await sharp(Buffer.from(svg)).resize(size, size).png().toFile(join(OUT, file));
  console.log("wrote", file, `(${size}²)`);
}

await png(badgeSvg, "icon.png");
await png(glyphSvg(LIME, 1), "android-icon-foreground.png");
await png(solidSvg, "android-icon-background.png");
await png(glyphSvg("#FFFFFF", 1), "android-icon-monochrome.png");
await png(glyphSvg(LIME, 1.15), "splash-icon.png");
await png(badgeSvg, "favicon.png", 196);
console.log("done");
