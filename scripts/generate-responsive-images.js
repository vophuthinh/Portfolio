/**
 * Generate Responsive Images Script
 * Generates multiple sizes and formats (WebP, AVIF) for all images
 * 
 * Usage: node scripts/generate-responsive-images.js
 * 
 * Requirements:
 * - Install sharp: npm install sharp
 */

import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SIZES = [320, 640, 960, 1280, 1920];
const QUALITY = {
  jpg: 85,
  webp: 85,
  avif: 75
};

const INPUT_DIRS = [
  'assets/images',
  'assets/images/portfolio',
  'assets/images/certifications'
];

const FORMATS = ['webp', 'avif'];

async function processImage(inputPath, outputDir) {
  const filename = path.basename(inputPath, path.extname(inputPath));
  const ext = path.extname(inputPath).toLowerCase();
  
  console.log(`Processing: ${inputPath}`);
  
  try {
    const image = sharp(inputPath);
    const metadata = await image.metadata();
    
    // Generate different sizes
    for (const width of SIZES) {
      // Skip if image is smaller than target size
      if (metadata.width < width) continue;
      
      // Original format with new size
      await image
        .clone()
        .resize(width, null, {
          withoutEnlargement: true,
          fit: 'inside'
        })
        .jpeg({ quality: QUALITY.jpg })
        .toFile(path.join(outputDir, `${filename}-${width}${ext}`));
      
      // WebP format
      await image
        .clone()
        .resize(width, null, {
          withoutEnlargement: true,
          fit: 'inside'
        })
        .webp({ quality: QUALITY.webp })
        .toFile(path.join(outputDir, `${filename}-${width}.webp`));
      
      // AVIF format
      await image
        .clone()
        .resize(width, null, {
          withoutEnlargement: true,
          fit: 'inside'
        })
        .avif({ quality: QUALITY.avif })
        .toFile(path.join(outputDir, `${filename}-${width}.avif`));
      
      console.log(`  ✓ Generated ${width}px versions`);
    }
    
    console.log(`✓ Completed: ${filename}`);
  } catch (error) {
    console.error(`✗ Error processing ${inputPath}:`, error.message);
  }
}

async function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      // Skip if it's a generated directory
      if (file.startsWith('responsive-')) continue;
      
      await processDirectory(fullPath);
    } else {
      const ext = path.extname(file).toLowerCase();
      if (['.jpg', '.jpeg', '.png'].includes(ext)) {
        // Skip if it's already a generated responsive image
        if (/-\d{3,4}\.(jpg|jpeg|png|webp|avif)$/.test(file)) continue;
        
        await processImage(fullPath, dir);
      }
    }
  }
}

async function main() {
  console.log('🖼️  Generating responsive images...\n');
  
  // Check if sharp is installed
  try {
    await import('sharp');
  } catch (e) {
    console.error('❌ Error: sharp is not installed');
    console.error('Please install it with: npm install sharp');
    process.exit(1);
  }
  
  for (const dir of INPUT_DIRS) {
    if (fs.existsSync(dir)) {
      console.log(`\n📁 Processing directory: ${dir}`);
      await processDirectory(dir);
    } else {
      console.warn(`⚠️  Directory not found: ${dir}`);
    }
  }
  
  console.log('\n✅ All images processed successfully!');
  console.log('\n💡 Next steps:');
  console.log('   1. Update your HTML to use responsive images');
  console.log('   2. Use the ResponsiveImagesController in your app');
  console.log('   3. Test on different screen sizes');
}

// Run main
main().catch(console.error);
