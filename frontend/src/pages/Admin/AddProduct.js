import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FiArrowLeft, FiUpload, FiX, FiImage } from 'react-icons/fi';
import { AuthContext } from '../../context/AuthContext';

const AddProduct = () => {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    brand: 'Velan Engineering',
    price: '',
    category: 'Consulting',
    size: 'Standard Package',
    description: '',
    rating: '4.5',
    stock: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    
    // Limit to 5 images
    if (imageFiles.length + files.length > 5) {
      toast.error('Maximum 5 images allowed');
      return;
    }

    // Validate file types and size
    const validFiles = files.filter(file => {
      const isValidType = file.type.startsWith('image/');
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB
      
      if (!isValidType) {
        toast.error(`${file.name} is not an image file`);
        return false;
      }
      if (!isValidSize) {
        toast.error(`${file.name} is larger than 5MB`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    // Add new files
    setImageFiles(prev => [...prev, ...validFiles]);

    // Create previews
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const uploadToCloudinary = async (file) => {
    // Compress and convert image to base64
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          // Create canvas for compression
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          // Set max dimensions
          const MAX_WIDTH = 1200;
          const MAX_HEIGHT = 1200;
          
          let width = img.width;
          let height = img.height;
          
          // Calculate new dimensions
          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          
          // Draw and compress
          ctx.drawImage(img, 0, 0, width, height);
          
          // Convert to base64 with compression (0.8 quality)
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.8);
          resolve(compressedBase64);
        };
        img.onerror = reject;
        img.src = e.target.result;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (imageFiles.length === 0) {
      toast.error('Please upload at least one product image');
      return;
    }

    // Validation
    if (!formData.title || !formData.brand || !formData.price || !formData.description) {
      toast.error('Please fill all required fields');
      return;
    }

    if (Number(formData.price) <= 0) {
      toast.error('Price must be greater than 0');
      return;
    }

    if (Number(formData.stock) < 0) {
      toast.error('Stock cannot be negative');
      return;
    }

    setLoading(true);

    try {
      // Upload all images
      toast.info('Processing images...');
      const imageUrls = await Promise.all(
        imageFiles.map(file => uploadToCloudinary(file))
      );

      const productData = {
        title: formData.title.trim(),
        brand: formData.brand.trim(),
        price: Number(formData.price),
        category: formData.category,
        size: formData.size,
        description: formData.description.trim(),
        rating: Number(formData.rating),
        stock: Number(formData.stock),
        images: imageUrls
      };

      console.log('Sending product data:', productData);

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };

      const response = await axios.post('/api/products', productData, config);
      console.log('Product created:', response.data);
      
      toast.success('Product added successfully!');
      navigate('/admin/products');
    } catch (error) {
      console.error('Error adding product:', error);
      console.error('Error response:', error.response?.data);
      
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message || 
                          'Failed to add product';
      
      toast.error(errorMessage);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-luxury-black py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          whileHover={{ scale: 1.05, x: -5 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/admin/dashboard')}
          className="mb-6 flex items-center gap-2 px-4 py-2 bg-luxury-lightGray/50 hover:bg-luxury-lightGray text-white rounded-lg transition-all duration-300 group"
        >
          <motion.div
            animate={{ x: [0, -3, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <FiArrowLeft className="w-5 h-5 text-primary-500 group-hover:text-white transition-colors" />
          </motion.div>
          <span className="font-medium">Back to Dashboard</span>
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold font-serif text-white mb-2">
            Add New Product
          </h1>
          <p className="text-gray-400">Create a new perfume listing</p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onSubmit={handleSubmit}
          className="luxury-card p-8 rounded-xl"
        >
          <div className="space-y-6">
            <div>
              <label className="block text-gray-300 mb-2">Product Title *</label>
              <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-luxury-black text-white border border-primary-600/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="e.g., Noir de Noir"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-300 mb-2">Brand *</label>
                <input
                  type="text"
                  name="brand"
                  required
                  value={formData.brand}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-luxury-black text-white border border-primary-600/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="e.g., Tom Ford"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Price ($) *</label>
                <input
                  type="number"
                  name="price"
                  required
                  min="0"
                  max="999999"
                  step="0.01"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-luxury-black text-white border border-primary-600/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="e.g., 299.99"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div>
                <label className="block text-gray-300 mb-2">Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-luxury-black text-white border border-primary-600/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="Mechanical">Mechanical</option>
                  <option value="Industrial">Industrial</option>
                  <option value="Consulting">Consulting</option>
                  <option value="Maintenance">Maintenance</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Package Type *</label>
                <select
                  name="size"
                  value={formData.size}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-luxury-black text-white border border-primary-600/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="Standard Package">Standard Package</option>
                  <option value="Basic Package">Basic Package</option>
                  <option value="Premium Package">Premium Package</option>
                  <option value="Enterprise Package">Enterprise Package</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Rating *</label>
                <input
                  type="number"
                  name="rating"
                  required
                  min="0"
                  max="5"
                  step="0.1"
                  value={formData.rating}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-luxury-black text-white border border-primary-600/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="e.g., 4.5"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Description *</label>
              <textarea
                name="description"
                required
                value={formData.description}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-3 bg-luxury-black text-white border border-primary-600/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Detailed product description..."
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Product Images * (Max 5)</label>
              
              {/* Image Upload Area */}
              <div className="space-y-4">
                <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-primary-600/30 border-dashed rounded-lg cursor-pointer bg-luxury-black/50 hover:bg-luxury-lightGray/30 transition-all group">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <FiUpload className="w-10 h-10 mb-3 text-primary-500 group-hover:scale-110 transition-transform" />
                    <p className="mb-2 text-sm text-gray-400">
                      <span className="font-semibold text-primary-500">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG, JPEG up to 5MB (Max 5 images)</p>
                  </div>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={imageFiles.length >= 5}
                  />
                </label>

                {/* Image Previews */}
                {imagePreviews.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                    <AnimatePresence>
                      {imagePreviews.map((preview, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          className="relative group"
                        >
                          <div className="aspect-square rounded-lg overflow-hidden border-2 border-primary-600/30 bg-luxury-black">
                            <img
                              src={preview}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                          >
                            <FiX className="w-4 h-4" />
                          </button>
                          <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                            {index + 1}
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}

                {imageFiles.length > 0 && (
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <FiImage className="text-primary-500" />
                    <span>{imageFiles.length} image{imageFiles.length > 1 ? 's' : ''} selected</span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Stock Quantity *</label>
              <input
                type="number"
                name="stock"
                required
                min="0"
                value={formData.stock}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-luxury-black text-white border border-primary-600/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="e.g., 50"
              />
            </div>

            <div className="flex gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="flex-1 py-3 gold-glow-btn text-black font-bold rounded-lg disabled:opacity-50"
              >
                {loading ? 'Adding Product...' : 'Add Product'}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={() => navigate('/admin/products')}
                className="flex-1 py-3 border-2 border-primary-500 text-white font-semibold rounded-lg hover:bg-primary-500 hover:text-black transition-all"
              >
                Cancel
              </motion.button>
            </div>
          </div>
        </motion.form>
      </div>
    </div>
  );
};

export default AddProduct;


