#!/bin/bash

# Quick Deployment Script for Aroma Luxe / Velan Engineering
# This script helps prepare your project for deployment

echo "🚀 Preparing Aroma Luxe for Deployment..."
echo ""

# Step 1: Check if Git is initialized
if [ ! -d ".git" ]; then
    echo "📦 Initializing Git repository..."
    git init
    git add .
    git commit -m "Initial commit - Ready for deployment"
else
    echo "✅ Git repository already initialized"
fi

# Step 2: Install dependencies
echo ""
echo "📥 Installing Backend Dependencies..."
cd backend
npm install
cd ..

echo ""
echo "📥 Installing Frontend Dependencies..."
cd frontend
npm install
cd ..

# Step 3: Test Build
echo ""
echo "🔨 Testing Frontend Build..."
cd frontend
npm run build
if [ $? -eq 0 ]; then
    echo "✅ Frontend build successful!"
else
    echo "❌ Frontend build failed. Please fix errors before deploying."
    exit 1
fi
cd ..

# Step 4: Test Backend
echo ""
echo "🧪 Testing Backend..."
cd backend
timeout 5 npm start &
PID=$!
sleep 3
if ps -p $PID > /dev/null; then
    echo "✅ Backend starts successfully!"
    kill $PID
else
    echo "❌ Backend failed to start. Please fix errors before deploying."
    exit 1
fi
cd ..

echo ""
echo "✅ All checks passed!"
echo ""
echo "📋 Next Steps:"
echo "1. Push to GitHub: git push origin main"
echo "2. Setup MongoDB Atlas: https://www.mongodb.com/cloud/atlas"
echo "3. Deploy Backend to Render: https://render.com"
echo "4. Deploy Frontend to Vercel: https://vercel.com"
echo "5. Update environment variables on both platforms"
echo ""
echo "📖 Read DEPLOYMENT_GUIDE.md for detailed instructions"
echo ""
echo "🎉 Good luck with your deployment!"
