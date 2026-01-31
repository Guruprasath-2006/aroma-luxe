const axios = require('axios');

// ================================
// REAL AI CHATBOT using Google Gemini
// Natural language AI with context understanding
// ================================

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyAzmcKV0dHct3NzsGI4O9EoBCP7TE2QEDQ'; // Get free key from https://makersuite.google.com/app/apikey
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

// Product database for recommendations
const productDatabase = {
  door: [
    { 
      id: 'd1',
      url: 'https://images.unsplash.com/photo-1563298723-dcfebaa392e3?w=800&q=80', 
      name: 'Modern Steel Door', 
      type: 'Steel', 
      price: '₹35,000-60,000',
      priceRange: { min: 35000, max: 60000 },
      material: 'Steel',
      features: ['Fire-Resistant', 'Security System', 'Weather-Proof'],
      dimensions: '3ft x 7ft',
      warranty: '5 years',
      installation: '1-2 days',
      description: 'Modern steel door with enhanced security features and fire resistance'
    },
    { 
      id: 'd2',
      url: 'https://images.unsplash.com/photo-1519710889408-a991c4f7ed?w=800&q=80', 
      name: 'Wooden Entry Door', 
      type: 'Wood', 
      price: '₹60,000-90,000',
      priceRange: { min: 60000, max: 90000 },
      material: 'Wood',
      features: ['Sound Insulation', 'Luxury Finish', 'Custom Carving'],
      dimensions: '3ft x 7ft',
      warranty: '3 years',
      installation: '1-2 days',
      description: 'Premium wooden door with classic elegance'
    },
    { 
      id: 'd3',
      url: 'https://images.unsplash.com/photo-1565183928294-7d22f11c0789?w=800&q=80', 
      name: 'Glass Door', 
      type: 'Glass', 
      price: '₹50,000-75,000',
      priceRange: { min: 50000, max: 75000 },
      material: 'Glass',
      features: ['Modern Design', 'Natural Light', 'Space Illusion'],
      dimensions: '3ft x 7ft',
      warranty: '2 years',
      installation: '1 day',
      description: 'Elegant glass door for modern spaces'
    }
  ],
  window: [
    {
      id: 'w1',
      url: 'https://images.unsplash.com/photo-1597218868981-1b68e15f0065?w=800&q=80',
      name: 'UPVC Window',
      type: 'UPVC',
      price: '₹8,000-15,000',
      priceRange: { min: 8000, max: 15000 },
      material: 'UPVC',
      features: ['Energy Efficient', 'Sound Proof', 'Weather Resistant'],
      dimensions: '4ft x 3ft',
      warranty: '10 years',
      installation: '4-6 hours',
      description: 'Modern UPVC windows with excellent insulation'
    },
    {
      id: 'w2',
      url: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800&q=80',
      name: 'Aluminum Window',
      type: 'Aluminum',
      price: '₹6,000-12,000',
      priceRange: { min: 6000, max: 12000 },
      material: 'Aluminum',
      features: ['Lightweight', 'Durable', 'Low Maintenance'],
      dimensions: '4ft x 3ft',
      warranty: '5 years',
      installation: '4-6 hours',
      description: 'Durable aluminum windows for residential and commercial use'
    }
  ],
  roofing: [
    {
      id: 'r1',
      url: 'https://images.unsplash.com/photo-1632836464652-ed5fa2a5de83?w=800&q=80',
      name: 'Metal Roofing',
      type: 'Metal',
      price: '₹250-400/sq.ft',
      priceRange: { min: 250, max: 400 },
      material: 'Metal',
      features: ['Long Lasting', 'Fire Resistant', 'Energy Efficient'],
      warranty: '25 years',
      installation: '3-5 days',
      description: 'Durable metal roofing with excellent longevity'
    },
    {
      id: 'r2',
      url: 'https://images.unsplash.com/photo-1597008641621-cefdcf718025?w=800&q=80',
      name: 'Tile Roofing',
      type: 'Tile',
      price: '₹200-350/sq.ft',
      priceRange: { min: 200, max: 350 },
      material: 'Clay Tile',
      features: ['Classic Look', 'Heat Resistant', 'Eco Friendly'],
      warranty: '50 years',
      installation: '5-7 days',
      description: 'Traditional tile roofing with timeless appeal'
    }
  ],
  gate: [
    {
      id: 'g1',
      url: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800&q=80',
      name: 'Automated Gate',
      type: 'Automatic',
      price: '₹150,000-300,000',
      priceRange: { min: 150000, max: 300000 },
      material: 'Steel',
      features: ['Remote Control', 'Security System', 'Auto-Close'],
      dimensions: '12ft x 8ft',
      warranty: '5 years',
      installation: '2-3 days',
      description: 'Automated gate with smart security features'
    },
    {
      id: 'g2',
      url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
      name: 'Designer Gate',
      type: 'Manual',
      price: '₹80,000-150,000',
      priceRange: { min: 80000, max: 150000 },
      material: 'Iron',
      features: ['Custom Design', 'Rust Proof', 'Security'],
      dimensions: '12ft x 8ft',
      warranty: '3 years',
      installation: '1-2 days',
      description: 'Elegant designer gate with custom patterns'
    }
  ]
};

