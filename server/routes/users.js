const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Trip = require('../models/Trip');
const protect = require('../middleware/authMiddleware');

// @route   GET /api/users/:username/profile
// @desc    Get public profile and user's public trips (NO AUTH REQUIRED)
// @access  Public
router.get('/:username/profile', async (req, res) => {
  try {
    // Explicitly select ONLY safe fields (.select excludes email, password, etc.)
    const user = await User.findOne({ username: req.params.username.toLowerCase() })
                           .select('name username bio createdAt');

    if (!user) {
      return res.status(404).json({ message: 'User profile not found' });
    }

    // Fetch all trips belonging to this user
    const trips = await Trip.find({ user: user._id })
                             .select('title destination startDate endDate rating coverImage photos description')
                             .sort({ createdAt: -1 });

    res.status(200).json({ user, trips });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile', error: error.message });
  }
});

// @route   PUT /api/users/profile
// @desc    Update logged-in user's bio or username
// @access  Private
router.put('/profile', protect, async (req, res) => {
  try {
    const { bio, username } = req.body;
    const user = await User.findById(req.user.id);

    if (username) user.username = username.toLowerCase();
    if (bio !== undefined) user.bio = bio;

    await user.save();

    res.status(200).json({
      message: 'Profile updated',
      user: { id: user._id, name: user.name, username: user.username, bio: user.bio }
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update profile', error: error.message });
  }
});

module.exports = router;