const axios = require('axios');

async function testAPI() {
  try {
    console.log('Testing API connection...\n');
    
    // Test 1: Backend root
    console.log('1. Testing backend root endpoint:');
    const root = await axios.get('http://localhost:5000');
    console.log('✅ Backend is running');
    console.log('   Response:', root.data.message);
    
    // Test 2: Products endpoint
    console.log('\n2. Testing products endpoint:');
    const products = await axios.get('http://localhost:5000/api/products');
    console.log('✅ Products API is working');
    console.log('   Products found:', products.data.total);
    console.log('   Products in response:', products.data.products.length);
    
    // Test 3: Show first product
    if (products.data.products.length > 0) {
      const firstProduct = products.data.products[0];
      console.log('\n3. First product details:');
      console.log('   Title:', firstProduct.title);
      console.log('   Price:', firstProduct.price);
      console.log('   Category:', firstProduct.category);
    }
    
    console.log('\n✅ All tests passed! Backend is working correctly.');
    console.log('\n💡 If products are not loading in the frontend:');
    console.log('   1. Check browser console for errors (F12)');
    console.log('   2. Check browser Network tab for failed requests');
    console.log('   3. Make sure frontend is running on http://localhost:3000');
    console.log('   4. Try restarting the frontend server');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Data:', error.response.data);
    }
  }
}

testAPI();
