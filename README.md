# 🤖 AI Humaniser

Transform AI-generated text into natural, human-like content. Bypass AI detection with our advanced text humanization tool.

## ✨ Features

- **🧠 AI Text Humanization**: Convert AI-generated text to natural, human-like content
- **🔍 AI Detection**: Analyze text to determine if it was written by AI or human
- **📊 Plagiarism Checker**: Scan content for duplicate or copied text
- **🔢 Number Formatting**: Humanize numbers and data in text
- **🎨 Beautiful UI**: Modern, responsive design with intuitive interface
- **⚡ Real-time Processing**: Instant results with advanced AI models

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

## 🚀 Quick Start

### Prerequisites

- Python 3.8+
- Node.js 16+
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/ai-humaniser.git
   cd ai-humaniser
   ```

2. **Set up Python environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r ai_api_requirements.txt
   ```

3. **Set up React frontend**
   ```bash
   cd ai-humaniser-frontend
   npm install
   ```

### Running Locally

1. **Start the Flask API server**
   ```bash
   # From project root
   python ai_model_api.py
   ```
   The API will be available at: `http://localhost:5000`

2. **Start the React development server**
   ```bash
   # From ai-humaniser-frontend directory
   npm start
   ```
   The frontend will be available at: `http://localhost:3000`

## 🌐 Deployment

### Frontend (Vercel)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Configure settings:
     - **Framework Preset**: Create React App
     - **Root Directory**: `ai-humaniser-frontend`
     - **Build Command**: `npm run build`
     - **Output Directory**: `build`

3. **Add Environment Variables**
   - Go to Project Settings → Environment Variables
   - Add: `REACT_APP_API_URL` = `http://localhost:5000` (for development)

### Backend (API)

For production, deploy your Flask API to a cloud service:

#### Option 1: Railway (Recommended)
```bash
npm install -g @railway/cli
railway login
railway init
railway up
```

#### Option 2: Render
- Connect GitHub repository
- Set build command: `pip install -r ai_api_requirements.txt`
- Set start command: `python ai_model_api.py`

#### Option 3: Heroku
```bash
echo "web: gunicorn ai_model_api:app" > Procfile
heroku create ai-humaniser-api
git push heroku main
```

## 🔧 Configuration

### Environment Variables

**Development**:
```bash
REACT_APP_API_URL=http://localhost:5000
```

**Production**:
```bash
REACT_APP_API_URL=https://your-api-domain.com
```

### API Endpoints

- `POST /api/humanize/text` - Humanize text
- `POST /api/humanize/numbers` - Humanize numbers in text
- `POST /api/humanize/comprehensive` - Comprehensive text humanization
- `POST /api/detect/ai` - Detect AI-generated text
- `GET /api/health` - Health check
- `GET /api/stats` - Processing statistics

## 🧪 Testing

### Test the API
```bash
# Health check
curl http://localhost:5000/api/health

# Text humanization
curl -X POST http://localhost:5000/api/humanize/text \
  -H "Content-Type: application/json" \
  -d '{"text": "The implementation methodology framework demonstrates comprehensive functionality."}'
```

### Test the Frontend
1. Start both services (API + React)
2. Visit `http://localhost:3000`
3. Test all features: text humanization, AI detection, plagiarism checking

## 📱 Features in Detail

### Text Humanization
- Word replacement using NLTK and WordNet
- Part-of-speech tagging
- Sentence structure preservation
- Natural language processing

### AI Detection
- Vocabulary diversity analysis
- Formal language detection
- Technical jargon identification
- Confidence scoring

### Number Formatting
- Indian number system (lakhs/crores)
- Currency formatting (INR, USD)
- File size humanization
- Time-based formatting

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- NLTK for natural language processing
- TextBlob for text analysis
- Flask for the API framework
- React for the frontend framework

## 📞 Support

If you have any questions or need help, please open an issue on GitHub or contact us.

---

**Made with ❤️ for better AI-human interaction** 