// Test script for the Universal AI Chatbot API

const axios = require('axios');

const API_URL = 'http://localhost:5000/api/chatbot/chat';

// Test questions
const testQuestions = [
  "What is artificial intelligence?",
  "How does machine learning work?",
  "What is 25 * 48?",
  "Show me steel doors",
  "Calculate 15% of 2000",
  "What is Python programming?",
  "Tell me about blockchain",
  "What is cloud computing?",
  "Show me modern windows",
  "How does photosynthesis work?",
  "What is the speed of light?",
  "Who invented the airplane?",
  "What is JavaScript?",
  "Compare steel vs wood doors",
  "What is database?"
];

async function testChatbot() {
  console.log('🤖 Testing Universal AI Chatbot...\n');
  console.log('='.repeat(70));

  for (let i = 0; i < testQuestions.length; i++) {
    const question = testQuestions[i];
    console.log(`\n📝 Question ${i + 1}: "${question}"`);
    console.log('-'.repeat(70));

    try {
      const response = await axios.post(API_URL, {
        message: question,
        projectType: 'Door',
        category: 'Mechanical',
        context: []
      });

      if (response.data.success) {
        console.log(`✅ Status: Success`);
        console.log(`📊 Confidence: ${response.data.confidence || 'N/A'}`);
        console.log(`📷 Images: ${response.data.images?.length || 0}`);
        console.log(`💬 Response Preview:`);
        
        // Show first 200 characters of response
        const preview = response.data.response.substring(0, 200);
        console.log(preview + (response.data.response.length > 200 ? '...' : ''));
        
        if (response.data.suggestions && response.data.suggestions.length > 0) {
          console.log(`💡 Suggestions: ${response.data.suggestions.join(', ')}`);
        }
      } else {
        console.log(`❌ Error: ${response.data.message}`);
      }
    } catch (error) {
      console.log(`❌ Request Failed: ${error.message}`);
      if (error.response) {
        console.log(`   Server Response: ${error.response.status} - ${error.response.statusText}`);
      }
    }

    // Wait a bit between requests
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log('\n' + '='.repeat(70));
  console.log('✅ Testing Complete!\n');
}

// Run the test
testChatbot().catch(console.error);
