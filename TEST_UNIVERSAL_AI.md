# 🧪 TEST YOUR UNIVERSAL AI CHATBOT

## Quick Test Suite

### 1️⃣ **Math Questions**
```
Try: "What is 456 * 789?"
Expected: "359,784"

Try: "What is 25% of 2000?"
Expected: "500"

Try: "Square root of 144"
Expected: "12"
```

### 2️⃣ **Science Questions**
```
Try: "What is photosynthesis?"
Expected: Explanation with chemical equation

Try: "What is gravity?"
Expected: Definition and explanation

Try: "What is artificial intelligence?"
Expected: Comprehensive AI explanation
```

### 3️⃣ **Technology Questions**
```
Try: "What is JavaScript?"
Expected: Programming language explanation

Try: "What is HTML?"
Expected: Markup language explanation

Try: "What is Python?"
Expected: Programming language details
```

### 4️⃣ **General Knowledge**
```
Try: "Tell me about World War 2"
Expected: Historical overview

Try: "What is the speed of light?"
Expected: "299,792,458 meters per second"

Try: "What is the Internet?"
Expected: Networking explanation
```

### 5️⃣ **Conversational**
```
Try: "Hello!"
Expected: Friendly greeting

Try: "How are you?"
Expected: Friendly response

Try: "Thank you"
Expected: You're welcome message

Try: "What can you do?"
Expected: List of capabilities
```

### 6️⃣ **Product Questions** (Original)
```
Try: "Show me steel doors"
Expected: Door products with images

Try: "I need windows under $500"
Expected: Affordable window options

Try: "Gate for residential use"
Expected: Residential gates

Try: "Compare steel and wood doors"
Expected: Comparison explanation
```

### 7️⃣ **Mixed Conversations**
```
Test Sequence:
1. "Show me doors"
2. "What is steel made of?"
3. "Why is it stronger than wood?"
4. "Calculate 500 * 0.15" (15% tax)
5. "Show me the cheapest door"

Expected: Seamless transition between product and general queries
```

---

## 🚀 HOW TO TEST

### **Method 1: Browser Console**
1. Open browser DevTools (F12)
2. Go to Network tab
3. Type in chatbot
4. See request/response

### **Method 2: Direct API Test (Postman/cURL)**
```bash
curl -X POST http://localhost:5000/api/chatbot/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What is artificial intelligence?",
    "userId": "test123"
  }'
```

### **Method 3: Frontend Interface**
1. Open chatbot interface
2. Type questions from above
3. Verify responses

---

## ✅ SUCCESS CRITERIA

Your chatbot is working if it can:
- ✅ Answer math questions correctly
- ✅ Explain science concepts
- ✅ Define technology terms
- ✅ Provide historical facts
- ✅ Have friendly conversations
- ✅ Still handle product queries
- ✅ Remember context (10 messages)
- ✅ Give intelligent responses to unknown questions

---

## 🐛 TROUBLESHOOTING

### **Issue**: "Server not responding"
**Fix**: Restart backend server
```bash
cd backend
npm start
```

### **Issue**: "Empty responses"
**Fix**: Check console for errors
```bash
# Look for syntax errors
# Verify chatbotController.js deployed
```

### **Issue**: "Only product queries work"
**Fix**: Verify UniversalAI class is in chatbotController.js
```bash
# Search for "class UniversalAI" in chatbotController.js
```

### **Issue**: "Math calculations wrong"
**Fix**: Check handleMathQuestion method
```bash
# Should use eval() for calculations
# Should handle percentages separately
```

---

## 📊 EXPECTED RESULTS

### **Sample Test:**

**Input**: "What is 50 * 3?"
**Expected Output**:
```json
{
  "message": "🔢 Calculation:\n\n50 * 3 = 150\n\nNeed another calculation?",
  "suggestions": [
    "Calculate percentage",
    "Square root calculation",
    "Show me products"
  ],
  "context": "math",
  "confidence": 0.95
}
```

**Input**: "What is artificial intelligence?"
**Expected Output**:
```json
{
  "message": "🤖 Artificial Intelligence (AI)\n\nAI is the simulation...",
  "suggestions": [
    "Machine learning",
    "AI applications",
    "How AI works"
  ],
  "context": "technology",
  "confidence": 0.9
}
```

**Input**: "Show me steel doors"
**Expected Output**:
```json
{
  "message": "I found 4 steel doors for you! ...",
  "products": [...],
  "autoFill": {...},
  "suggestions": [...],
  "context": "product",
  "confidence": 0.95
}
```

---

## 🎯 COMPREHENSIVE TEST SCRIPT

Run all these in sequence:

```
1. "Hello" → Should greet
2. "What is AI?" → Should explain AI
3. "Show me doors" → Should show products
4. "Why steel?" → Should explain benefits
5. "Calculate 25 * 48" → Should return 1200
6. "What's photosynthesis?" → Should explain
7. "Thank you" → Should respond politely
8. "What's your name?" → Should introduce
9. "Square root of 256" → Should return 16
10. "Show me gates" → Should show gates
```

---

## 💡 TIP: Check Context Memory

The AI remembers last 10 messages. Test this:

```
1. User: "Show me doors"
   AI: [Shows doors]

2. User: "Why steel?"  ← No mention of "steel doors"
   AI: [Explains steel benefits for doors] ← Should remember context!

3. User: "What about the cheapest one?"
   AI: [Shows cheapest door] ← Should know we're talking about doors!
```

---

## 🌟 READY TO TEST!

Your Universal AI chatbot is deployed and ready. Test all categories above to verify it can truly answer ANYTHING!

**Start Testing**: Open your chatbot and try the questions! 🚀
