/**
 * Simple API Test
 */

async function testAPI() {
  console.log('🧪 Testing Flask API...');
  
  try {
    // Test 1: Health endpoint
    console.log('\n1️⃣ Testing health endpoint...');
    const healthResponse = await fetch('http://localhost:5000/api/health');
    console.log('Health status:', healthResponse.status);
    
    if (healthResponse.ok) {
      const healthData = await healthResponse.json();
      console.log('✅ Health check successful:', healthData);
    } else {
      console.log('❌ Health check failed');
    }
    
    // Test 2: Text humanization
    console.log('\n2️⃣ Testing text humanization...');
    const testText = "The implementation methodology demonstrates comprehensive functionality.";
    
    const humanizeResponse = await fetch('http://localhost:5000/api/humanize/text', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: testText }),
    });
    
    console.log('Humanize status:', humanizeResponse.status);
    
    if (humanizeResponse.ok) {
      const humanizeData = await humanizeResponse.json();
      console.log('✅ Text humanization successful:');
      console.log('Original:', testText);
      console.log('Humanized:', humanizeData.humanized_text);
    } else {
      console.log('❌ Text humanization failed');
    }
    
    console.log('\n🎉 API test completed!');
    
  } catch (error) {
    console.error('❌ API test failed:', error.message);
  }
}

testAPI(); 