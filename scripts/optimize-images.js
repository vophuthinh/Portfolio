import sharp from "sharp";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

async function convert() {
  // Portfolio images: JPEG → WebP, resize to 1200px width
  const portfolioFiles = ["Chatbot D-Day 2025", "Lyly Assistant", "Soc Do La"];
  for (const name of portfolioFiles) {
    const input = path.join(root, "assets/images/portfolio", name + ".jpeg");
    const output = path.join(root, "assets/images/portfolio", name + ".webp");
    if (fs.existsSync(input)) {
      await sharp(input)
        .resize(1200, null, { withoutEnlargement: true })
        .webp({ quality: 80 })
        .toFile(output);
      const origSize = fs.statSync(input).size;
      const newSize = fs.statSync(output).size;
      console.log(
        `${name}: ${(origSize / 1024).toFixed(0)}KB → ${(newSize / 1024).toFixed(0)}KB (${((1 - newSize / origSize) * 100).toFixed(0)}% smaller)`,
      );
    }
  }

  // Certifications: large PNG → WebP
  const certDir = path.join(root, "assets/images/certifications");
  const certFiles = fs.readdirSync(certDir).filter((f) => f.endsWith(".png"));
  for (const file of certFiles) {
    const input = path.join(certDir, file);
    const name = path.basename(file, ".png");
    const output = path.join(certDir, name + ".webp");
    const size = fs.statSync(input).size;
    if (size > 200000 && !fs.existsSync(output)) {
      await sharp(input)
        .resize(800, null, { withoutEnlargement: true })
        .webp({ quality: 80 })
        .toFile(output);
      const newSize = fs.statSync(output).size;
      console.log(
        `${name}: ${(size / 1024).toFixed(0)}KB → ${(newSize / 1024).toFixed(0)}KB (${((1 - newSize / size) * 100).toFixed(0)}% smaller)`,
      );
    }
  }

  console.log("\nDone!");
}

convert().catch(console.error);
