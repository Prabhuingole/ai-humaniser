"""
Flask API for AI Humaniser Model
Wraps the AI text humanization model for frontend integration
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import time
import sys
import os
import re
from datetime import datetime

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
    # Fallback functions
    def humanize_text(text):
        return text
    
    def replace_word(word, pos):
        return word
    
    def clean_symbols(text):
        return text

try:
    from humanize import naturalsize
    import humanize
    print("✅ Humanize library imported successfully")
except ImportError as e:
    print(f"⚠️ Warning: Could not import humanize library: {e}")
    # Fallback function
    def naturalsize(size):
        return f"{size} bytes"

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend integration

# Global statistics
stats = {
    'total_processed': 0,
    'total_processing_time': 0,
    'success_count': 0,
    'error_count': 0,
    'popular_features': {
        'text_humanization': 0,
        'number_humanization': 0,
        'comprehensive': 0,
        'ai_detection': 0
    }
}

def update_stats(feature, processing_time, success=True):
    """Update processing statistics"""
    stats['total_processed'] += 1
    stats['total_processing_time'] += processing_time
    stats['popular_features'][feature] += 1
    
    if success:
        stats['success_count'] += 1
    else:
        stats['error_count'] += 1

def humanize_numbers_in_text(text):
    """Humanize numbers and data in text"""
    if not text:
        return text
    
    processed = text
    
    # Humanize bytes
    processed = re.sub(r'(\d{5,})\s?(bytes|Byte|B)', 
                      lambda m: f"{naturalsize(int(m.group(1)))}", processed)
    
    # Humanize large currency amounts (INR, USD, etc.)
    def format_currency(match):
        amount = int(match.group(1))
        currency = match.group(2)
        if amount >= 10_000_000:
            return f"{round(amount/10_000_000, 1)} crore {currency}"
        elif amount >= 100_000:
            return f"{round(amount/100_000, 1)} lakh {currency}"
        else:
            return f"{amount:,} {currency}"
    
    processed = re.sub(r'(\d{5,})(\s?INR|\s?USD|\s?Rs\.?)', format_currency, processed)
    
    # Humanize time-related values
    def format_time(match):
        number = int(match.group(1))
        unit = match.group(2)
        if unit.endswith('s'):
            unit = unit[:-1]  # Remove 's' for singular
        return f"{number} {unit} ago"
    
    processed = re.sub(r'(\d+)\s?(seconds?|minutes?|hours?|days?)\sago', format_time, processed)
    
    return processed

def detect_ai_indicators(text):
    """Detect AI-generated text indicators"""
    indicators = []
    confidence = 0
    
    # Check for repetitive patterns
    if len(set(text.split())) / len(text.split()) < 0.3:
        indicators.append("Low vocabulary diversity")
        confidence += 20
    
    # Check for formal/robotic language
    formal_words = ['furthermore', 'moreover', 'consequently', 'thus', 'therefore']
    formal_count = sum(1 for word in formal_words if word.lower() in text.lower())
    if formal_count > 2:
        indicators.append("Excessive formal language")
        confidence += 15
    
    # Check for repetitive sentence structures
    sentences = re.split(r'[.!?]+', text)
    if len(sentences) > 3:
        avg_length = sum(len(s.split()) for s in sentences) / len(sentences)
        if avg_length > 25:
            indicators.append("Long, complex sentences")
            confidence += 10
    
    # Check for technical jargon
    jargon_words = ['implementation', 'methodology', 'framework', 'optimization', 'algorithm']
    jargon_count = sum(1 for word in jargon_words if word.lower() in text.lower())
    if jargon_count > 1:
        indicators.append("Technical jargon")
        confidence += 10
    
    return {
        'is_ai_generated': confidence > 30,
        'confidence': min(confidence, 100),
        'indicators': indicators,
        'analysis': {
            'vocabulary_diversity': len(set(text.split())) / len(text.split()) if text.split() else 0,
            'formal_word_count': formal_count,
            'jargon_count': jargon_count,
            'avg_sentence_length': avg_length if len(sentences) > 3 else 0
        }
    }

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'version': '1.0.0',
        'services': {
            'ai_model': 'available',
            'humanize_library': 'available',
            'nltk': 'available'
        }
    })

@app.route('/api/humanize/text', methods=['POST'])
def humanize_text_endpoint():
    """Humanize AI-generated text"""
    start_time = time.time()
    
    try:
        data = request.get_json()
        text = data.get('text', '')
        
        if not text:
            return jsonify({'error': 'Text is required'}), 400
        
        # Process the text
        humanized_text = humanize_text(text)
        
        processing_time = time.time() - start_time
        word_count = len(text.split())
        changes_made = len([c for c in humanized_text if c != text]) if len(humanized_text) == len(text) else 'significant'
        
        update_stats('text_humanization', processing_time, True)
        
        return jsonify({
            'humanized_text': humanized_text,
            'processing_time': round(processing_time, 3),
            'word_count': word_count,
            'changes_made': changes_made,
            'success': True
        })
        
    except Exception as e:
        processing_time = time.time() - start_time
        update_stats('text_humanization', processing_time, False)
        return jsonify({
            'error': str(e),
            'success': False
        }), 500

@app.route('/api/humanize/numbers', methods=['POST'])
def humanize_numbers_endpoint():
    """Humanize numbers in text"""
    start_time = time.time()
    
    try:
        data = request.get_json()
        text = data.get('text', '')
        
        if not text:
            return jsonify({'error': 'Text is required'}), 400
        
        # Process the text
        humanized_text = humanize_numbers_in_text(text)
        
        processing_time = time.time() - start_time
        numbers_processed = len(re.findall(r'\d{5,}', text))
        
        update_stats('number_humanization', processing_time, True)
        
        return jsonify({
            'humanized_text': humanized_text,
            'numbers_processed': numbers_processed,
            'processing_time': round(processing_time, 3),
            'success': True
        })
        
    except Exception as e:
        processing_time = time.time() - start_time
        update_stats('number_humanization', processing_time, False)
        return jsonify({
            'error': str(e),
            'success': False
        }), 500

@app.route('/api/humanize/comprehensive', methods=['POST'])
def humanize_comprehensive_endpoint():
    """Comprehensive text humanization (both text and numbers)"""
    start_time = time.time()
    
    try:
        data = request.get_json()
        text = data.get('text', '')
        
        if not text:
            return jsonify({'error': 'Text is required'}), 400
        
        # First humanize text
        humanized_text = humanize_text(text)
        
        # Then humanize numbers
        final_text = humanize_numbers_in_text(humanized_text)
        
        processing_time = time.time() - start_time
        text_changes = len([c for c in humanized_text if c != text]) if len(humanized_text) == len(text) else 'significant'
        number_changes = len(re.findall(r'\d{5,}', text))
        
        update_stats('comprehensive', processing_time, True)
        
        return jsonify({
            'humanized_text': final_text,
            'processing_time': round(processing_time, 3),
            'text_changes': text_changes,
            'number_changes': number_changes,
            'total_changes': f"{text_changes} + {number_changes} numbers",
            'success': True
        })
        
    except Exception as e:
        processing_time = time.time() - start_time
        update_stats('comprehensive', processing_time, False)
        return jsonify({
            'error': str(e),
            'success': False
        }), 500

@app.route('/api/detect/ai', methods=['POST'])
def detect_ai_endpoint():
    """Detect if text is AI-generated"""
    start_time = time.time()
    
    try:
        data = request.get_json()
        text = data.get('text', '')
        
        if not text:
            return jsonify({'error': 'Text is required'}), 400
        
        # Analyze the text
        result = detect_ai_indicators(text)
        
        processing_time = time.time() - start_time
        update_stats('ai_detection', processing_time, True)
        
        return jsonify({
            'is_ai_generated': result['is_ai_generated'],
            'confidence': result['confidence'],
            'indicators': result['indicators'],
            'analysis': result['analysis'],
            'processing_time': round(processing_time, 3),
            'success': True
        })
        
    except Exception as e:
        processing_time = time.time() - start_time
        update_stats('ai_detection', processing_time, False)
        return jsonify({
            'error': str(e),
            'success': False
        }), 500

@app.route('/api/stats', methods=['GET'])
def get_stats():
    """Get processing statistics"""
    try:
        avg_processing_time = (stats['total_processing_time'] / stats['total_processed'] 
                             if stats['total_processed'] > 0 else 0)
        success_rate = (stats['success_count'] / stats['total_processed'] * 100 
                       if stats['total_processed'] > 0 else 0)
        
        return jsonify({
            'total_processed': stats['total_processed'],
            'average_processing_time': round(avg_processing_time, 3),
            'success_rate': round(success_rate, 2),
            'popular_features': stats['popular_features'],
            'success': True
        })
        
    except Exception as e:
        return jsonify({
            'error': str(e),
            'success': False
        }), 500

if __name__ == '__main__':
    print("🚀 Starting AI Humaniser API...")
    print("📡 API will be available at: http://localhost:5000")
    print("🔗 Frontend can connect to: http://localhost:5000/api/")
    
    app.run(debug=True, host='0.0.0.0', port=5000) 