const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

// @desc    Generate Sales Report
// @route   GET /api/reports/sales
// @access  Private/Admin
exports.generateSalesReport = async (req, res) => {
  try {
    const { startDate, endDate, format = 'summary' } = req.query;

    let dateFilter = {};
    if (startDate || endDate) {
      dateFilter.createdAt = {};
      if (startDate) dateFilter.createdAt.$gte = new Date(startDate);
      if (endDate) dateFilter.createdAt.$lte = new Date(endDate);
    }

    const orders = await Order.find(dateFilter)
      .populate('user', 'name email')
      .populate('items.product', 'title price category')
      .sort({ createdAt: -1 });

    // Calculate statistics
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
    const completedOrders = orders.filter(o => o.status === 'Delivered').length;
    const pendingOrders = orders.filter(o => o.status === 'Pending').length;
    const processingOrders = orders.filter(o => o.status === 'Processing').length;

    // Category-wise sales
    const categorySales = {};
    orders.forEach(order => {
      order.items.forEach(item => {
        const category = item.product?.category || 'Unknown';
        if (!categorySales[category]) {
          categorySales[category] = { revenue: 0, quantity: 0 };
        }
        categorySales[category].revenue += item.price * item.quantity;
        categorySales[category].quantity += item.quantity;
      });
    });

    const report = {
      generatedAt: new Date(),
      period: {
        start: startDate || 'All time',
        end: endDate || 'Present'
      },
      summary: {
        totalOrders,
        totalRevenue,
        averageOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0,
        completedOrders,
        pendingOrders,
        processingOrders
      },
      categorySales,
      orders: format === 'detailed' ? orders : orders.slice(0, 10)
    };

    res.json({
      success: true,
      report
    });
  } catch (error) {
    console.error('Generate sales report error:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating sales report'
    });
  }
};

// @desc    Generate Product Report
// @route   GET /api/reports/products
// @access  Private/Admin
exports.generateProductReport = async (req, res) => {
  try {
    const products = await Product.find().sort({ views: -1, stock: 1 });
    const orders = await Order.find({ status: { $in: ['Processing', 'Delivered'] } });

    // Calculate product sales
    const productSales = {};
    orders.forEach(order => {
      order.items.forEach(item => {
        const productId = item.product?._id?.toString() || item.product?.toString();
        if (!productSales[productId]) {
          productSales[productId] = {
            quantitySold: 0,
            revenue: 0
          };
        }
        productSales[productId].quantitySold += item.quantity;
        productSales[productId].revenue += item.price * item.quantity;
      });
    });

    // Enrich products with sales data
    const enrichedProducts = products.map(product => {
      const sales = productSales[product._id.toString()] || { quantitySold: 0, revenue: 0 };
      return {
        id: product._id,
        title: product.title,
        category: product.category,
        price: product.price,
        stock: product.stock,
        views: product.views || 0,
        rating: product.rating,
        quantitySold: sales.quantitySold,
        revenue: sales.revenue,
        status: product.stock === 0 ? 'Out of Stock' : product.stock < 5 ? 'Low Stock' : 'In Stock'
      };
    });

    const report = {
      generatedAt: new Date(),
      summary: {
        totalProducts: products.length,
        inStock: products.filter(p => p.stock > 0).length,
        outOfStock: products.filter(p => p.stock === 0).length,
        lowStock: products.filter(p => p.stock > 0 && p.stock < 5).length
      },
      topSelling: enrichedProducts.sort((a, b) => b.quantitySold - a.quantitySold).slice(0, 10),
      lowStock: enrichedProducts.filter(p => p.stock > 0 && p.stock < 5),
      allProducts: enrichedProducts
    };

    res.json({
      success: true,
      report
    });
  } catch (error) {
    console.error('Generate product report error:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating product report'
    });
  }
};

