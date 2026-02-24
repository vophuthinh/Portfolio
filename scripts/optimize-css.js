/**
 * CSS Optimization Script
 * Minifies and optimizes CSS files
 * 
 * Usage: node scripts/optimize-css.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Simple CSS minifier
function minifyCSS(css) {
  return css
    // Remove comments
    .replace(/\/\*[\s\S]*?\*\//g, '')
    // Remove whitespace
    .replace(/\s+/g, ' ')
    // Remove spaces around special characters
    .replace(/\s*([{}:;,>+~])\s*/g, '$1')
    // Remove trailing semicolons
    .replace(/;}/g, '}')
    // Remove empty rules
    .replace(/[^\}]+\{\s*\}/g, '')
    .trim();
}

function processCSSFile(inputPath, outputPath) {
  try {
    const css = fs.readFileSync(inputPath, 'utf8');
    const minified = minifyCSS(css);
    
    // Calculate size reduction
    const originalSize = Buffer.byteLength(css, 'utf8');
    const minifiedSize = Buffer.byteLength(minified, 'utf8');
    const reduction = ((originalSize - minifiedSize) / originalSize * 100).toFixed(2);
    
    fs.writeFileSync(outputPath, minified, 'utf8');
    
    console.log(`✓ ${path.basename(inputPath)}`);
    console.log(`  Original: ${(originalSize / 1024).toFixed(2)} KB`);
    console.log(`  Minified: ${(minifiedSize / 1024).toFixed(2)} KB`);
    console.log(`  Reduction: ${reduction}%\n`);
  } catch (error) {
    console.error(`✗ Error processing ${inputPath}:`, error.message);
  }
}

function main() {
  console.log('🎨 Optimizing CSS files...\n');
  
  const cssFiles = [
    {
      input: 'assets/css/style.css',
      output: 'assets/css/style.min.css'
    },
    {
      input: 'assets/css/style-switcher.css',
      output: 'assets/css/style-switcher.min.css'
    }
  ];
  
  // Process color skins
  for (let i = 1; i <= 5; i++) {
    cssFiles.push({
      input: `assets/css/skins/color-${i}.css`,
      output: `assets/css/skins/color-${i}.min.css`
    });
  }
  
  cssFiles.forEach(({ input, output }) => {
    if (fs.existsSync(input)) {
      processCSSFile(input, output);
    } else {
      console.warn(`⚠️  File not found: ${input}`);
    }
  });
  
  console.log('✅ CSS optimization complete!');
}

main();
