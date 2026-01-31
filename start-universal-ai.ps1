# 🚀 QUICK START - UNIVERSAL AI CHATBOT
# Run this script to start your AI chatbot!

Write-Host "════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "   🤖 UNIVERSAL AI CHATBOT - QUICK START" -ForegroundColor Yellow
Write-Host "════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# Check if MongoDB is running
Write-Host "📊 Checking MongoDB..." -ForegroundColor Cyan
$mongoProcess = Get-Process mongod -ErrorAction SilentlyContinue
if ($mongoProcess) {
    Write-Host "✅ MongoDB is running!" -ForegroundColor Green
} else {
    Write-Host "⚠️  MongoDB may not be running" -ForegroundColor Yellow
    Write-Host "   If you get connection errors, start MongoDB first" -ForegroundColor Gray
}
Write-Host ""

# Navigate to backend
Set-Location "$PSScriptRoot\backend"

# Stop any existing Node processes
Write-Host "🛑 Stopping old servers..." -ForegroundColor Cyan
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep -Seconds 2
Write-Host "✅ Cleared old servers" -ForegroundColor Green
Write-Host ""

# Start backend server
Write-Host "🚀 Starting Universal AI Backend..." -ForegroundColor Cyan
Write-Host "   Server will run on http://localhost:5000" -ForegroundColor Gray
Write-Host ""
Write-Host "════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "   🎯 YOUR AI CAN NOW ANSWER ANYTHING!" -ForegroundColor Yellow
Write-Host "════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "Try asking:" -ForegroundColor White
Write-Host "  • What is artificial intelligence?" -ForegroundColor Gray
Write-Host "  • Calculate 456 * 789" -ForegroundColor Gray
Write-Host "  • Show me steel doors" -ForegroundColor Gray
Write-Host "  • How does photosynthesis work?" -ForegroundColor Gray
Write-Host "  • What is JavaScript?" -ForegroundColor Gray
Write-Host "  • ANYTHING you want!" -ForegroundColor Gray
Write-Host ""
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""
Write-Host "════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# Start server
node server.js
