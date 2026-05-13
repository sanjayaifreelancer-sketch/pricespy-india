# PriceSpy India - Setup Script
# Run this in PowerShell to get everything working

Write-Host "=== PriceSpy India Auto Setup ===" -ForegroundColor Cyan
Write-Host ""

# Check Node.js
try {
    $nodeVer = node --version
    Write-Host "✓ Node.js: $nodeVer" -ForegroundColor Green
} catch {
    Write-Host "✗ Node.js not found. Install from https://nodejs.org (v18+)" -ForegroundColor Red
    exit 1
}

# Install dependencies
Write-Host ""
Write-Host "→ Installing dependencies..." -ForegroundColor Yellow
npm install
Write-Host "✓ Dependencies installed" -ForegroundColor Green

# Check .env.local
if (-not (Test-Path ".env.local")) {
    Write-Host ""
    Write-Host "→ Creating .env.local from example..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env.local"
    Write-Host "⚠ EDIT .env.local with your Supabase keys to enable the backend" -ForegroundColor Yellow
} else {
    Write-Host "✓ .env.local exists" -ForegroundColor Green
}

# Build web app
Write-Host ""
Write-Host "→ Building web app..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Build failed. Check errors above." -ForegroundColor Red
    exit 1
}
Write-Host "✓ Web build complete" -ForegroundColor Green

# Check Java for APK build
$javaOk = $false
try { java -version 2>&1 | Out-Null; $javaOk = $true } catch {}

if (-not $javaOk) {
    Write-Host ""
    Write-Host "⚠ Java/Android SDK not detected on this machine." -ForegroundColor Yellow
    Write-Host "  The APK build requires: Java 17+ and Android Studio" -ForegroundColor Yellow
    Write-Host "  To build APK on this machine later, run:" -ForegroundColor White
    Write-Host "  npm run apk" -ForegroundColor White
    
    # Offer to serve locally instead
    Write-Host ""
    $serve = Read-Host "Start a local server to preview in browser? (Y/n)"
    if ($serve -ne "n") {
        npx serve out -l 3000
    }
} else {
    # Sync to Capacitor and build APK
    Write-Host ""
    Write-Host "→ Syncing to Android..." -ForegroundColor Yellow
    npx cap sync
    
    Write-Host ""
    Write-Host "→ Building APK..." -ForegroundColor Yellow
    Push-Location android
    .\gradlew assembleDebug
    Pop-Location
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "✓ APK BUILD SUCCESSFUL!" -ForegroundColor Green
        Write-Host "  Location: android\app\build\outputs\apk\debug\app-debug.apk" -ForegroundColor Cyan
    } else {
        Write-Host "✗ APK build failed. Check Android SDK setup." -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "=== Setup Complete ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "📱 Web Preview: npx serve out" -ForegroundColor White
Write-Host "📦 Build APK:   npm run apk" -ForegroundColor White
Write-Host "🚀 Dev Mode:    npm run dev" -ForegroundColor White
Write-Host "🔧 Supabase:    Edit .env.local with your keys" -ForegroundColor White
