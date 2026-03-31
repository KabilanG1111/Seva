const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['farmer', 'admin'], default: 'farmer' },
    location: {
      lat: { type: Number },
      lon: { type: Number },
      village: { type: String },
      district: { type: String },
      state: { type: String },
    },
    preferredLanguage: { type: String, default: 'en' },
    crops: [{ type: String }],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('KisanUser', userSchema);
