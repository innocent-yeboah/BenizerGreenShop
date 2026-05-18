/**
 * Raster favicons / PWA icons from public/branding/benizer-seal.png (transparent circular seal).
 * Run npm run brand:assets after replacing seal-screenshot.jpg / re-extracting the seal.
 */
import { existsSync } from "fs";
import { join } from "path";
import sharp from "sharp";

const root = process.cwd();
const src = join(root, "public/branding/benizer-seal.png");
const transparent = { r: 0, g: 0, b: 0, alpha: 0 };

if (!existsSync(src)) {
  console.error("Missing seal source:", src);
  process.exit(1);
}

async function writeIcon(filename, size) {
  await sharp(src)
    .resize(size, size, { fit: "contain", background: transparent })
    .png()
    .toFile(join(root, "public", filename));
}

await writeIcon("favicon-32.png", 32);
await writeIcon("apple-touch-icon.png", 180);
await writeIcon("icon-192.png", 192);

console.log("Wrote public/favicon-32.png, apple-touch-icon.png, icon-192.png");
