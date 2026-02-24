#!/bin/bash

# Portfolio Build Script
# Runs all optimization steps in sequence

echo "🚀 Starting portfolio build process..."
echo ""

# Step 1: Clean previous build
echo "🧹 Cleaning previous build..."
rm -rf dist/
echo "✅ Clean complete"
echo ""

# Step 2: Generate responsive images (if sharp is installed)
if command -v node &> /dev/null; then
  if npm list sharp &> /dev/null; then
    echo "🖼️  Generating responsive images..."
    npm run images
    echo "✅ Images generated"
  else
    echo "⚠️  Sharp not installed. Skipping image generation."
    echo "   Install with: npm install sharp"
  fi
else
  echo "⚠️  Node.js not found. Skipping image generation."
fi
echo ""

# Step 3: Optimize CSS
echo "🎨 Optimizing CSS..."
node scripts/optimize-css.js
echo ""

# Step 4: Build with Vite
echo "📦 Building with Vite..."
npm run build
echo ""

# Step 5: Copy additional files
echo "📄 Copying additional files..."
cp -r assets/favicon dist/assets/ 2>/dev/null || true
cp assets/CV.pdf dist/assets/ 2>/dev/null || true
cp sw.js dist/ 2>/dev/null || true
echo "✅ Files copied"
echo ""

# Step 6: Show build statistics
echo "📊 Build Statistics:"
du -sh dist/
echo ""
echo "Main files:"
ls -lh dist/*.html 2>/dev/null || true
echo ""
echo "JavaScript bundles:"
ls -lh dist/js/*.js 2>/dev/null || true
echo ""
echo "CSS files:"
ls -lh dist/assets/*.css 2>/dev/null || true
echo ""

echo "✨ Build complete! Output in ./dist/"
echo ""
echo "💡 Next steps:"
echo "   - Test: npm run preview"
echo "   - Deploy: Upload ./dist/ to your hosting"
