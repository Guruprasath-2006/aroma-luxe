const User = require('../models/User');
const Order = require('../models/Order');

// @desc    Get all users (Admin)
// @route   GET /api/users
// @access  Private/Admin
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });

    // Calculate order statistics for each user
    const usersWithStats = await Promise.all(
      users.map(async (user) => {
        const userOrders = await Order.find({ user: user._id });
        const orderCount = userOrders.length;
        const totalSpent = userOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);

        return {
          ...user.toObject(),
          orderCount,
          totalSpent
        };
      })
    );

    res.status(200).json({
      success: true,
      count: usersWithStats.length,
      users: usersWithStats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single user (Admin)
// @route   GET /api/users/:id
// @access  Private/Admin
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Calculate order statistics for the user
    const userOrders = await Order.find({ user: user._id });
    const orderCount = userOrders.length;
    const totalSpent = userOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);

    const userWithStats = {
      ...user.toObject(),
      orderCount,
      totalSpent
    };

    res.status(200).json({
      success: true,
      user: userWithStats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete user (Admin)
// @route   DELETE /api/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
