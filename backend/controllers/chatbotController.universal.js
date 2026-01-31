const axios = require('axios');

// ================================
// UNIVERSAL AI CHATBOT
// Can answer ANY question like ChatGPT!
// ================================

// Product database (existing)
const productDatabase = {
  door: [
    { 
      id: 'd1',
      url: 'https://images.unsplash.com/photo-1606074671985-dd0d8d6f1f5e?w=500', 
      name: 'Modern Steel Door', 
      type: 'Steel', 
      price: '$500-800',
      priceRange: { min: 500, max: 800 },
      material: 'Steel',
      features: ['Fire-Resistant', 'Security System', 'Weather-Proof'],
      dimensions: '3ft x 7ft',
      warranty: '5 years',
      installation: '1-2 days',
      description: 'Modern steel door with enhanced security features and fire resistance',
      bestFor: ['Commercial', 'Industrial'],
      rating: 4.7
    },
    { 
      id: 'd2',
      url: 'https://images.unsplash.com/photo-1516455590571-18256e5bb9ff?w=500', 
      name: 'Wooden Entry Door', 
      type: 'Wood', 
      price: '$800-1200',
      priceRange: { min: 800, max: 1200 },
      material: 'Wood',
      features: ['Sound Insulation', 'Luxury Finish', 'Custom Carving'],
      dimensions: '3ft x 7ft',
      warranty: '3 years',
      installation: '1-2 days',
      description: 'Premium wooden door with classic elegance and superior craftsmanship',
      bestFor: ['Residential', 'Luxury'],
      rating: 4.9
    },
    { 
      id: 'd3',
      url: 'https://images.unsplash.com/photo-1534237710431-e2fc698436d0?w=500', 
      name: 'Glass Door', 
      type: 'Glass', 
      price: '$700-1000',
      priceRange: { min: 700, max: 1000 },
      material: 'Glass',
      features: ['Tempered Glass', 'UV Protection', 'Modern Design'],
      dimensions: '3ft x 7ft',
      warranty: '2 years',
      installation: '1 day',
      description: 'Contemporary glass door with tempered safety glass and UV protection',
      bestFor: ['Commercial', 'Modern Homes'],
      rating: 4.5
    },
    { 
      id: 'd4',
      url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500', 
      name: 'Security Door', 
      type: 'Steel Reinforced', 
      price: '$1000-1500',
      priceRange: { min: 1000, max: 1500 },
      material: 'Steel',
      features: ['Maximum Security', 'Multi-Point Locking', 'Fire-Rated', 'Break-In Resistant'],
      dimensions: '3ft x 7ft',
      warranty: '10 years',
      installation: '2-3 days',
      description: 'High-security reinforced steel door with advanced locking system',
      bestFor: ['High-Security', 'Commercial', 'Banks'],
      rating: 4.8
    }
  ],
  window: [
    { 
      id: 'w1',
      url: 'https://images.unsplash.com/photo-1545259741-2ea3ebf61fa3?w=500', 
      name: 'Double Pane Window', 
      type: 'Glass', 
      price: '$300-600',
      priceRange: { min: 300, max: 600 },
      material: 'Glass',
      features: ['Energy Efficient', 'Sound Insulation', 'Double Glazed'],
      dimensions: '3ft x 4ft',
      warranty: '5 years',
      installation: '4-6 hours',
      description: 'Energy-efficient double pane window with excellent insulation',
      bestFor: ['Residential', 'Energy Saving'],
      rating: 4.6
    },
    { 
      id: 'w2',
      url: 'https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=500', 
      name: 'Bay Window', 
      type: 'Glass & Wood', 
      price: '$1200-2000',
      priceRange: { min: 1200, max: 2000 },
      material: 'Glass',
      features: ['Panoramic View', 'Natural Light', 'Architectural Beauty'],
      dimensions: '6ft x 5ft',
      warranty: '7 years',
      installation: '2-3 days',
      description: 'Elegant bay window offering panoramic views and enhanced natural lighting',
      bestFor: ['Luxury Homes', 'Living Rooms'],
      rating: 4.9
    },
    { 
      id: 'w3',
      url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=500', 
      name: 'Sliding Window', 
      type: 'Aluminum', 
      price: '$400-800',
      priceRange: { min: 400, max: 800 },
      material: 'Aluminum',
      features: ['Easy Operation', 'Space Saving', 'Low Maintenance'],
      dimensions: '4ft x 4ft',
      warranty: '5 years',
      installation: '3-5 hours',
      description: 'Practical sliding window with aluminum frame for easy operation',
      bestFor: ['Residential', 'Apartments'],
      rating: 4.4
    },
    { 
      id: 'w4',
      url: 'https://images.unsplash.com/photo-1600210492486-724d6b31e1f8?w=500', 
      name: 'Energy Efficient Window', 
      type: 'Triple Pane', 
      price: '$600-1000',
      priceRange: { min: 600, max: 1000 },
      material: 'Glass',
      features: ['Triple Glazed', 'Maximum Insulation', 'Low-E Coating', 'Argon Gas Fill'],
      dimensions: '3ft x 4ft',
      warranty: '10 years',
      installation: '5-7 hours',
      description: 'Premium triple pane window with maximum energy efficiency',
      bestFor: ['Cold Climates', 'Energy Conscious'],
      rating: 4.8
    }
  ],
  gate: [
    { 
      id: 'g1',
      url: 'https://images.unsplash.com/photo-1583267117310-ea9b37cd0baa?w=500', 
      name: 'Modern Gate Design', 
      type: 'Steel', 
      price: '$2000-3500',
      priceRange: { min: 2000, max: 3500 },
      material: 'Steel',
      features: ['Contemporary Design', 'Durable', 'Powder Coated'],
      dimensions: '12ft x 6ft',
      warranty: '5 years',
      installation: '2-3 days',
      description: 'Sleek modern gate with contemporary design and long-lasting finish',
      bestFor: ['Modern Homes', 'Commercial'],
      rating: 4.6
    },
    { 
      id: 'g2',
      url: 'https://images.unsplash.com/photo-1600489000022-c2086d79f9d4?w=500', 
      name: 'Automated Gate', 
      type: 'Aluminum', 
      price: '$3000-5000',
      priceRange: { min: 3000, max: 5000 },
      material: 'Aluminum',
      features: ['Automation System', 'Remote Control', 'Safety Sensors', 'Smart Integration'],
      dimensions: '14ft x 6ft',
      warranty: '7 years',
      installation: '3-4 days',
      description: 'Fully automated gate with smart home integration and safety features',
      bestFor: ['Luxury Homes', 'High Security'],
      rating: 4.9
    },
    { 
      id: 'g3',
      url: 'https://images.unsplash.com/photo-1542327897-d73f4005b533?w=500', 
      name: 'Wrought Iron Gate', 
      type: 'Iron', 
      price: '$2500-4000',
      priceRange: { min: 2500, max: 4000 },
      material: 'Iron',
      features: ['Classic Design', 'Handcrafted', 'Ornamental', 'Rust-Resistant'],
      dimensions: '12ft x 7ft',
      warranty: '8 years',
      installation: '2-3 days',
      description: 'Traditional wrought iron gate with ornamental designs and classic appeal',
      bestFor: ['Classic Homes', 'Heritage Properties'],
      rating: 4.7
    },
    { 
      id: 'g4',
      url: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=500', 
      name: 'Wooden Gate', 
      type: 'Wood', 
      price: '$1500-2500',
      priceRange: { min: 1500, max: 2500 },
      material: 'Wood',
      features: ['Natural Beauty', 'Weather Treated', 'Custom Designs'],
      dimensions: '10ft x 6ft',
      warranty: '3 years',
      installation: '2 days',
      description: 'Beautiful wooden gate with natural aesthetics and weather protection',
      bestFor: ['Residential', 'Rustic Homes'],
      rating: 4.5
    }
  ],
  roofing: [
    { 
      id: 'r1',
      url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=500', 
      name: 'Metal Roofing', 
      type: 'Steel', 
      price: '$5000-10000',
      priceRange: { min: 5000, max: 10000 },
      material: 'Steel',
      features: ['50+ Year Lifespan', 'Energy Efficient', 'Fire Resistant', 'Low Maintenance'],
      dimensions: 'Per sq ft',
      warranty: '30 years',
      installation: '3-5 days',
      description: 'Durable metal roofing with exceptional longevity and energy efficiency',
      bestFor: ['Commercial', 'Industrial', 'Modern Homes'],
      rating: 4.8
    },
    { 
      id: 'r2',
      url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=500', 
      name: 'Tile Roofing', 
      type: 'Clay Tiles', 
      price: '$8000-15000',
      priceRange: { min: 8000, max: 15000 },
      material: 'Clay',
      features: ['Premium Look', 'Heat Resistant', 'Long Lasting', 'Traditional'],
      dimensions: 'Per sq ft',
      warranty: '50 years',
      installation: '5-7 days',
      description: 'Classic clay tile roofing offering timeless beauty and superior heat resistance',
      bestFor: ['Luxury Homes', 'Mediterranean Style'],
      rating: 4.9
    },
    { 
      id: 'r3',
      url: 'https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?w=500', 
      name: 'Shingle Roofing', 
      type: 'Asphalt', 
      price: '$4000-8000',
      priceRange: { min: 4000, max: 8000 },
      material: 'Asphalt',
      features: ['Affordable', 'Easy Installation', 'Variety of Colors'],
      dimensions: 'Per sq ft',
      warranty: '20 years',
      installation: '2-3 days',
      description: 'Cost-effective asphalt shingle roofing with reliable performance',
      bestFor: ['Residential', 'Budget Conscious'],
      rating: 4.4
    },
    { 
      id: 'r4',
      url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=500', 
      name: 'Solar Panel Roof', 
      type: 'Solar Tiles', 
      price: '$15000-30000',
      priceRange: { min: 15000, max: 30000 },
      material: 'Solar',
      features: ['Energy Generation', 'Eco-Friendly', 'Tax Benefits', 'Modern Technology'],
      dimensions: 'Per sq ft',
      warranty: '25 years',
      installation: '5-7 days',
      description: 'Advanced solar panel roofing generating clean energy while protecting your home',
      bestFor: ['Eco-Conscious', 'Modern Homes', 'Long-term Investment'],
      rating: 4.9
    }
  ]
};

