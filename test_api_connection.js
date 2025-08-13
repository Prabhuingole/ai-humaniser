/**
 * Test Flask API Connection
 */

async function testAPI() {
  console.log('🧪 Testing Flask API Connection...');
  
  try {
    // Test health endpoint
    const healthResponse = await fetch('http://localhost:5000/api/health');
    const healthData = await healthResponse.json();
    console.log('✅ Health check:', healthData);
    
    // Test text humanization
    const testText = "The implementation methodology framework demonstrates comprehensive functionality through systematic analysis and evaluation processes.";
    
    const humanizeResponse = await fetch('http://localhost:5000/api/humanize/text', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: testText }),
    });
    
    const humanizeData = await humanizeResponse.json();
    console.log('✅ Text humanization:', humanizeData);
    
    // Test comprehensive humanization
    const comprehensiveResponse = await fetch('http://localhost:5000/api/humanize/comprehensive', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: testText }),
    });
    
    const comprehensiveData = await comprehensiveResponse.json();
    console.log('✅ Comprehensive humanization:', comprehensiveData);
    
    console.log('🎉 All API tests passed!');
    
  } catch (error) {
    console.error('❌ API test failed:', error);
  }
}

// Run the test
testAPI(); 