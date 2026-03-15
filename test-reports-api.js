const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

async function testReportsAPI() {
  try {
    console.log('🔐 Logging in as admin...');
    
    // Login as admin
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'admin@aromaluxe.com',
      password: 'admin123'
    });
    
    const token = loginResponse.data.token;
    console.log('✅ Login successful!');
    console.log('Token:', token.substring(0, 20) + '...\n');
    
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
    
    // Test Sales Report
    console.log('📊 Testing Sales Report...');
    const salesReport = await axios.get(`${BASE_URL}/reports/sales`, config);
    console.log('✅ Sales Report:', {
      totalOrders: salesReport.data.report.summary.totalOrders,
      totalRevenue: salesReport.data.report.summary.totalRevenue,
      categories: Object.keys(salesReport.data.report.categorySales).length
    });
    console.log('');
    
    // Test Product Report
    console.log('📦 Testing Product Report...');
    const productReport = await axios.get(`${BASE_URL}/reports/products`, config);
    console.log('✅ Product Report:', {
      totalProducts: productReport.data.report.summary.totalProducts,
      inStock: productReport.data.report.summary.inStock,
      outOfStock: productReport.data.report.summary.outOfStock
    });
    console.log('');
    
    // Test Customer Report
    console.log('👥 Testing Customer Report...');
    const customerReport = await axios.get(`${BASE_URL}/reports/customers`, config);
    console.log('✅ Customer Report:', {
      totalCustomers: customerReport.data.report.summary.totalCustomers,
      activeCustomers: customerReport.data.report.summary.activeCustomers
    });
    console.log('');
    
    // Test CSV Export
    console.log('📄 Testing CSV Export...');
    const csvResponse = await axios.get(`${BASE_URL}/reports/export/sales`, {
      ...config,
      responseType: 'text'
    });
    console.log('✅ CSV Export successful!');
    console.log('First 200 chars:', csvResponse.data.substring(0, 200));
    
    console.log('\n🎉 All Reports API tests passed!');
    
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
    process.exit(1);
  }
}

testReportsAPI();
