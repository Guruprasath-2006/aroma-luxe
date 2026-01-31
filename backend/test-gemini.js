const axios = require('axios');
require('dotenv').config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

async function testGemini() {
  console.log('🔑 API Key:', GEMINI_API_KEY ? `${GEMINI_API_KEY.substring(0, 10)}...` : 'NOT FOUND');
  console.log('🌐 API URL:', GEMINI_API_URL);
  console.log('\n🧪 Testing Gemini AI...\n');

  try {
    const response = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                text: 'Hello! What is 2+2? Please respond in one short sentence.'
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 100,
        }
      },
      {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 10000
      }
    );

    console.log('✅ SUCCESS! Gemini AI is working!\n');
    console.log('📥 Response:', JSON.stringify(response.data, null, 2));
    
    if (response.data?.candidates?.[0]?.content?.parts?.[0]?.text) {
      console.log('\n💬 AI says:', response.data.candidates[0].content.parts[0].text);
    }

  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
    if (error.response) {
      console.error('📊 Status:', error.response.status);
      console.error('📄 Data:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

testGemini();
