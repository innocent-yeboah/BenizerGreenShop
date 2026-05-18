/**
 * Build a transparent circular PNG from the full-page screenshot asset.
 *
 * Reads (first match): seal-screenshot.jpg | .jpeg | .png under public/branding/
 * If those are missing but benizer-seal.png is a wide screenshot, backs up to
 * seal-screenshot.jpg once, then extracts from that backup.
 *
 * Output: public/branding/benizer-seal.png
 *
 * Env tuning (optional):
 *   SEAL_CENTER_Y_RATIO=0.50 SEAL_BOX_RATIO=0.68 node scripts/extract-brand-seal.mjs
 */
import { existsSync } from "fs";
import { join } from "path";
import sharp from "sharp";

const root = process.cwd();
const brandingDir = join(root, "public/branding");
const outPath = join(brandingDir, "benizer-seal.png");

async function resolveSourcePath() {
  const screenshotNames = ["seal-screenshot.jpg", "seal-screenshot.jpeg", "seal-screenshot.png"];
  for (const n of screenshotNames) {
    const p = join(brandingDir, n);
    if (existsSync(p)) return p;
  }

  const legacy = join(brandingDir, "benizer-seal.png");
  if (!existsSync(legacy)) return null;

  const meta = await sharp(legacy).metadata();
  const w = meta.width ?? 1;
  const h = meta.height ?? 1;
  const ar = w / h;

  if (ar > 0.92 && ar < 1.08 && meta.hasAlpha) {
    console.log("benizer-seal.png already looks like an extracted seal (square + alpha). Nothing to do.");
    process.exit(0);
  }

  if (ar > 1.35) {
    const backup = join(brandingDir, "seal-screenshot.jpg");
    await sharp(legacy).jpeg({ quality: 93 }).toFile(backup);
    console.log(`Backed up wide screenshot → ${backup}`);
    return backup;
  }

  return legacy;
}

async function extractCircularSeal(srcPath) {
  const meta = await sharp(srcPath).metadata();
  const W = meta.width ?? 0;
  const H = meta.height ?? 0;
  if (!W || !H) throw new Error(`Could not read dimensions: ${srcPath}`);

  const cyRatio = Number(process.env.SEAL_CENTER_Y_RATIO ?? "0.50");
  const boxRatio = Number(process.env.SEAL_BOX_RATIO ?? "0.68");

  const box = Math.round(Math.min(W, H) * boxRatio);
  const cx = Math.round(W / 2);
  const cy = Math.round(H * cyRatio);
  let left = Math.round(cx - box / 2);
  let top = Math.round(cy - box / 2);
  left = Math.max(0, Math.min(left, W - box));
  top = Math.max(0, Math.min(top, H - box));

  const extractSize = Math.min(box, W - left, H - top);

  const square = await sharp(srcPath).extract({ left, top, width: extractSize, height: extractSize }).toBuffer();

  const exportSide = Math.min(
    900,
    Math.max(Math.round(extractSize * 2.35), Math.min(560, extractSize * 2)),
  );

  const resized = await sharp(square)
    .resize(exportSide, exportSide, {
      kernel: sharp.kernel.lanczos3,
      fit: "fill",
    })
    .ensureAlpha()
    .toBuffer();

  const feather = Math.max(1, Math.round(exportSide * 0.004));
  const r = exportSide / 2 - feather;
  const maskSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${exportSide}" height="${exportSide}">
  <circle cx="${exportSide / 2}" cy="${exportSide / 2}" r="${r}" fill="#ffffff"/>
</svg>`;

  const mask = await sharp(Buffer.from(maskSvg)).resize(exportSide, exportSide).blur(0.65).ensureAlpha().png().toBuffer();

  await sharp(resized)
    .composite([{ input: mask, blend: "dest-in" }])
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toFile(outPath);

  console.log(`Wrote ${outPath} (${exportSide}px) from ${srcPath} crop [${left},${top}] ${extractSize}px`);
}

async function main() {
  const srcPath = await resolveSourcePath();
  if (!srcPath) {
    console.error(
      "No source image found. Add public/branding/seal-screenshot.jpg (full-page screenshot), or restore benizer-seal.png.",
    );
    process.exit(1);
  }

  await extractCircularSeal(srcPath);
}

await main();
