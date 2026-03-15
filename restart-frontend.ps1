# Fix Product Loading Issue
# This script will restart the frontend with a clean state

Write-Host "========================================" -ForegroundColor Cyan
Write-Host " FIXING PRODUCT LOADING ISSUE" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Kill any running React dev servers
Write-Host "Step 1: Stopping frontend server..." -ForegroundColor Yellow
Get-Process -Name node -ErrorAction SilentlyContinue | Where-Object {$_.MainWindowTitle -like "*react*"} | Stop-Process -Force
Start-Sleep -Seconds 2

# Step 2: Clear browser cache instructions
Write-Host ""
Write-Host "Step 2: Clear your browser cache:" -ForegroundColor Yellow
Write-Host "  - Press Ctrl+Shift+Del in your browser" -ForegroundColor White
Write-Host "  - Select 'Cached images and files'" -ForegroundColor White
Write-Host "  - Click 'Clear data'" -ForegroundColor White
Write-Host ""
Write-Host "Press any key after clearing cache..." -ForegroundColor Green
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

# Step 3: Navigate to frontend
Set-Location -Path "e:\ACEDEMIC\aroma-luxe\frontend"

# Step 4: Clear npm cache
Write-Host ""
Write-Host "Step 3: Clearing npm cache..." -ForegroundColor Yellow
npm cache clean --force

# Step 5: Start the server
Write-Host ""
Write-Host "Step 4: Starting frontend server..." -ForegroundColor Yellow
Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host " Frontend server starting..." -ForegroundColor Green
Write-Host " Open http://localhost:3000 in browser" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

npm start
