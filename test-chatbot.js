// Quick test script for chatbot API
const axios = require('axios');

const testCases = [
  {
    name: 'Greeting Test',
    message: 'Hello',
    expected: 'greeting response'
  },
  {
    name: 'Door Query with Images',
    message: 'Show me door designs',
    expected: 'door images array'
  },
  {
    name: 'Material Comparison',
    message: 'Compare steel and wood',
    expected: 'comparison with images'
  },
  {
    name: 'Cost Estimation',
    message: 'How much does it cost?',
    expected: 'pricing information'
  }
];

async function testChatbot() {
  console.log('🧪 Starting Chatbot Tests...\n');
  
  const baseURL = 'http://localhost:5000';
  
  for (const test of testCases) {
    try {
      console.log(`\n📝 Test: ${test.name}`);
      console.log(`   Query: "${test.message}"`);
      
      const response = await axios.post(`${baseURL}/api/chatbot/chat`, {
        message: test.message,
        projectType: 'Door',
        category: 'Mechanical',
        context: []
      });
      
      if (response.data.success) {
        console.log(`   ✅ Status: Success`);
        console.log(`   📄 Response: ${response.data.response.substring(0, 100)}...`);
        console.log(`   🖼️  Images: ${response.data.images?.length || 0} images returned`);
        
        if (response.data.autoFillData) {
          console.log(`   ✨ Auto-fill: ${JSON.stringify(response.data.autoFillData)}`);
        }
      } else {
        console.log(`   ❌ Failed: ${response.data.message}`);
      }
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
      if (error.code === 'ECONNREFUSED') {
        console.log(`   ⚠️  Backend server is not running!`);
        console.log(`   💡 Run: cd backend && npm start`);
        break;
      }
    }
  }
  
  console.log('\n✨ Tests Complete!\n');
}

// Run tests
testChatbot();
