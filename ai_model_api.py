"""
AI Model API Server
Flask-based web API that wraps the standalone AI model for frontend integration
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import time
import os
import sys
from datetime import datetime
from functools import wraps
from supabase import create_client, Client

# Add the AI detector path to Python path
sys.path.append('../ai_detector/ai_detector')

# Import the AI model functions
try:
    from main import humanize_text
    from main import replace_word, clean_symbols
    from main import nltk, TextBlob, wordnet
    print("✅ AI model imported successfully")
except ImportError as e:
    print(f"⚠️ Warning: Could not import AI model: {e}")
    print("Please ensure your AI model files are in the correct location")
    sys.exit(1)

try:
    from humanize import naturalsize
    import humanize
    print("✅ Humanize library imported successfully")
except ImportError as e:
    print(f"⚠️ Warning: Could not import humanize library: {e}")
    # Fallback function
    def naturalsize(size):
        return f"{size} bytes"

# Import functions from standalone_ai_model.py
from standalone_ai_model import humanize_numbers_in_text, detect_ai_indicators, process_text_comprehensive

# Initialize Supabase
supabase_url = os.environ.get("SUPABASE_URL")
supabase_jwt_secret = os.environ.get("SUPABASE_JWT_SECRET")

if not supabase_url or not supabase_jwt_secret:
    print("⚠️ Supabase environment variables not set. Authentication will be disabled.")
    supabase_client = None
else:
    print("✅ Supabase environment variables found. Initializing client.")
    supabase_client: Client = create_client(
        supabase_url, supabase_jwt_secret,
        options={"jwt_secret": supabase_jwt_secret}
    )

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Decorator for token validation
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        # If Supabase is not configured, skip auth
        if not supabase_client:
            return f(*args, **kwargs)

        token = None
        if 'Authorization' in request.headers:
            # Extract token from "Bearer <token>"
            token = request.headers['Authorization'].split(" ")[1]

        if not token:
            return jsonify({'error': 'Token is missing'}), 401
        try:
            # Validate the token with Supabase
            user_response = supabase_client.auth.get_user(token)
            if not user_response.user:
                 raise Exception("Invalid user token")
    except Exception as e:
            return jsonify({'error': f'Token is invalid or expired: {e}'}), 401

        return f(*args, **kwargs)
    return decorated


@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
        return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'version': '1.0.0',
        'services': {
            'ai_model': 'available',
            'text_humanization': 'available',
            'ai_detection': 'available',
            'number_formatting': 'available'
        }
    })
@app.route('/api/humanize/text', methods=['POST'])
@token_required
def humanize_text_endpoint():
    """Humanize text endpoint"""
    try:
        data = request.get_json()
        text = data.get('text', '')
        
        if not text:
            return jsonify({'error': 'Text is required'}), 400
        
        start_time = time.time()
        
        # Process text using the standalone model
        result = process_text_comprehensive(text)
        
        processing_time = time.time() - start_time
        
        return jsonify({
            'humanized_text': result['final_text'],
            'processing_time': round(processing_time, 3),
            'word_count': len(text.split()),
            'changes_made': 'Significant' if text != result['final_text' else 'Minor',
            'success': True
        })
        
    except Exception as e:
        return jsonify({
            'error': str(e),
            'success': False
        }), 500

@app.route('/api/humanize/numbers', methods=['POST'])
@token_required
def humanize_numbers_endpoint():
    """Humanize numbers in text endpoint"""
    try:
        data = request.get_json()
        text = data.get('text', '')
        
        if not text:
            return jsonify({'error': 'Text is required'}), 400
        
        start_time = time.time()

        # Humanize numbers
        humanized_text = humanize_numbers_in_text(text)

        processing_time = time.time() - start_time
        return jsonify({
            'humanized_text': humanized_text,
            'numbers_processed': text != humanized_text,
            'processing_time': round(processing_time, 3),
            'success': True
        })
        
    except Exception as e:
        return jsonify({
            'error': str(e),
            'success': False
        }), 500

@app.route('/api/humanize/comprehensive', methods=['POST'])
@token_required
def humanize_comprehensive_endpoint():
    """Comprehensive text humanization endpoint"""
    try:
        data = request.get_json()
        text = data.get('text', '')

        if not text:
            return jsonify({'error': 'Text is required'}), 400

        start_time = time.time()

        # Process text comprehensively
        result = process_text_comprehensive(text)

        processing_time = time.time() - start_time
    return jsonify({
            'humanized_text': result['final_text'],
            'processing_time': round(processing_time, 3),
            'text_changes': 'Significant' if text != result['humanized_text'] else 'Minor',
            'number_changes': 'Significant' if result['humanized_text'] != result['final_text'] else 'None',
            'total_changes': 'Significant' if text != result['final_text'] else 'Minor',
        'success': True
    })

    except Exception as e:
        return jsonify({
            'error': str(e),
            'success': False
        }), 500

@app.route('/api/detect/ai', methods=['POST'])
@token_required
def detect_ai_endpoint():
    """Detect AI-generated text endpoint"""
    try:
        data = request.get_json()
        text = data.get('text', '')

        if not text:
            return jsonify({'error': 'Text is required'}), 400

        # Detect AI indicators
        ai_result = detect_ai_indicators(text)

        return jsonify({
            'is_ai_generated': ai_result['is_ai_generated'],
            'confidence': ai_result['confidence'],
            'indicators': ai_result['indicators'],
            'analysis': f"Text shows {ai_result['confidence']}% confidence of being AI-generated",
            'success': True
        })

    except Exception as e:
        return jsonify({
            'error': str(e),
            'success': False
        }), 500

@app.route('/api/stats', methods=['GET'])
def get_stats():
    """Get processing statistics"""
    return jsonify({
        'total_processed': 0,  # You can implement a counter if needed
        'average_processing_time': 0.5,
        'success_rate': 100.0,
        'popular_features': ['text_humanization', 'ai_detection',
        'success': True
    })

if __name__ == '__main__':
    print("🚀 Starting AI Model API Server...")
    print("📍 Server will run on http://localhost:5000")
    print("🔗 Available endpoints:")
    print("   - POST /api/humanize/text")
    print("   - POST /api/humanize/numbers") 
    print("   - POST /api/humanize/comprehensive")
    print("   - POST /api/detect/ai")
    print("   - GET  /api/health")
    print("   - GET  /api/stats")
    print("=" * 50)
    
    app.run(host='0.0.0.0', port=5000, debug=True) 
```
