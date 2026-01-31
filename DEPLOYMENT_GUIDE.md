# 🚀 Deployment Guide - Aroma Luxe/Velan Engineering

This guide covers deploying your MERN stack application to production.

## 📋 Table of Contents
1. [Prerequisites](#prerequisites)
2. [Database Setup (MongoDB Atlas)](#database-setup)
3. [Backend Deployment (Render/Railway)](#backend-deployment)
4. [Frontend Deployment (Vercel/Netlify)](#frontend-deployment)
5. [Environment Variables](#environment-variables)
6. [Alternative: Single Server Deployment](#alternative-deployment)

---

## 📦 Prerequisites

- ✅ GitHub account
- ✅ MongoDB Atlas account (free)
- ✅ Render/Railway account (for backend)
- ✅ Vercel/Netlify account (for frontend)
- ✅ All code pushed to GitHub repository

---

## 🗄️ Database Setup (MongoDB Atlas)

### Step 1: Create MongoDB Atlas Cluster

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up/Login
3. Create a **Free M0 Cluster**
   - Cloud Provider: AWS/Google/Azure
   - Region: Choose closest to you (e.g., Mumbai for India)
4. Wait 3-5 minutes for cluster creation

### Step 2: Setup Database Access

1. **Create Database User:**
   - Database Access → Add New Database User
   - Authentication: Username & Password
   - Username: `velan_admin`
   - Password: Generate secure password (save it!)
   - User Privileges: `Read and write to any database`

2. **Whitelist IP Addresses:**
   - Network Access → Add IP Address
   - Click **"Allow Access from Anywhere"** (0.0.0.0/0)
   - Confirm

### Step 3: Get Connection String

1. Click **"Connect"** on your cluster
2. Choose **"Connect your application"**
3. Driver: Node.js, Version: 5.5 or later
4. Copy connection string:
   ```
   mongodb+srv://velan_admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. Replace `<password>` with your actual password
6. Add database name: `aroma-luxe`
   ```
   mongodb+srv://velan_admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/aroma-luxe?retryWrites=true&w=majority
   ```

---

## 🔧 Backend Deployment

### Option A: Deploy to Render (Recommended - Free Tier)

#### Step 1: Prepare Backend for Deployment

1. **Create `.gitignore` in backend folder** (if not exists):
   ```
   node_modules/
   .env
   ```

2. **Update `backend/server.js`** - Ensure CORS allows frontend URL:
   ```javascript
   const corsOptions = {
     origin: process.env.FRONTEND_URL || 'http://localhost:3000',
     credentials: true
   };
   app.use(cors(corsOptions));
   ```

#### Step 2: Deploy on Render

1. Go to [Render.com](https://render.com) and sign up
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure:
   - **Name**: `velan-engineering-backend`
   - **Region**: Singapore (closest to India)
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free

5. **Add Environment Variables** (see section below)

6. Click **"Create Web Service"**
7. Wait 5-10 minutes for deployment
8. Copy your backend URL: `https://velan-engineering-backend.onrender.com`

#### Step 3: Configure Environment Variables on Render

Go to **Environment** tab and add:

| Key | Value |
|-----|-------|
| `PORT` | `5000` |
| `MONGODB_URI` | `mongodb+srv://velan_admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/aroma-luxe?retryWrites=true&w=majority` |
| `JWT_SECRET` | `your-super-secret-jwt-key-change-this-production-velan-2026` |
| `JWT_EXPIRE` | `7d` |
| `NODE_ENV` | `production` |
| `GEMINI_API_KEY` | `AIzaSyAzmcKV0dHct3NzsGI4O9EoBCP7TE2QEDQ` |
| `FRONTEND_URL` | `https://your-frontend-url.vercel.app` (update after frontend deployment) |

---

### Option B: Deploy to Railway

1. Go to [Railway.app](https://railway.app)
2. Click **"Start a New Project"**
3. Choose **"Deploy from GitHub repo"**
4. Select your repository and `backend` folder
5. Add environment variables (same as above)
6. Deploy automatically

---

## 🎨 Frontend Deployment

### Option A: Deploy to Vercel (Recommended)

#### Step 1: Update Frontend Configuration

1. **Create `.env.production` in frontend folder:**
   ```env
   REACT_APP_API_URL=https://your-backend-url.onrender.com
   ```

2. **Update `frontend/src/index.js` or axios config:**
   ```javascript
   // Add this to set base URL
   axios.defaults.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
   ```

#### Step 2: Deploy on Vercel

1. Go to [Vercel.com](https://vercel.com) and sign up
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Create React App
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
   - **Install Command**: `npm install`

5. **Add Environment Variables:**
   - `REACT_APP_API_URL` = `https://your-backend-url.onrender.com`

6. Click **"Deploy"**
7. Wait 2-3 minutes
8. Your site is live! 🎉

#### Step 3: Update Backend CORS

Go back to Render → Environment Variables → Update:
- `FRONTEND_URL` = `https://your-site.vercel.app`

Click **"Save Changes"** (backend will redeploy)

---

### Option B: Deploy to Netlify

1. Go to [Netlify.com](https://www.netlify.com)
2. **"Add new site"** → **"Import an existing project"**
3. Connect GitHub repository
4. Configure:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `build`
5. Add environment variable: `REACT_APP_API_URL`
6. Deploy

---

## 🔐 Environment Variables Summary

### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb+srv://velan_admin:PASSWORD@cluster0.xxxxx.mongodb.net/aroma-luxe
JWT_SECRET=super-secret-key-change-in-production
JWT_EXPIRE=7d
NODE_ENV=production
GEMINI_API_KEY=AIzaSyAzmcKV0dHct3NzsGI4O9EoBCP7TE2QEDQ
FRONTEND_URL=https://your-frontend.vercel.app
```

### Frontend (.env.production)
```env
REACT_APP_API_URL=https://your-backend.onrender.com
```

---

## 🏗️ Alternative: Single Server Deployment (VPS/DigitalOcean)

If you want to deploy everything on one server:

### Step 1: Get a VPS

- **DigitalOcean**: $6/month droplet
- **Linode**: $5/month
- **AWS EC2**: Free tier (1 year)
- **Azure**: Free tier

### Step 2: Server Setup (Ubuntu 22.04)

```bash
# SSH into server
ssh root@your-server-ip

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt update
sudo apt install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod

# Install Nginx
sudo apt install -y nginx

# Install PM2 (process manager)
sudo npm install -g pm2
```

### Step 3: Deploy Application

```bash
# Clone repository
git clone https://github.com/your-username/your-repo.git
cd your-repo

# Setup Backend
cd backend
npm install
# Create .env file with production values
nano .env
# Start with PM2
pm2 start server.js --name "velan-backend"
pm2 save
pm2 startup

# Setup Frontend
cd ../frontend
npm install
npm run build

# Copy build to nginx
sudo cp -r build/* /var/www/html/
```

### Step 4: Configure Nginx

```bash
sudo nano /etc/nginx/sites-available/default
```

Add:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Frontend
    location / {
        root /var/www/html;
        try_files $uri /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
sudo nginx -t
sudo systemctl restart nginx
```

### Step 5: Setup SSL (Let's Encrypt)

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

---

## 🎯 Post-Deployment Checklist

- [ ] Backend is accessible and returns data
- [ ] Frontend loads and connects to backend
- [ ] User registration/login works
- [ ] Products display correctly
- [ ] Cart functionality works
- [ ] Orders can be placed
- [ ] Admin panel is accessible
- [ ] AI Chatbot responds correctly
- [ ] Images load properly
- [ ] Payment gateway (Razorpay) is configured
- [ ] Environment variables are secure (not in code)
- [ ] MongoDB is secured and backed up

---

## 🔄 Continuous Deployment

### GitHub Actions (Auto-deploy on push)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Render
        run: curl https://api.render.com/deploy/srv-YOUR_SERVICE_ID

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

---

## 🐛 Troubleshooting

### Backend Issues

**Error: Cannot connect to MongoDB**
- Check MongoDB Atlas IP whitelist
- Verify connection string
- Check network connectivity

**Error: Port already in use**
- Ensure PORT environment variable is set
- Check if another service uses the port

### Frontend Issues

**API calls failing**
- Verify REACT_APP_API_URL is correct
- Check backend CORS configuration
- Open browser console for errors

**Build fails**
- Run `npm install` to update dependencies
- Clear cache: `npm cache clean --force`
- Check for syntax errors

---

## 📱 Domain Configuration

### Custom Domain (Optional)

1. **Buy domain** from Namecheap/GoDaddy
2. **For Vercel:**
   - Project Settings → Domains → Add domain
   - Update DNS records at your registrar:
     - Type: CNAME
     - Name: www
     - Value: cname.vercel-dns.com

3. **For Render:**
   - Settings → Custom Domains → Add domain
   - Update DNS A record to Render IP

---

## 💰 Cost Estimate

### Free Tier (Good for testing)
- MongoDB Atlas: **Free** (512 MB)
- Render: **Free** (750 hours/month)
- Vercel: **Free** (100 GB bandwidth)
- **Total: ₹0/month**

### Production Tier
- MongoDB Atlas M10: **$0.08/hour** (~₹500/month)
- Render Starter: **$7/month** (~₹600/month)
- Vercel Pro: **$20/month** (~₹1,650/month)
- Domain: **₹800/year**
- **Total: ~₹2,800/month**

---

## 🎓 Recommended Setup for Your Project

### Best Option (Free):
1. **Database**: MongoDB Atlas (Free M0)
2. **Backend**: Render (Free tier)
3. **Frontend**: Vercel (Free tier)
4. **Total Cost**: ₹0/month

### For Production (Paid):
1. **Database**: MongoDB Atlas M10
2. **Backend**: Render Starter
3. **Frontend**: Vercel Pro
4. **Total Cost**: ~₹2,800/month

---

## 📚 Additional Resources

- [Render Documentation](https://render.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [MongoDB Atlas Guide](https://docs.atlas.mongodb.com/)
- [PM2 Documentation](https://pm2.keymetrics.io/docs/)

---

## ⚡ Quick Deploy Commands

```bash
# Push to GitHub
git add .
git commit -m "Ready for deployment"
git push origin main

# Build frontend locally (test)
cd frontend
npm run build

# Test backend locally
cd backend
npm start
```

---

## 🆘 Need Help?

If you encounter issues:
1. Check deployment logs on Render/Vercel
2. Verify all environment variables
3. Test API endpoints with Postman
4. Check browser console for frontend errors
5. Review MongoDB Atlas connection

---

**🎉 Your app is now live! Share the URL with the world!**

Contact: velankarur1976@gmail.com | +91 9443839900
