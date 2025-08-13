# 🚀 Vercel Deployment Guide for AI Humaniser

## 📋 Overview

This guide will help you deploy your **AI Humaniser** React frontend to Vercel with full AI model integration. The deployment includes:

- ✅ **React Frontend** with beautiful UI
- ✅ **AI Model Integration** via Flask API
- ✅ **Real-time Processing** capabilities
- ✅ **Professional Design** with your color palette

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React App     │    │   Flask API     │    │   AI Model      │
│   (Vercel)      │◄──►│   (Local/Cloud) │◄──►│   (Your Code)   │
│                 │    │                 │    │                 │
│ • Beautiful UI  │    │ • API Endpoints │    │ • Text Humanize │
│ • User Interface│    │ • CORS Support  │    │ • Number Format │
│ • File Upload   │    │ • Error Handling│    │ • AI Detection  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🔧 Setup Instructions

### **Step 1: Prepare Your AI Model**

1. **Copy your AI model** to the project root:
   ```bash
   cp -r ../ai_detector/ai_detector ./ai_model/
   ```

2. **Install Python dependencies**:
   ```bash
   pip install -r ai_api_requirements.txt
   ```

### **Step 2: Configure Environment Variables**

Create a `.env` file in your React app root:

```bash
# AI API Configuration
REACT_APP_API_URL=http://localhost:5000

# For production, use your deployed API URL
# REACT_APP_API_URL=https://your-api-domain.com
```

### **Step 3: Start the AI API**

```bash
# Start the Flask API
python ai_model_api.py
```

The API will be available at: `http://localhost:5000`

### **Step 4: Test Locally**

```bash
# Start React development server
cd ai-humaniser-frontend
npm start
```

Visit: `http://localhost:3000`

## 🚀 Deploy to Vercel

### **Method 1: Vercel CLI (Recommended)**

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy from React app directory**:
   ```bash
   cd ai-humaniser-frontend
   vercel
   ```

4. **Follow the prompts**:
   - Set project name: `ai-humaniser`
   - Confirm deployment settings
   - Wait for deployment

### **Method 2: Vercel Dashboard**

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Add AI Humaniser frontend"
   git push origin main
   ```

2. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Configure settings:
     - **Framework Preset**: Create React App
     - **Root Directory**: `ai-humaniser-frontend`
     - **Build Command**: `npm run build`
     - **Output Directory**: `build`

3. **Add Environment Variables**:
   - Go to Project Settings → Environment Variables
   - Add: `REACT_APP_API_URL` = `http://localhost:5000` (for development)

## 🔗 API Deployment Options

### **Option A: Local API (Development)**

Keep the Flask API running locally during development:

```bash
# Terminal 1: Start API
python ai_model_api.py

# Terminal 2: Start React
cd ai-humaniser-frontend
npm start
```

### **Option B: Cloud API (Production)**

Deploy the Flask API to a cloud service:

#### **Railway (Recommended)**
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

#### **Render**
1. Create a `render.yaml` file:
```yaml
services:
  - type: web
    name: ai-humaniser-api
    env: python
    buildCommand: pip install -r ai_api_requirements.txt
    startCommand: python ai_model_api.py
    envVars:
      - key: PYTHON_VERSION
        value: 3.9
```

#### **Heroku**
```bash
# Create Procfile
echo "web: gunicorn ai_model_api:app" > Procfile

# Deploy
heroku create ai-humaniser-api
git push heroku main
```

## 🔧 Configuration

### **Frontend Configuration**

Update `ai-humaniser-frontend/src/services/aiHumaniserService.js`:

```javascript
// For development
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// For production
// const API_BASE_URL = 'https://your-api-domain.com';
```

### **CORS Configuration**

The Flask API already includes CORS support:

```python
from flask_cors import CORS
app = Flask(__name__)
CORS(app)  # Allows all origins
```

### **Environment Variables**

**Development**:
```bash
REACT_APP_API_URL=http://localhost:5000
```

**Production**:
```bash
REACT_APP_API_URL=https://your-api-domain.com
```

## 📱 Features Available

### **✅ Text Humanization**
- Word replacement using NLTK and WordNet
- Part-of-speech tagging
- Sentence structure preservation

### **✅ Number Formatting**
- Indian number system (lakhs/crores)
- Currency formatting (INR, USD)
- File size humanization

### **✅ AI Detection**
- Vocabulary diversity analysis
- Formal language detection
- Technical jargon identification

### **✅ User Interface**
- Beautiful, responsive design
- File upload/download
- Real-time processing
- Statistics dashboard

## 🧪 Testing

### **Test the API Locally**

```bash
# Test health endpoint
curl http://localhost:5000/api/health

# Test text humanization
curl -X POST http://localhost:5000/api/humanize/text \
  -H "Content-Type: application/json" \
  -d '{"text": "The implementation methodology framework optimization algorithm."}'
```

### **Test the Frontend**

1. **Start both services**:
   ```bash
   # Terminal 1: API
   python ai_model_api.py
   
   # Terminal 2: Frontend
   cd ai-humaniser-frontend
   npm start
   ```

2. **Test features**:
   - Paste AI-generated text
   - Try different processing modes
   - Upload/download files
   - Check statistics

## 🚀 Production Deployment

### **1. Deploy API to Cloud**

Choose one of these options:

**Railway** (Recommended):
```bash
railway login
railway init
railway up
```

**Render**:
- Connect GitHub repository
- Set build command: `pip install -r ai_api_requirements.txt`
- Set start command: `python ai_model_api.py`

### **2. Update Frontend API URL**

In Vercel dashboard:
1. Go to Project Settings → Environment Variables
2. Update `REACT_APP_API_URL` to your deployed API URL
3. Redeploy the frontend

### **3. Test Production**

1. Visit your Vercel URL
2. Test all features
3. Check API connectivity
4. Monitor performance

## 🔍 Troubleshooting

### **Common Issues**

**1. CORS Errors**
```bash
# Ensure Flask API has CORS enabled
from flask_cors import CORS
app = Flask(__name__)
CORS(app)
```

**2. API Connection Failed**
```bash
# Check if API is running
curl http://localhost:5000/api/health

# Check environment variables
echo $REACT_APP_API_URL
```

**3. Build Errors**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

**4. Python Dependencies**
```bash
# Install missing packages
pip install nltk textblob humanize flask flask-cors
```

### **Debug Commands**

```bash
# Check API status
curl http://localhost:5000/api/health

# Test text processing
curl -X POST http://localhost:5000/api/humanize/text \
  -H "Content-Type: application/json" \
  -d '{"text": "Test text"}'

# Check React app
cd ai-humaniser-frontend
npm start
```

## 📊 Monitoring

### **API Health Check**
```bash
curl https://your-api-domain.com/api/health
```

### **Statistics Dashboard**
- Visit your deployed app
- Go to Statistics section
- Monitor processing metrics

### **Error Logs**
- Check Vercel deployment logs
- Monitor API server logs
- Review browser console

## 🎯 Next Steps

1. **Deploy API** to cloud service
2. **Update environment variables** in Vercel
3. **Test all features** in production
4. **Monitor performance** and usage
5. **Add custom domain** (optional)
6. **Set up analytics** (optional)

## 🏆 Success Checklist

- [ ] AI model integrated and working
- [ ] React frontend deployed to Vercel
- [ ] API deployed to cloud service
- [ ] Environment variables configured
- [ ] CORS issues resolved
- [ ] All features tested
- [ ] Performance optimized
- [ ] Error handling implemented

Your **AI Humaniser** is now ready for production! 🚀 