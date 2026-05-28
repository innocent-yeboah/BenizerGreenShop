/**
 * Hero slider image pipeline.
 *
 * Strips third-party branding bands from each source graphic so the central
 * product composition (which is the MiiraCare product line Benizer Green Shop
 * legitimately distributes) remains intact while competing brand marks
 * (Revoobit logo, 5ighter Challenge mark, MiiraCarehq social handles, and
 * regulatory disclaimer line) are cropped away.
 *
 * Reads from: scripts/hero-source/*.png
 * Writes to:  public/images/hero-slides/*.{webp,jpg}
 *
 * Each slide preserves its natural aspect (no forced 16:10) because they are
 * displayed as cards inside the hero — never full-bleed.
 */
import { existsSync } from "node:fs";
import { mkdir } from "node:fs/promises";
import { join } from "node:path";
import sharp from "sharp";

const root = process.cwd();
const srcDir = join(root, "scripts", "hero-source");
const outDir = join(root, "public", "images", "hero-slides");

const MAX_WIDTH = 1100;

/**
 * Crop ratios are tuned per source after inspecting the watermark positions:
 *   - top: Revoobit logo + 5ighter Challenge mark band
 *   - bottom: MiiraCarehq social handles + disclaimer footer
 *   - right: tight crop for the all-products mosaic (Revoobit bug top-right)
 */
const slides = [
  {
    label: "Cell Power",
    src: "cell-power.png",
    out: "slide-1-cell-power",
    cropTop: 0.085,
    cropBottom: 0.125,
    cropLeft: 0,
    cropRight: 0,
  },
  {
    label: "Gut Health",
    src: "gut-health.png",
    out: "slide-2-gut-health",
    cropTop: 0.06,
    cropBottom: 0.125,
    cropLeft: 0,
    cropRight: 0,
  },
  {
    label: "Miira Coffee",
    src: "miira-coffee.png",
    out: "slide-3-coffee",
    cropTop: 0.02,
    cropBottom: 0.08,
    cropLeft: 0,
    cropRight: 0,
  },
  {
    label: "Product Range",
    src: "product-range.png",
    out: "slide-4-range",
    cropTop: 0.04,
    cropBottom: 0.02,
    cropLeft: 0,
    cropRight: 0.085,
  },
];

async function processSlide(slide) {
  const srcPath = join(srcDir, slide.src);
  if (!existsSync(srcPath)) {
    console.warn(`· Skipped (missing source): ${slide.src}`);
    return;
  }

  const meta = await sharp(srcPath).metadata();
  const W = meta.width ?? 0;
  const H = meta.height ?? 0;
  if (!W || !H) return;

  const top = Math.round(H * slide.cropTop);
  const left = Math.round(W * slide.cropLeft);
  const width = Math.max(1, Math.round(W * (1 - slide.cropLeft - slide.cropRight)));
  const height = Math.max(1, Math.round(H * (1 - slide.cropTop - slide.cropBottom)));

  const cropped = sharp(srcPath).extract({ left, top, width, height });

  const targetWidth = Math.min(MAX_WIDTH, width);
  const targetHeight = Math.round(height * (targetWidth / width));

  const resized = cropped.resize(targetWidth, targetHeight, {
    kernel: sharp.kernel.lanczos3,
    fit: "fill",
  });

  const jpegOut = join(outDir, `${slide.out}.jpg`);
  const webpOut = join(outDir, `${slide.out}.webp`);

  await resized
    .clone()
    .jpeg({ quality: 86, mozjpeg: true, chromaSubsampling: "4:4:4" })
    .toFile(jpegOut);

  await resized.clone().webp({ quality: 84, effort: 5 }).toFile(webpOut);

  console.log(
    `✓ ${slide.out}  ${W}x${H} → crop ${width}x${height} → out ${targetWidth}x${targetHeight}`,
  );
}

async function main() {
  if (!existsSync(srcDir)) {
    console.error(`Missing source directory: ${srcDir}`);
    process.exit(1);
  }

  await mkdir(outDir, { recursive: true });
  for (const slide of slides) {
    await processSlide(slide);
  }
  console.log(`\nDone. Output: ${outDir}`);
}

await main();
