# 🚀 Quick Deployment Steps

## Step-by-Step Deployment (15 minutes)

### 1️⃣ Prepare Code (2 min)
```bash
# Run preparation script
.\deploy-prep.ps1
```

### 2️⃣ MongoDB Atlas (3 min)
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create free cluster (M0)
3. Create database user
4. Whitelist all IPs (0.0.0.0/0)
5. Copy connection string

### 3️⃣ Push to GitHub (2 min)
```bash
git init
git add .
git commit -m "Ready for deployment"
git remote add origin https://github.com/YOUR_USERNAME/aroma-luxe.git
git branch -M main
git push -u origin main
```

### 4️⃣ Deploy Backend on Render (5 min)
1. Go to [Render.com](https://render.com)
2. New Web Service → Connect GitHub
3. Settings:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
4. Add Environment Variables:
   ```
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key_here
   JWT_EXPIRE=7d
   NODE_ENV=production
   GEMINI_API_KEY=AIzaSyAzmcKV0dHct3NzsGI4O9EoBCP7TE2QEDQ
   ```
5. Deploy → Copy URL

### 5️⃣ Deploy Frontend on Vercel (3 min)
1. Go to [Vercel.com](https://vercel.com)
2. Import GitHub repository
3. Settings:
   - **Framework**: Create React App
   - **Root Directory**: `frontend`
4. Add Environment Variable:
   ```
   REACT_APP_API_URL=https://your-backend.onrender.com
   ```
5. Deploy → Copy URL

### 6️⃣ Update Backend CORS
1. Go back to Render
2. Environment → Add:
   ```
   FRONTEND_URL=https://your-frontend.vercel.app
   ```
3. Save (auto-redeploys)

## ✅ Done!

Your site is live at: `https://your-frontend.vercel.app` 🎉

---

## 📖 Need More Details?

Read [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for:
- Detailed explanations
- Troubleshooting
- VPS deployment
- Custom domains
- SSL setup
- Cost estimates

---

## 🆘 Common Issues

**Backend not connecting?**
- Check MongoDB connection string
- Verify environment variables
- Check Render logs

**Frontend can't reach backend?**
- Verify REACT_APP_API_URL
- Check backend CORS settings
- Ensure backend is deployed and running

**AI Chatbot not working?**
- Verify GEMINI_API_KEY is set
- Check backend logs for API errors
- Ensure model name is correct (gemini-2.5-flash)

---

## 📞 Support

- Email: velankarur1976@gmail.com
- Phone: +91 9443839900
- Location: Karur, Tamil Nadu, India

---

**Made with ❤️ by Velan Engineering**