// @desc    Generate Customer Report
// @route   GET /api/reports/customers
// @access  Private/Admin
exports.generateCustomerReport = async (req, res) => {
  try {
    const users = await User.find({ role: { $ne: 'admin' } }).select('-password');
    const orders = await Order.find().populate('user', 'name email');

    // Calculate customer statistics
    const customerStats = {};
    orders.forEach(order => {
      const userId = order.user?._id?.toString();
      if (!userId) return;

      if (!customerStats[userId]) {
        customerStats[userId] = {
          name: order.user.name,
          email: order.user.email,
          totalOrders: 0,
          totalSpent: 0,
          lastOrderDate: null
        };
      }
      customerStats[userId].totalOrders += 1;
      customerStats[userId].totalSpent += order.totalAmount;
      if (!customerStats[userId].lastOrderDate || order.createdAt > customerStats[userId].lastOrderDate) {
        customerStats[userId].lastOrderDate = order.createdAt;
      }
    });

    const enrichedCustomers = users.map(user => ({
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      createdAt: user.createdAt,
      ...customerStats[user._id.toString()] || { totalOrders: 0, totalSpent: 0, lastOrderDate: null }
    }));

    const report = {
      generatedAt: new Date(),
      summary: {
        totalCustomers: users.length,
        activeCustomers: Object.keys(customerStats).length,
        newCustomersThisMonth: users.filter(u => {
          const monthAgo = new Date();
          monthAgo.setMonth(monthAgo.getMonth() - 1);
          return new Date(u.createdAt) > monthAgo;
        }).length
      },
      topCustomers: enrichedCustomers.sort((a, b) => b.totalSpent - a.totalSpent).slice(0, 10),
      allCustomers: enrichedCustomers
    };

    res.json({
      success: true,
      report
    });
  } catch (error) {
    console.error('Generate customer report error:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating customer report'
    });
  }
};

// @desc    Export Report as CSV
// @route   GET /api/reports/export/:type
// @access  Private/Admin
exports.exportReport = async (req, res) => {
  try {
    const { type } = req.params;
    const { startDate, endDate } = req.query;

    let data, filename;

    switch (type) {
      case 'sales':
        const salesData = await generateSalesData(startDate, endDate);
        data = convertSalesToCSV(salesData);
        filename = `sales-report-${Date.now()}.csv`;
        break;

      case 'products':
        const productData = await generateProductData();
        data = convertProductsToCSV(productData);
        filename = `product-report-${Date.now()}.csv`;
        break;

      case 'customers':
        const customerData = await generateCustomerData();
        data = convertCustomersToCSV(customerData);
        filename = `customer-report-${Date.now()}.csv`;
        break;

      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid report type'
        });
    }

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(data);
  } catch (error) {
    console.error('Export report error:', error);
    res.status(500).json({
      success: false,
      message: 'Error exporting report'
    });
  }
};

// Helper functions
async function generateSalesData(startDate, endDate) {
  let dateFilter = {};
  if (startDate || endDate) {
    dateFilter.createdAt = {};
    if (startDate) dateFilter.createdAt.$gte = new Date(startDate);
    if (endDate) dateFilter.createdAt.$lte = new Date(endDate);
  }

  return await Order.find(dateFilter)
    .populate('user', 'name email')
    .populate('items.product', 'title price category')
    .sort({ createdAt: -1 });
}

async function generateProductData() {
  return await Product.find().sort({ stock: 1 });
}

async function generateCustomerData() {
  const users = await User.find({ role: { $ne: 'admin' } }).select('-password');
  const orders = await Order.find().populate('user');

  return users.map(user => {
    const userOrders = orders.filter(o => o.user?._id?.toString() === user._id.toString());
    return {
      ...user.toObject(),
      totalOrders: userOrders.length,
      totalSpent: userOrders.reduce((sum, o) => sum + o.totalAmount, 0)
    };
  });
}

function convertSalesToCSV(orders) {
  const headers = 'Order ID,Date,Customer,Email,Items,Total Amount,Status\n';
  const rows = orders.map(order => {
    const date = new Date(order.createdAt).toLocaleDateString();
    const items = order.items.length;
    return `${order._id},${date},${order.user?.name || 'N/A'},${order.user?.email || 'N/A'},${items},${order.totalAmount},${order.status}`;
  }).join('\n');

  return headers + rows;
}

function convertProductsToCSV(products) {
  const headers = 'Product ID,Title,Category,Price,Stock,Rating,Views\n';
  const rows = products.map(p => 
    `${p._id},${p.title},${p.category},${p.price},${p.stock},${p.rating},${p.views || 0}`
  ).join('\n');

  return headers + rows;
}

function convertCustomersToCSV(customers) {
  const headers = 'Customer ID,Name,Email,Phone,Total Orders,Total Spent,Joined Date\n';
  const rows = customers.map(c => {
    const date = new Date(c.createdAt).toLocaleDateString();
    return `${c._id},${c.name},${c.email},${c.phone || 'N/A'},${c.totalOrders || 0},${c.totalSpent || 0},${date}`;
  }).join('\n');

  return headers + rows;
}
