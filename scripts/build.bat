@echo off
REM Portfolio Build Script for Windows
REM Runs all optimization steps in sequence

echo 🚀 Starting portfolio build process...
echo.

REM Step 1: Clean previous build
echo 🧹 Cleaning previous build...
if exist dist rmdir /s /q dist
echo ✅ Clean complete
echo.

REM Step 2: Generate responsive images (if sharp is installed)
where node >nul 2>nul
if %ERRORLEVEL% EQU 0 (
  npm list sharp >nul 2>nul
  if %ERRORLEVEL% EQU 0 (
    echo 🖼️  Generating responsive images...
    call npm run images
    echo ✅ Images generated
  ) else (
    echo ⚠️  Sharp not installed. Skipping image generation.
    echo    Install with: npm install sharp
  )
) else (
  echo ⚠️  Node.js not found. Skipping image generation.
)
echo.

REM Step 3: Optimize CSS
echo 🎨 Optimizing CSS...
node scripts/optimize-css.js
echo.

REM Step 4: Build with Vite
echo 📦 Building with Vite...
call npm run build
echo.

REM Step 5: Copy additional files
echo 📄 Copying additional files...
if exist assets\favicon xcopy /s /i /q assets\favicon dist\assets\favicon
if exist assets\CV.pdf copy /y assets\CV.pdf dist\assets\
if exist sw.js copy /y sw.js dist\
echo ✅ Files copied
echo.

REM Step 6: Show build statistics
echo 📊 Build Statistics:
dir dist /s
echo.

echo ✨ Build complete! Output in .\dist\
echo.
echo 💡 Next steps:
echo    - Test: npm run preview
echo    - Deploy: Upload .\dist\ to your hosting