// System context for AI
const SYSTEM_CONTEXT = `You are an intelligent AI assistant for Velan Engineering, a professional engineering company based in Karur, Tamil Nadu, India. 

Your role:
- Help customers with engineering and construction projects
- Recommend doors, windows, roofing, and gates
- Answer technical questions about engineering
- Provide cost estimates in Indian Rupees (₹)
- Be friendly, professional, and helpful
- Use emojis to make conversations engaging

Company details:
- Name: Velan Engineering
- Location: Karur, Tamil Nadu, India
- Services: Doors, Windows, Roofing, Gates, Complete Engineering Packages
- Contact: +91 9443839900
- Email: velankarur1976@gmail.com

When users ask about products, recommend items from our catalog and suggest they can browse our shop for more options.

Always be concise but informative. Use bullet points and formatting to make responses easy to read.`;

// Main chat function with real AI
exports.getChatResponse = async (req, res) => {
  try {
    const { message, conversationHistory = [] } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    console.log('🤖 AI Chat Request:', message);

    // Check if asking about specific products
    const productType = detectProductType(message.toLowerCase());
    let productRecommendations = [];
    
    if (productType) {
      productRecommendations = recommendProducts(message.toLowerCase(), productType);
    }

    // Build conversation for Gemini AI
    const conversationContext = buildConversationContext(conversationHistory, message);

    // Call Gemini AI
    let aiResponse = '';
    try {
      const geminiResponse = await axios.post(
        `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
        {
          contents: [
            {
              parts: [
                {
                  text: `${SYSTEM_CONTEXT}\n\n${conversationContext}\n\nUser: ${message}\n\nAssistant:`
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          }
        },
        {
          headers: {
            'Content-Type': 'application/json'
          },
          timeout: 10000
        }
      );

      if (geminiResponse.data?.candidates?.[0]?.content?.parts?.[0]?.text) {
        aiResponse = geminiResponse.data.candidates[0].content.parts[0].text.trim();
      } else {
        throw new Error('Invalid AI response format');
      }

    } catch (aiError) {
      console.error('❌ AI Error:', aiError.message);
      // Fallback to smart pattern matching
      aiResponse = getFallbackResponse(message.toLowerCase(), productType);
    }

    // Add product recommendations if relevant
    if (productRecommendations.length > 0) {
      aiResponse += formatProductRecommendations(productRecommendations);
    }

    // Enhance response with quick actions
    const quickActions = generateQuickActions(message.toLowerCase(), productType);

    console.log('✅ AI Response Generated');

    res.json({
      response: aiResponse,
      images: productRecommendations.map(p => ({ url: p.url, name: p.name, price: p.price })),
      quickActions,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('💥 Chatbot Error:', error);
    res.status(500).json({ 
      error: 'Failed to process message',
      response: 'I apologize, but I\'m experiencing technical difficulties. Please try again or contact us at +91 9443839900.'
    });
  }
};

// Helper functions
function detectProductType(message) {
  if (message.match(/\b(door|doors|entrance|entry)\b/i)) return 'door';
  if (message.match(/\b(window|windows|ventilation)\b/i)) return 'window';
  if (message.match(/\b(roof|roofing|ceiling|shed)\b/i)) return 'roofing';
  if (message.match(/\b(gate|gates|main gate|compound)\b/i)) return 'gate';
  return null;
}

function recommendProducts(message, type) {
  if (!productDatabase[type]) return [];
  
  const products = productDatabase[type];
  const budget = extractBudget(message);
  const material = extractMaterial(message);
  
  let filtered = products;
  
  if (budget) {
    filtered = filtered.filter(p => p.priceRange.min <= budget.max && p.priceRange.max >= budget.min);
  }
  
  if (material) {
    filtered = filtered.filter(p => p.material.toLowerCase().includes(material));
  }
  
  return filtered.slice(0, 3);
}

function extractBudget(message) {
  const match = message.match(/(\d+)(?:\s*(?:thousand|k|lakh|lac))?/i);
  if (match) {
    let amount = parseInt(match[1]);
    if (message.match(/lakh|lac/i)) amount *= 100000;
    else if (message.match(/thousand|k/i)) amount *= 1000;
    return { min: amount * 0.8, max: amount * 1.2 };
  }
  return null;
}

function extractMaterial(message) {
  const materials = ['steel', 'wood', 'wooden', 'glass', 'upvc', 'aluminum', 'aluminium', 'metal', 'iron', 'tile', 'clay'];
  for (const mat of materials) {
    if (message.includes(mat)) return mat;
  }
  return null;
}

function buildConversationContext(history, currentMessage) {
  if (!history || history.length === 0) return '';
  
  const recentHistory = history.slice(-4); // Last 4 messages for context
  return recentHistory.map(msg => 
    `${msg.type === 'user' ? 'User' : 'Assistant'}: ${msg.message}`
  ).join('\n');
}

function formatProductRecommendations(products) {
  if (products.length === 0) return '';
  
  let formatted = '\n\n📦 **Recommended Products:**\n\n';
  products.forEach((p, i) => {
    formatted += `${i + 1}. **${p.name}** (${p.material})\n`;
    formatted += `   💰 Price: ${p.price}\n`;
    formatted += `   ✨ Features: ${p.features.join(', ')}\n`;
    formatted += `   📏 Size: ${p.dimensions}\n\n`;
  });
  formatted += '\n🛒 **Browse more products in our shop!**';
  return formatted;
}

function generateQuickActions(message, productType) {
  const actions = [];
  
  if (productType) {
    actions.push(`Show me ${productType} options`);
    actions.push(`What's the price range for ${productType}?`);
  }
  
  actions.push('Get a quote');
  actions.push('Contact support');
  actions.push('Browse products');
  
  return actions.slice(0, 4);
}

function getFallbackResponse(message, productType) {
  // Smart fallback when AI is unavailable
  
  if (message.match(/hello|hi|hey|greetings/i)) {
    return '👋 Hello! I\'m your AI assistant from Velan Engineering. How can I help you today with your engineering and construction needs?';
  }
  
  if (message.match(/price|cost|budget|how much/i)) {
    if (productType) {
      const products = productDatabase[productType];
      if (products && products.length > 0) {
        return `💰 Our ${productType} prices typically range from ${products[0].price} to ${products[products.length - 1].price}, depending on the material and features. Would you like specific recommendations based on your budget?`;
      }
    }
    return '💰 Our prices vary based on materials, size, and features. Could you tell me more about what you\'re looking for? (doors, windows, roofing, or gates)';
  }
  
  if (message.match(/material|what type|which material/i)) {
    if (productType === 'door') {
      return '🚪 We offer doors in:\n• Steel (₹35,000-60,000) - Fire-resistant, secure\n• Wood (₹60,000-90,000) - Luxury, sound insulation\n• Glass (₹50,000-75,000) - Modern, aesthetic\n\nWhich material interests you?';
    }
    if (productType === 'window') {
      return '🪟 We offer windows in:\n• UPVC (₹8,000-15,000) - Energy efficient, soundproof\n• Aluminum (₹6,000-12,000) - Lightweight, durable\n\nWhich would you prefer?';
    }
  }
  
  if (message.match(/contact|phone|call|email/i)) {
    return '📞 **Contact Velan Engineering:**\n\n📱 Phone: +91 9443839900\n📧 Email: velankarur1976@gmail.com\n📍 Location: Karur, Tamil Nadu\n\nFeel free to call us anytime! We\'re here to help. 😊';
  }
  
  if (message.match(/thank|thanks/i)) {
    return '😊 You\'re welcome! Is there anything else I can help you with regarding your engineering project?';
  }
  
  if (productType) {
    return `I can help you with ${productType} selection! Could you tell me:\n• Your budget range?\n• Preferred material?\n• Any specific features you need?\n\nThis will help me recommend the perfect ${productType} for you! 🎯`;
  }
  
  return 'I\'m here to help with all your engineering needs! I can assist you with:\n\n🚪 Doors\n🪟 Windows\n🏠 Roofing\n🚧 Gates\n📦 Complete Engineering Packages\n\nWhat would you like to know more about?';
}

// Legacy endpoint for backwards compatibility
exports.getProductImages = async (req, res) => {
  try {
    const { category } = req.query;
    
    if (!category || !productDatabase[category]) {
      return res.status(400).json({ error: 'Invalid category' });
    }

    const products = productDatabase[category];
    
    res.json({
      images: products.map(p => ({
        url: p.url,
        name: p.name,
        price: p.price,
        material: p.material
      }))
    });

  } catch (error) {
    console.error('Error fetching product images:', error);
    res.status(500).json({ error: 'Failed to fetch product images' });
  }
};
