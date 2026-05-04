/**
 * Crops the bottom strip off MiiraCare promo packshots where "Revoobit Store"
 * + social icons appear (fixed template footer).
 *
 * Usage: npm run strip:product-footers
 * Tune: STRIP_BOTTOM_PERCENT=12 npm run strip:product-footers
 *
 * Do not run twice on the same files without restoring originals — each pass crops again.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const productsDir = path.join(root, "public", "products");

/** Primary catalogue images that share the legacy footer strip */
const FILES = [
  "miira-cell-plus-1.jpg",
  "miira-life-1.png",
  "miira-curve-1.jpg",
  "miira-phyll-1.jpg",
  "miira-lanang-1.jpg",
  "miira-coffee-1.png",
  "miira-wedok-1.jpg",
];

function parsePercent() {
  const env = process.env.STRIP_BOTTOM_PERCENT;
  if (env && !Number.isNaN(Number(env))) return Number(env);
  const arg = process.argv.find((a) => a.startsWith("--percent="));
  if (arg) {
    const n = Number(arg.split("=")[1]);
    if (!Number.isNaN(n)) return n;
  }
  return 11;
}

async function stripOne(filePath, bottomPercent) {
  const meta = await sharp(filePath).metadata();
  const w = meta.width;
  const h = meta.height;
  if (!w || !h) throw new Error(`No dimensions: ${filePath}`);

  const newH = Math.max(1, Math.floor(h * (1 - bottomPercent / 100)));
  if (newH >= h) {
    console.warn(`Skip ${path.basename(filePath)} (crop would not shrink)`);
    return;
  }

  const tmp = `${filePath}.tmp`;

  let pipeline = sharp(filePath).extract({
    left: 0,
    top: 0,
    width: w,
    height: newH,
  });

  const low = filePath.toLowerCase();
  if (low.endsWith(".png")) {
    pipeline = pipeline.png({ compressionLevel: 9 });
  } else if (low.endsWith(".webp")) {
    pipeline = pipeline.webp({ quality: 92 });
  } else {
    pipeline = pipeline.jpeg({ quality: 92, mozjpeg: true });
  }

  await pipeline.toFile(tmp);
  fs.renameSync(tmp, filePath);
  console.log(
    `Stripped bottom ${bottomPercent}% (${h}px → ${newH}px): ${path.basename(filePath)}`,
  );
}

async function main() {
  const pct = parsePercent();
  if (pct <= 0 || pct >= 40) {
    console.error("STRIP_BOTTOM_PERCENT must be between 1 and 39");
    process.exit(1);
  }

  if (!fs.existsSync(productsDir)) {
    console.error(`Missing folder: ${productsDir}`);
    process.exit(1);
  }

  let processed = 0;
  for (const name of FILES) {
    const fp = path.join(productsDir, name);
    if (!fs.existsSync(fp)) {
      console.warn(`Missing (skipped): ${name}`);
      continue;
    }
    await stripOne(fp, pct);
    processed += 1;
  }

  if (processed === 0) {
    console.warn("No Miira product images found under public/products — nothing to do.");
    process.exit(0);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
