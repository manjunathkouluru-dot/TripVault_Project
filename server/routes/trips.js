const upload = require('../middleware/upload');
const protect = require('../middleware/authMiddleware');

// @route   POST /api/trips/:id/upload
// @desc    Upload an image for a specific trip
// @access  Private (Owner only)
router.post('/:id/upload', protect, upload.single('image'), async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    // Verify Ownership
    if (trip.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to modify this trip' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'Please upload an image file' });
    }

    const imageUrl = req.file.path; // Cloudinary CDN URL

    // Set as cover image if none exists, and append to photos array
    if (!trip.coverImage) {
      trip.coverImage = imageUrl;
    }
    trip.photos.push(imageUrl);

    await trip.save();
    res.status(200).json({ message: 'Photo uploaded successfully', trip });
  } catch (error) {
    res.status(500).json({ message: 'Server upload error', error: error.message });
  }
});