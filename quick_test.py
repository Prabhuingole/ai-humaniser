"""
Quick Test for AI Humaniser Model
Shows immediate output without waiting for input
"""

import sys
import time

# Add the AI detector path to Python path
sys.path.append('../ai_detector/ai_detector')

def quick_test():
    """Quick test with sample text"""
    print("🚀 QUICK TEST - AI HUMANISER MODEL")
    print("=" * 50)
    
    try:
        from main import humanize_text
        print("✅ AI model imported successfully")
        
        # Test text
        test_text = """
        The implementation methodology framework demonstrates comprehensive functionality 
        through systematic analysis and evaluation processes. Furthermore, the system 
        architecture incorporates advanced computational paradigms that facilitate 
        efficient data processing and storage mechanisms. The project encompasses 
        15000000 bytes of data and requires 500000 INR for development.
        """
        
        print("\n📝 ORIGINAL TEXT:")
        print("-" * 40)
        print(test_text.strip())
        
        print("\n🤖 PROCESSING...")
        start_time = time.time()
        humanized_text = humanize_text(test_text)
        processing_time = time.time() - start_time
        
        print("\n✨ HUMANIZED TEXT:")
        print("-" * 40)
        print(humanized_text.strip())
        
        print(f"\n📊 RESULTS:")
        print(f"   Processing time: {processing_time:.3f} seconds")
        print(f"   Original length: {len(test_text)} characters")
        print(f"   Humanized length: {len(humanized_text)} characters")
        print(f"   Changes made: {'Yes' if test_text != humanized_text else 'No'}")
        
        # Show key changes
        if test_text != humanized_text:
            print(f"\n🔍 KEY CHANGES DETECTED:")
            print("-" * 30)
            original_words = test_text.split()
            humanized_words = humanized_text.split()
            
            changes_found = 0
            for i, (orig, hum) in enumerate(zip(original_words, humanized_words)):
                if orig != hum and changes_found < 5:
                    print(f"   '{orig}' → '{hum}'")
                    changes_found += 1
            
            if changes_found == 0:
                print("   (Subtle changes in formatting and punctuation)")
        
        print("\n🎉 TEST COMPLETED SUCCESSFULLY!")
        
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == '__main__':
    quick_test() 