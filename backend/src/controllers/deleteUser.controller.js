import User from '../models/user.model.js';

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      // Prevent deleting own account
      if (user._id.toString() === req.user._id.toString()) {
        return res.status(400).json({
          success: false,
          message: 'Cannot delete your own account',
        });
      }

      await User.deleteOne({ _id: user._id });
      res.json({
        success: true,
        data: {},
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};
