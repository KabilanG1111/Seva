const mongoose = require('mongoose');

const farmDataSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'KisanUser' },
    location: {
      lat: { type: Number, required: true },
      lon: { type: Number, required: true },
      name: { type: String },
    },
    weather: {
      temperature: Number,
      feelsLike: Number,
      humidity: Number,
      pressure: Number,
      windSpeed: Number,
      description: String,
      icon: String,
    },
    derived: {
      soilMoisture_estimated: Number,
      diseaseRisk_probability: Number,
      rainProbability: Number,
    },
    zones: [
      {
        zone: String,
        ndvi: Number,
        status: String,
        action: String,
      },
    ],
    source: { type: String, default: 'openweathermap' },
  },
  { timestamps: true }
);

// Index for time-series queries
farmDataSchema.index({ 'location.lat': 1, 'location.lon': 1, createdAt: -1 });

module.exports = mongoose.model('FarmData', farmDataSchema);
