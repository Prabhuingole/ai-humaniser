"""
Standalone AI Humaniser Model
Run your AI text humanization model independently
"""

import sys
import os
import re
import time
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

def process_text_comprehensive(text):
    """Process text with both humanization and number formatting"""
    print("\n" + "="*60)
    print("🤖 AI HUMANISER - COMPREHENSIVE PROCESSING")
    print("="*60)
    
    start_time = time.time()
    
    # Step 1: Text Humanization
    print("\n📝 Step 1: Text Humanization")
    print("-" * 40)
    humanized_text = humanize_text(text)
    print(f"Original: {text[:100]}{'...' if len(text) > 100 else ''}")
    print(f"Humanized: {humanized_text[:100]}{'...' if len(humanized_text) > 100 else ''}")
    
    # Step 2: Number Formatting
    print("\n🔢 Step 2: Number Formatting")
    print("-" * 40)
    final_text = humanize_numbers_in_text(humanized_text)
    print(f"With Numbers: {final_text[:100]}{'...' if len(final_text) > 100 else ''}")
    
    # Step 3: AI Detection
    print("\n🔍 Step 3: AI Detection Analysis")
    print("-" * 40)
    ai_result = detect_ai_indicators(text)
    print(f"AI Generated: {ai_result['is_ai_generated']}")
    print(f"Confidence: {ai_result['confidence']}%")
    if ai_result['indicators']:
        print("Indicators:")
        for indicator in ai_result['indicators']:
            print(f"  • {indicator}")
    
    processing_time = time.time() - start_time
    
    print("\n📊 Processing Summary")
    print("-" * 40)
    print(f"Processing Time: {processing_time:.3f} seconds")
    print(f"Original Length: {len(text)} characters")
    print(f"Final Length: {len(final_text)} characters")
    print(f"Changes Made: {'Significant' if text != final_text else 'Minor'}")
    
    return {
        'original_text': text,
        'humanized_text': humanized_text,
        'final_text': final_text,
        'ai_detection': ai_result,
        'processing_time': processing_time
    }

def interactive_mode():
    """Run the model in interactive mode"""
    print("\n" + "="*60)
    print("🎯 AI HUMANISER - INTERACTIVE MODE")
    print("="*60)
    print("Enter your AI-generated text below (type 'quit' to exit)")
    print("Type 'help' for available commands")
    
    while True:
        print("\n" + "-"*40)
        user_input = input("Enter text: ").strip()
        
        if user_input.lower() == 'quit':
            print("👋 Goodbye!")
            break
        elif user_input.lower() == 'help':
            print_help()
            continue
        elif user_input.lower() == 'demo':
            run_demo()
            continue
        elif not user_input:
            print("❌ Please enter some text")
            continue
        
        # Process the text
        result = process_text_comprehensive(user_input)
        
        # Show full results
        print("\n📄 Full Results:")
        print("-" * 40)
        print("ORIGINAL TEXT:")
        print(user_input)
        print("\nHUMANIZED TEXT:")
        print(result['final_text'])
        
        # Ask if user wants to save
        save_choice = input("\n💾 Save results to file? (y/n): ").strip().lower()
        if save_choice == 'y':
            save_results(result)

def run_demo():
    """Run a demonstration with sample text"""
    demo_text = """
    The implementation methodology framework optimization algorithm demonstrates 
    comprehensive functionality through systematic analysis and evaluation processes. 
    Furthermore, the system architecture incorporates advanced computational paradigms 
    that facilitate efficient data processing and storage mechanisms. The project 
    encompasses 15000000 bytes of data and requires 500000 INR for development.
    """
    
    print("\n🎬 Running Demo with Sample Text:")
    print("-" * 40)
    print(demo_text)
    
    result = process_text_comprehensive(demo_text)
    
    print("\n📄 Demo Results:")
    print("-" * 40)
    print("ORIGINAL:")
    print(demo_text)
    print("\nHUMANIZED:")
    print(result['final_text'])

def save_results(result):
    """Save processing results to a file"""
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"ai_humaniser_results_{timestamp}.txt"
    
    try:
        with open(filename, 'w', encoding='utf-8') as f:
            f.write("AI HUMANISER - PROCESSING RESULTS\n")
            f.write("=" * 50 + "\n\n")
            f.write(f"Processing Time: {result['processing_time']:.3f} seconds\n")
            f.write(f"AI Detection Confidence: {result['ai_detection']['confidence']}%\n")
            f.write(f"AI Generated: {result['ai_detection']['is_ai_generated']}\n\n")
            
            f.write("ORIGINAL TEXT:\n")
            f.write("-" * 20 + "\n")
            f.write(result['original_text'] + "\n\n")
            
            f.write("HUMANIZED TEXT:\n")
            f.write("-" * 20 + "\n")
            f.write(result['final_text'] + "\n\n")
            
            if result['ai_detection']['indicators']:
                f.write("AI DETECTION INDICATORS:\n")
                f.write("-" * 25 + "\n")
                for indicator in result['ai_detection']['indicators']:
                    f.write(f"• {indicator}\n")
        
        print(f"✅ Results saved to: {filename}")
    except Exception as e:
        print(f"❌ Error saving results: {e}")

def print_help():
    """Print help information"""
    print("\n📖 HELP - Available Commands:")
    print("-" * 30)
    print("• Enter any text to process it")
    print("• Type 'demo' to run a demonstration")
    print("• Type 'help' to show this help")
    print("• Type 'quit' to exit the program")
    print("\n💡 Tips:")
    print("• The model works best with AI-generated text")
    print("• Longer texts provide better analysis")
    print("• Results can be saved to files")

def batch_process_file(filename):
    """Process text from a file"""
    try:
        with open(filename, 'r', encoding='utf-8') as f:
            text = f.read()
        
        print(f"\n📁 Processing file: {filename}")
        result = process_text_comprehensive(text)
        
        # Save results
        save_results(result)
        
        return result
    except FileNotFoundError:
        print(f"❌ File not found: {filename}")
    except Exception as e:
        print(f"❌ Error processing file: {e}")

def main():
    """Main function"""
    print("🚀 AI HUMANISER - STANDALONE MODEL")
    print("=" * 50)
    print("Your AI text humanization model is ready!")
    
    # Check command line arguments
    if len(sys.argv) > 1:
        if sys.argv[1] == '--demo':
            run_demo()
        elif sys.argv[1] == '--file' and len(sys.argv) > 2:
            batch_process_file(sys.argv[2])
        else:
            print("Usage:")
            print("  python standalone_ai_model.py                    # Interactive mode")
            print("  python standalone_ai_model.py --demo            # Run demo")
            print("  python standalone_ai_model.py --file <filename> # Process file")
    else:
        # Interactive mode
        interactive_mode()

if __name__ == '__main__':
    main() 