import React, { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-toastify';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FiDownload, FiBarChart2, FiPackage, FiUsers, FiCalendar, FiFileText } from 'react-icons/fi';
import { AuthContext } from '../../context/AuthContext';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const Reports = () => {
  const { token } = useContext(AuthContext);
  const [reportType, setReportType] = useState('sales');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [error, setError] = useState('');

  const reportTypes = [
    {
      id: 'sales',
      title: 'Sales Report',
      description: 'Detailed sales analysis with revenue, orders, and trends',
      icon: FiBarChart2,
      color: 'blue'
    },
    {
      id: 'products',
      title: 'Product Report',
      description: 'Product inventory, stock levels, and performance',
      icon: FiPackage,
      color: 'green'
    },
    {
      id: 'customers',
      title: 'Customer Report',
      description: 'Customer analytics, spending patterns, and engagement',
      icon: FiUsers,
      color: 'purple'
    }
  ];

  const handleGenerateReport = async () => {
    if (!token) {
      setError('Please log in to generate reports');
      toast.error('Please log in to generate reports');
      return;
    }

    console.log('Generating report:', reportType);
    setLoading(true);
    setError('');
    setReportData(null);
    
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params: {}
      };

      if (startDate) config.params.startDate = startDate.toISOString().split('T')[0];
      if (endDate) config.params.endDate = endDate.toISOString().split('T')[0];

      console.log('Making API call to:', `/api/reports/${reportType}`);
      const { data } = await axios.get(`/api/reports/${reportType}`, config);
      console.log('Report data received:', data);
      setReportData(data.report);
      toast.success('Report generated successfully!');
    } catch (error) {
      console.error('Error generating report:', error);
      const errorMsg = error.response?.data?.message || error.message || 'Failed to generate report';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = async () => {
    if (!token) {
      toast.error('Please log in to export reports');
      return;
    }

    try {
      toast.info('Preparing CSV export...');
      
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params: {},
        responseType: 'blob'
      };

      if (startDate) config.params.startDate = startDate.toISOString().split('T')[0];
      if (endDate) config.params.endDate = endDate.toISOString().split('T')[0];

      const { data } = await axios.get(`/api/reports/export/${reportType}`, config);
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${reportType}-report-${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      toast.success('CSV exported successfully!');
    } catch (error) {
      console.error('Error exporting report:', error);
      const errorMsg = error.response?.data?.message || error.message || 'Failed to export report';
      setError(errorMsg);
      toast.error(errorMsg);
    }
  };

  const handleExportPDF = () => {
    if (!reportData) {
      toast.error('Please generate a report first');
      return;
    }

    try {
      toast.info('Generating PDF...');
      
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      
      // Company Header
      doc.setFillColor(15, 23, 42); // Dark navy
      doc.rect(0, 0, pageWidth, 40, 'F');
      
      // Company Name
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(24);
      doc.setFont('helvetica', 'bold');
      doc.text('VELAN ENGINEERING', pageWidth / 2, 15, { align: 'center' });
      
      // Tagline
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text('Engineering Services & Solutions', pageWidth / 2, 22, { align: 'center' });
      
      // Contact Info
      doc.setFontSize(8);
      doc.text('Email: admin@aromaluxe.com | Phone: +91-XXXXXXXXXX', pageWidth / 2, 28, { align: 'center' });
      doc.text('Website: www.aromaluxe.com', pageWidth / 2, 33, { align: 'center' });
      
      // Report Title Section
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      const reportTitle = reportType.charAt(0).toUpperCase() + reportType.slice(1) + ' Report';
      doc.text(reportTitle, pageWidth / 2, 52, { align: 'center' });
      
      // Report Info
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 100, 100);
      
      let yPos = 60;
      doc.text(`Generated on: ${new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}`, 14, yPos);
      
      if (startDate || endDate) {
        yPos += 5;
        const dateRange = `Period: ${startDate ? startDate.toLocaleDateString('en-IN') : 'Start'} to ${endDate ? endDate.toLocaleDateString('en-IN') : 'Present'}`;
        doc.text(dateRange, 14, yPos);
      }
      
      // Separator Line
      yPos += 8;
      doc.setDrawColor(33, 150, 243);
      doc.setLineWidth(0.5);
      doc.line(14, yPos, pageWidth - 14, yPos);
      
      yPos += 10;
      
      // Summary Section
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 0, 0);
      doc.text('SUMMARY', 14, yPos);
      
      yPos += 8;
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      
      if (reportType === 'sales' && reportData.summary) {
        const summaryData = [
          ['Total Orders', (reportData.summary.totalOrders || 0).toString()],
          ['Total Revenue', formatCurrency(reportData.summary.totalRevenue || 0)],
          ['Average Order Value', formatCurrency(reportData.summary.averageOrderValue || 0)],
          ['Completed Orders', (reportData.summary.completedOrders || 0).toString()]
        ];
        
        autoTable(doc, {
          startY: yPos,
          head: [['Metric', 'Value']],
          body: summaryData,
          theme: 'striped',
          headStyles: { fillColor: [33, 150, 243], fontSize: 10, fontStyle: 'bold' },
          styles: { fontSize: 9 },
          margin: { left: 14, right: 14 }
        });
        
        yPos = doc.lastAutoTable.finalY + 10;
        
        // Category Sales
        if (reportData.categorySales && Object.keys(reportData.categorySales).length > 0) {
          doc.setFontSize(12);
          doc.setFont('helvetica', 'bold');
          doc.text('CATEGORY SALES', 14, yPos);
          yPos += 6;
          
          const categoryData = Object.entries(reportData.categorySales).map(([category, data]) => [
            category,
            data.quantity.toString(),
            formatCurrency(data.revenue)
          ]);
          
          autoTable(doc, {
            startY: yPos,
            head: [['Category', 'Quantity Sold', 'Revenue']],
            body: categoryData,
            theme: 'striped',
            headStyles: { fillColor: [33, 150, 243], fontSize: 10, fontStyle: 'bold' },
            styles: { fontSize: 9 },
            margin: { left: 14, right: 14 }
          });
          
          yPos = doc.lastAutoTable.finalY + 10;
        }
        
        // Recent Orders
        if (reportData.orders && reportData.orders.length > 0) {
          if (yPos > pageHeight - 60) {
            doc.addPage();
            yPos = 20;
          }
          
          doc.setFontSize(12);
          doc.setFont('helvetica', 'bold');
          doc.text('RECENT ORDERS', 14, yPos);
          yPos += 6;
          
          const ordersData = reportData.orders.slice(0, 15).map(order => [
            order._id.substring(0, 8) + '...',
            order.user?.name || 'N/A',
            new Date(order.createdAt).toLocaleDateString('en-IN'),
            order.status,
            formatCurrency(order.totalAmount)
          ]);
          
          autoTable(doc, {
            startY: yPos,
            head: [['Order ID', 'Customer', 'Date', 'Status', 'Amount']],
            body: ordersData,
            theme: 'striped',
            headStyles: { fillColor: [33, 150, 243], fontSize: 9, fontStyle: 'bold' },
            styles: { fontSize: 8 },
            margin: { left: 14, right: 14 }
          });
        }
        
      } else if (reportType === 'products' && reportData.summary) {
        const summaryData = [
          ['Total Products', (reportData.summary.totalProducts || 0).toString()],
          ['In Stock', (reportData.summary.inStock || 0).toString()],
          ['Out of Stock', (reportData.summary.outOfStock || 0).toString()],
          ['Low Stock', (reportData.summary.lowStock || 0).toString()]
        ];
        
        autoTable(doc, {
          startY: yPos,
          head: [['Metric', 'Value']],
          body: summaryData,
          theme: 'striped',
          headStyles: { fillColor: [33, 150, 243], fontSize: 10, fontStyle: 'bold' },
          styles: { fontSize: 9 },
          margin: { left: 14, right: 14 }
        });
        
        yPos = doc.lastAutoTable.finalY + 10;
        
        // Top Selling Products
        if (reportData.topSelling && reportData.topSelling.length > 0) {
          if (yPos > pageHeight - 60) {
            doc.addPage();
            yPos = 20;
          }
          
          doc.setFontSize(12);
          doc.setFont('helvetica', 'bold');
          doc.text('TOP SELLING PRODUCTS', 14, yPos);
          yPos += 6;
          
          const productsData = reportData.topSelling.map(product => [
            product.title,
            product.category,
            product.stock.toString(),
            product.quantitySold.toString(),
            formatCurrency(product.revenue)
          ]);
          
          autoTable(doc, {
            startY: yPos,
            head: [['Product', 'Category', 'Stock', 'Sold', 'Revenue']],
            body: productsData,
            theme: 'striped',
            headStyles: { fillColor: [33, 150, 243], fontSize: 9, fontStyle: 'bold' },
            styles: { fontSize: 8 },
            margin: { left: 14, right: 14 }
          });
        }
        
      } else if (reportType === 'customers' && reportData.summary) {
        const summaryData = [
          ['Total Customers', (reportData.summary.totalCustomers || 0).toString()],
          ['Active Customers', (reportData.summary.activeCustomers || 0).toString()],
          ['New This Month', (reportData.summary.newCustomersThisMonth || 0).toString()]
        ];
        
        autoTable(doc, {
          startY: yPos,
          head: [['Metric', 'Value']],
          body: summaryData,
          theme: 'striped',
          headStyles: { fillColor: [33, 150, 243], fontSize: 10, fontStyle: 'bold' },
          styles: { fontSize: 9 },
          margin: { left: 14, right: 14 }
        });
        
        yPos = doc.lastAutoTable.finalY + 10;
        
        // Top Customers
        if (reportData.topCustomers && reportData.topCustomers.length > 0) {
          if (yPos > pageHeight - 60) {
            doc.addPage();
            yPos = 20;
          }
          
          doc.setFontSize(12);
          doc.setFont('helvetica', 'bold');
          doc.text('TOP CUSTOMERS', 14, yPos);
          yPos += 6;
          
          const customersData = reportData.topCustomers.map(customer => [
            customer.name,
            customer.email,
            customer.totalOrders.toString(),
            formatCurrency(customer.totalSpent),
            customer.lastOrderDate ? new Date(customer.lastOrderDate).toLocaleDateString('en-IN') : 'N/A'
          ]);
          
          autoTable(doc, {
            startY: yPos,
            head: [['Customer', 'Email', 'Orders', 'Total Spent', 'Last Order']],
            body: customersData,
            theme: 'striped',
            headStyles: { fillColor: [33, 150, 243], fontSize: 8, fontStyle: 'bold' },
            styles: { fontSize: 7 },
            margin: { left: 14, right: 14 }
          });
        }
      }
      
      // Footer on last page
      const finalY = doc.lastAutoTable ? doc.lastAutoTable.finalY : yPos;
      const footerY = pageHeight - 20;
      
      if (finalY < footerY - 20) {
        doc.setFontSize(8);
        doc.setTextColor(100, 100, 100);
        doc.setFont('helvetica', 'italic');
        doc.text('This is a computer-generated report and does not require a signature.', pageWidth / 2, footerY - 10, { align: 'center' });
        
        // Footer line
        doc.setDrawColor(33, 150, 243);
        doc.setLineWidth(0.3);
        doc.line(14, footerY - 5, pageWidth - 14, footerY - 5);
        
        doc.setFont('helvetica', 'normal');
        doc.text('© 2026 Velan Engineering. All rights reserved.', pageWidth / 2, footerY, { align: 'center' });
      }
      
      // Save PDF
      const fileName = `${reportType}-report-${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(fileName);
      
      toast.success('PDF generated successfully!');
    } catch (error) {
      console.error('Error generating PDF:', error);
      console.error('Error details:', error.message, error.stack);
      toast.error(`Failed to generate PDF: ${error.message || 'Unknown error'}`);
    }
  };

  const formatCurrency = (amount) => {
    return `₹${amount?.toFixed(2) || '0.00'}`;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-luxury-black py-12 px-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Floating Orbs */}
        <motion.div
          className="absolute w-96 h-96 rounded-full bg-primary-500/10 blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{ top: '10%', left: '10%' }}
        />
        <motion.div
          className="absolute w-96 h-96 rounded-full bg-blue-500/10 blur-3xl"
          animate={{
            x: [0, -100, 0],
            y: [0, 100, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{ top: '50%', right: '10%' }}
        />
        <motion.div
          className="absolute w-80 h-80 rounded-full bg-purple-500/10 blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, -50, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{ bottom: '15%', left: '30%' }}
        />

        {/* Animated Grid Lines */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.03]">
          <defs>
            <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
              <motion.path
                d="M 50 0 L 0 0 0 50"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
                className="text-primary-500"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        {/* Floating Particles */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-primary-500/30 rounded-full"
            animate={{
              y: [0, -1000],
              x: [0, Math.sin(i) * 100],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 10 + i * 2,
              repeat: Infinity,
              delay: i * 1.5,
              ease: "linear"
            }}
            style={{ 
              left: `${10 + i * 12}%`, 
              bottom: '0%'
            }}
          />
        ))}

        {/* Rotating Rings */}
        <motion.div
          className="absolute w-[600px] h-[600px] border border-primary-500/5 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
          style={{ top: '20%', left: '50%', transform: 'translate(-50%, -50%)' }}
        />
        <motion.div
          className="absolute w-[800px] h-[800px] border border-blue-500/5 rounded-full"
          animate={{ rotate: -360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          style={{ top: '60%', right: '20%', transform: 'translate(50%, -50%)' }}
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold font-serif text-white mb-2">
            Reports & Analytics
          </h1>
          <p className="text-gray-400">Generate and export detailed business reports</p>
        </motion.div>

        {/* Report Type Selection */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {reportTypes.map((type, index) => (
            <motion.div
              key={type.id}
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ 
                delay: index * 0.15,
                type: 'spring',
                stiffness: 200,
                damping: 20
              }}
              whileHover={{ 
                scale: 1.05, 
                y: -5,
                transition: { duration: 0.2 }
              }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setReportType(type.id)}
              className={`luxury-card p-6 rounded-xl cursor-pointer transition-all ${
                reportType === type.id
                  ? 'ring-2 ring-primary-500 bg-gradient-to-br from-slate-800 to-slate-700 shadow-lg shadow-primary-500/20'
                  : ''
              }`}
            >
              <motion.div
                animate={{
                  rotate: reportType === type.id ? [0, 10, -10, 0] : 0,
                  scale: reportType === type.id ? [1, 1.1, 1] : 1
                }}
                transition={{ duration: 0.5 }}
              >
                <type.icon className={`text-4xl mb-4 transition-colors duration-300 ${
                  reportType === type.id ? 'text-primary-500' : 'text-gray-400'
                }`} />
              </motion.div>
              <h3 className="text-xl font-bold text-white mb-2">{type.title}</h3>
              <p className="text-gray-400 text-sm">{type.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Date Range Selection */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, type: 'spring', stiffness: 100 }}
          className="luxury-card p-6 rounded-xl mb-8"
        >
          <div className="flex items-center gap-2 mb-4">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              <FiCalendar className="text-primary-500 text-xl" />
            </motion.div>
            <h3 className="text-xl font-bold text-white">Date Range (Optional)</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-300 mb-2 font-semibold text-sm">Start Date</label>
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                dateFormat="dd-MM-yyyy"
                placeholderText="dd-mm-yyyy"
                className="w-full bg-slate-800 border-2 border-slate-600 rounded-lg px-4 py-3 text-white font-medium text-base focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 cursor-pointer placeholder-gray-400"
                wrapperClassName="w-full"
                maxDate={endDate || new Date()}
                isClearable
                showYearDropdown
                showMonthDropdown
                dropdownMode="select"
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-2 font-semibold text-sm">End Date</label>
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                dateFormat="dd-MM-yyyy"
                placeholderText="dd-mm-yyyy"
                className="w-full bg-slate-800 border-2 border-slate-600 rounded-lg px-4 py-3 text-white font-medium text-base focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 cursor-pointer placeholder-gray-400"
                wrapperClassName="w-full"
                minDate={startDate}
                maxDate={new Date()}
                isClearable
                showYearDropdown
                showMonthDropdown
                dropdownMode="select"
              />
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7, type: 'spring' }}
          className="flex flex-wrap gap-4 mb-8"
        >
          <motion.button
            onClick={handleGenerateReport}
            disabled={loading}
            whileHover={{ scale: 1.05, boxShadow: '0 10px 30px rgba(33, 150, 243, 0.3)' }}
            whileTap={{ scale: 0.95 }}
            animate={loading ? { scale: [1, 1.05, 1] } : {}}
            transition={loading ? { duration: 1, repeat: Infinity } : {}}
            className="flex items-center gap-2 px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50 font-semibold shadow-lg"
          >
            <motion.div
              animate={loading ? { rotate: 360 } : {}}
              transition={loading ? { duration: 1, repeat: Infinity, ease: 'linear' } : {}}
            >
              <FiFileText />
            </motion.div>
            {loading ? 'Generating...' : 'Generate Report'}
          </motion.button>
          {reportData && (
            <>
              <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={handleExportCSV}
                whileHover={{ scale: 1.05, boxShadow: '0 10px 30px rgba(34, 197, 94, 0.3)' }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-semibold shadow-lg"
              >
                <motion.div
                  animate={{ y: [0, -3, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <FiDownload />
                </motion.div>
                Export as CSV
              </motion.button>
              <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                onClick={handleExportPDF}
                whileHover={{ scale: 1.05, boxShadow: '0 10px 30px rgba(239, 68, 68, 0.3)' }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-semibold shadow-lg"
              >
                <motion.div
                  animate={{ y: [0, -3, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
                >
                  <FiFileText />
                </motion.div>
                Export as PDF
              </motion.button>
            </>
          )}
        </motion.div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="luxury-card p-4 rounded-lg mb-8 bg-red-500/10 border border-red-500"
          >
            <p className="text-red-500">{error}</p>
          </motion.div>
        )}

        {/* Report Results */}
        {reportData && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: 'spring', stiffness: 100, damping: 15 }}
            className="luxury-card p-8 rounded-xl"
          >
            <motion.div 
              className="flex items-center justify-between mb-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-2xl font-bold text-white">Report Results</h2>
              <motion.span 
                className="text-gray-400 text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Generated: {formatDate(reportData.generatedAt)}
              </motion.span>
            </motion.div>

            {/* Sales Report */}
            {reportType === 'sales' && (
              <>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  {[
                    { label: 'Total Orders', value: reportData.summary.totalOrders, color: 'text-white', icon: '📊' },
                    { label: 'Total Revenue', value: formatCurrency(reportData.summary.totalRevenue), color: 'text-green-400', icon: '💰' },
                    { label: 'Avg Order Value', value: formatCurrency(reportData.summary.averageOrderValue), color: 'text-blue-400', icon: '📈' },
                    { label: 'Completed', value: reportData.summary.completedOrders, color: 'text-primary-400', icon: '✅' }
                  ].map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 20, scale: 0.8 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ delay: 0.1 + index * 0.1, type: 'spring' }}
                      whileHover={{ scale: 1.05, y: -5 }}
                      className="bg-slate-800 p-4 rounded-lg border border-slate-700 hover:border-primary-500 transition-all cursor-pointer"
                    >
                      <motion.p 
                        className="text-gray-300 text-sm mb-1 font-semibold flex items-center gap-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 + index * 0.1 }}
                      >
                        <span className="text-xl">{stat.icon}</span>
                        {stat.label}
                      </motion.p>
                      <motion.p 
                        className={`text-3xl font-bold ${stat.color}`}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.3 + index * 0.1, type: 'spring', stiffness: 200 }}
                      >
                        {stat.value}
                      </motion.p>
                    </motion.div>
                  ))}
                </div>

                {/* Category Sales */}
                {reportData?.categorySales && Object.keys(reportData.categorySales).length > 0 && (
                  <motion.div 
                    className="mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <motion.h3 
                      className="text-xl font-bold text-white mb-4"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 }}
                    >
                      Category-wise Sales
                    </motion.h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {Object.entries(reportData.categorySales).map(([category, data], index) => (
                        <motion.div 
                          key={category} 
                          className="bg-slate-800 p-4 rounded-lg border border-slate-700 hover:border-primary-500 transition-all"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.8 + index * 0.05, type: 'spring' }}
                          whileHover={{ scale: 1.03, y: -3 }}
                        >
                          <p className="text-gray-300 text-sm mb-2 font-semibold">{category}</p>
                          <motion.p 
                            className="text-2xl font-bold text-white mb-1"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.9 + index * 0.05 }}
                          >
                            {formatCurrency(data.revenue)}
                          </motion.p>
                          <p className="text-sm text-gray-400 font-medium">{data.quantity} items sold</p>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Recent Orders */}
                {reportData.orders && reportData.orders.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 }}
                  >
                    <motion.h3 
                      className="text-xl font-bold text-white mb-4"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.1 }}
                    >
                      Recent Orders
                    </motion.h3>
                    <motion.div 
                      className="overflow-x-auto"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.2 }}
                    >
                      <table className="w-full">
                        <thead>
                          <tr className="border-b-2 border-slate-600">
                            <th className="text-left text-gray-200 py-3 px-4 font-bold text-sm">Order ID</th>
                            <th className="text-left text-gray-200 py-3 px-4 font-bold text-sm">Customer</th>
                            <th className="text-left text-gray-200 py-3 px-4 font-bold text-sm">Date</th>
                            <th className="text-left text-gray-200 py-3 px-4 font-bold text-sm">Status</th>
                            <th className="text-right text-gray-200 py-3 px-4 font-bold text-sm">Amount</th>
                          </tr>
                        </thead>
                        <tbody>
                          {reportData.orders.slice(0, 10).map((order, index) => (
                            <motion.tr 
                              key={order._id} 
                              className="border-b border-slate-700 hover:bg-slate-800/50"
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 1.3 + index * 0.05 }}
                              whileHover={{ backgroundColor: 'rgba(51, 65, 85, 0.5)', scale: 1.01 }}
                            >
                              <td className="py-3 px-4 text-gray-200 font-mono text-sm">{order._id.substring(0, 8)}...</td>
                              <td className="py-3 px-4 text-gray-200 font-medium">{order.user?.name || 'N/A'}</td>
                              <td className="py-3 px-4 text-gray-200">{formatDate(order.createdAt)}</td>
                              <td className="py-3 px-4">
                                <span className={`px-2 py-1 rounded text-xs ${
                                  order.status === 'Delivered' ? 'bg-green-500/20 text-green-500' :
                                  order.status === 'Processing' ? 'bg-blue-500/20 text-blue-500' :
                                  'bg-yellow-500/20 text-yellow-500'
                                }`}>
                                  {order.status}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-right text-white font-bold">
                                {formatCurrency(order.totalAmount)}
                              </td>
                            </motion.tr>
                          ))}
                        </tbody>
                      </table>
                    </motion.div>
                  </motion.div>
                )}
              </>
            )}

            {/* Product Report */}
            {reportType === 'products' && (
              <>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  {[
                    { label: 'Total Products', value: reportData.summary.totalProducts, color: 'text-white', icon: '📦' },
                    { label: 'In Stock', value: reportData.summary.inStock, color: 'text-green-400', icon: '✓' },
                    { label: 'Out of Stock', value: reportData.summary.outOfStock, color: 'text-red-400', icon: '✗' },
                    { label: 'Low Stock', value: reportData.summary.lowStock, color: 'text-yellow-400', icon: '⚠️' }
                  ].map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 20, scale: 0.8 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ delay: 0.1 + index * 0.1, type: 'spring' }}
                      whileHover={{ scale: 1.05, y: -5 }}
                      className="bg-slate-800 p-4 rounded-lg border border-slate-700 hover:border-primary-500 transition-all cursor-pointer"
                    >
                      <motion.p 
                        className="text-gray-300 text-sm mb-1 font-semibold flex items-center gap-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 + index * 0.1 }}
                      >
                        <span className="text-xl">{stat.icon}</span>
                        {stat.label}
                      </motion.p>
                      <motion.p 
                        className={`text-3xl font-bold ${stat.color}`}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.3 + index * 0.1, type: 'spring', stiffness: 200 }}
                      >
                        {stat.value}
                      </motion.p>
                    </motion.div>
                  ))}
                </div>

                {/* Top Selling Products */}
                {reportData.topSelling && reportData.topSelling.length > 0 && (
                  <motion.div 
                    className="mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <motion.h3 
                      className="text-xl font-bold text-white mb-4"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 }}
                    >
                      Top Selling Products
                    </motion.h3>
                    <motion.div 
                      className="overflow-x-auto"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.8 }}
                    >
                      <table className="w-full">
                        <thead>
                          <tr className="border-b-2 border-slate-600">
                            <th className="text-left text-gray-200 py-3 px-4 font-bold text-sm">Product</th>
                            <th className="text-left text-gray-200 py-3 px-4 font-bold text-sm">Category</th>
                            <th className="text-left text-gray-200 py-3 px-4 font-bold text-sm">Stock</th>
                            <th className="text-right text-gray-200 py-3 px-4 font-bold text-sm">Sold</th>
                            <th className="text-right text-gray-200 py-3 px-4 font-bold text-sm">Revenue</th>
                          </tr>
                        </thead>
                        <tbody>
                          {reportData.topSelling.map((product, index) => (
                            <motion.tr 
                              key={product.id} 
                              className="border-b border-slate-700 hover:bg-slate-800/50"
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.9 + index * 0.05 }}
                              whileHover={{ backgroundColor: 'rgba(51, 65, 85, 0.5)', scale: 1.01 }}
                            >
                              <td className="py-3 px-4 text-gray-200 font-medium">{product.title}</td>
                              <td className="py-3 px-4 text-gray-200">{product.category}</td>
                              <td className="py-3 px-4">
                                <span className={`px-2 py-1 rounded text-xs ${
                                  product.status === 'In Stock' ? 'bg-green-500/20 text-green-500' :
                                  product.status === 'Low Stock' ? 'bg-yellow-500/20 text-yellow-500' :
                                  'bg-red-500/20 text-red-500'
                                }`}>
                                  {product.stock}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-right text-white">{product.quantitySold}</td>
                              <td className="py-3 px-4 text-right text-green-400 font-bold">
                                {formatCurrency(product.revenue)}
                              </td>
                            </motion.tr>
                          ))}
                        </tbody>
                      </table>
                    </motion.div>
                  </motion.div>
                )}
              </>
            )}

            {/* Customer Report */}
            {reportType === 'customers' && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  {[
                    { label: 'Total Customers', value: reportData.summary.totalCustomers, color: 'text-white', icon: '👥' },
                    { label: 'Active Customers', value: reportData.summary.activeCustomers, color: 'text-green-400', icon: '👤' },
                    { label: 'New This Month', value: reportData.summary.newCustomersThisMonth, color: 'text-blue-400', icon: '✨' }
                  ].map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 20, scale: 0.8 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ delay: 0.1 + index * 0.1, type: 'spring' }}
                      whileHover={{ scale: 1.05, y: -5 }}
                      className="bg-slate-800 p-4 rounded-lg border border-slate-700 hover:border-primary-500 transition-all cursor-pointer"
                    >
                      <motion.p 
                        className="text-gray-300 text-sm mb-1 font-semibold flex items-center gap-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 + index * 0.1 }}
                      >
                        <span className="text-xl">{stat.icon}</span>
                        {stat.label}
                      </motion.p>
                      <motion.p 
                        className={`text-3xl font-bold ${stat.color}`}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.3 + index * 0.1, type: 'spring', stiffness: 200 }}
                      >
                        {stat.value}
                      </motion.p>
                    </motion.div>
                  ))}
                </div>

                {/* Top Customers */}
                {reportData.topCustomers && reportData.topCustomers.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <motion.h3 
                      className="text-xl font-bold text-white mb-4"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 }}
                    >
                      Top Customers
                    </motion.h3>
                    <motion.div 
                      className="overflow-x-auto"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.8 }}
                    >
                      <table className="w-full">
                        <thead>
                          <tr className="border-b-2 border-slate-600">
                            <th className="text-left text-gray-200 py-3 px-4 font-bold text-sm">Customer</th>
                            <th className="text-left text-gray-200 py-3 px-4 font-bold text-sm">Email</th>
                            <th className="text-right text-gray-200 py-3 px-4 font-bold text-sm">Orders</th>
                            <th className="text-right text-gray-200 py-3 px-4 font-bold text-sm">Total Spent</th>
                            <th className="text-left text-gray-200 py-3 px-4 font-bold text-sm">Last Order</th>
                          </tr>
                        </thead>
                        <tbody>
                          {reportData.topCustomers.map((customer, index) => (
                            <motion.tr 
                              key={customer.id} 
                              className="border-b border-slate-700 hover:bg-slate-800/50"
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.9 + index * 0.05 }}
                              whileHover={{ backgroundColor: 'rgba(51, 65, 85, 0.5)', scale: 1.01 }}
                            >
                              <td className="py-3 px-4 text-gray-200 font-medium">{customer.name}</td>
                              <td className="py-3 px-4 text-gray-200">{customer.email}</td>
                              <td className="py-3 px-4 text-right text-white">{customer.totalOrders}</td>
                              <td className="py-3 px-4 text-right text-green-400 font-bold">
                                {formatCurrency(customer.totalSpent)}
                              </td>
                              <td className="py-3 px-4 text-gray-200">
                                {customer.lastOrderDate ? formatDate(customer.lastOrderDate) : 'N/A'}
                              </td>
                            </motion.tr>
                          ))}
                        </tbody>
                      </table>
                    </motion.div>
                  </motion.div>
                )}
              </>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Reports;
