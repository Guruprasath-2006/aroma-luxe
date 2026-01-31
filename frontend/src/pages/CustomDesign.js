import React, { useState, useContext, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext';
import { FiSave, FiTrash2, FiPlus, FiUpload, FiCpu, FiDollarSign, FiClock, FiCheckCircle, FiAlertCircle, FiZap, FiTrendingUp, FiBox, FiLayers, FiMessageCircle, FiSend, FiMinimize2 } from 'react-icons/fi';

const CustomDesign = () => {
  const { user, token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [userAddressLoaded, setUserAddressLoaded] = useState(false);

  const [design, setDesign] = useState({
    projectName: '',
    projectType: 'Door',
    category: 'Mechanical',
    specifications: {
      dimensions: {
        width: '',
        height: '',
        depth: '',
        unit: 'feet'
      },
      material: '',
      color: '',
      finish: '',
      features: []
    },
    budget: {
      min: '',
      max: '',
      currency: 'USD'
    },
    timeline: {
      startDate: '',
      endDate: '',
      duration: ''
    },
    location: {
      locationType: 'Commercial',
      address: '',
      city: '',
      state: '',
      zipCode: ''
    },
    buildingType: 'Commercial',
    description: '',
    requirements: [],
    status: 'Draft'
  });

  // Load user's saved address on component mount
  useEffect(() => {
    const loadUserAddress = async () => {
      if (!user || userAddressLoaded) return;

      try {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        };
        const { data } = await axios.get('/api/auth/profile', config);
        
        // Check if user has saved addresses
        if (data.user.addresses && data.user.addresses.length > 0) {
          // Find default address or use first address
          const savedAddress = data.user.addresses.find(addr => addr.isDefault) || data.user.addresses[0];
          
          // Auto-fill location fields
          setDesign(prev => ({
            ...prev,
            location: {
              ...prev.location,
              address: savedAddress.address || '',
              city: savedAddress.city || '',
              state: savedAddress.state || '',
              zipCode: savedAddress.zipCode || ''
            }
          }));
          
          toast.success('Address auto-filled from your saved location!');
          setUserAddressLoaded(true);
        }
      } catch (error) {
        console.error('Error loading user address:', error);
        // Silently fail - user will fill manually
      }
    };

    loadUserAddress();
  }, [user, token, userAddressLoaded]);

  const [newFeature, setNewFeature] = useState('');
  const [newRequirement, setNewRequirement] = useState('');
  
  // High-tech features state
  const [estimatedCost, setEstimatedCost] = useState(null);
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [showAiPanel, setShowAiPanel] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [autoSaving, setAutoSaving] = useState(false);
  const [completionProgress, setCompletionProgress] = useState(0);
  const [showCostBreakdown, setShowCostBreakdown] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { 
      type: 'bot', 
      text: '👋 **Hello! I\'m your AI Design Assistant!**\n\n💬 I\'m here to help you create the perfect design. Just chat with me naturally!\n\n**Quick Start:**\n• \"Show me door options\" - See designs with images\n• \"I need a steel gate\" - Get recommendations\n• \"How much will it cost?\" - Get instant estimates\n• \"What materials are best?\" - Expert advice\n\n**I understand natural language!** Ask me anything about:\n🚪 Doors • 🪟 Windows • 🚧 Gates • 🏠 Roofing\n\n**What can I help you with today?** 🚀', 
      timestamp: new Date(),
      images: []
    }
  ]);
  const [userMessage, setUserMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [conversationContext, setConversationContext] = useState([]);

  // Local image database for fallback
  const productImages = {
    door: [
      { url: 'https://images.unsplash.com/photo-1606074671985-dd0d8d6f1f5e?w=500', name: 'Modern Steel Door', type: 'Steel', price: '$500-800' },
      { url: 'https://images.unsplash.com/photo-1516455590571-18256e5bb9ff?w=500', name: 'Wooden Entry Door', type: 'Wood', price: '$800-1200' },
      { url: 'https://images.unsplash.com/photo-1534237710431-e2fc698436d0?w=500', name: 'Glass Door', type: 'Glass', price: '$700-1000' },
      { url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500', name: 'Security Door', type: 'Steel Reinforced', price: '$1000-1500' }
    ],
    window: [
      { url: 'https://images.unsplash.com/photo-1545259741-2ea3ebf61fa3?w=500', name: 'Double Pane Window', type: 'Glass', price: '$300-600' },
      { url: 'https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=500', name: 'Bay Window', type: 'Glass & Wood', price: '$1200-2000' },
      { url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=500', name: 'Sliding Window', type: 'Aluminum', price: '$400-800' },
      { url: 'https://images.unsplash.com/photo-1600210492486-724d6b31e1f8?w=500', name: 'Energy Efficient Window', type: 'Triple Pane', price: '$600-1000' }
    ],
    gate: [
      { url: 'https://images.unsplash.com/photo-1583267117310-ea9b37cd0baa?w=500', name: 'Modern Gate Design', type: 'Steel', price: '$2000-3500' },
      { url: 'https://images.unsplash.com/photo-1600489000022-c2086d79f9d4?w=500', name: 'Automated Gate', type: 'Aluminum', price: '$3000-5000' },
      { url: 'https://images.unsplash.com/photo-1542327897-d73f4005b533?w=500', name: 'Wrought Iron Gate', type: 'Iron', price: '$2500-4000' },
      { url: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=500', name: 'Wooden Gate', type: 'Wood', price: '$1500-2500' }
    ],
    roofing: [
      { url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=500', name: 'Metal Roofing', type: 'Steel', price: '$5000-10000' },
      { url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=500', name: 'Tile Roofing', type: 'Clay Tiles', price: '$8000-15000' },
      { url: 'https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?w=500', name: 'Shingle Roofing', type: 'Asphalt', price: '$4000-8000' },
      { url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=500', name: 'Solar Panel Roof', type: 'Solar Tiles', price: '$15000-30000' }
    ]
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child, grandchild] = name.split('.');
      if (grandchild) {
        setDesign(prev => ({
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: {
              ...prev[parent][child],
              [grandchild]: value
            }
          }
        }));
      } else {
        setDesign(prev => ({
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: value
          }
        }));
      }
    } else {
      setDesign(prev => ({ ...prev, [name]: value }));
    }
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setDesign(prev => ({
        ...prev,
        specifications: {
          ...prev.specifications,
          features: [...prev.specifications.features, newFeature]
        }
      }));
      setNewFeature('');
    }
  };

  const removeFeature = (index) => {
    setDesign(prev => ({
      ...prev,
      specifications: {
        ...prev.specifications,
        features: prev.specifications.features.filter((_, i) => i !== index)
      }
    }));
  };

  const addRequirement = () => {
    if (newRequirement.trim()) {
      setDesign(prev => ({
        ...prev,
        requirements: [...prev.requirements, newRequirement]
      }));
      setNewRequirement('');
    }
  };

  const removeRequirement = (index) => {
    setDesign(prev => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index)
    }));
  };

  // Real-time cost estimation
  const calculateEstimate = useCallback(() => {
    const { dimensions, material } = design.specifications;
    const { min, max } = design.budget;
    
    // Base cost calculation based on material and dimensions
    const materialCosts = {
      'Steel': 50, 'Stainless Steel': 80, 'Aluminum': 60, 'Brass': 100,
      'Teak Wood': 120, 'Oak Wood': 90, 'Tempered Glass': 70,
      'UPVC': 45, 'Concrete': 40, 'Granite': 110
    };
    
    const baseCost = materialCosts[material] || 50;
    const area = (parseFloat(dimensions.width) || 0) * (parseFloat(dimensions.height) || 0);
    const volume = area * (parseFloat(dimensions.depth) || 1);
    
    let estimate = baseCost * area;
    
    // Category multiplier
    const categoryMultiplier = {
      'Industrial': 1.5,
      'Mechanical': 1.2,
      'Consulting': 1.3,
      'Maintenance': 1.0
    };
    
    estimate *= categoryMultiplier[design.category] || 1.0;
    
    // Complexity adjustment
    const featureCount = design.specifications.features.length;
    estimate += featureCount * 200;
    
    setEstimatedCost({
      base: Math.round(estimate),
      labor: Math.round(estimate * 0.4),
      materials: Math.round(estimate * 0.5),
      overhead: Math.round(estimate * 0.1),
      total: Math.round(estimate * 2.0)
    });
  }, [design]);

  // AI-powered suggestions
  const generateAISuggestions = useCallback(() => {
    const suggestions = [];
    
    // Material-based suggestions
    if (design.specifications.material === 'Steel') {
      suggestions.push({
        type: 'material',
        icon: '🛡️',
        title: 'Corrosion Protection Recommended',
        description: 'Consider galvanized or powder-coated finish for outdoor applications'
      });
    }
    
    if (design.specifications.material === 'Glass' || design.specifications.material === 'Tempered Glass') {
      suggestions.push({
        type: 'safety',
        icon: '⚡',
        title: 'Safety Enhancement',
        description: 'Add laminated glass for increased safety and sound insulation'
      });
    }
    
    // Budget-based suggestions
    const estTotal = estimatedCost?.total || 0;
    if (design.budget.max && estTotal > design.budget.max) {
      suggestions.push({
        type: 'budget',
        icon: '💰',
        title: 'Budget Optimization',
        description: `Estimated cost (₹${estTotal}) exceeds budget. Consider alternative materials or simplified design.`
      });
    }
    
    // Project type suggestions
    if (design.projectType === 'Gate' && !design.specifications.features.includes('Automation')) {
      suggestions.push({
        type: 'feature',
        icon: '🤖',
        title: 'Smart Automation',
        description: 'Add automated gate opener for enhanced convenience and security'
      });
    }
    
    if (design.projectType === 'Door' && design.buildingType === 'Commercial') {
      suggestions.push({
        type: 'compliance',
        icon: '📋',
        title: 'Fire Safety Code',
        description: 'Ensure compliance with fire-rated door requirements for commercial buildings'
      });
    }
    
    // Timeline suggestions
    const startDate = new Date(design.timeline.startDate);
    const endDate = new Date(design.timeline.endDate);
    const daysDiff = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
    
    if (daysDiff < 14 && design.category === 'Industrial') {
      suggestions.push({
        type: 'timeline',
        icon: '⏰',
        title: 'Timeline Advisory',
        description: 'Industrial projects typically require 3-6 weeks. Consider extending timeline.'
      });
    }
    
    setAiSuggestions(suggestions);
  }, [design, estimatedCost]);

  // Auto-save functionality
  const autoSave = useCallback(() => {
    if (user && design.projectName) {
      setAutoSaving(true);
      localStorage.setItem('draft_design', JSON.stringify(design));
      setTimeout(() => setAutoSaving(false), 1000);
    }
  }, [design, user]);

  // Progress calculation
  const calculateProgress = useCallback(() => {
    const fields = [
      design.projectName,
      design.projectType,
      design.specifications.material,
      design.specifications.color,
      design.budget.min,
      design.timeline.startDate,
      design.location.city,
      design.description
    ];
    
    const filledFields = fields.filter(field => field && field !== '').length;
    const progress = Math.round((filledFields / fields.length) * 100);
    setCompletionProgress(progress);
  }, [design]);

  // File upload handler
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const newFiles = files.map(file => ({
      name: file.name,
      size: (file.size / 1024).toFixed(2) + ' KB',
      type: file.type,
      preview: URL.createObjectURL(file)
    }));
    setUploadedFiles(prev => [...prev, ...newFiles]);
    toast.success(`${files.length} file(s) uploaded successfully`);
  };

  // Enhanced AI Chatbot Response Generator with Advanced Intelligence
  const generateChatResponse = (message) => {
    const msg = message.toLowerCase();
    const { projectType, category } = design;
    const materialName = design.specifications?.material;
    const { width, height } = design.specifications.dimensions;
    
    // Track conversation context
    setConversationContext(prev => [...prev, msg].slice(-5));
    
    // Response object with text and images
    let response = { text: '', images: [] };

    // ============================================
    // 🤖 CHATGPT-LIKE AI INTELLIGENCE ENGINE  
    // Handles ALL types of questions intelligently
    // ============================================
    
    // ========== GENERAL KNOWLEDGE & CONVERSATIONAL AI ==========
    
    // General "How to" questions - ChatGPT-style helpful answers
    if (msg.match(/^how to /i) || msg.match(/^how do i /i) || msg.match(/^how can i /i)) {
      const topic = msg.replace(/^how (to|do i|can i) /i, '').trim();
      
      // If not design-related, provide general guidance
      if (!topic.match(/\b(install|build|choose|select|design|measure|calculate)\b/i)) {
        response.text = `💡 **You asked: "${message}"**\n\nI'm an AI assistant specialized in design and construction, but I'll try to help!\n\n**General Approach:**\n1. Break down the task into smaller steps\n2. Research and gather information\n3. Plan before taking action\n4. Start with the basics and build up\n5. Don't hesitate to ask for help\n\n**For design projects, I can definitely help you with:**\n• How to choose the right materials\n• How to measure your space\n• How to calculate costs\n• How to select the best design\n• How to install products\n• How to maintain your installations\n\n**Need specific design guidance?** Just ask! 😊`;
        return response;
      }
    }
    
    // "Can you" questions - ChatGPT capability responses
    if (msg.match(/^can you /i) || msg.match(/^could you /i) || msg.match(/^are you able to /i)) {
      response.text = `✅ **I'd be happy to help!**\n\n**What I can do:**\n\n🎨 **Design & Products:**\n✓ Show you product options with images\n✓ Recommend materials and styles\n✓ Compare different options\n✓ Explain technical specifications\n\n💰 **Costs & Budget:**\n✓ Calculate instant estimates\n✓ Break down pricing\n✓ Suggest cost-saving alternatives\n✓ Explain payment options\n\n🔧 **Technical Support:**\n✓ Answer installation questions\n✓ Provide maintenance tips\n✓ Explain safety requirements\n✓ Guide you through the process\n\n💬 **Conversation:**\n✓ Answer your questions naturally\n✓ Remember our conversation context\n✓ Provide detailed explanations\n✓ Chat about various topics\n\n**What specifically would you like me to help you with?** Just tell me! 😊`;
      return response;
    }
    
    // "Why" questions - ChatGPT explanatory responses
    if (msg.match(/^why /i)) {
      const topic = msg.replace(/^why /i, '').trim();
      
      // Design-related why questions
      if (topic.match(/\b(expensive|cheap|cost|price|better|best|recommended|should)\b/i)) {
        response.text = `🤔 **Great question: "${message}"**\n\nLet me explain!\n\n**General Factors:**\n• Quality of materials\n• Manufacturing process\n• Labor and expertise\n• Supply and demand\n• Features and specifications\n• Brand reputation\n• Warranty and support\n\n**For specific design questions:**\n• "Why is steel better?" - I can compare materials\n• "Why so expensive?" - I can break down costs\n• "Why choose this?" - I can explain benefits\n\n**Want a detailed explanation about a specific topic?** Let me know! 😊`;
        return response;
      }
      
      response.text = `🤔 **You asked: "${message}"**\n\nI love curious minds! While I specialize in design and construction, I'll help where I can.\n\n**For design-related "why" questions, I can explain:**\n• Why certain materials are better\n• Why costs vary\n• Why specific features matter\n• Why installation processes work\n• Why maintenance is important\n\n**Ask me anything about your design project!** 🎨`;
      return response;
    }
    
    // "Where" questions
    if (msg.match(/^where /i)) {
      response.text = `📍 **You asked: "${message}"**\n\n**I can help you find:**\n• Where to place installations\n• Where to measure dimensions\n• Where to add features\n• Where to start your project\n• Where to get support\n\n**For location-specific design advice:**\n• "Where should I install this door?"\n• "Where to measure for windows?"\n• "Where are you located?" - We serve multiple regions!\n\nWhat specific location information do you need? 😊`;
      return response;
    }
    
    // "When" questions
    if (msg.match(/^when /i)) {
      response.text = `⏰ **You asked: "${message}"**\n\n**I can help with timing:**\n\n**Project Timeline:**\n• When to start planning\n• When to order materials\n• When installation happens\n• When to expect delivery\n• When to schedule maintenance\n\n**Best Times:**\n• Off-season for discounts\n• Planning ahead saves money\n• Rush orders available\n\n**Ask me specific timeline questions like:**\n• "When will my project be complete?"\n• "When should I install this?"\n• "When is the best time to order?"\n\nWhat timing information do you need? 🕐`;
      return response;
    }
    
    // Comparison questions - "Which is better"
    if (msg.match(/\b(which is better|which one|better than|versus|vs|compare)\b/i)) {
      response.text = `⚖️ **Comparison Question: "${message}"**\n\n**I'm great at comparisons!**\n\n**I can compare:**\n🔹 Materials (Steel vs Wood vs Aluminum)\n🔹 Products (Different door/window styles)\n🔹 Prices (Budget vs Premium)\n🔹 Features (Standard vs Advanced)\n🔹 Brands and quality levels\n\n**Example questions:**\n• "Which is better: steel or wood doors?"\n• "Compare tempered vs regular glass"\n• "Which gate is more secure?"\n• "What's better for my budget?"\n\n**Tell me what you'd like to compare**, and I'll give you a detailed analysis! 📊`;
      return response;
    }
    
    // Definition questions - "What does X mean"
    if (msg.match(/what (does|is) .* mean/i) || msg.match(/define /i) || msg.match(/meaning of /i)) {
      response.text = `📖 **You asked: "${message}"**\n\n**I can explain terms related to:**\n\n**Materials:**\n• Tempered glass, laminated, double-glazing\n• Steel types, aluminum grades\n• Wood varieties, finishes\n\n**Technical Terms:**\n• R-values, U-factors\n• Fire ratings, load capacity\n• Weatherproofing, insulation\n\n**Process Terms:**\n• Installation, fabrication\n• Powder coating, galvanizing\n• Measurements and specifications\n\n**Which specific term would you like me to explain?** I'll give you a clear, simple definition! 😊`;
      return response;
    }
    
    // Opinion/Recommendation questions
    if (msg.match(/\b(should i|would you recommend|your recommendation|what would you|in your opinion|do you think)\b/i)) {
      response.text = `💭 **You asked for my recommendation!**\n\n**I'd be happy to suggest the best option!**\n\nTo give you the perfect recommendation, tell me:\n\n1️⃣ **What's your project?**\n   • Door, Window, Gate, or Roofing?\n\n2️⃣ **Your priorities:**\n   • Budget, Security, Durability, Style?\n\n3️⃣ **Your budget range:**\n   • Economy, Mid-range, or Premium?\n\n4️⃣ **Any special needs:**\n   • Weatherproofing, automation, energy-efficiency?\n\n**Example questions I can answer:**\n• "Should I choose steel or wood?"\n• "Would you recommend automation?"\n• "What would you suggest for security?"\n• "Do you think this is worth it?"\n\n**Tell me more about your needs**, and I'll give you expert advice! 🎯`;
      return response;
    }
    
    // List questions - "What are"
    if (msg.match(/what are (the|some|all)/i)) {
      response.text = `📋 **List Question: "${message}"**\n\n**I can provide lists of:**\n\n**Products & Options:**\n• Available door/window/gate styles\n• Material choices\n• Color and finish options\n• Feature add-ons\n\n**Information:**\n• Benefits and advantages\n• Requirements and specifications\n• Steps in the process\n• Cost factors\n• Maintenance tips\n\n**Ask me specifically like:**\n• "What are the door material options?"\n• "What are the benefits of steel?"\n• "What are the costs involved?"\n• "What are the best features?"\n\n**What list would you like me to provide?** 📝`;
      return response;
    }
    
    // Problem-solving - "I have a problem"
    if (msg.match(/\b(problem|issue|trouble|difficulty|error|not working|broken|stuck)\b/i)) {
      response.text = `🔧 **I'm here to help solve your problem!**\n\n**Tell me more:**\n• What's the specific issue?\n• When did it start?\n• What were you trying to do?\n• Any error messages?\n\n**Common solutions I can help with:**\n\n🛠️ **Technical Issues:**\n• Form not working\n• Can't select options\n• Images not loading\n• Chat not responding\n\n📋 **Design Problems:**\n• Unsure what to choose\n• Budget constraints\n• Measurement questions\n• Material confusion\n\n💬 **Communication:**\n• Need clarification\n• Want more details\n• Request changes\n\n**Describe your problem, and I'll help you fix it!** 💪`;
      return response;
    }
    
    // Learning questions - "Teach me" / "Explain"
    if (msg.match(/\b(teach me|explain|learn|understand|educate|lesson)\b/i)) {
      response.text = `🎓 **I love teaching! Let's learn together!**\n\n**What would you like to learn about?**\n\n**Design Topics:**\n📚 Material science & properties\n📚 Installation techniques\n📚 Cost estimation methods\n📚 Safety & compliance\n📚 Energy efficiency\n📚 Maintenance practices\n\n**Popular Lessons:**\n• \"Explain different door materials\"\n• \"Teach me about window types\"\n• \"How does pricing work?\"\n• \"What makes quality construction?\"\n\n**I'll explain:**\n✓ In simple terms\n✓ With examples\n✓ Step by step\n✓ As detailed as you need\n\n**What topic interests you?** I'll be your teacher! 👨‍🏫`;
      return response;
    }
    
    // Time & Date Questions
    if (msg.match(/\b(what time|current time|what's the time|time is it|what date|today's date|what day)\b/i)) {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      const dateStr = now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
      response.text = `⏰ **Current Time:** ${timeStr}\n📅 **Today's Date:** ${dateStr}\n\nHow can I help you with your design project today?`;
      return response;
    }
    
    // Math & Calculations
    if (msg.match(/\b(calculate|compute|math|plus|minus|multiply|divide|times|\+|\-|\*|\/|\d+\s*[\+\-\*\/]\s*\d+)\b/i)) {
      // Try to extract and calculate simple math
      const mathMatch = msg.match(/(\d+(?:\.\d+)?)\s*([\+\-\*\/×÷])\s*(\d+(?:\.\d+)?)/);
      if (mathMatch) {
        const [, num1, op, num2] = mathMatch;
        let result;
        const n1 = parseFloat(num1);
        const n2 = parseFloat(num2);
        
        switch(op) {
          case '+': result = n1 + n2; break;
          case '-': result = n1 - n2; break;
          case '*': case '×': result = n1 * n2; break;
          case '/': case '÷': result = n2 !== 0 ? n1 / n2 : 'undefined (division by zero)'; break;
          default: result = 'unknown operation';
        }
        
        response.text = `🧮 **Calculation Result:**\n\n${num1} ${op} ${num2} = **${result}**\n\nNeed help calculating project costs or dimensions?`;
        return response;
      }
      
      response.text = '🧮 **I can help with calculations!**\n\nTry asking:\n• \"Calculate 150 + 250\"\n• \"What is 12 × 8?\"\n• \"Divide 1000 by 4\"\n\nI can also calculate:\n• Project costs\n• Material quantities\n• Area measurements\n• Budget estimates\n\nWhat would you like to calculate?';
      return response;
    }
    
    // Weather Questions
    if (msg.match(/\b(weather|temperature|forecast|rain|sunny|climate|hot|cold)\b/i)) {
      response.text = '🌤️ **Weather Information:**\n\nI don\'t have real-time weather data, but I can help you choose materials based on your climate!\n\n**Climate-Specific Recommendations:**\n\n☀️ **Hot & Sunny:**\n• UV-resistant materials\n• Reflective coatings\n• Heat-resistant seals\n\n🌧️ **Rainy & Humid:**\n• Rust-proof materials\n• Waterproof coatings\n• Enhanced drainage\n\n❄️ **Cold & Snowy:**\n• Insulated materials\n• Weather stripping\n• Freeze-resistant components\n\nWhat\'s your climate like? I\'ll recommend the best materials!';
      return response;
    }
    
    // Who are you / About AI
    if (msg.match(/\b(who are you|what are you|are you ai|are you human|are you real|your name|introduce yourself)\b/i)) {
      response.text = '🤖 **I\'m your AI Design Assistant!**\n\n**About Me:**\n• I\'m an AI-powered chatbot designed to help you create custom designs\n• I understand natural language and can answer all kinds of questions\n• I can show you products, calculate costs, and provide expert advice\n• I\'m available 24/7 to assist with your project\n\n**My Capabilities:**\n✅ Product recommendations with images\n✅ Real-time cost calculations\n✅ Technical guidance & support\n✅ Material comparisons\n✅ General conversation & assistance\n\n**I\'m here to make your design process easy and enjoyable!**\n\nWhat can I help you with today? 😊';
      return response;
    }
    
    // How does it work / Process questions
    if (msg.match(/\b(how does (it|this) work|how do (i|you)|process|steps|procedure|workflow)\b/i) && !msg.includes('install')) {
      response.text = '📋 **Here\'s How It Works:**\n\n**Design Process:**\n\n1️⃣ **Tell Me What You Need**\n   • Chat with me about your project\n   • I\'ll ask relevant questions\n   • Share your ideas naturally\n\n2️⃣ **Explore Options**\n   • I\'ll show you designs with images\n   • Compare materials and prices\n   • Get instant cost estimates\n\n3️⃣ **Fill Out Form**\n   • I can auto-fill based on our chat\n   • Or you can fill it manually\n   • Add custom requirements\n\n4️⃣ **Submit Design**\n   • Review everything\n   • Submit for professional review\n   • Get expert feedback\n\n5️⃣ **Production & Delivery**\n   • We manufacture your design\n   • Professional installation\n   • Quality guarantee\n\n**Need help with any specific step?** Just ask!';
      return response;
    }
    
    // General "What is" questions - ChatGPT style explanations
    if (msg.match(/^what (is|are) /i)) {
      const topic = msg.replace(/^what (is|are) /i, '').trim();
      
      // Check if it's design-related (handled later)
      if (!topic.match(/\b(door|window|gate|roof|steel|wood|aluminum|glass|material|design|price|cost)\b/i)) {
        response.text = `🤔 **You asked: "${message}"**\n\nI\'m primarily designed to help with design and construction projects, but I can try to assist!\n\n**For design-related questions, try:**\n• "What is the best door material?"\n• "What are the window options?"\n• "What is tempered glass?"\n• "What are the costs involved?"\n\n**I can help you with:**\n✓ Product information & recommendations\n✓ Material comparisons\n✓ Technical specifications\n✓ Cost estimates\n✓ Installation guidance\n\n**Would you like to know about any design-related topics?** 😊`;
        return response;
      }
    }
    
    // Jokes & Fun
    if (msg.match(/\b(joke|funny|laugh|humor|make me laugh)\b/i)) {
      const jokes = [
        '😄 Why did the door go to therapy?\nBecause it had too many issues to handle! 🚪\n\nNow, let\'s handle YOUR door project! Need help?',
        '😂 What did the window say to the door?\n"I\'m pane-fully jealous of your hinges!"\n\nSpeaking of windows and doors, need any for your project? 🪟🚪',
        '🤣 Why don\'t gates ever get lonely?\nBecause they\'re always hanging out with their posts!\n\nLet me help you design the perfect gate! 🚧',
        '😁 A door, a window, and a gate walk into a bar...\nThe bartender says, "Sorry, we\'re closed!" 🚪\n\nBut I\'m always open to help with your design! What do you need?'
      ];
      response.text = jokes[Math.floor(Math.random() * jokes.length)];
      return response;
    }
    
    // Goodbye / Exit
    if (msg.match(/^(bye|goodbye|see you|later|exit|quit|close|talk to you later|ttyl|cya)$/i)) {
      const goodbyes = [
        '👋 Goodbye! Your design is auto-saved. Come back anytime!',
        '✨ See you later! Don\'t forget to submit your design when ready!',
        '💙 Thanks for chatting! I\'ll be here whenever you need me.',
        '🎨 Bye! Your progress is saved. Good luck with your project!',
        '🌟 Take care! Feel free to return anytime you need help!'
      ];
      response.text = goodbyes[Math.floor(Math.random() * goodbyes.length)];
      return response;
    }
    
    // Affirmative responses
    if (msg.match(/^(yes|yeah|yep|yup|sure|of course|definitely|absolutely|correct|right|exactly)$/i)) {
      const affirmatives = [
        '✅ Great! What would you like to know or do next?',
        '👍 Perfect! How can I help you further?',
        '😊 Awesome! What\'s your next question?',
        '🎯 Excellent! What else can I assist you with?'
      ];
      response.text = affirmatives[Math.floor(Math.random() * affirmatives.length)];
      return response;
    }
    
    // Negative responses
    if (msg.match(/^(no|nope|nah|not really|don't think so|negative)$/i)) {
      const negatives = [
        '👌 No problem! What would you like to do instead?',
        '😊 That\'s okay! How else can I help you?',
        '✨ Understood! What would you prefer?',
        '🤔 Got it! What\'s your next thought?'
      ];
      response.text = negatives[Math.floor(Math.random() * negatives.length)];
      return response;
    }
    
    // Repeat/Clarification requests
    if (msg.match(/\b(repeat|again|what did you say|didn't understand|unclear|confusing|rephrase)\b/i)) {
      const lastBotMessage = [...chatMessages].reverse().find(m => m.type === 'bot');
      if (lastBotMessage) {
        response.text = `📣 **Let me repeat that:**\n\n${lastBotMessage.text}\n\n**Still unclear?** Ask me to explain it differently or ask a specific question about it! 😊`;
      } else {
        response.text = '📣 **Let me clarify!**\n\nI\'m your AI design assistant, ready to help with:\n• Product recommendations\n• Cost calculations\n• Material advice\n• Technical support\n• General questions\n\n**What would you like to know?** I\'ll explain clearly! 😊';
      }
      return response;
    }
    
    // More information requests
    if (msg.match(/\b(tell me more|more details|more info|elaborate|expand|go on|continue)\b/i)) {
      response.text = `📚 **I'd love to provide more details!**\n\n**What specific aspect interests you?**\n\n**I can elaborate on:**\n• Product specifications\n• Material properties\n• Cost breakdowns\n• Installation processes\n• Maintenance requirements\n• Warranty coverage\n• Design options\n• Technical features\n\n**Or ask a specific question like:**\n• "Tell me more about steel doors"\n• "More details on pricing"\n• "Elaborate on installation"\n• "What else should I know?"\n\n**What would you like to dive deeper into?** 🔍`;
      return response;
    }
    
    // Start over / Reset
    if (msg.match(/\b(start over|reset|begin again|clear|new project|fresh start)\b/i)) {
      response.text = `🔄 **Starting Fresh!**\n\n**Ready to begin a new project?**\n\n**Let's start with the basics:**\n\n1️⃣ **What are you designing?**\n   • Door\n   • Window\n   • Gate\n   • Roofing\n\n2️⃣ **Or ask me anything:**\n   • "Show me door options"\n   • "What materials are available?"\n   • "Help me choose"\n   • "What's my budget?"\n\n**I'm here to guide you from the beginning!** 🚀\n\n*Note: Your previous work is auto-saved if you need it later.*`;
      return response;
    }
    
    // ========== DESIGN-SPECIFIC RESPONSES ==========
    
    // Greeting Detection - AI warmth
    if (msg.match(/^(hi|hello|hey|hola|namaste|good morning|good afternoon|good evening|greetings|sup|yo)$/i)) {
      const greetings = [
        '👋 Hello! I\'m your AI design assistant. What would you like to create today?',
        '✨ Hi there! Ready to bring your design ideas to life? Just tell me what you need!',
        '🎨 Hey! I\'m here to help with your project. Doors, windows, gates, or roofing?',
        '👋 Greetings! Let\'s design something amazing together. What\'s on your mind?'
      ];
      response.text = greetings[Math.floor(Math.random() * greetings.length)];
      response.images = [productImages.door[0], productImages.window[0]];
      return response;
    }

    // Help Detection - AI assistance
    if (msg.match(/\b(help|assist|support|guide|how|what can you do|capabilities|features)\b/i)) {
      response.text = '🤖 **I\'m your AI Design Assistant!** Here\'s what I can do:\n\n**🎨 Product Recommendations:**\n• Show designs with images (doors, windows, gates, roofing)\n• Compare materials and prices\n• Suggest best options for your needs\n\n**💰 Cost Planning:**\n• Instant price estimates\n• Budget optimization tips\n• Material cost comparison\n\n**🔧 Technical Guidance:**\n• Dimension recommendations\n• Installation advice\n• Maintenance tips\n\n**💬 Natural Conversation:**\n• Ask me anything in plain English\n• I understand context and follow-ups\n• No special commands needed!\n\n**Just tell me what you need - I\'ll understand!** 🚀';
      return response;
    }

    // Thank you detection - AI politeness
    if (msg.match(/\b(thank|thanks|thx|appreciate|grateful|awesome|great|perfect|excellent|good job|nice|amazing|wonderful)\b/i)) {
      const thanks = [
        '😊 You\'re welcome! Let me know if you need anything else!',
        '✨ Happy to help! Feel free to ask more questions anytime.',
        '🎉 Glad I could assist! What else can I help you with?',
        '💙 My pleasure! I\'m here whenever you need me.',
        '🙌 Anytime! That\'s what I\'m here for. Need anything else?'
      ];
      response.text = thanks[Math.floor(Math.random() * thanks.length)];
      return response;
    }
    
    // Casual conversation detection - ChatGPT-like friendliness
    if (msg.match(/^(ok|okay|sure|alright|got it|understood|i see|makes sense|cool|sounds good)$/i)) {
      const casual = [
        '👍 Great! What would you like to do next?',
        '✨ Perfect! How else can I help you?',
        '😊 Awesome! Feel free to ask me anything.',
        '🎯 Cool! What\'s next on your project?'
      ];
      response.text = casual[Math.floor(Math.random() * casual.length)];
      return response;
    }
    
    // Not sure / Confused responses - ChatGPT empathy
    if (msg.match(/\b(not sure|don't know|confused|unsure|undecided|help me decide|what do you think|your opinion)\b/i)) {
      response.text = '🤔 **No worries! I\'m here to help you decide.**\n\n**Let\'s start with a few questions:**\n\n1️⃣ **What are you working on?**\n   • Door, Window, Gate, or Roofing?\n\n2️⃣ **What\'s most important to you?**\n   • Budget-friendly\n   • Maximum security\n   • Best durability\n   • Modern aesthetics\n   • Energy efficiency\n\n3️⃣ **What\'s your budget range?**\n   • Economy ($500-1000)\n   • Mid-range ($1000-3000)\n   • Premium ($3000+)\n\n**Just tell me what you\'re thinking**, and I\'ll guide you to the perfect choice! 😊';
      return response;
    }
    
    // User expressing interest - ChatGPT engagement
    if (msg.match(/\b(interested|looking for|searching for|want to see|show me more|tell me more|interested in)\b/i)) {
      response.text = '✨ **Great! I\'d love to show you more options.**\n\n**What specifically interests you?**\n\n🚪 **Doors** - \"Show me door designs\"\n🪟 **Windows** - \"Show me window options\"\n🚧 **Gates** - \"Show me gate styles\"\n🏠 **Roofing** - \"Show me roofing materials\"\n\n**Or tell me:**\n• Your budget range\n• Preferred material (steel, wood, glass)\n• Style preference (modern, classic, industrial)\n• Special requirements (security, automation)\n\nI\'ll show you options with images and prices! 🎨';
      return response;
    }
    
    // Smart Form Auto-Fill Feature
    let formUpdated = false;
    let updateMessage = '';
    
    // Auto-detect and fill Project Type
    if (msg.match(/(?:i need|want|building|planning|project for|show me|looking for)\s+(?:a\s+)?(?:new\s+)?(roof|roofing|ceiling)/i)) {
      setDesign(prev => ({ ...prev, projectType: 'Roofing', category: 'Mechanical' }));
      formUpdated = true;
      updateMessage += '✅ Project Type set to **Roofing**\n';
      toast.success('📝 Form updated: Project Type → Roofing');
    } else if (msg.match(/(?:i need|want|building|planning|project for|show me|looking for)\s+(?:a\s+)?(?:new\s+)?(door|entrance|entry)/i)) {
      setDesign(prev => ({ ...prev, projectType: 'Door', category: 'Mechanical' }));
      formUpdated = true;
      updateMessage += '✅ Project Type set to **Door**\n';
      toast.success('📝 Form updated: Project Type → Door');
    } else if (msg.match(/(?:i need|want|building|planning|project for|show me|looking for)\s+(?:a\s+)?(?:new\s+)?(window|windows|glass)/i)) {
      setDesign(prev => ({ ...prev, projectType: 'Window', category: 'Mechanical' }));
      formUpdated = true;
      updateMessage += '✅ Project Type set to **Window**\n';
      toast.success('📝 Form updated: Project Type → Window');
    } else if (msg.match(/(?:i need|want|building|planning|project for|show me|looking for)\s+(?:a\s+)?(?:new\s+)?(gate|gateway|entrance gate)/i)) {
      setDesign(prev => ({ ...prev, projectType: 'Gate', category: 'Mechanical' }));
      formUpdated = true;
      updateMessage += '✅ Project Type set to **Gate**\n';
      toast.success('📝 Form updated: Project Type → Gate');
    }
    
    // Auto-detect and fill Building Type
    if (msg.match(/\b(commercial|office|business|shop|store|mall)\b/i)) {
      setDesign(prev => ({ ...prev, buildingType: 'Commercial' }));
      formUpdated = true;
      updateMessage += '✅ Building Type set to **Commercial**\n';
      toast.info('📝 Form updated: Building Type → Commercial');
    } else if (msg.match(/\b(residential|home|house|apartment|condo)\b/i)) {
      setDesign(prev => ({ ...prev, buildingType: 'Residential' }));
      formUpdated = true;
      updateMessage += '✅ Building Type set to **Residential**\n';
      toast.info('📝 Form updated: Building Type → Residential');
    } else if (msg.match(/\b(industrial|factory|warehouse|plant)\b/i)) {
      setDesign(prev => ({ ...prev, buildingType: 'Industrial' }));
      formUpdated = true;
      updateMessage += '✅ Building Type set to **Industrial**\n';
      toast.info('📝 Form updated: Building Type → Industrial');
    }
    
    // Auto-detect and fill Dimensions
    const dimensionMatch = msg.match(/(\d+(?:\.\d+)?)\s*(?:ft|feet|foot|')?\s*(?:x|by|×)\s*(\d+(?:\.\d+)?)\s*(?:ft|feet|foot|')?/i);
    if (dimensionMatch) {
      const w = parseFloat(dimensionMatch[1]);
      const h = parseFloat(dimensionMatch[2]);
      setDesign(prev => ({
        ...prev,
        specifications: {
          ...prev.specifications,
          dimensions: { ...prev.specifications.dimensions, width: w, height: h }
        }
      }));
      formUpdated = true;
      updateMessage += `✅ Dimensions set to **${w}ft × ${h}ft**\n`;
      toast.success(`📐 Form updated: Dimensions → ${w}ft × ${h}ft`);
    }
    
    // Auto-detect and fill Material
    if (msg.match(/\b(steel|stainless steel|mild steel|steel door|steel gate|steel window)\b/i)) {
      setDesign(prev => ({
        ...prev,
        specifications: { ...prev.specifications, material: 'Steel' }
      }));
      formUpdated = true;
      updateMessage += '✅ Material set to **Steel**\n';
      toast.info('📝 Form updated: Material set to Steel');
    } else if (msg.match(/\b(aluminum|aluminium|aluminum door|aluminum gate)\b/i)) {
      setDesign(prev => ({
        ...prev,
        specifications: { ...prev.specifications, material: 'Aluminum' }
      }));
      formUpdated = true;
      updateMessage += '✅ Material set to **Aluminum**\n';
      toast.info('📝 Form updated: Material set to Aluminum');
    } else if (msg.match(/\b(wood|wooden|timber|teak|oak|pine)\b/i)) {
      setDesign(prev => ({
        ...prev,
        specifications: { ...prev.specifications, material: 'Wood' }
      }));
      formUpdated = true;
      updateMessage += '✅ Material set to **Wood**\n';
      toast.info('📝 Form updated: Material set to Wood');
    } else if (msg.match(/\b(glass|tempered glass|laminated glass|double glazed)\b/i)) {
      setDesign(prev => ({
        ...prev,
        specifications: { ...prev.specifications, material: 'Glass' }
      }));
      formUpdated = true;
      updateMessage += '✅ Material set to **Glass**\n';
      toast.info('📝 Form updated: Material set to Glass');
    }
    
    // Auto-detect and fill Budget
    const budgetMatch = msg.match(/budget\s+(?:is\s+)?(?:around\s+)?(?:₹|rs\.?|rupees?\s+)?(\d+(?:,\d+)*(?:\.\d+)?)\s*(?:k|thousand|lakhs?)?/i);
    if (budgetMatch) {
      let budget = parseFloat(budgetMatch[1].replace(/,/g, ''));
      if (msg.match(/\b(k|thousand)\b/i)) budget *= 1000;
      if (msg.match(/\blakh?s?\b/i)) budget *= 100000;
      
      setDesign(prev => ({
        ...prev,
        budget: { ...prev.budget, min: budget * 0.8, max: budget * 1.2 }
      }));
      formUpdated = true;
      updateMessage += `✅ Budget range set to **₹${(budget * 0.8).toLocaleString()} - ₹${(budget * 1.2).toLocaleString()}**\n`;
    }
    
    // Auto-detect and fill Project Name
    const projectNameMatch = msg.match(/(?:project name|call it|name it|named?)\s+(?:is\s+)?["']?([^"',.!?\n]+)["']?/i);
    if (projectNameMatch) {
      const name = projectNameMatch[1].trim();
      setDesign(prev => ({ ...prev, projectName: name }));
      formUpdated = true;
      updateMessage += `✅ Project Name set to **"${name}"**\n`;
    }
    
    // Auto-detect and add Features
    if (msg.match(/\b(automation|automated|automatic|smart|motorized)\b/i)) {
      setDesign(prev => ({
        ...prev,
        features: [...new Set([...prev.features, 'Automation'])]
      }));
      formUpdated = true;
      updateMessage += '✅ Added feature: **Automation**\n';
    }
    if (msg.match(/\b(security|safe|secure|lock|deadbolt)\b/i)) {
      setDesign(prev => ({
        ...prev,
        features: [...new Set([...prev.features, 'Security System'])]
      }));
      formUpdated = true;
      updateMessage += '✅ Added feature: **Security System**\n';
    }
    if (msg.match(/\b(fire.?resistant|fire.?rated|fire.?proof)\b/i)) {
      setDesign(prev => ({
        ...prev,
        features: [...new Set([...prev.features, 'Fire-Resistant'])]
      }));
      formUpdated = true;
      updateMessage += '✅ Added feature: **Fire-Resistant**\n';
    }
    
    // Auto-detect and fill Color
    const colorMatch = msg.match(/\b(black|white|gray|grey|silver|gold|brown|red|blue|green)\b/i);
    if (colorMatch) {
      const color = colorMatch[1].charAt(0).toUpperCase() + colorMatch[1].slice(1).toLowerCase();
      setDesign(prev => ({
        ...prev,
        specifications: { ...prev.specifications, color: color }
      }));
      formUpdated = true;
      updateMessage += `✅ Color set to **${color}**\n`;
    }
    
    // If form was updated, prepend the update message
    if (formUpdated) {
      updateMessage += '\n📝 **Form automatically updated!** Check the form above.\n\n';
      toast.success('Form fields updated automatically!', { duration: 3000 });
    }
    
    // AI-powered Natural Language Understanding - Works like Gemini!
    // Detects ANY way of asking about doors, windows, gates, or roofing
    
    // Door Detection - matches: "door", "I need door", "design door", "door design", etc.
    if (msg.match(/\b(door|doors|entrance|entry|doorway)\b/i)) {
      response.text = updateMessage + '🚪 **Perfect! Here are door design options for you:**\n\n';
      response.images = productImages.door;
      productImages.door.forEach((item, i) => {
        response.text += `${i + 1}. **${item.name}** - ${item.type} - ${item.price}\n`;
      });
      response.text += '\n💡 **Click any image to select it!** I\'ll auto-fill your form.';
      return response;
    }
    
    // Window Detection - matches: "window", "I need window", "design window", etc.
    if (msg.match(/\b(window|windows|glass panel|pane)\b/i)) {
      response.text = updateMessage + '🪟 **Great choice! Here are window options:**\n\n';
      response.images = productImages.window;
      productImages.window.forEach((item, i) => {
        response.text += `${i + 1}. **${item.name}** - ${item.type} - ${item.price}\n`;
      });
      response.text += '\n💡 **Click to select!** Your form will update automatically.';
      return response;
    }
    
    // Gate Detection - matches: "gate", "I need gate", "design gate", etc.
    if (msg.match(/\b(gate|gates|gateway|main gate|entrance gate|driveway gate)\b/i)) {
      response.text = updateMessage + '🚧 **Excellent! Here are gate design options:**\n\n';
      response.images = productImages.gate;
      productImages.gate.forEach((item, i) => {
        response.text += `${i + 1}. **${item.name}** - ${item.type} - ${item.price}\n`;
      });
      response.text += '\n💡 **Click any design to select!** Form auto-fills instantly.';
      return response;
    }
    
    // Roofing Detection - matches: "roof", "I need roof", "design roof", etc.
    if (msg.match(/\b(roof|roofing|roofs|ceiling|top|tiles|shingles)\b/i)) {
      response.text = updateMessage + '🏠 **Perfect! Here are roofing options:**\n\n';
      response.images = productImages.roofing;
      productImages.roofing.forEach((item, i) => {
        response.text += `${i + 1}. **${item.name}** - ${item.type} - ${item.price}\n`;
      });
      response.text += '\n💡 **Click to select!** I\'ll update your project details.';
      return response;
    }

    // Detect project type from user's message with better pattern matching
    let detectedType = null;
    if (msg.match(/roof|roofing|ceiling|tiles|shingle/)) {
      detectedType = 'Roofing';
      response.images = productImages.roofing;
    } else if (msg.match(/door|entrance|entry|doorway/)) {
      detectedType = 'Door';
      response.images = productImages.door;
    } else if (msg.match(/window|glass|pane|sash/)) {
      detectedType = 'Window';
      response.images = productImages.window;
    } else if (msg.match(/gate|entrance|driveway|main gate/)) {
      detectedType = 'Gate';
      response.images = productImages.gate;
    }
    
    // If user mentions a different project type, suggest it
    if (detectedType && detectedType !== projectType) {
      const suggestions = {
        'Roofing': 'I can help you with roofing! 🏠\n\n**For residential roofing, consider:**\n- **Asphalt Shingles**: Affordable, 20-30 year lifespan (₹250-420/sq ft)\n- **Metal Roofing**: Durable, energy-efficient, 40-70 years (₹580-1000/sq ft)\n- **Tile Roofing**: Premium, 50+ years, excellent for hot climates (₹830-1500/sq ft)\n\n**I recommend:**\n1. Change "Project Type" above to "Roofing"\n2. Select your building type (Residential/Commercial)\n3. Enter roof area in square feet\n\nWhat type of building is this for?',
        'Door': 'Perfect! Let me help with your door project 🚪\n\n**Material options:**\n- **Teak Wood**: Premium, durable (₹10,000/unit)\n- **Steel**: Secure, fire-resistant (₹4,150/unit)\n- **Aluminum**: Lightweight (₹5,000/unit)\n\n**Standard sizes:**\n- Residential: 3ft x 6.67ft\n- Commercial: 3ft x 7ft\n\nChange "Project Type" to "Door" above to get started!',
        'Window': 'Great choice! For windows 🪟\n\n**Recommended materials:**\n- **Tempered Glass**: Safety first (₹5,800/unit)\n- **Aluminum Frame**: Low maintenance (₹5,000/unit)\n- **uPVC Frame**: Energy-efficient (₹4,565/unit)\n\n**Common sizes:**\n- Small: 2ft x 3ft\n- Medium: 3ft x 4ft\n- Large: 4ft x 5ft\n\nSet "Project Type" to "Window" above!',
        'Gate': 'I can help with your gate design! 🚧\n\n**Material options:**\n- **Stainless Steel**: Weather-proof (₹6,640/unit)\n- **Wrought Iron**: Classic look (₹7,055/unit)\n- **Aluminum**: Rust-resistant (₹5,000/unit)\n\n**Sizes:**\n- Pedestrian: 4ft x 6ft\n- Single Vehicle: 12ft x 6ft\n- Double Vehicle: 24ft x 6ft\n\nChange "Project Type" to "Gate" to begin!'
      };
      response.text = suggestions[detectedType];
      return response;
    }
    
    // Comparison queries - AI intelligence
    if (msg.match(/\b(compare|comparison|difference|vs|versus|better|best|which is better|should i choose)\b/i)) {
      response.text = '🤔 **AI Comparison Analysis:**\n\n**Let me help you compare!**\n\n**🚪 Doors:**\n• Steel - Most secure, fireproof, budget-friendly\n• Wood - Classic look, natural insulation\n• Aluminum - Lightweight, rust-proof\n\n**🪟 Windows:**\n• Tempered Glass - Safety first, shatter-resistant\n• Double Glazed - Energy saving, soundproof\n• Tinted Glass - Privacy + UV protection\n\n**🚧 Gates:**\n• Stainless Steel - Weather champion, long-lasting\n• Wrought Iron - Elegant, highly secure\n• Aluminum - Low maintenance, modern\n\n**🏠 Roofing:**\n• Metal - 40-70 years, energy efficient\n• Clay Tiles - Premium, 50+ years\n• Asphalt - Most affordable, 20-30 years\n\n💡 **Tell me your priorities** (budget/durability/style) and I\'ll recommend the best option!';
      response.images = [productImages.door[0], productImages.window[0], productImages.gate[0]];
      return response;
    }

    // Recommendation queries - AI suggestions
    if (msg.match(/\b(recommend|suggest|advice|opinion|what do you think|your suggestion|best option|top choice)\b/i)) {
      if (msg.match(/\b(door|doors)\b/i)) {
        response.text = '🤖 **AI Recommendation for Doors:**\n\n**My top pick: Steel Door**\n\n✅ **Why I recommend it:**\n• Best security (break-in resistant)\n• Fire-rated protection\n• Budget-friendly (₹4,150)\n• Low maintenance\n• Modern aesthetic\n\n**Perfect for:** Main entrances, high-security areas\n\n💡 **Alternative:** If you prefer traditional look, go with Teak Wood!';
        response.images = [productImages.door[0], productImages.door[1]];
        return response;
      } else if (msg.match(/\b(window|windows)\b/i)) {
        response.text = '🤖 **AI Recommendation for Windows:**\n\n**My top pick: Tempered Glass with Aluminum Frame**\n\n✅ **Why I recommend it:**\n• Safety certified (breaks into small pieces)\n• Crystal clear visibility\n• Rust-proof frame\n• Great value (₹5,000)\n\n**Perfect for:** Living rooms, bedrooms, offices\n\n💡 **Upgrade option:** Double glazed for AC rooms!';
        response.images = [productImages.window[0], productImages.window[1]];
        return response;
      } else if (msg.match(/\b(gate|gates)\b/i)) {
        response.text = '🤖 **AI Recommendation for Gates:**\n\n**My top pick: Stainless Steel Automatic Gate**\n\n✅ **Why I recommend it:**\n• Weather-proof (rain/sun resistant)\n• Auto-close feature\n• Premium durability\n• Modern smart look\n\n**Perfect for:** Main entrances, villas, commercial\n\n💡 **Budget option:** Steel Gate (₹4,500)';
        response.images = [productImages.gate[0], productImages.gate[1]];
        return response;
      }
      response.text = '🤖 **I\'d love to recommend!** What are you looking for?\n• Door recommendations\n• Window suggestions\n• Gate options\n• Roofing advice\n\nJust tell me and I\'ll give you my expert AI analysis! 🎯';
      return response;
    }

    // Material queries with images
    if (msg.match(/\b(material|materials|what material|which material|material type)\b/i)) {
      if (msg.match(/\b(door|doors|entrance)\b/i) || projectType === 'Door') {
        response.text = updateMessage + '🚪 **Door Materials - Here are your options:**\n\n';
        response.images = productImages.door;
        productImages.door.forEach((item, i) => {
          response.text += `${i + 1}. **${item.type}** - ${item.name} - ${item.price}\n`;
        });
        response.text += '\n💡 Click any option to select that material!';
        return response;
      } else if (msg.match(/\b(window|windows)\b/i) || projectType === 'Window') {
        response.text = updateMessage + '🪟 **Window Materials - Here are options:**\n\n';
        response.images = productImages.window;
        productImages.window.forEach((item, i) => {
          response.text += `${i + 1}. **${item.type}** - ${item.name} - ${item.price}\n`;
        });
        response.text += '\n💡 Click any option to select that material!';
        return response;
      }
    }
    
    // Size and measurement queries - AI guidance
    if (msg.match(/\b(size|dimension|measurement|how big|how wide|how tall|height|width|standard size)\b/i)) {
      response.text = '📏 **AI Sizing Guide:**\n\n**🚪 Standard Door Sizes:**\n• Single Door: 3\'x7\' (914mm x 2134mm)\n• Double Door: 6\'x7\' (1829mm x 2134mm)\n• Main Entrance: 4\'x8\' (premium)\n\n**🪟 Standard Window Sizes:**\n• Small: 2\'x3\' (610mm x 914mm)\n• Medium: 3\'x4\' (914mm x 1219mm)\n• Large: 4\'x5\' (1219mm x 1524mm)\n\n**🚧 Standard Gate Sizes:**\n• Single: 4\'x6\' (1219mm x 1829mm)\n• Double: 12\'x6\' (3658mm x 1829mm)\n• Driveway: 14\'x7\' (custom)\n\n💡 **Custom sizes available!** Tell me your space dimensions and I\'ll help you decide.';
      return response;
    }

    // Installation queries - AI technical support
    if (msg.match(/\b(install|installation|how to install|setup|fitting|mount|fix)\b/i)) {
      response.text = '🔧 **AI Installation Guide:**\n\n**Professional Installation Included!**\n\n⏱️ **Timeframes:**\n• Doors: 2-4 hours\n• Windows: 1-3 hours per unit\n• Gates: 4-8 hours (with automation)\n• Roofing: 2-5 days\n\n**📋 Our Process:**\n1. Site measurement verification\n2. Professional installation team\n3. Quality testing\n4. Cleanup & warranty activation\n\n**✅ What\'s Included:**\n• All hardware & fittings\n• Waterproofing/sealing\n• Final adjustments\n• 1-year installation warranty\n\n💡 **Book installation** when you place your order!';
      return response;
    }

    // Warranty and maintenance - AI support
    if (msg.match(/\b(warranty|guarantee|maintenance|durability|last|lifespan|how long)\b/i)) {
      response.text = '🛡️ **AI Warranty & Maintenance Info:**\n\n**Warranty Coverage:**\n• Steel Products: 5 years\n• Wood Products: 3 years\n• Glass/Aluminum: 2 years\n• Automation: 1 year\n\n**Expected Lifespan:**\n• Steel: 20-30 years\n• Wood: 15-25 years (with maintenance)\n• Aluminum: 25-35 years\n• Glass: 20+ years\n\n**🔧 Maintenance Tips:**\n✓ Clean quarterly with mild soap\n✓ Lubricate hinges annually\n✓ Check weatherstripping\n✓ Touch up paint/finish as needed\n\n📞 **24/7 Support:** We\'re always here to help!';
      return response;
    }

    // Color and finish queries
    if (msg.match(/\b(color|colour|finish|paint|coating|shade|appearance)\b/i)) {
      response.text = '🎨 **AI Color & Finish Options:**\n\n**Popular Finishes:**\n• **Matte Black** - Modern, sleek, trending\n• **White/Ivory** - Classic, timeless\n• **Wood Grain** - Natural, warm\n• **Bronze** - Premium, elegant\n• **Grey/Silver** - Contemporary, neutral\n\n**Special Coatings:**\n• Powder coating (weather-resistant)\n• UV protection (fade-resistant)\n• Anti-rust treatment\n• Scratch-resistant finish\n\n💡 **Color matching available!** Send us your color code or sample.';
      return response;
    }

    // Delivery and timeline
    if (msg.match(/\b(delivery|shipping|how long|when|timeline|lead time|receive)\b/i)) {
      response.text = '🚚 **AI Delivery Information:**\n\n**Manufacturing Time:**\n• Standard Items: 7-10 days\n• Custom Designs: 15-21 days\n• Bulk Orders: 21-30 days\n\n**Shipping:**\n• Local: 2-3 days\n• Interstate: 5-7 days\n• Free delivery on orders > ₹50,000\n\n**📦 Tracking:**\n• Real-time updates via SMS/Email\n• Photo proof of delivery\n• Signature required\n\n⚡ **Express options available** for urgent projects!';
      return response;
    }

    // Cost and pricing queries with visual options
    if (msg.match(/\b(cost|price|budget|expensive|cheap|affordable|how much|pricing)\b/i)) {
      if (estimatedCost) {
        response.text = `💰 **Cost Estimate for Your Project:**\n\n**Total: ₹${estimatedCost.total.toLocaleString()}**\n- Base: ₹${estimatedCost.base.toLocaleString()}\n- Materials: ₹${estimatedCost.materials.toLocaleString()}\n- Labor: ₹${estimatedCost.labor.toLocaleString()}\n\n**Tips to reduce cost:**\n✓ Choose standard dimensions\n✓ Opt for Steel over premium materials\n✓ Reduce custom features`;
        return response;
      }
      
      // Show pricing with product images
      if (msg.match(/\b(door|doors)\b/i) || projectType === 'Door') {
        response.text = updateMessage + '💰 **Door Pricing Options:**\n\n';
        response.images = productImages.door;
        productImages.door.forEach((item, i) => {
          response.text += `${i + 1}. ${item.name} - **${item.price}**\n`;
        });
        response.text += '\n💡 Click any option for more details!';
        return response;
      } else if (msg.match(/\b(window|windows)\b/i) || projectType === 'Window') {
        response.text = updateMessage + '💰 **Window Pricing:**\n\n';
        response.images = productImages.window;
        productImages.window.forEach((item, i) => {
          response.text += `${i + 1}. ${item.name} - **${item.price}**\n`;
        });
        response.text += '\n💡 Click to select and see full details!';
        return response;
      } else if (msg.match(/\b(gate|gates)\b/i) || projectType === 'Gate') {
        response.text = updateMessage + '💰 **Gate Pricing:**\n\n';
        response.images = productImages.gate;
        productImages.gate.forEach((item, i) => {
          response.text += `${i + 1}. ${item.name} - **${item.price}**\n`;
        });
        response.text += '\n💡 Click for selection!';
        return response;
      } else if (msg.match(/\b(roof|roofing)\b/i) || projectType === 'Roofing') {
        response.text = updateMessage + '💰 **Roofing Costs:**\n\n';
        response.images = productImages.roofing;
        productImages.roofing.forEach((item, i) => {
          response.text += `${i + 1}. ${item.name} - **${item.price}**\n`;
        });
        response.text += '\n💡 Click to choose!';
        return response;
      }
      
      response.text = 'Fill in your project details (dimensions, material, features) and I\'ll calculate a real-time estimate! Budget planning is crucial. Or tell me what product you need pricing for!';
      return response;
    }
    
    // Material queries with images
    if (msg.match(/\b(material|materials|what material|which material|material type)\b/i)) {
      if (msg.match(/\b(door|doors|entrance)\b/i) || projectType === 'Door') {
        response.text = updateMessage + '🚪 **Door Materials - Here are your options:**\n\n';
        response.images = productImages.door;
        productImages.door.forEach((item, i) => {
          response.text += `${i + 1}. **${item.type}** - ${item.name} - ${item.price}\n`;
        });
        response.text += '\n💡 Click any option to select that material!';
        return response;
      } else if (msg.match(/\b(window|windows)\b/i) || projectType === 'Window') {
        response.text = updateMessage + '🪟 **Window Materials - Here are options:**\n\n';
        response.images = productImages.window;
        productImages.window.forEach((item, i) => {
          response.text += `${i + 1}. **${item.type}** - ${item.name} - ${item.price}\n`;
        });
        response.text += '\n💡 Click any option to select that material!';
        return response;
      } else if (msg.match(/\b(gate|gates)\b/i) || projectType === 'Gate') {
        response.text = updateMessage + '🚧 **Gate Materials - Available options:**\n\n';
        response.images = productImages.gate;
        productImages.gate.forEach((item, i) => {
          response.text += `${i + 1}. **${item.type}** - ${item.name} - ${item.price}\n`;
        });
        response.text += '\n💡 Click to choose your material!';
        return response;
      } else if (msg.match(/\b(roof|roofing)\b/i) || projectType === 'Roofing') {
        response.text = updateMessage + '🏠 **Roofing Materials:**\n\n';
        response.images = productImages.roofing;
        productImages.roofing.forEach((item, i) => {
          response.text += `${i + 1}. **${item.type}** - ${item.name} - ${item.price}\n`;
        });
        response.text += '\n💡 Click to select roofing material!';
        return response;
      }
      // Show all materials if no specific type
      response.text = updateMessage + '🔨 **All Material Options:**\n\n**What are you looking for?**\n- Type "door materials"\n- Type "window materials"\n- Type "gate materials"\n- Type "roofing materials"\n\nOr just tell me what you need!';
      return response;
    }
    
    if (msg.includes('cost') || msg.includes('price') || msg.includes('budget')) {
      if (estimatedCost) {
        return `Based on your current design:\n💰 **Estimated Cost: ₹${estimatedCost.total.toLocaleString()}**\n- Base: ₹${estimatedCost.base.toLocaleString()}\n- Materials: ₹${estimatedCost.materials.toLocaleString()}\n- Labor: ₹${estimatedCost.labor.toLocaleString()}\n\nTips to reduce cost:\n- Choose standard dimensions\n- Opt for Steel over premium materials\n- Reduce custom features`;
      }
      return 'Fill in your project details (dimensions, material, features) and I\'ll calculate a real-time estimate! Budget planning is crucial for engineering projects.';
    }
    
    // Installation & Maintenance queries
    if (msg.match(/install|installation|how to install|fitting/)) {
      return 'Installation Guide: 🔧\n\n**Professional Installation Recommended**\n- Doors/Windows: 1-2 days\n- Gates: 2-3 days (with automation: 3-4 days)\n- Roofing: 3-7 days (depends on area)\n\n**DIY Considerations:**\n✅ Proper tools required\n✅ Building codes compliance\n✅ Warranty may require professional install\n✅ Safety equipment necessary\n\n**Included in our service:**\n• Site preparation\n• Professional installation\n• Post-install inspection\n• 1-year installation warranty\n\nWould you like a detailed installation timeline?';
    }
    
    if (msg.match(/maintain|maintenance|care|clean|upkeep/)) {
      return 'Maintenance Tips: 🧹\n\n**Regular Maintenance (Every 6 months):**\n\n**Doors/Gates:**\n• Lubricate hinges and locks\n• Check weather stripping\n• Clean with mild soap\n• Inspect for rust/corrosion\n\n**Windows:**\n• Clean glass with non-abrasive cleaner\n• Check seals and caulking\n• Lubricate sliding mechanisms\n• Inspect frames for damage\n\n**Roofing:**\n• Clear debris and leaves\n• Inspect for damaged shingles\n• Clean gutters\n• Check for leaks after rain\n\n**Pro tip:** Schedule annual professional inspection!';
    }
    
    if (msg.match(/warranty|guarantee|coverage|protection/)) {
      return 'Warranty Coverage: 🛡️\n\n**Standard Warranty:**\n• Materials: 10-25 years (manufacturer)\n• Installation: 1 year (our service)\n• Hardware: 2-5 years\n\n**Extended Protection Available:**\n• Premium Warranty: +$500 (5 years full coverage)\n• Lifetime Structural Warranty: +$1,200\n\n**Covered:**\n✅ Manufacturing defects\n✅ Installation errors\n✅ Structural issues\n✅ Hardware failures\n\n**Not Covered:**\n❌ Normal wear & tear\n❌ Weather damage\n❌ Improper maintenance\n❌ Unauthorized modifications\n\nNeed extended warranty details?';
    }
    
    if (msg.match(/weather|climate|rain|sun|wind|snow|resistant/)) {
      return 'Weather Resistance Guide: ☀️🌧️\n\n**Climate Considerations:**\n\n**Hot/Sunny Climates:**\n• UV-resistant coatings\n• Reflective materials\n• Heat-resistant seals\n• Light colors recommended\n\n**Rainy/Humid Climates:**\n• Waterproof materials\n• Rust-resistant hardware\n• Proper drainage design\n• Anti-corrosion coating\n\n**Cold/Snowy Climates:**\n• Insulated materials\n• Weather stripping\n• Freeze-resistant components\n• Snow load calculations\n\n**Coastal Areas:**\n• Marine-grade stainless steel\n• Salt-resistant finishes\n• Enhanced corrosion protection\n\nWhat\'s your climate like?';
    }
    
    if (msg.match(/compare|comparison|vs|versus|difference|better/)) {
      return 'Material Comparison: 📊\n\n**Steel vs Aluminum:**\n• Steel: Stronger, heavier, needs coating ($50/unit)\n• Aluminum: Rust-proof, lighter, more expensive ($60/unit)\n\n**Wood vs Metal:**\n• Wood: Natural look, needs maintenance, insulating ($90-120/unit)\n• Metal: Low maintenance, modern, durable ($50-80/unit)\n\n**Asphalt vs Metal Roofing:**\n• Asphalt: Cheaper upfront, 20-30 years ($3-5/sq ft)\n• Metal: Higher cost, 50+ years, energy-efficient ($7-12/sq ft)\n\n**Budget vs Premium:**\n• Budget: Basic function, shorter lifespan, standard look\n• Premium: Enhanced features, longer warranty, better aesthetics\n\nWhich materials would you like to compare in detail?';
    }
    
    if (msg.match(/energy|efficiency|insulation|thermal|saving/)) {
      return 'Energy Efficiency Guide: ⚡💡\n\n**Energy-Saving Features:**\n\n**Windows:**\n• Double/Triple glazing: 30-50% heat reduction\n• Low-E coating: Blocks UV, retains heat\n• Gas-filled panes: Better insulation\n• **Savings**: $100-300/year on energy bills\n\n**Doors:**\n• Insulated core: R-value 15-20\n• Weather stripping: Prevents drafts\n• Thermal break: Reduces heat transfer\n\n**Roofing:**\n• Cool roof coating: Reflects 65-90% of sun\n• Proper ventilation: Reduces AC load 15-20%\n• Insulation: R-30 to R-60 recommended\n• **Payback**: 3-7 years\n\n**ROI:** Energy-efficient upgrades can increase home value by 5-10%!';
    }
    
    if (msg.match(/permit|code|regulation|legal|approval/)) {
      return 'Permits & Regulations: 📋\n\n**Typically Required Permits:**\n\n**Roofing:**\n✅ Building permit (always)\n✅ Structural approval\n✅ HOA approval (if applicable)\n• Cost: $200-500\n• Processing: 2-4 weeks\n\n**Doors/Windows (Exterior):**\n✅ Building permit (major changes)\n✅ Energy compliance\n• Cost: $50-150\n• Processing: 1-2 weeks\n\n**Gates (Automated):**\n✅ Electrical permit\n✅ Safety compliance\n✅ Setback requirements\n• Cost: $100-300\n\n**We Handle:**\n• Permit applications\n• Code compliance verification\n• Inspector coordination\n• Documentation\n\n**Note:** Requirements vary by location!';
    }
    
    if (msg.match(/calculate|calculator|math|compute|estimate/)) {
      if (width && height) {
        const area = parseFloat(width) * parseFloat(height);
        return `Quick Calculator: 🧮\n\n**Your Dimensions:** ${width}ft × ${height}ft\n**Area:** ${area.toFixed(2)} square feet\n\n**Useful Calculations:**\n• Roofing material needed: ${(area * 1.15).toFixed(2)} sq ft (15% waste factor)\n• Paint required: ${(area / 350).toFixed(2)} gallons\n• Approximate weight: ${(area * 3).toFixed(2)} lbs (standard materials)\n\n**Cost Estimates by Material:**\n• Steel: $${(area * 50).toFixed(2)}\n• Aluminum: $${(area * 60).toFixed(2)}\n• Wood: $${(area * 90).toFixed(2)}\n\nNeed more calculations?`;
      }
      return 'Quick Calculator: 🧮\n\nI can help calculate:\n• Material quantities\n• Cost estimates\n• Area/volume\n• Paint needed\n• Installation time\n\nEnter your dimensions above (width × height) and ask me to calculate!';
    }
    
    // Product-specific dimension guidance
    if (msg.match(/\b(size|dimension|measure|measurement|how big|how large)\b/i)) {
      if (projectType === 'Roofing') {
        return 'Roofing Measurements: 🏠📏\n\n**How to Measure:**\n1. Measure roof length and width\n2. Calculate area (L × W)\n3. Multiply by roof pitch factor\n4. Add 10-15% for waste\n\n**Typical House Sizes:**\n• Small (1000 sq ft home): 1,200-1,500 sq ft roof\n• Medium (1500 sq ft home): 1,800-2,200 sq ft roof\n• Large (2500 sq ft home): 3,000-3,500 sq ft roof\n\n**Pitch Multipliers:**\n• Flat (1:12): 1.00×\n• Low (4:12): 1.05×\n• Medium (6:12): 1.12×\n• Steep (12:12): 1.41×\n\nNeed help calculating your roof area?';
      } else if (projectType === 'Door') {
        return 'Standard door dimensions: 🚪\n- **Residential Interior**: 30" x 80" or 32" x 80"\n- **Residential Exterior**: 36" x 80" (3ft x 6.67ft)\n- **Commercial**: 36" x 84" (3ft x 7ft)\n- **Double Door**: 60-72" x 80" (5-6ft x 6.67ft)\n- **Garage**: 8-9ft x 7ft (single) or 16ft x 7ft (double)\n\n**Opening Size:** Add 2-3" to door size for frame\n\nCustom sizes available! Enter dimensions in feet.';
      } else if (projectType === 'Window') {
        return 'Common window sizes: 🪟\n\n**Standard Heights:** 3-6 feet\n**Standard Widths:** 2-8 feet\n\n**Popular Sizes:**\n- **Small**: 24" x 36" (2ft x 3ft) - Bathrooms\n- **Medium**: 36" x 48" (3ft x 4ft) - Bedrooms\n- **Large**: 48" x 60" (4ft x 5ft) - Living rooms\n- **Picture Window**: 72" x 48" (6ft x 4ft)\n- **Bay Window**: Custom configurations\n\n**Rough Opening:** Add 1-2" for installation\n\nEnter width × height in feet!';
      } else if (projectType === 'Gate') {
        return 'Gate sizing guide: 🚧\n\n**Pedestrian Gates:**\n- Standard: 3-4ft wide × 5-6ft tall\n- ADA Compliant: 36" minimum width\n\n**Vehicle Gates:**\n- Single Car: 10-12ft wide × 5-7ft tall\n- Double Car: 20-24ft wide × 5-7ft tall\n- RV/Truck: 14-16ft wide × 8-10ft tall\n\n**Commercial:**\n- Delivery: 12-14ft wide\n- Loading Dock: 16-20ft wide\n\n**Clearance:** Add 6-12" to vehicle width\n**Swing Space:** Consider gate arc radius\n\nMeasure your opening accurately!';
      }
      return 'Dimensions are critical! Measure your space: Width (ft) × Height (ft). For roofing, include total area in square feet. I can help calculate material needs!';
    }
    
    if (msg.includes('feature') || msg.includes('add') || msg.includes('include')) {
      return 'Popular features by category: ✨\n\n**Doors**: Auto-closer, deadbolt lock, fire-rating, vision panel\n**Windows**: Double-glazing, UV coating, security bars, mosquito mesh\n**Gates**: Automation, intercom, CCTV, remote control\n**Roofing**: Insulation, skylights, solar panels, waterproofing\n\nEach feature adds ~$200 to cost but increases value!';
    }
    
    if (msg.includes('timeline') || msg.includes('how long') || msg.includes('duration')) {
      const categoryTime = {
        'Mechanical': '2-4 weeks',
        'Industrial': '3-6 weeks',
        'Consulting': '1-3 weeks',
        'Maintenance': '1-2 weeks'
      };
      const time = categoryTime[category] || '2-4 weeks';
      return `Typical timeline for ${category || 'your'} projects: ⏱️\n\n**${time}** (includes design, approval, fabrication, installation)\n\nFactors affecting timeline:\n- Custom features (+1 week)\n- Premium materials (+3-5 days)\n- Complex designs (+1-2 weeks)\n\nWe'll provide exact timeline after reviewing your design!`;
    }
    
    if (msg.includes('safety') || msg.includes('compliance') || msg.includes('code')) {
      return 'Safety & Compliance checklist: 🛡️\n\n✅ **Fire Safety**: Fire-rated materials for commercial\n✅ **Structural**: Load calculations for roofing\n✅ **Security**: Proper locking mechanisms\n✅ **Weather**: Corrosion protection for exterior\n✅ **Standards**: Compliance with local building codes\n\nOur team ensures all designs meet regulatory requirements!';
    }
    
    if (msg.includes('help') || msg.includes('guide') || msg.includes('how to')) {
      return 'I can help you with: 🤖\n\n1️⃣ **Material Selection** - Best options for your project\n2️⃣ **Cost Estimation** - Real-time budget calculations\n3️⃣ **Dimensions** - Standard sizes and custom requirements\n4️⃣ **Features** - Available add-ons and upgrades\n5️⃣ **Timeline** - Project duration estimates\n6️⃣ **Safety** - Compliance and regulations\n\nJust ask me anything like "What material for doors?" or "How much will it cost?"';
    }
    
    if (msg.includes('save') || msg.includes('draft')) {
      return 'Your project auto-saves every 30 seconds! 💾\n\nYou can also:\n- Click **"Save as Draft"** to manually save\n- Reload page to continue where you left off\n- Drafts stored in your browser\n\nNever lose your progress!';
    }
    
    if (msg.includes('upload') || msg.includes('file') || msg.includes('blueprint')) {
      return 'File Upload Tips: 📁\n\n✅ **Supported**: Images (JPG, PNG), PDF, DWG, CAD files\n✅ **Drag & Drop**: Just drop files in the upload zone\n✅ **Multiple Files**: Upload references, blueprints, inspiration\n\nFiles help our team understand your vision better! Max 10MB per file.';
    }
    
    // Smart follow-up based on conversation context - Gemini-style contextual AI
    const lastTopics = conversationContext.slice(-3).join(' ');
    if (lastTopics.includes('cost') && !lastTopics.includes('save')) {
      response.text = updateMessage + '💡 **Smart Cost Tip:** Since we discussed costs, here are ways to **save money**:\n\n1️⃣ **Choose standard sizes** (-15-20%)\n2️⃣ **Bundle multiple projects** (-10-15%)\n3️⃣ **Off-season installation** (-10% in winter)\n4️⃣ **Mid-grade materials** (best value/durability ratio)\n5️⃣ **Skip premium features** initially, upgrade later\n\n**Financing Options:**\n• 0% APR for 12 months\n• Low monthly payments\n• Home improvement loans\n\nWant to know about material alternatives that cost less?';
      return response;
    }
    
    if (lastTopics.includes('material') && !lastTopics.includes('install')) {
      response.text = updateMessage + '🔨 **Next Step Suggestion:** Now that you\'ve chosen materials, let\'s talk about:\n\n**Installation:**\n• Professional vs DIY\n• Timeline expectations\n• Site preparation\n• Permits needed\n\n**Or learn about:**\n• Maintenance requirements\n• Warranty coverage\n• Energy efficiency\n• Weather resistance\n\nWhat would you like to know next?';
      return response;
    }

    // Conversational fallback - ChatGPT AI experience
    // Handles unclear queries with intelligence
    if (msg.length < 3) {
      response.text = '🤔 I\'m listening! Could you tell me more about what you need?';
      return response;
    }
    
    // Handle emotional expressions
    if (msg.match(/\b(frustrated|angry|mad|annoyed|upset|stressed|worried|nervous|excited|happy)\b/i)) {
      const emotion = msg.match(/\b(frustrated|angry|mad|annoyed|upset|stressed|worried|nervous|excited|happy)\b/i)[0];
      const responses = {
        frustrated: '😌 I understand this can be frustrating. Let me help make it easier! What specific aspect is giving you trouble?',
        angry: '🙏 I\'m sorry you\'re feeling upset. How can I help improve your experience? Let me know what you need.',
        stressed: '😊 Take a deep breath! I\'m here to make this process stress-free. Let\'s tackle one thing at a time. What would help most right now?',
        worried: '💙 Don\'t worry, I\'m here to help! What are you concerned about? Let me provide some guidance.',
        excited: '🎉 That\'s wonderful! Your enthusiasm is great! What are you most excited about? Let\'s make it happen!',
        happy: '😊 I\'m glad you\'re happy! How can I help make your project even better?'
      };
      response.text = responses[emotion] || responses.stressed;
      return response;
    }
    
    // Handle random statements or unclear input
    if (!msg.match(/\b(door|window|gate|roof|material|cost|price|design|install|help|show|tell|what|how|why|when|where)\b/i)) {
      response.text = `💬 **I heard you say: "${message}"**\n\nI\'m your AI design assistant! While I can chat about many things, I specialize in helping with design projects.\n\n**I\'m great at:**\n• Answering design questions\n• Showing product options\n• Calculating costs\n• Providing recommendations\n• General conversation & support\n\n**Try asking me:**\n• \"Show me door designs\"\n• \"What\'s the best material for windows?\"\n• \"How much will my project cost?\"\n• \"Help me choose a gate\"\n• Or just tell me what you need!\n\n${projectType ? `\n**Your Current Project:** ${projectType}` : '**Ready to start a new project?**'}\n\nWhat can I help you with? 😊`;
      return response;
    }

    // Check if it's ANY type of question - ChatGPT-like intelligence
    if (msg.includes('?') || msg.includes('how') || msg.includes('what') || msg.includes('why') || msg.includes('when') || msg.includes('where') || msg.includes('who') || msg.includes('can you') || msg.includes('could you') || msg.includes('would you') || msg.includes('tell me') || msg.includes('explain')) {
      let contextResponse = updateMessage || '';
      
      // Provide contextual intelligent response
      if (projectType && projectType !== 'Door') {
        contextResponse += `I see you're working on a **${projectType}** project. `;
      }
      
      if (materialName || estimatedCost) {
        contextResponse += `\n\n**Your Current Design:**\n`;
        if (materialName) contextResponse += `• Material: **${materialName}**\n`;
        if (width && height) contextResponse += `• Dimensions: **${width}ft × ${height}ft**\n`;
        if (estimatedCost) contextResponse += `• Estimated Cost: **₹${estimatedCost.total.toLocaleString()}**\n`;
        contextResponse += `\n`;
      }
      
      contextResponse += `💡 **I'm here to answer ALL your questions!**\n\n**I can help you with:**\n\n🎨 **Design & Products:**\n• Show you options with images\n• Recommend best materials\n• Compare different styles\n• Suggest features and upgrades\n\n💰 **Cost & Budget:**\n• Calculate instant estimates\n• Explain pricing factors\n• Suggest cost-saving options\n• Payment and financing info\n\n🔧 **Technical Info:**\n• Dimensions and measurements\n• Installation requirements\n• Maintenance guidelines\n• Safety and compliance\n• Energy efficiency tips\n\n📋 **Process & Support:**\n• Timeline expectations\n• Warranty coverage\n• Permit requirements\n• Custom design options\n• After-sales support\n\n**Ask me anything!** I'm designed to understand natural conversation. Just chat with me like you would with a real assistant. 😊`;
      
      response.text = contextResponse;
      return response;
    }
    
    // Provide intelligent context-aware default response
    if (projectType && materialName) {
      const progressItems = [];
      if (materialName) progressItems.push('✅ Material selected');
      if (width && height) progressItems.push('✅ Dimensions entered');
      if (estimatedCost) progressItems.push('✅ Cost estimated');
      
      response.text = updateMessage + `Great progress on your **${projectType}** project! ${progressItems.join(' • ')}\n\n${materialName ? `**Material:** ${materialName}` : ''} ${estimatedCost ? `\n**Estimate:** ₹${estimatedCost.total.toLocaleString()}` : ''}\n\n**Next steps:**\n1. Add features/upgrades\n2. Upload reference images\n3. Submit for review\n\n**Need help with:**\n• Installation timeline\n• Maintenance tips\n• Warranty options\n• Energy efficiency\n• Permit requirements\n\nWhat would you like to explore?`;
      return response;
    }
    
    // ChatGPT-like conversational default response
    response.text = updateMessage + `🤖 **I'm your AI Design Assistant!**\n\n💬 **Chat with me naturally** - I understand conversational language!\n\n**Try asking me anything like:**\n• \"What materials do you recommend for a bedroom door?\"\n• \"How much would a steel gate cost?\"\n• \"Show me energy-efficient window options\"\n• \"What's the difference between wood and aluminum?\"\n• \"How long does installation take?\"\n• \"Tell me about warranty coverage\"\n• \"I need a secure door for my office\"\n• \"Looking for budget-friendly options\"\n\n**🎨 I can show you:**\n🚪 Doors • 🪟 Windows • 🚧 Gates • 🏠 Roofing\n\n**💡 I can help with:**\n✓ Smart recommendations with images\n✓ Real-time cost calculations\n✓ Material comparisons\n✓ Technical specifications\n✓ Installation & maintenance\n✓ And much more!\n\n${projectType ? `\n**Current Project:** ${projectType}` : '**Start by telling me what you need!**'}\n${materialName ? `\n**Selected Material:** ${materialName}` : ''}\n\n**Go ahead, ask me anything!** 🚀`;
    return response;
  };

  const handleSendMessage = async () => {
    if (!userMessage.trim()) return;
    
    // Add user message
    const userMsg = {
      type: 'user',
      text: userMessage,
      timestamp: new Date()
    };
    setChatMessages(prev => [...prev, userMsg]);
    
    // Show typing indicator
    setIsTyping(true);
    const currentMessage = userMessage;
    setUserMessage('');
    
    try {
      // Call backend API for AI response with image suggestions
      const { data } = await axios.post('/api/chatbot/chat', {
        message: currentMessage,
        projectType: design.projectType,
        category: design.category,
        context: conversationContext
      });
      
      setIsTyping(false);
      
      // Apply auto-fill data if provided
      if (data.autoFillData) {
        setDesign(prev => ({
          ...prev,
          ...data.autoFillData,
          specifications: {
            ...prev.specifications,
            ...(data.autoFillData.material && { material: data.autoFillData.material })
          }
        }));
        toast.success('✨ Form auto-filled based on your message!');
      }
      
      // Add bot response with images
      const botMsg = {
        type: 'bot',
        text: data.response,
        images: data.images || [],
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, botMsg]);
      
      // Update conversation context
      setConversationContext(prev => [...prev, currentMessage].slice(-5));
      
    } catch (error) {
      setIsTyping(false);
      
      // Enhanced ChatGPT-like fallback - try local AI first
      const fallbackResponse = generateChatResponse(currentMessage);
      
      // Create intelligent response
      let botResponse = {
        type: 'bot',
        text: '',
        images: [],
        timestamp: new Date()
      };
      
      if (typeof fallbackResponse === 'object') {
        botResponse.text = fallbackResponse.text;
        botResponse.images = fallbackResponse.images || [];
      } else {
        botResponse.text = fallbackResponse;
      }
      
      // Only add fallback message if response is too short or generic
      if (!botResponse.text || botResponse.text.length < 30) {
        botResponse.text = `🤖 **I understand your question: "${currentMessage}"**\n\nI'm working in offline mode right now, but I can still help!\n\n**What I can assist you with:**\n\n💬 **Conversations:**\n• Answer design questions\n• Provide recommendations\n• Explain concepts\n• Compare options\n\n🎨 **Design Help:**\n• Show product options\n• Calculate estimates\n• Suggest materials\n• Guide your choices\n\n**Current Project:**\n${design.projectType ? `• Type: **${design.projectType}**` : '• No project type set'}\n${design.specifications.material ? `• Material: **${design.specifications.material}**` : '• No material selected'}\n${estimatedCost ? `• Estimate: **₹${estimatedCost.total.toLocaleString()}**` : '• Fill details for estimate'}\n\n**Try asking:**\n• \"Show me [door/window/gate] options\"\n• \"What material is best for [purpose]?\"\n• \"How much will this cost?\"\n• \"Compare [option A] vs [option B]\"\n\n**I'm here to help!** What would you like to know? 😊`;
      }
      
      setChatMessages(prev => [...prev, botResponse]);
      
      // Update conversation context
      setConversationContext(prev => [...prev, currentMessage].slice(-5));
      
      console.log('Using enhanced local AI - seamless experience maintained');
    }
    
    // Scroll to bottom
    setTimeout(() => {
      const chatContainer = document.getElementById('chat-messages');
      if (chatContainer) {
        chatContainer.scrollTop = chatContainer.scrollHeight;
      }
    }, 100);
  };
  
  // Export chat history
  const exportChatHistory = () => {
    const chatText = chatMessages
      .map(msg => `[${msg.timestamp.toLocaleTimeString()}] ${msg.type === 'user' ? 'You' : 'AI'}: ${msg.text}`)
      .join('\n\n');
    
    const blob = new Blob([chatText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `design-chat-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    toast.success('Chat history exported!');
  };
  
  // Clear chat
  const clearChat = () => {
    setChatMessages([
      { type: 'bot', text: 'Chat cleared! How can I help with your new project?', timestamp: new Date() }
    ]);
    setConversationContext([]);
    toast.info('Chat history cleared');
  };

  // Effects
  useEffect(() => {
    if (design.specifications.material && design.specifications.dimensions.width) {
      calculateEstimate();
    }
  }, [design.specifications, design.category, calculateEstimate]);

  useEffect(() => {
    if (estimatedCost) {
      generateAISuggestions();
    }
  }, [estimatedCost, design, generateAISuggestions]);

  useEffect(() => {
    calculateProgress();
  }, [design, calculateProgress]);

  useEffect(() => {
    const saveInterval = setInterval(autoSave, 30000); // Auto-save every 30 seconds
    return () => clearInterval(saveInterval);
  }, [autoSave]);

  // Load draft on mount
  useEffect(() => {
    const draft = localStorage.getItem('draft_design');
    if (draft) {
      const shouldLoad = window.confirm('Found a saved draft. Would you like to continue from where you left off?');
      if (shouldLoad) {
        setDesign(JSON.parse(draft));
        toast.info('Draft loaded successfully');
      }
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please login to create a design');
      navigate('/login');
      return;
    }

    // Check if user has phone number registered
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      const { data } = await axios.get('/api/auth/profile', config);
      
      if (!data.user.phone) {
        toast.error('Phone number is required! Please add a phone number to your profile before submitting designs. Redirecting to profile...');
        setTimeout(() => navigate('/profile'), 2500);
        return;
      }
    } catch (error) {
      console.error('Error checking user phone:', error);
      toast.error('Unable to verify profile. Please try again.');
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.post('/api/designs', design, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success('Design created successfully! Our team will review it soon.');
      navigate('/designs/my-designs');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create design');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-luxury-black relative overflow-hidden">
      {/* Main Content Wrapper - Slides left when chat opens */}
      <motion.div
        animate={{ 
          marginRight: chatOpen ? '500px' : '0'
        }}
        transition={{ 
          type: 'spring', 
          damping: 30, 
          stiffness: 150,
          mass: 0.8,
          restDelta: 0.001
        }}
        className="min-h-screen py-12 px-4 relative overflow-hidden"
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-20 left-10 w-96 h-96 bg-primary-500 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500 rounded-full blur-3xl"
        />
      </div>

      {/* Floating Stats Widget */}
      <motion.div
        initial={{ opacity: 0, x: 100 }}
        animate={{ 
          opacity: 1, 
          x: 0,
          right: chatOpen ? '516px' : '16px'
        }}
        transition={{ 
          delay: 1,
          x: { type: 'spring', damping: 30, stiffness: 150, mass: 0.8 },
          right: { type: 'spring', damping: 30, stiffness: 150, mass: 0.8, restDelta: 0.001 },
          opacity: { duration: 0.4, ease: 'easeInOut' }
        }}
        className="fixed top-1/4 z-30 hidden lg:block"
      >
        <motion.div 
          whileHover={{ scale: 1.05, y: -5 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          className="luxury-card p-4 rounded-xl border border-primary-500/30 backdrop-blur-lg bg-luxury-darkGray/80 shadow-xl hover:shadow-2xl hover:shadow-primary-500/20 hover:border-primary-500/50 transition-all duration-300"
        >
          <div className="text-center mb-3">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            >
              <FiCpu className="text-primary-500 text-3xl mx-auto mb-2" />
            </motion.div>
            <p className="text-xs text-gray-400 font-semibold">LIVE STATUS</p>
          </div>
          <div className="space-y-3">
            <motion.div 
              className="text-center"
              whileHover={{ scale: 1.08 }}
              transition={{ type: 'spring', stiffness: 400 }}
            >
              <motion.div 
                className="text-2xl font-bold text-white"
                key={completionProgress}
                initial={{ scale: 1.2, color: '#2196f3' }}
                animate={{ scale: 1, color: '#ffffff' }}
                transition={{ duration: 0.5 }}
              >
                {completionProgress}%
              </motion.div>
              <div className="text-xs text-gray-400">Complete</div>
            </motion.div>
            <div className="border-t border-primary-500/20 pt-2">
              <motion.div 
                className="text-center"
                whileHover={{ scale: 1.08 }}
                transition={{ type: 'spring', stiffness: 400 }}
              >
                <motion.div 
                  className="text-lg font-bold text-primary-500"
                  key={estimatedCost?.total}
                  initial={{ scale: 1.2, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  {estimatedCost ? `$${estimatedCost.total.toLocaleString()}` : '--'}
                </motion.div>
                <div className="text-xs text-gray-400">Estimated</div>
              </motion.div>
            </div>
            <div className="border-t border-primary-500/20 pt-2">
              <motion.div 
                className="text-center"
                whileHover={{ scale: 1.08 }}
                transition={{ type: 'spring', stiffness: 400 }}
              >
                <motion.div 
                  className="text-lg font-bold text-purple-500"
                  key={aiSuggestions.length}
                  initial={{ scale: 1.3, rotate: -10 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  {aiSuggestions.length}
                </motion.div>
                <div className="text-xs text-gray-400">AI Tips</div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header with Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="text-center mb-6">
            <h1 className="text-5xl md:text-6xl font-bold font-serif text-white mb-4">
              <span className="text-transparent bg-gradient-to-r from-primary-400 via-primary-500 to-primary-600 bg-clip-text">
                AI-Powered
              </span> Design Studio
            </h1>
            <p className="text-gray-400 text-lg">Create your custom engineering project with intelligent assistance</p>
          </div>

          {/* Progress Bar */}
          <div className="max-w-3xl mx-auto">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-400">Project Completion</span>
              <span className="text-sm font-semibold text-primary-500">{completionProgress}%</span>
            </div>
            <div className="w-full h-3 bg-luxury-darkGray rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${completionProgress}%` }}
                transition={{ duration: 0.5 }}
                className="h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full relative"
              >
                <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
              </motion.div>
            </div>
          </div>

          {/* Quick Actions Bar */}
          <div className="flex justify-center gap-4 mt-6">
            <button
              type="button"
              onClick={() => setShowAiPanel(!showAiPanel)}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all"
            >
              <FiCpu className="text-xl" />
              <span>AI Assistant</span>
              {aiSuggestions.length > 0 && (
                <span className="bg-white text-purple-600 px-2 py-0.5 rounded-full text-xs font-bold">
                  {aiSuggestions.length}
                </span>
              )}
            </button>
            
            <button
              type="button"
              onClick={() => setShowCostBreakdown(!showCostBreakdown)}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all"
            >
              <FiDollarSign className="text-xl" />
              <span>Cost</span>
              {estimatedCost && (
                <span className="bg-white text-green-600 px-2 py-0.5 rounded-full text-xs font-bold">
                  ₹{estimatedCost.total.toLocaleString()}
                </span>
              )}
            </button>

            {autoSaving && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center space-x-2 px-4 py-3 bg-luxury-darkGray text-primary-500 rounded-lg"
              >
                <FiCheckCircle className="animate-pulse" />
                <span className="text-sm">Auto-saved</span>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* AI Suggestions Panel */}
        <AnimatePresence>
          {showAiPanel && aiSuggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -20, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -20, height: 0 }}
              className="mb-8 luxury-card p-6 rounded-xl border-2 border-purple-500/30"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <FiZap className="text-purple-500 text-2xl" />
                  <h3 className="text-xl font-bold text-white">AI-Powered Suggestions</h3>
                </div>
                <button
                  onClick={() => setShowAiPanel(false)}
                  className="text-gray-400 hover:text-white"
                >
                  ×
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {aiSuggestions.map((suggestion, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-luxury-darkGray p-4 rounded-lg border border-purple-500/20 hover:border-purple-500/50 transition-all"
                  >
                    <div className="flex items-start space-x-3">
                      <span className="text-3xl">{suggestion.icon}</span>
                      <div className="flex-1">
                        <h4 className="font-semibold text-white mb-1">{suggestion.title}</h4>
                        <p className="text-sm text-gray-400">{suggestion.description}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Cost Breakdown Panel */}
        <AnimatePresence>
          {showCostBreakdown && estimatedCost && (
            <motion.div
              initial={{ opacity: 0, y: -20, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -20, height: 0 }}
              className="mb-8 luxury-card p-6 rounded-xl border-2 border-green-500/30"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <FiTrendingUp className="text-green-500 text-2xl" />
                  <h3 className="text-xl font-bold text-white">Real-Time Cost Analysis</h3>
                </div>
                <button
                  onClick={() => setShowCostBreakdown(false)}
                  className="text-gray-400 hover:text-white"
                >
                  ×
                </button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-luxury-darkGray p-4 rounded-lg">
                  <div className="text-gray-400 text-sm mb-1">Base Cost</div>
                  <div className="text-2xl font-bold text-white">${estimatedCost.base.toLocaleString()}</div>
                </div>
                <div className="bg-luxury-darkGray p-4 rounded-lg">
                  <div className="text-gray-400 text-sm mb-1">Materials</div>
                  <div className="text-2xl font-bold text-primary-500">${estimatedCost.materials.toLocaleString()}</div>
                </div>
                <div className="bg-luxury-darkGray p-4 rounded-lg">
                  <div className="text-gray-400 text-sm mb-1">Labor</div>
                  <div className="text-2xl font-bold text-yellow-500">${estimatedCost.labor.toLocaleString()}</div>
                </div>
                <div className="bg-luxury-darkGray p-4 rounded-lg border-2 border-green-500/30">
                  <div className="text-gray-400 text-sm mb-1">Total Estimate</div>
                  <div className="text-2xl font-bold text-green-500">${estimatedCost.total.toLocaleString()}</div>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-4 text-center">
                * Estimates are calculated in real-time based on specifications and may vary
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Quick Start Templates */}
        {!design.projectName && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 luxury-card p-6 rounded-xl"
          >
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-white mb-2">Quick Start Templates</h3>
              <p className="text-gray-400">Choose a template to get started faster</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: '🚪', name: 'Door Design', type: 'Door', category: 'Mechanical' },
                { icon: '🪟', name: 'Window System', type: 'Window', category: 'Mechanical' },
                { icon: '🚧', name: 'Gate System', type: 'Gate', category: 'Mechanical' },
                { icon: '🏠', name: 'Roofing', type: 'Roofing', category: 'Mechanical' },
              ].map((template, index) => (
                <motion.button
                  key={index}
                  type="button"
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setDesign(prev => ({
                      ...prev,
                      projectType: template.type,
                      category: template.category,
                      projectName: `New ${template.name} Project`
                    }));
                    toast.success(`${template.name} template loaded!`);
                  }}
                  className="bg-luxury-darkGray hover:bg-luxury-gray border-2 border-primary-500/20 hover:border-primary-500 rounded-xl p-6 text-center transition-all group"
                >
                  <div className="text-5xl mb-3 group-hover:scale-110 transition-transform">{template.icon}</div>
                  <div className="text-white font-semibold">{template.name}</div>
                  <div className="text-xs text-gray-500 mt-1">{template.category}</div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Project Info */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="luxury-card p-6 rounded-xl"
              >
                <h2 className="text-2xl font-bold text-white mb-4">Project Information</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-300 mb-2">Project Name *</label>
                    <input
                      type="text"
                      name="projectName"
                      value={design.projectName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-luxury-black text-white border border-primary-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="e.g., Main Entrance Gate Design"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-300 mb-2">Project Type *</label>
                      <select
                        name="projectType"
                        value={design.projectType}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-luxury-black text-white border border-primary-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        <option value="Door">Door</option>
                        <option value="Window">Window</option>
                        <option value="Gate">Gate</option>
                        <option value="Roofing">Roofing</option>
                        <option value="HVAC">HVAC</option>
                        <option value="Custom">Custom</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-gray-300 mb-2">Category *</label>
                      <select
                        name="category"
                        value={design.category}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-luxury-black text-white border border-primary-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        <option value="Mechanical">Mechanical</option>
                        <option value="Industrial">Industrial</option>
                        <option value="Consulting">Consulting</option>
                        <option value="Maintenance">Maintenance</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2">Building Type</label>
                    <select
                      name="buildingType"
                      value={design.buildingType}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-luxury-black text-white border border-primary-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="Residential">Residential</option>
                      <option value="Commercial">Commercial</option>
                      <option value="Industrial">Industrial</option>
                      <option value="Mall">Mall</option>
                      <option value="Office">Office</option>
                      <option value="Warehouse">Warehouse</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2">Description</label>
                    <textarea
                      name="description"
                      value={design.description}
                      onChange={handleInputChange}
                      rows="4"
                      className="w-full px-4 py-3 bg-luxury-black text-white border border-primary-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Describe your project requirements..."
                    />
                  </div>
                </div>
              </motion.div>

              {/* Specifications */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="luxury-card p-6 rounded-xl"
              >
                <h2 className="text-2xl font-bold text-white mb-4">Specifications</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-300 mb-2">Dimensions</label>
                    <div className="grid grid-cols-4 gap-2">
                      <input
                        type="number"
                        name="specifications.dimensions.width"
                        value={design.specifications.dimensions.width}
                        onChange={handleInputChange}
                        placeholder="Width"
                        className="px-3 py-2 bg-luxury-black text-white border border-primary-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                      <input
                        type="number"
                        name="specifications.dimensions.height"
                        value={design.specifications.dimensions.height}
                        onChange={handleInputChange}
                        placeholder="Height"
                        className="px-3 py-2 bg-luxury-black text-white border border-primary-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                      <input
                        type="number"
                        name="specifications.dimensions.depth"
                        value={design.specifications.dimensions.depth}
                        onChange={handleInputChange}
                        placeholder="Depth"
                        className="px-3 py-2 bg-luxury-black text-white border border-primary-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                      <select
                        name="specifications.dimensions.unit"
                        value={design.specifications.dimensions.unit}
                        onChange={handleInputChange}
                        className="px-3 py-2 bg-luxury-black text-white border border-primary-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        <option value="feet">ft</option>
                        <option value="meters">m</option>
                        <option value="inches">in</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-300 mb-2">Material *</label>
                      <select
                        name="specifications.material"
                        value={design.specifications.material}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-luxury-black text-white border border-primary-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        <option value="">Select Material</option>
                        <optgroup label="Metals">
                          <option value="Steel">Steel</option>
                          <option value="Stainless Steel">Stainless Steel</option>
                          <option value="Aluminum">Aluminum</option>
                          <option value="Brass">Brass</option>
                          <option value="Bronze">Bronze</option>
                          <option value="Iron">Iron</option>
                          <option value="Galvanized Steel">Galvanized Steel</option>
                        </optgroup>
                        <optgroup label="Wood">
                          <option value="Teak Wood">Teak Wood</option>
                          <option value="Oak Wood">Oak Wood</option>
                          <option value="Pine Wood">Pine Wood</option>
                          <option value="Mahogany">Mahogany</option>
                          <option value="Plywood">Plywood</option>
                        </optgroup>
                        <optgroup label="Glass & Acrylic">
                          <option value="Tempered Glass">Tempered Glass</option>
                          <option value="Laminated Glass">Laminated Glass</option>
                          <option value="Acrylic Sheet">Acrylic Sheet</option>
                          <option value="Polycarbonate">Polycarbonate</option>
                        </optgroup>
                        <optgroup label="Composite">
                          <option value="UPVC">UPVC</option>
                          <option value="Fiber Glass">Fiber Glass</option>
                          <option value="Composite Panel">Composite Panel</option>
                          <option value="WPC (Wood Plastic)">WPC (Wood Plastic)</option>
                        </optgroup>
                        <optgroup label="Concrete & Stone">
                          <option value="Concrete">Concrete</option>
                          <option value="Granite">Granite</option>
                          <option value="Marble">Marble</option>
                        </optgroup>
                      </select>
                    </div>

                    <div>
                      <label className="block text-gray-300 mb-2">Color *</label>
                      <select
                        name="specifications.color"
                        value={design.specifications.color}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-luxury-black text-white border border-primary-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        <option value="">Select Color</option>
                        <optgroup label="Neutral">
                          <option value="White">White</option>
                          <option value="Black">Black</option>
                          <option value="Gray">Gray</option>
                          <option value="Silver">Silver</option>
                          <option value="Beige">Beige</option>
                          <option value="Cream">Cream</option>
                        </optgroup>
                        <optgroup label="Earth Tones">
                          <option value="Brown">Brown</option>
                          <option value="Wood Finish">Wood Finish</option>
                          <option value="Walnut">Walnut</option>
                          <option value="Teak">Teak</option>
                          <option value="Oak">Oak</option>
                        </optgroup>
                        <optgroup label="Classic Colors">
                          <option value="Red">Red</option>
                          <option value="Blue">Blue</option>
                          <option value="Green">Green</option>
                          <option value="Yellow">Yellow</option>
                          <option value="Orange">Orange</option>
                        </optgroup>
                        <optgroup label="Metallic">
                          <option value="Gold">Gold</option>
                          <option value="Bronze">Bronze</option>
                          <option value="Copper">Copper</option>
                          <option value="Champagne">Champagne</option>
                          <option value="Gunmetal">Gunmetal</option>
                        </optgroup>
                        <optgroup label="Special">
                          <option value="Transparent">Transparent</option>
                          <option value="Frosted">Frosted</option>
                          <option value="Custom Color">Custom Color</option>
                        </optgroup>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2">Finish</label>
                    <input
                      type="text"
                      name="specifications.finish"
                      value={design.specifications.finish}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-luxury-black text-white border border-primary-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="e.g., Powder Coated, Polished"
                    />
                  </div>

                  {/* File Upload Section */}
                  <div>
                    <label className="block text-gray-300 mb-2">
                      <div className="flex items-center space-x-2">
                        <FiUpload />
                        <span>Upload Blueprints / References</span>
                      </div>
                    </label>
                    <div className="border-2 border-dashed border-primary-500/30 rounded-lg p-6 text-center hover:border-primary-500/60 transition-all cursor-pointer bg-luxury-darkGray/50">
                      <input
                        type="file"
                        multiple
                        accept="image/*,.pdf,.dwg"
                        onChange={handleFileUpload}
                        className="hidden"
                        id="file-upload"
                      />
                      <label htmlFor="file-upload" className="cursor-pointer">
                        <FiBox className="text-4xl text-primary-500 mx-auto mb-2" />
                        <p className="text-white font-semibold mb-1">Drop files here or click to upload</p>
                        <p className="text-sm text-gray-400">Supports: Images, PDF, DWG, CAD files</p>
                      </label>
                    </div>
                    
                    {uploadedFiles.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {uploadedFiles.map((file, index) => (
                          <div key={index} className="flex items-center justify-between bg-luxury-darkGray px-3 py-2 rounded">
                            <div className="flex items-center space-x-2">
                              <FiLayers className="text-primary-500" />
                              <div>
                                <span className="text-gray-300 text-sm">{file.name}</span>
                                <span className="text-gray-500 text-xs ml-2">({file.size})</span>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => setUploadedFiles(prev => prev.filter((_, i) => i !== index))}
                              className="text-red-500 hover:text-red-400"
                            >
                              <FiTrash2 />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2">Features</label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={newFeature}
                        onChange={(e) => setNewFeature(e.target.value)}
                        className="flex-1 px-4 py-2 bg-luxury-black text-white border border-primary-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="Add feature"
                      />
                      <button
                        type="button"
                        onClick={addFeature}
                        className="px-4 py-2 bg-primary-500 text-black font-semibold rounded-lg hover:bg-primary-600"
                      >
                        <FiPlus />
                      </button>
                    </div>
                    <div className="space-y-2">
                      {design.specifications.features.map((feature, index) => (
                        <div key={index} className="flex items-center justify-between bg-luxury-darkGray px-3 py-2 rounded">
                          <span className="text-gray-300">{feature}</span>
                          <button
                            type="button"
                            onClick={() => removeFeature(index)}
                            className="text-red-500 hover:text-red-400"
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Budget & Timeline */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="luxury-card p-6 rounded-xl"
              >
                <h2 className="text-2xl font-bold text-white mb-4">Budget & Timeline</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-300 mb-2">Budget Range</label>
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="number"
                        name="budget.min"
                        value={design.budget.min}
                        onChange={handleInputChange}
                        placeholder="Min Budget"
                        className="w-full px-4 py-3 bg-luxury-black text-white border border-primary-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                      <input
                        type="number"
                        name="budget.max"
                        value={design.budget.max}
                        onChange={handleInputChange}
                        placeholder="Max Budget"
                        className="w-full px-4 py-3 bg-luxury-black text-white border border-primary-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-300 mb-2 font-semibold">Start Date *</label>
                      <input
                        type="date"
                        name="timeline.startDate"
                        value={design.timeline.startDate}
                        onChange={handleInputChange}
                        min={new Date().toISOString().split('T')[0]}
                        required
                        className="w-full px-4 py-3 bg-luxury-black text-white border border-primary-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer hover:border-primary-500/50 transition-colors"
                        style={{ colorScheme: 'dark' }}
                        placeholder="Select start date"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-300 mb-2 font-semibold">End Date *</label>
                      <input
                        type="date"
                        name="timeline.endDate"
                        value={design.timeline.endDate}
                        onChange={handleInputChange}
                        min={design.timeline.startDate || new Date().toISOString().split('T')[0]}
                        required
                        className="w-full px-4 py-3 bg-luxury-black text-white border border-primary-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer hover:border-primary-500/50 transition-colors"
                        style={{ colorScheme: 'dark' }}
                        placeholder="Select end date"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2">Expected Duration</label>
                    <input
                      type="text"
                      name="timeline.duration"
                      value={design.timeline.duration}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-luxury-black text-white border border-primary-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="e.g., 2-3 weeks"
                    />
                  </div>
                </div>
              </motion.div>

              {/* Location */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="luxury-card p-6 rounded-xl"
              >
                <h2 className="text-2xl font-bold text-white mb-4">Location</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-300 mb-2">Address</label>
                    <input
                      type="text"
                      name="location.address"
                      value={design.location.address}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-luxury-black text-white border border-primary-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Street address"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-300 mb-2">City</label>
                      <input
                        type="text"
                        name="location.city"
                        value={design.location.city}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-luxury-black text-white border border-primary-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="City"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-300 mb-2">State</label>
                      <input
                        type="text"
                        name="location.state"
                        value={design.location.state}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-luxury-black text-white border border-primary-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="State"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2">ZIP Code</label>
                    <input
                      type="text"
                      name="location.zipCode"
                      value={design.location.zipCode}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-luxury-black text-white border border-primary-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="ZIP Code"
                    />
                  </div>
                </div>
              </motion.div>

              {/* Requirements */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="luxury-card p-6 rounded-xl"
              >
                <h2 className="text-2xl font-bold text-white mb-4">Special Requirements</h2>
                
                <div className="space-y-4">
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={newRequirement}
                      onChange={(e) => setNewRequirement(e.target.value)}
                      className="flex-1 px-4 py-2 bg-luxury-black text-white border border-primary-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Add requirement"
                    />
                    <button
                      type="button"
                      onClick={addRequirement}
                      className="px-4 py-2 bg-primary-500 text-black font-semibold rounded-lg hover:bg-primary-600"
                    >
                      <FiPlus />
                    </button>
                  </div>
                  <div className="space-y-2">
                    {design.requirements.map((req, index) => (
                      <div key={index} className="flex items-center justify-between bg-luxury-darkGray px-3 py-2 rounded">
                        <span className="text-gray-300">{req}</span>
                        <button
                          type="button"
                          onClick={() => removeRequirement(index)}
                          className="text-red-500 hover:text-red-400"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Submit Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8"
          >
            {/* Smart Validation Messages */}
            <div className="mb-6 flex flex-wrap justify-center gap-3">
              {design.projectName && (
                <div className="flex items-center space-x-1 px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full text-green-500 text-sm">
                  <FiCheckCircle />
                  <span>Project Named</span>
                </div>
              )}
              {design.specifications.material && (
                <div className="flex items-center space-x-1 px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full text-green-500 text-sm">
                  <FiCheckCircle />
                  <span>Material Selected</span>
                </div>
              )}
              {estimatedCost && (
                <div className="flex items-center space-x-1 px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full text-green-500 text-sm">
                  <FiCheckCircle />
                  <span>Cost Calculated</span>
                </div>
              )}
              {completionProgress < 60 && (
                <div className="flex items-center space-x-1 px-3 py-1 bg-yellow-500/20 border border-yellow-500/30 rounded-full text-yellow-500 text-sm">
                  <FiAlertCircle />
                  <span>More details recommended</span>
                </div>
              )}
            </div>

            {/* Enhanced Submit Button */}
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                type="button"
                onClick={() => {
                  localStorage.setItem('draft_design', JSON.stringify(design));
                  toast.success('Draft saved successfully!');
                }}
                className="px-8 py-4 bg-luxury-darkGray border-2 border-primary-500/30 text-white font-bold rounded-xl text-lg flex items-center justify-center space-x-3 hover:border-primary-500 transition-all"
              >
                <FiSave />
                <span>Save as Draft</span>
              </button>

              <motion.button
                type="submit"
                disabled={loading || !design.projectName}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative px-12 py-4 bg-gradient-to-r from-primary-500 via-primary-600 to-primary-700 text-white font-bold rounded-xl text-lg flex items-center justify-center space-x-3 shadow-primary-lg disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-primary-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                <FiZap className="relative z-10" />
                <span className="relative z-10">{loading ? 'Processing...' : 'Submit to AI Review'}</span>
                <motion.div
                  animate={{
                    rotate: loading ? 360 : 0
                  }}
                  transition={{
                    duration: 1,
                    repeat: loading ? Infinity : 0,
                    ease: "linear"
                  }}
                  className="relative z-10"
                >
                  {loading && <FiCpu />}
                </motion.div>
              </motion.button>
            </div>

            <p className="text-center text-sm text-gray-500 mt-4">
              🔒 Your design will be reviewed by our AI system and engineering team within 24 hours
            </p>
          </motion.div>
        </form>
      </div>
      </motion.div>

      {/* AI Chatbot - Floating Window in Slide Area */}
      <AnimatePresence>
        {chatOpen && (
          <>
            {/* Floating Chat Window - Positioned in cleared space */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, x: 100 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.9, x: 100 }}
              transition={{ 
                type: 'spring', 
                damping: 30, 
                stiffness: 150,
                mass: 0.8,
                restDelta: 0.001
              }}
              className="fixed top-8 right-8 w-[470px] max-w-[95vw] h-[calc(100vh-4rem)] z-50"
            >
              {/* Glassmorphism Effect with rounded corners */}
              <div className="h-full flex flex-col overflow-hidden rounded-3xl backdrop-blur-2xl bg-gradient-to-br from-luxury-darkGray/95 via-luxury-black/95 to-luxury-darkGray/95 border-2 border-primary-500/30 shadow-2xl shadow-primary-500/20">
                {/* Chat Header - Enhanced Design */}
                <div className="relative overflow-hidden flex-shrink-0">
                  {/* Animated Background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-600 via-primary-500 to-primary-600 animate-gradient-x"></div>
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                  />
                  
                  <div className="relative p-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {/* AI Avatar with Glow */}
                      <motion.div 
                        className="relative"
                        whileHover={{ scale: 1.05 }}
                      >
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-white to-primary-100 flex items-center justify-center shadow-lg">
                          <FiCpu className="text-primary-600 text-2xl" />
                        </div>
                        <motion.div
                          animate={{ scale: [1, 1.3, 1], opacity: [0.7, 0, 0.7] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="absolute inset-0 rounded-full bg-green-400 blur-md"
                        />
                        <motion.div
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white shadow-lg"
                        />
                      </motion.div>
                      
                      <div>
                        <h4 className="text-white font-bold text-xl tracking-tight">Design Assistant</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <motion.div
                            animate={{ opacity: [1, 0.5, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="w-2 h-2 bg-green-400 rounded-full"
                          />
                          <p className="text-white/90 text-xs font-medium">AI Online • Ready to assist</p>
                        </div>
                      </div>
                    </div>
                    
                    <motion.button
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setChatOpen(false)}
                      className="text-white/90 hover:text-white transition-colors p-2.5 hover:bg-white/10 rounded-xl backdrop-blur-sm"
                    >
                      <FiMinimize2 size={20} />
                    </motion.button>
                  </div>
                </div>

                {/* Chat Messages - Redesigned */}
                <div id="chat-messages" className="flex-1 overflow-y-auto p-5 space-y-4 scroll-smooth custom-scrollbar">
                {chatMessages.map((msg, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className={`flex gap-3 ${msg.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                  >
                    {/* Avatar */}
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className="flex-shrink-0"
                    >
                      {msg.type === 'bot' ? (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg ring-2 ring-primary-400/30">
                          <FiCpu className="text-white text-lg" />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg ring-2 ring-blue-400/30 text-white font-bold text-sm">
                          {user?.name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                      )}
                    </motion.div>
                    
                    {/* Message Bubble */}
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className={`flex flex-col max-w-[75%] ${
                        msg.type === 'user' ? 'items-end' : 'items-start'
                      }`}
                    >
                      <div
                        className={`relative p-4 rounded-2xl shadow-xl ${
                          msg.type === 'user'
                            ? 'bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 text-white rounded-br-sm'
                            : 'bg-gradient-to-br from-luxury-gray to-luxury-darkGray text-gray-100 rounded-bl-sm border border-primary-500/20'
                        }`}
                      >
                        {/* Shine Effect */}
                        <motion.div
                          className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/5 to-transparent"
                          animate={{ x: ['-100%', '100%'] }}
                          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                        />
                        
                        {msg.type === 'bot' && (
                          <div className="flex items-center gap-2 mb-2 pb-2 border-b border-primary-500/20">
                            <span className="text-xs text-primary-400 font-bold uppercase tracking-wider">AI Response</span>
                          </div>
                        )}
                        <p className="text-sm leading-relaxed whitespace-pre-line relative z-10">{msg.text}</p>
                        
                        {/* Image Suggestions Display */}
                        {msg.images && msg.images.length > 0 && (
                          <div className="mt-4 space-y-3 relative z-10">
                            <div className="flex items-center gap-2 mb-2">
                              <FiLayers className="text-primary-400 text-sm" />
                              <span className="text-xs text-primary-400 font-bold uppercase">Suggested Options</span>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              {msg.images.map((img, imgIndex) => (
                                <motion.div
                                  key={imgIndex}
                                  initial={{ opacity: 0, scale: 0.9 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ delay: imgIndex * 0.1 }}
                                  whileHover={{ scale: 1.05, y: -5 }}
                                  className="relative group cursor-pointer"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (img.type) {
                                      setDesign(prev => ({
                                        ...prev,
                                        specifications: {
                                          ...prev.specifications,
                                          material: img.type
                                        }
                                      }));
                                      toast.success(`✅ Material selected: ${img.name}`);
                                      
                                      // Add a chat message confirming selection
                                      setChatMessages(prev => [...prev, {
                                        type: 'bot',
                                        text: `Perfect! I've set your material to **${img.type}**${img.price ? ` (${img.price})` : ''}.\n\nYour form has been updated. What else would you like to configure?`,
                                        timestamp: new Date()
                                      }]);
                                    } else {
                                      toast.error('Unable to select this option. Please try another.');
                                    }
                                  }}
                                >
                                  <div className="relative rounded-xl overflow-hidden shadow-lg border-2 border-primary-500/30 group-hover:border-primary-500 transition-all">
                                    <img
                                      src={img.url}
                                      alt={img.name}
                                      className="w-full h-24 object-cover"
                                      onError={(e) => {
                                        e.target.src = 'https://via.placeholder.com/200x150?text=Image+Preview';
                                      }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                                      <div className="absolute bottom-0 left-0 right-0 p-2">
                                        <div className="flex items-center gap-1 text-white">
                                          <FiCheckCircle size={12} />
                                          <span className="text-xs font-medium">Click to Select</span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="mt-2 text-center">
                                    <p className="text-xs font-semibold text-white line-clamp-1">{img.name}</p>
                                    {img.type && (
                                      <p className="text-xs text-gray-400">{img.type}</p>
                                    )}
                                    {img.price && (
                                      <p className="text-xs text-primary-400 font-bold">{img.price}</p>
                                    )}
                                    {img.properties && (
                                      <p className="text-xs text-gray-500 line-clamp-1">{img.properties}</p>
                                    )}
                                  </div>
                                </motion.div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {msg.timestamp && (
                        <span className="text-xs text-gray-500 mt-1.5 px-2 flex items-center gap-1">
                          <FiClock size={10} />
                          {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      )}
                    </motion.div>
                  </motion.div>
                ))}
                
                {/* Typing Indicator - Enhanced */}
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-3"
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg ring-2 ring-primary-400/30">
                      <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}>
                        <FiCpu className="text-white text-lg" />
                      </motion.div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-luxury-gray to-luxury-darkGray px-5 py-4 rounded-2xl rounded-bl-sm border border-primary-500/20 shadow-xl">
                      <div className="flex items-center gap-3">
                        <div className="flex gap-1.5">
                          <motion.div
                            animate={{ y: [0, -8, 0] }}
                            transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                            className="w-2.5 h-2.5 bg-primary-400 rounded-full shadow-lg shadow-primary-400/50"
                          />
                          <motion.div
                            animate={{ y: [0, -8, 0] }}
                            transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                            className="w-2.5 h-2.5 bg-primary-400 rounded-full shadow-lg shadow-primary-400/50"
                          />
                          <motion.div
                            animate={{ y: [0, -8, 0] }}
                            transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                            className="w-2.5 h-2.5 bg-primary-400 rounded-full shadow-lg shadow-primary-400/50"
                          />
                        </div>
                        <span className="text-xs text-gray-400 font-medium">AI is analyzing...</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

                {/* Chat Input - Enhanced */}
                <div className="p-5 bg-gradient-to-t from-luxury-black to-luxury-darkGray border-t border-primary-500/20 flex-shrink-0 backdrop-blur-xl">
                  {/* Chat Controls */}
                  <div className="flex gap-3 mb-4">
                    <motion.button
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={exportChatHistory}
                      className="flex items-center gap-2 text-xs text-primary-400 hover:text-primary-300 bg-primary-500/10 hover:bg-primary-500/20 px-3 py-2 rounded-lg transition-all"
                      title="Export chat history"
                    >
                      <FiSave size={14} />
                      <span className="font-medium">Export</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={clearChat}
                      className="flex items-center gap-2 text-xs text-gray-500 hover:text-gray-400 bg-gray-500/10 hover:bg-gray-500/20 px-3 py-2 rounded-lg transition-all"
                      title="Clear chat"
                    >
                      <FiTrash2 size={14} />
                      <span className="font-medium">Clear</span>
                    </motion.button>
                  </div>
                  
                  <div className="flex gap-3">
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={userMessage}
                        onChange={(e) => setUserMessage(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                        placeholder="Type your message or ask me anything..."
                        className="w-full bg-luxury-darkGray/80 text-white px-5 py-4 rounded-2xl border-2 border-primary-500/30 focus:border-primary-500 focus:outline-none transition-all placeholder:text-gray-500 shadow-inner"
                      />
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.08, rotate: 5 }}
                      whileTap={{ scale: 0.92 }}
                      onClick={handleSendMessage}
                      disabled={!userMessage.trim()}
                      className="bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 text-white px-6 py-4 rounded-2xl hover:shadow-2xl hover:shadow-primary-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      <FiSend size={22} />
                    </motion.button>
                  </div>
                  {/* Quick Actions - Enhanced */}
                  <div className="flex flex-wrap gap-2 mt-4">
                    {[
                      { text: 'Show door designs', icon: '🚪', color: 'from-blue-500/20 to-blue-600/20 hover:from-blue-500/30 hover:to-blue-600/30 border-blue-500/30' },
                      { text: 'Show window options', icon: '🪟', color: 'from-cyan-500/20 to-cyan-600/20 hover:from-cyan-500/30 hover:to-cyan-600/30 border-cyan-500/30' },
                      { text: 'Gate designs', icon: '🚧', color: 'from-purple-500/20 to-purple-600/20 hover:from-purple-500/30 hover:to-purple-600/30 border-purple-500/30' },
                      { text: 'Compare materials', icon: '📊', color: 'from-orange-500/20 to-orange-600/20 hover:from-orange-500/30 hover:to-orange-600/30 border-orange-500/30' },
                      { text: 'Calculate cost', icon: '💰', color: 'from-green-500/20 to-green-600/20 hover:from-green-500/30 hover:to-green-600/30 border-green-500/30' }
                    ].map((quick) => (
                      <motion.button
                        key={quick.text}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          setUserMessage(quick.text);
                          // Send message immediately after setting it
                          setTimeout(() => {
                            const userMsg = {
                              type: 'user',
                              text: quick.text,
                              timestamp: new Date()
                            };
                            setChatMessages(prev => [...prev, userMsg]);
                            setIsTyping(true);
                            
                            // Get AI response
                            setTimeout(() => {
                              const fallbackResponse = generateChatResponse(quick.text);
                              let botMsg = {
                                type: 'bot',
                                text: typeof fallbackResponse === 'object' ? fallbackResponse.text : fallbackResponse,
                                images: typeof fallbackResponse === 'object' ? (fallbackResponse.images || []) : [],
                                timestamp: new Date()
                              };
                              setChatMessages(prev => [...prev, botMsg]);
                              setIsTyping(false);
                              setUserMessage('');
                            }, 800);
                          }, 50);
                        }}
                        className={`text-xs bg-gradient-to-r ${quick.color} text-white font-medium px-4 py-2 rounded-xl border transition-all flex items-center gap-2 shadow-lg`}
                      >
                        <span className="text-base">{quick.icon}</span>
                        <span>{quick.text}</span>
                      </motion.button>
                    ))}
                  </div>
              </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Enhanced Floating Chat Button */}
      {!chatOpen && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ type: 'spring', damping: 15, stiffness: 300 }}
          className="fixed bottom-8 right-8 z-30"
        >
          {/* Glow Effect */}
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 bg-primary-500 rounded-full blur-xl"
          />
          
          <motion.button
            whileHover={{ scale: 1.15, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setChatOpen(true)}
            className="relative bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 text-white p-5 rounded-full shadow-2xl hover:shadow-primary-500/70 transition-all group"
          >
            {/* Shine Effect */}
            <motion.div
              className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/20 to-transparent"
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            />
            
            <div className="relative">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <FiMessageCircle size={32} className="drop-shadow-lg" />
              </motion.div>
              
              {chatMessages.length > 1 && (
                <motion.div
                  animate={{ scale: [1, 1.15, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="absolute -top-2 -right-2 bg-gradient-to-br from-red-500 to-red-600 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center font-bold shadow-lg ring-2 ring-white"
                >
                  {chatMessages.filter(m => m.type === 'bot').length}
                </motion.div>
              )}
            </div>
          </motion.button>
          
          {/* Tooltip */}
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            whileHover={{ opacity: 1, x: 0 }}
            className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-luxury-darkGray text-white px-4 py-2 rounded-lg shadow-xl whitespace-nowrap pointer-events-none"
          >
            <span className="text-sm font-medium">Chat with AI Assistant</span>
            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-l-8 border-l-luxury-darkGray"></div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default CustomDesign;
