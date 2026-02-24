/**
 * CSP Nonce Injection Script
 * Injects cryptographic nonces into HTML files for Content Security Policy
 * 
 * Usage: node scripts/inject-nonce.js
 */

import fs from 'fs';
import crypto from 'crypto';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Generate a cryptographically secure nonce
 */
function generateNonce() {
  return crypto.randomBytes(16).toString('base64');
}

/**
 * Inject nonce into HTML file
 */
function injectNonce(htmlPath, outputPath = null) {
  const output = outputPath || htmlPath;
  
  try {
    let html = fs.readFileSync(htmlPath, 'utf8');
    const nonce = generateNonce();
    
    // Replace nonce placeholder in meta tag and CSP header
    html = html.replace(/NONCE_PLACEHOLDER/g, nonce);
    
    // Add nonce to all inline scripts
    html = html.replace(
      /<script([^>]*)>([\s\S]*?)<\/script>/gi,
      (match, attributes, content) => {
        // Skip if already has nonce or has src attribute
        if (attributes.includes('nonce=') || attributes.includes('src=')) {
          return match;
        }
        return `<script${attributes} nonce="${nonce}">${content}</script>`;
      }
    );
    
    // Add nonce to inline styles
    html = html.replace(
      /<style([^>]*)>([\s\S]*?)<\/style>/gi,
      (match, attributes, content) => {
        // Skip if already has nonce
        if (attributes.includes('nonce=')) {
          return match;
        }
        return `<style${attributes} nonce="${nonce}">${content}</style>`;
      }
    );
    
    fs.writeFileSync(output, html, 'utf8');
    
    console.log(`✓ Injected nonce into ${path.basename(htmlPath)}`);
    console.log(`  Nonce: ${nonce.substring(0, 10)}...`);
    
    return nonce;
  } catch (error) {
    console.error(`✗ Error processing ${htmlPath}:`, error.message);
    return null;
  }
}

/**
 * Process all HTML files in dist directory
 */
function processDistDirectory() {
  const distDir = path.join(process.cwd(), 'dist');
  
  if (!fs.existsSync(distDir)) {
    console.error('❌ dist directory not found. Run build first.');
    process.exit(1);
  }
  
  const htmlFiles = fs.readdirSync(distDir)
    .filter(file => file.endsWith('.html'))
    .map(file => path.join(distDir, file));
  
  if (htmlFiles.length === 0) {
    console.warn('⚠️  No HTML files found in dist directory');
    return;
  }
  
  console.log('🔒 Injecting CSP nonces into HTML files...\n');
  
  htmlFiles.forEach(file => {
    injectNonce(file);
  });
  
  console.log('\n✅ CSP nonce injection complete!');
  console.log('\n💡 Note: Each HTML file has a unique nonce for security.');
  console.log('   In production, generate a new nonce on each request.');
}

/**
 * Main execution
 */
function main() {
  const args = process.argv.slice(2);
  
  if (args.length > 0) {
    // Process specific file
    const inputFile = args[0];
    const outputFile = args[1];
    
    if (!fs.existsSync(inputFile)) {
      console.error(`❌ File not found: ${inputFile}`);
      process.exit(1);
    }
    
    injectNonce(inputFile, outputFile);
  } else {
    // Process dist directory
    processDistDirectory();
  }
}

// Run main
main();

// Export functions
export { generateNonce, injectNonce };
