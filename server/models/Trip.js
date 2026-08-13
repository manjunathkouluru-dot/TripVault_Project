const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: [true, 'Trip title is required'] 
  },
  destination: { 
    type: String, 
    required: [true, 'Destination is required'] 
  },
  startDate: { 
    type: Date 
  },
  endDate: { 
    type: Date 
  },
  description: { 
    type: String 
  },
  rating: { 
    type: Number, 
    min: 1, 
    max: 5 
  },
  // --- ADDED NEW FIELDS HERE ---
  coverImage: { 
    type: String, 
    default: '' 
  }, // Main card photo (Cloudinary URL string)
  photos: [
    { type: String }
  ],  // Array of extra Cloudinary URL strings
  // -----------------------------
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  }
}, { timestamps: true });

module.exports = mongoose.model('Trip', tripSchema);