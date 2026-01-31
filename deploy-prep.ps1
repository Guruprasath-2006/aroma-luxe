# Quick Deployment Preparation Script for Windows
# Aroma Luxe / Velan Engineering

Write-Host "🚀 Preparing Aroma Luxe for Deployment..." -ForegroundColor Cyan
Write-Host ""

# Step 1: Check if Git is initialized
if (-not (Test-Path ".git")) {
    Write-Host "📦 Initializing Git repository..." -ForegroundColor Yellow
    git init
    git add .
    git commit -m "Initial commit - Ready for deployment"
} else {
    Write-Host "✅ Git repository already initialized" -ForegroundColor Green
}

# Step 2: Install Backend Dependencies
Write-Host ""
Write-Host "📥 Installing Backend Dependencies..." -ForegroundColor Cyan
Push-Location backend
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Backend dependency installation failed" -ForegroundColor Red
    Pop-Location
    exit 1
}
Pop-Location

# Step 3: Install Frontend Dependencies
Write-Host ""
Write-Host "📥 Installing Frontend Dependencies..." -ForegroundColor Cyan
Push-Location frontend
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Frontend dependency installation failed" -ForegroundColor Red
    Pop-Location
    exit 1
}
Pop-Location

# Step 4: Test Frontend Build
Write-Host ""
Write-Host "🔨 Testing Frontend Build..." -ForegroundColor Cyan
Push-Location frontend
npm run build
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Frontend build successful!" -ForegroundColor Green
} else {
    Write-Host "❌ Frontend build failed. Please fix errors before deploying." -ForegroundColor Red
    Pop-Location
    exit 1
}
Pop-Location

Write-Host ""
Write-Host "✅ All checks passed!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next Steps:" -ForegroundColor Yellow
Write-Host "1. Create GitHub repository and push code:"
Write-Host "   git remote add origin https://github.com/your-username/your-repo.git"
Write-Host "   git branch -M main"
Write-Host "   git push -u origin main"
Write-Host ""
Write-Host "2. Setup MongoDB Atlas:" -ForegroundColor Cyan
Write-Host "   https://www.mongodb.com/cloud/atlas"
Write-Host ""
Write-Host "3. Deploy Backend to Render:" -ForegroundColor Cyan
Write-Host "   https://render.com"
Write-Host "   - New Web Service"
Write-Host "   - Connect GitHub repo"
Write-Host "   - Root Directory: backend"
Write-Host "   - Build: npm install"
Write-Host "   - Start: npm start"
Write-Host ""
Write-Host "4. Deploy Frontend to Vercel:" -ForegroundColor Cyan
Write-Host "   https://vercel.com"
Write-Host "   - Import GitHub repo"
Write-Host "   - Root Directory: frontend"
Write-Host "   - Framework: Create React App"
Write-Host ""
Write-Host "5. Update environment variables on both platforms"
Write-Host ""
Write-Host "📖 Read DEPLOYMENT_GUIDE.md for detailed instructions" -ForegroundColor Yellow
Write-Host ""
Write-Host "🎉 Good luck with your deployment!" -ForegroundColor Green