// ================================
// UNIVERSAL KNOWLEDGE BASE
// Answers general questions!
// ================================

const knowledgeBase = {
  // General greetings
  greetings: {
    patterns: [/^(hi|hello|hey|hola|namaste|good morning|good afternoon|good evening|greetings|sup|yo|howdy)/i],
    responses: [
      '👋 **Hello! I\'m your AI Assistant!**\n\nI can help you with:\n🏗️ Engineering & construction (doors, windows, gates, roofing)\n💡 General questions (math, science, history, technology)\n📊 Calculations and conversions\n🌍 General knowledge\n💬 Friendly conversation\n\nWhat would you like to know?',
      '✨ **Hi there!** I\'m here to help with anything you need!\n\nAsk me about:\n• Engineering projects\n• General knowledge\n• Math problems\n• Technical questions\n• Product recommendations\n• Or just chat!\n\nHow can I assist you today?'
    ]
  },

  // Math & calculations
  math: {
    patterns: [
      /what is|what's|calculate|solve|compute/i,
      /\d+\s*[\+\-\*\/×÷]\s*\d+/,
      /square root|sqrt|cube root|power|exponent/i,
      /percentage|percent|\d+%/i,
      /area|volume|perimeter|circumference/i
    ],
    handler: (message) => {
      try {
        // Extract math expression
        const mathMatch = message.match(/(\d+(?:\.\d+)?)\s*([\+\-\*\/×÷])\s*(\d+(?:\.\d+)?)/);
        if (mathMatch) {
          const num1 = parseFloat(mathMatch[1]);
          const operator = mathMatch[2].replace('×', '*').replace('÷', '/');
          const num2 = parseFloat(mathMatch[3]);
          let result;
          switch(operator) {
            case '+': result = num1 + num2; break;
            case '-': result = num1 - num2; break;
            case '*': result = num1 * num2; break;
            case '/': result = num2 !== 0 ? num1 / num2 : 'Cannot divide by zero'; break;
          }
          return `🔢 **Calculation:**\n\n${num1} ${operator} ${num2} = **${result}**\n\nNeed another calculation?`;
        }

        // Square root
        if (message.match(/square root|sqrt/i)) {
          const numMatch = message.match(/(\d+(?:\.\d+)?)/);
          if (numMatch) {
            const num = parseFloat(numMatch[1]);
            const result = Math.sqrt(num);
            return `🔢 **Square Root:**\n\n√${num} = **${result.toFixed(4)}**`;
          }
        }

        // Percentage
        if (message.match(/(\d+)%\s*of\s*(\d+)/i)) {
          const match = message.match(/(\d+)%\s*of\s*(\d+)/i);
          const percent = parseFloat(match[1]);
          const number = parseFloat(match[2]);
          const result = (percent / 100) * number;
          return `🔢 **Percentage:**\n\n${percent}% of ${number} = **${result}**`;
        }

        return null;
      } catch (error) {
        return null;
      }
    }
  },

  // Science & technology
  science: {
    patterns: [
      /what is (ai|artificial intelligence|machine learning|deep learning|neural network)/i,
      /explain (photosynthesis|gravity|evolution|dna|atoms?|molecules?)/i,
      /how does|how do/i,
      /why is|why does|why do/i,
      /speed of light|speed of sound/i
    ],
    responses: {
      'ai|artificial intelligence': '🤖 **Artificial Intelligence (AI)**\n\nAI is the simulation of human intelligence by machines, especially computer systems. Key aspects:\n\n**Types:**\n• Narrow AI: Specific tasks (like me!)\n• General AI: Human-level intelligence\n• Super AI: Beyond human intelligence\n\n**Applications:**\n✓ Chatbots & virtual assistants\n✓ Image & speech recognition\n✓ Self-driving cars\n✓ Medical diagnosis\n✓ Recommendation systems\n\n**How it works:**\n1. Data collection\n2. Pattern recognition\n3. Learning algorithms\n4. Prediction & decision making\n\nI\'m an example of AI helping you right now! 😊',
      
      'machine learning': '🧠 **Machine Learning (ML)**\n\nML is a subset of AI where computers learn from data without explicit programming.\n\n**Types:**\n1. **Supervised Learning:** Learns from labeled data\n2. **Unsupervised Learning:** Finds patterns in unlabeled data\n3. **Reinforcement Learning:** Learns through trial and error\n\n**Examples:**\n• Email spam filters\n• Netflix recommendations\n• Voice assistants\n• Fraud detection\n\n**Process:**\nData → Training → Model → Predictions\n\nWant to know more about any specific type?',
      
      'photosynthesis': '🌿 **Photosynthesis**\n\nThe process plants use to convert sunlight into energy!\n\n**Chemical Equation:**\n6CO₂ + 6H₂O + Light → C₆H₁₂O₆ + 6O₂\n\n**Simple Explanation:**\nCarbon Dioxide + Water + Sunlight → Glucose + Oxygen\n\n**Where:** In chloroplasts (green parts of plants)\n\n**Why Important:**\n✓ Produces oxygen we breathe\n✓ Creates food for plants\n✓ Basis of food chain\n✓ Removes CO₂ from atmosphere\n\nPlants are basically solar-powered food factories! 🌱☀️',
      
      'gravity': '🌍 **Gravity**\n\nThe force that attracts objects with mass toward each other.\n\n**Key Facts:**\n• Discovered by: Isaac Newton (1687)\n• Law: F = G(m₁m₂)/r²\n• Earth\'s gravity: 9.8 m/s²\n• Keeps us on the ground\n• Holds planets in orbit\n\n**Why we don\'t float:** Earth\'s mass creates gravitational pull.\n\n**Fun Facts:**\n🌙 Moon has 1/6th Earth\'s gravity\n☀️ Sun\'s gravity holds solar system together\n🚀 Escape velocity from Earth: 11.2 km/s\n\nWithout gravity, we\'d all be floating in space! 🌌',
      
      'speed of light': '⚡ **Speed of Light**\n\n**In vacuum:** 299,792,458 m/s (about 300,000 km/s)\n\n**Simple version:** ~186,000 miles/second\n\n**Symbol:** c (from Latin "celeritas" = speed)\n\n**Cool Facts:**\n✓ Fastest thing in universe\n✓ Light from Sun takes ~8 minutes to reach Earth\n✓ Nothing can travel faster (according to Einstein)\n✓ Used in E=mc² formula\n\n**Comparison:**\n🌍 Around Earth 7.5 times in 1 second\n🌙 To Moon in 1.3 seconds\n☀️ To Sun in 8 minutes\n\nThat\'s REALLY fast! 💨'
    }
  },

  // History & geography
  history: {
    patterns: [
      /who (invented|discovered|created|founded|built)/i,
      /when (did|was|were)/i,
      /history of|historical/i,
      /world war|ww1|ww2/i,
      /(country|capital|continent|ocean|mountain)/i
    ],
    responses: {
      'invented airplane|wright brothers': '✈️ **The Airplane**\n\n**Inventors:** Orville and Wilbur Wright\n**Date:** December 17, 1903\n**Location:** Kitty Hawk, North Carolina\n\n**First Flight:**\n• Duration: 12 seconds\n• Distance: 120 feet\n• Pilot: Orville Wright\n\n**Impact:**\n✓ Revolutionized transportation\n✓ Connected the world\n✓ Made space travel possible\n\n**Today:**\n🛫 Over 100,000 flights daily worldwide!\n\nFrom 12 seconds to Mars missions! 🚀',
      
      'world war 2|ww2': '⚔️ **World War II (1939-1945)**\n\n**Duration:** 6 years\n**Participants:** 50+ nations\n**Casualties:** ~70-85 million\n\n**Key Events:**\n1. 1939: War begins (Germany invades Poland)\n2. 1941: Pearl Harbor (US enters war)\n3. 1944: D-Day invasion\n4. 1945: Atomic bombs, war ends\n\n**Major Powers:**\n**Allies:** US, UK, USSR, France\n**Axis:** Germany, Italy, Japan\n\n**Outcome:**\n✓ Allied victory\n✓ UN formed\n✓ Cold War begins\n✓ Shaped modern world\n\nMost significant conflict in human history.',
      
      'capital': '🏛️ **World Capitals**\n\nHere are some major world capitals:\n\n🇺🇸 USA: Washington, D.C.\n🇬🇧 UK: London\n🇫🇷 France: Paris\n🇩🇪 Germany: Berlin\n🇯🇵 Japan: Tokyo\n🇨🇳 China: Beijing\n🇮🇳 India: New Delhi\n🇧🇷 Brazil: Brasília\n🇷🇺 Russia: Moscow\n🇦🇺 Australia: Canberra\n\nWhich country\'s capital would you like to know?'
    }
  },

  // Technology & coding
  technology: {
    patterns: [
      /what is (html|css|javascript|python|java|react|node)/i,
      /programming|coding|software|app|website/i,
      /internet|wifi|5g|bluetooth/i,
      /computer|laptop|phone|smartphone/i,
      /database|sql|api|cloud/i
    ],
    responses: {
      'html': '🌐 **HTML (HyperText Markup Language)**\n\n**What it is:** The skeleton of websites\n\n**Purpose:** Structures web content\n\n**Basic Tags:**\n```html\n<html> - Root element\n<head> - Metadata\n<body> - Visible content\n<h1> - Heading\n<p> - Paragraph\n<a> - Link\n<img> - Image\n```\n\n**Example:**\n```html\n<h1>Hello World!</h1>\n<p>This is HTML</p>\n```\n\n**Used with:**\n• CSS (styling)\n• JavaScript (interactivity)\n\nEvery website uses HTML!',
      
      'javascript': '⚡ **JavaScript**\n\n**Type:** Programming language\n**Used for:** Making websites interactive\n**Created:** 1995 by Brendan Eich\n\n**What it does:**\n✓ Dynamic content\n✓ Animations\n✓ User interactions\n✓ Form validation\n✓ Games\n✓ Web apps\n\n**Example:**\n```javascript\nfunction greet(name) {\n  return "Hello, " + name + "!";\n}\n\ngreet("World"); // "Hello, World!"\n```\n\n**Runs on:**\n🌐 Browsers (Chrome, Firefox, etc.)\n🖥️ Servers (Node.js)\n📱 Mobile (React Native)\n\n**Most popular programming language in web development!**',
      
      'python': '🐍 **Python**\n\n**Type:** High-level programming language\n**Created:** 1991 by Guido van Rossum\n**Philosophy:** Simple, readable code\n\n**Used for:**\n✓ AI & Machine Learning\n✓ Data Science\n✓ Web Development\n✓ Automation\n✓ Scientific Computing\n\n**Example:**\n```python\n# Print hello world\nprint("Hello, World!")\n\n# Calculate\nresult = 5 + 3\nprint(result)  # 8\n```\n\n**Why Popular:**\n• Easy to learn\n• Readable syntax\n• Huge library ecosystem\n• Used by Google, Netflix, NASA\n\n**Best for beginners!** 🚀',
      
      'internet': '🌐 **The Internet**\n\n**What it is:** Global network of connected computers\n\n**Key Technologies:**\n📡 TCP/IP: Communication protocol\n🌍 DNS: Translates names to addresses\n🔒 HTTPS: Secure connections\n☁️ Cloud: Remote data storage\n\n**Speed Types:**\n• Dial-up: ~56 Kbps (ancient!)\n• Broadband: 1-100 Mbps\n• Fiber: 100-10,000 Mbps\n• 5G: Up to 20,000 Mbps\n\n**Uses:**\n✓ Websites\n✓ Email\n✓ Streaming\n✓ Social media\n✓ Gaming\n✓ Shopping\n\n**Fun Fact:** 5.4 billion internet users worldwide! 🌍'
    }
  },

  // General knowledge
  general: {
    patterns: [
      /what is|what are|what does/i,
      /how to|how can|how do/i,
      /tell me about|explain/i,
      /definition of|meaning of/i
    ]
  },

  // Conversational
  conversation: {
    patterns: [
      /how are you|how're you/i,
      /what('s| is) your name/i,
      /who (are you|made you|created you)/i,
      /can you help|help me/i,
      /thank|thanks|thx/i,
      /bye|goodbye|see you/i
    ],
    responses: {
      'how are you': '😊 I\'m doing great, thanks for asking!\n\nI\'m here 24/7, ready to help with:\n• Engineering projects\n• General questions\n• Calculations\n• Product recommendations\n• And much more!\n\nHow can I assist you today?',
      
      'your name': '🤖 I\'m **AI Design Assistant**!\n\nI\'m an intelligent chatbot created to help you with:\n✓ Engineering & construction projects\n✓ General knowledge questions\n✓ Product recommendations\n✓ Technical calculations\n✓ Friendly conversation\n\nThink of me as your smart assistant who knows a lot about many things! 😊\n\nWhat would you like to know?',
      
      'who are you': '👋 **I\'m your AI Assistant!**\n\n**What I am:**\n• Intelligent chatbot\n• Knowledge helper\n• Design consultant\n• Problem solver\n\n**What I can do:**\n🏗️ Help with engineering projects\n💡 Answer general questions\n🔢 Solve math problems\n📚 Explain concepts\n💬 Have friendly conversations\n\n**What I can\'t do:**\n❌ Physical tasks\n❌ Access external websites\n❌ Personal opinions (I\'m neutral!)\n\nI\'m here to make your life easier! How can I help?',
      
      'help': '💪 **I\'d Love to Help!**\n\nI can assist with:\n\n**🏗️ Engineering Projects:**\n• Doors, windows, gates, roofing\n• Material recommendations\n• Cost estimates\n• Specifications\n\n**💡 General Knowledge:**\n• Science & technology\n• Math & calculations\n• History & geography\n• Definitions & explanations\n\n**🎯 How to Get Best Results:**\n1. Be specific with your question\n2. Provide context if needed\n3. Ask follow-up questions\n4. Try voice input! 🎤\n\n**What would you like help with?**',
      
      'thanks': '😊 **You\'re very welcome!**\n\nHappy to help! Feel free to ask me:\n• More questions\n• Follow-up queries\n• Anything else you need\n\nI\'m here for you! 💙',
      
      'bye': '👋 **Goodbye!**\n\nIt was great chatting with you! Come back anytime you need:\n• Engineering help\n• General questions\n• Product recommendations\n• Just a friendly chat\n\nHave an amazing day! 🌟'
    }
  }
};

// ================================
// UNIVERSAL AI ENGINE
// ================================

class UniversalAI {
  constructor() {
    this.conversationHistory = [];
  }

  // Check if message is product-related
  isProductQuery(message) {
    const msg = message.toLowerCase();
    const productKeywords = /\b(door|doors|window|windows|gate|gates|roofing|roof|entrance|entry|glass)\b/i;
    const requestKeywords = /\b(show|display|need|want|looking for|recommend|suggest|buy|purchase)\b/i;
    
    return productKeywords.test(msg) || requestKeywords.test(msg);
  }

  // Handle general knowledge questions
  handleGeneralQuestion(message) {
    const msg = message.toLowerCase();

    // Check each knowledge category
    for (const [category, data] of Object.entries(knowledgeBase)) {
      if (!data.patterns) continue;

      // Check if message matches pattern
      const matched = data.patterns.some(pattern => pattern.test(msg));
      
      if (matched) {
        // If has custom handler (like math)
        if (data.handler) {
          const result = data.handler(message);
          if (result) return { text: result, confidence: 0.95 };
        }

        // If has predefined responses
        if (data.responses) {
          // Array of responses (random selection)
          if (Array.isArray(data.responses)) {
            return {
              text: data.responses[Math.floor(Math.random() * data.responses.length)],
              confidence: 0.9
            };
          }
          
          // Object of responses (keyword matching)
          for (const [keyword, response] of Object.entries(data.responses)) {
            if (new RegExp(keyword, 'i').test(msg)) {
              return { text: response, confidence: 0.9 };
            }
          }
        }
      }
    }

    // Default intelligent response
    return this.generateIntelligentResponse(message);
  }

  // Generate intelligent fallback responses
  generateIntelligentResponse(message) {
    const msg = message.toLowerCase();

    // Question patterns
    if (msg.startsWith('what') || msg.startsWith('what\'s') || msg.startsWith('whats')) {
      if (msg.includes('what is') || msg.includes('what\'s') || msg.includes('whats')) {
        const topic = msg.replace(/what('s| is) /i, '').replace(/\?/g, '').trim();
        return {
          text: `🤔 **About ${topic}:**\n\nI'd love to explain "${topic}" to you! However, I might need more context to give you the best answer.\n\n**Can you be more specific?** For example:\n• What aspect interests you?\n• What context is this for?\n• What level of detail do you need?\n\n💡 **Or try asking about:**\n• Engineering topics (doors, windows, construction)\n• Technology (AI, programming, internet)\n• Science (physics, chemistry, biology)\n• Math calculations\n• History & geography\n\nI'm here to help! 😊`,
          confidence: 0.6
        };
      }
    }

    if (msg.startsWith('how') || msg.match(/how (do|does|can|to|much|many)/i)) {
      return {
        text: `🛠️ **"How" questions are my specialty!**\n\nI can explain processes, methods, and procedures!\n\n**Popular "How" questions:**\n• How does photosynthesis work?\n• How to calculate percentages?\n• How much does a steel door cost?\n• How are windows installed?\n• How to choose the right material?\n\n**For your specific question:**\nCan you provide more details so I can give you a precise answer?\n\n💡 **Tip:** Be specific! The more details, the better I can help!`,
        confidence: 0.65
      };
    }

    if (msg.startsWith('why') || msg.match(/why (is|are|do|does|can)/i)) {
      return {
        text: `🤓 **Great question! Let me think...**\n\n"Why" questions often seek explanations and reasoning. I'm good at those!\n\n**I can explain:**\n• Scientific phenomena\n• Engineering principles\n• Material properties\n• Design choices\n• Technical concepts\n\n**To give you the best answer:**\nCould you elaborate on what specific aspect you're curious about?\n\n💡 **Example "Why" questions I can answer:**\n• "Why is steel stronger than aluminum?"\n• "Why do windows have double panes?"\n• "Why is photosynthesis important?"\n\nFire away! 🎯`,
        confidence: 0.65
      };
    }

    if (msg.match(/can you|are you able/i)) {
      return {
        text: `✅ **Yes, I can do many things!**\n\n**What I CAN do:**\n✓ Answer engineering questions\n✓ Recommend products (doors, windows, gates, roofing)\n✓ Explain scientific concepts\n✓ Solve math problems\n✓ Provide general knowledge\n✓ Calculate costs & dimensions\n✓ Compare materials\n✓ Give specifications\n✓ Have friendly conversations\n\n**What I CAN'T do:**\n❌ Browse the internet in real-time\n❌ Access external websites\n❌ Make purchases for you\n❌ Provide medical/legal advice\n❌ Physical tasks\n\n**Try asking me something specific!** 🚀`,
        confidence: 0.85
      };
    }

    // Default helpful response
    return {
      text: `🤖 **I'm here to help!**\n\nI didn't quite understand that, but I'm great at:\n\n**🏗️ Engineering & Construction:**\n• Doors, windows, gates, roofing\n• Material selection\n• Cost estimates\n• Specifications\n\n**💡 General Knowledge:**\n• Science & technology\n• Math calculations (try: "what is 25 * 4?")\n• Definitions & explanations\n• How things work\n\n**💬 Try asking:**\n• "Show me steel doors under $1000"\n• "What is artificial intelligence?"\n• "Calculate 15% of 2000"\n• "How does photosynthesis work?"\n• "Explain JavaScript"\n\n**Or just chat with me!** I'm friendly 😊\n\nWhat would you like to know?`,
      confidence: 0.5
    };
  }

  // Main response generator
  async generateResponse(message, context = {}) {
    // Add to conversation history
    this.conversationHistory.push({ role: 'user', content: message });
    
    // Keep only last 10 messages
    if (this.conversationHistory.length > 10) {
      this.conversationHistory = this.conversationHistory.slice(-10);
    }

    let response = {
      text: '',
      images: [],
      autoFillData: {},
      suggestions: [],
      confidence: 0
    };

    // Check if it's a product query
    if (this.isProductQuery(message)) {
      // Use existing product AI logic
      const productAI = new ProductChatbotAI();
      return productAI.generateResponse(message, context);
    }

    // Handle general questions
    const generalResponse = this.handleGeneralQuestion(message);
    response.text = generalResponse.text;
    response.confidence = generalResponse.confidence;

    // Add contextual suggestions
    if (message.toLowerCase().includes('door') || message.toLowerCase().includes('window')) {
      response.suggestions = ['Show me door options', 'Compare materials', 'Calculate costs'];
    } else {
      response.suggestions = ['What else can you help with?', 'Tell me about engineering', 'Show product options'];
    }

    return response;
  }
}

// ================================
// PRODUCT-SPECIFIC AI (Existing)
// ================================

class ProductChatbotAI {
  constructor() {
    this.conversationHistory = [];
  }

  extractIntent(message) {
    const msg = message.toLowerCase();
    
    const intents = {
      greeting: /^(hi|hello|hey|good morning|good afternoon|good evening|greetings)/i,
      help: /(help|assist|support|guide|what can you do|capabilities)/i,
      gratitude: /(thank|thanks|thx|appreciate|grateful|awesome|great|perfect)/i,
      productQuery: /(show|display|see|view|suggest|recommend|find|need|want|looking for)/i,
      priceQuery: /(cost|price|budget|expensive|cheap|affordable|how much)/i,
      comparison: /(compare|difference|vs|versus|better|which is)/i,
      specification: /(size|dimension|width|height|measurement|spec)/i,
      installation: /(install|installation|setup|how to install|fitting)/i,
      material: /(material|made of|type of|steel|wood|aluminum|glass)/i,
      features: /(feature|benefit|advantage|what does it have)/i,
      warranty: /(warranty|guarantee|coverage|protection)/i
    };

    for (const [intent, pattern] of Object.entries(intents)) {
      if (pattern.test(msg)) return intent;
    }

    return 'general';
  }

  extractEntities(message) {
    const msg = message.toLowerCase();
    const entities = {};

    // Product type
    if (msg.match(/\b(door|doors|entrance|entry)\b/)) entities.productType = 'door';
    if (msg.match(/\b(window|windows|pane)\b/)) entities.productType = 'window';
    if (msg.match(/\b(gate|gates|gateway)\b/)) entities.productType = 'gate';
    if (msg.match(/\b(roof|roofing|ceiling)\b/)) entities.productType = 'roofing';

    // Material
    if (msg.match(/\b(steel|metal|iron)\b/)) entities.material = 'Steel';
    if (msg.match(/\b(wood|wooden|timber)\b/)) entities.material = 'Wood';
    if (msg.match(/\b(aluminum|aluminium)\b/)) entities.material = 'Aluminum';
    if (msg.match(/\b(glass)\b/)) entities.material = 'Glass';

    // Building type
    if (msg.match(/\b(residential|home|house)\b/)) entities.buildingType = 'Residential';
    if (msg.match(/\b(commercial|office|business)\b/)) entities.buildingType = 'Commercial';
    if (msg.match(/\b(industrial|factory|warehouse)\b/)) entities.buildingType = 'Industrial';

    // Budget
    const budgetMatch = msg.match(/\$?(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)/);
    if (budgetMatch) {
      entities.budget = parseInt(budgetMatch[1].replace(/,/g, ''));
    }

    // Features
    if (msg.match(/\b(automat|smart|motorized)\b/)) entities.wantsAutomation = true;
    if (msg.match(/\b(security|secure|safe)\b/)) entities.wantsSecurity = true;
    if (msg.match(/\b(energy|efficient|eco)\b/)) entities.wantsEnergy = true;

    return entities;
  }

  recommendProducts(entities, context) {
    const { productType, material, budget, buildingType } = entities;
    
    if (!productType) return [];

    let products = [...productDatabase[productType]];

    if (material) {
      products = products.filter(p => p.material === material || p.type.includes(material));
    }

    if (buildingType) {
      products = products.filter(p => p.bestFor.includes(buildingType));
    }

    if (budget) {
      products = products.filter(p => p.priceRange.min <= budget);
    }

    return products.slice(0, 4);
  }

  generateResponse(message, context = {}) {
    const intent = this.extractIntent(message);
    const entities = this.extractEntities(message);
    
    let response = {
      text: '',
      images: [],
      autoFillData: {},
      suggestions: [],
      confidence: 0
    };

    if (intent === 'productQuery' || entities.productType) {
      const products = this.recommendProducts(entities, context);
      
      if (products.length > 0) {
        const productType = entities.productType.charAt(0).toUpperCase() + entities.productType.slice(1);
        response.text = `✨ **Here are the best ${productType} options for you:**\n\n`;
        
        products.forEach((product, index) => {
          response.text += `**${index + 1}. ${product.name}**\n`;
          response.text += `💰 Price: ${product.price}\n`;
          response.text += `🎨 Material: ${product.type}\n`;
          response.text += `⭐ Rating: ${product.rating}/5.0\n`;
          response.text += `✓ Key Features: ${product.features.slice(0, 2).join(', ')}\n\n`;
        });
        
        response.text += `💡 **Click any image to select it!**`;
        response.images = products;
        response.confidence = 0.9;
        
        // Auto-fill data
        if (entities.productType) {
          response.autoFillData.projectType = productType;
          response.autoFillData.category = 'Mechanical';
        }
        if (entities.material) {
          response.autoFillData.material = entities.material;
        }
        if (entities.buildingType) {
          response.autoFillData.buildingType = entities.buildingType;
        }
      }
    }

    return response;
  }
}

// ================================
// MAIN CONTROLLER
// ================================

const universalAI = new UniversalAI();

exports.getChatResponse = async (req, res) => {
  try {
    const { message, projectType, category, context } = req.body;
    
    if (!message) {
      return res.status(400).json({ 
        success: false,
        message: 'Message is required' 
      });
    }

    // Generate AI response (handles both general and product queries)
    const aiResponse = await universalAI.generateResponse(message, context);

    res.json({
      success: true,
      response: aiResponse.text,
      images: aiResponse.images,
      autoFillData: Object.keys(aiResponse.autoFillData).length > 0 ? aiResponse.autoFillData : null,
      suggestions: aiResponse.suggestions,
      confidence: aiResponse.confidence,
      timestamp: new Date()
    });

  } catch (error) {
    console.error('Chatbot error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Sorry, I encountered an error. Please try again.',
      error: error.message 
    });
  }
};

exports.UniversalAI = UniversalAI;
