"""
Test Script for AI Humaniser Model
Verify that your AI model is working correctly
"""

import sys
import time

# Add the AI detector path to Python path
sys.path.append('../ai_detector/ai_detector')

def test_ai_model():
    """Test the AI model with various inputs"""
    print("🧪 TESTING AI HUMANISER MODEL")
    print("=" * 50)
    
    # Test 1: Basic import
    print("\n1️⃣ Testing Model Import...")
    try:
        from main import humanize_text
        print("✅ AI model imported successfully")
    except ImportError as e:
        print(f"❌ Failed to import AI model: {e}")
        return False
    
    # Test 2: Basic text processing
    print("\n2️⃣ Testing Basic Text Processing...")
    test_text = "The implementation methodology framework demonstrates comprehensive functionality."
    try:
        result = humanize_text(test_text)
        print(f"✅ Text processing successful")
        print(f"   Input: {test_text}")
        print(f"   Output: {result}")
        if result != test_text:
            print("✅ Changes detected - model is working!")
        else:
            print("⚠️ No changes detected - this might be normal for simple text")
    except Exception as e:
        print(f"❌ Text processing failed: {e}")
        return False
    
    # Test 3: Complex AI-generated text
    print("\n3️⃣ Testing Complex AI-Generated Text...")
    complex_text = """
    The implementation methodology framework optimization algorithm demonstrates 
    comprehensive functionality through systematic analysis and evaluation processes. 
    Furthermore, the system architecture incorporates advanced computational paradigms 
    that facilitate efficient data processing and storage mechanisms.
    """
    try:
        result = humanize_text(complex_text)
        print(f"✅ Complex text processing successful")
        print(f"   Original length: {len(complex_text)} characters")
        print(f"   Processed length: {len(result)} characters")
        print(f"   Changes detected: {'Yes' if result != complex_text else 'No'}")
    except Exception as e:
        print(f"❌ Complex text processing failed: {e}")
        return False
    
    # Test 4: Performance test
    print("\n4️⃣ Testing Performance...")
    performance_text = "The optimization algorithm demonstrates comprehensive functionality through systematic analysis." * 10
    try:
        start_time = time.time()
        result = humanize_text(performance_text)
        processing_time = time.time() - start_time
        print(f"✅ Performance test successful")
        print(f"   Processing time: {processing_time:.3f} seconds")
        print(f"   Text length: {len(performance_text)} characters")
        if processing_time < 5.0:
            print("✅ Performance is acceptable")
        else:
            print("⚠️ Processing is slow - consider optimization")
    except Exception as e:
        print(f"❌ Performance test failed: {e}")
        return False
    
    # Test 5: Edge cases
    print("\n5️⃣ Testing Edge Cases...")
    edge_cases = [
        "",  # Empty string
        "Hello world",  # Simple text
        "The quick brown fox jumps over the lazy dog.",  # Common sentence
        "A" * 100,  # Repetitive text
    ]
    
    for i, test_case in enumerate(edge_cases, 1):
        try:
            result = humanize_text(test_case)
            print(f"✅ Edge case {i} passed")
        except Exception as e:
            print(f"❌ Edge case {i} failed: {e}")
            return False
    
    print("\n🎉 ALL TESTS PASSED!")
    print("Your AI model is working correctly!")
    return True

def run_demo():
    """Run a demonstration of the model"""
    print("\n🎬 AI HUMANISER DEMONSTRATION")
    print("=" * 50)
    
    try:
        from main import humanize_text
        
        # Demo text
        demo_text = """
        The implementation methodology framework optimization algorithm demonstrates 
        comprehensive functionality through systematic analysis and evaluation processes. 
        Furthermore, the system architecture incorporates advanced computational paradigms 
        that facilitate efficient data processing and storage mechanisms. The project 
        encompasses 15000000 bytes of data and requires 500000 INR for development.
        """
        
        print("📝 Original AI-Generated Text:")
        print("-" * 40)
        print(demo_text.strip())
        
        print("\n🤖 Processing with AI Humaniser...")
        start_time = time.time()
        humanized_text = humanize_text(demo_text)
        processing_time = time.time() - start_time
        
        print("\n✨ Humanized Text:")
        print("-" * 40)
        print(humanized_text.strip())
        
        print(f"\n📊 Results:")
        print(f"   Processing time: {processing_time:.3f} seconds")
        print(f"   Original length: {len(demo_text)} characters")
        print(f"   Humanized length: {len(humanized_text)} characters")
        print(f"   Changes made: {'Yes' if demo_text != humanized_text else 'No'}")
        
        # Show differences
        if demo_text != humanized_text:
            print("\n🔍 Key Changes Detected:")
            print("-" * 30)
            original_words = demo_text.split()
            humanized_words = humanized_text.split()
            
            for i, (orig, hum) in enumerate(zip(original_words, humanized_words)):
                if orig != hum:
                    print(f"   '{orig}' → '{hum}'")
                    if i >= 5:  # Limit output
                        print("   ... (more changes)")
                        break
        
    except Exception as e:
        print(f"❌ Demo failed: {e}")

def main():
    """Main function"""
    print("🚀 AI HUMANISER - MODEL TESTING")
    print("=" * 50)
    
    if len(sys.argv) > 1:
        if sys.argv[1] == '--demo':
            run_demo()
        elif sys.argv[1] == '--test':
            test_ai_model()
        else:
            print("Usage:")
            print("  python test_ai_model.py --test  # Run tests")
            print("  python test_ai_model.py --demo  # Run demo")
    else:
        # Run both tests and demo
        if test_ai_model():
            print("\n" + "="*50)
            run_demo()

if __name__ == '__main__':
    main() 