const mongoose = require('mongoose');

const diseaseLogSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'KisanUser' },
    cropType: { type: String, default: 'unknown' },
    imageUrl: { type: String },
    imageName: { type: String },
    detection: {
      disease: { type: String, required: true },
      confidence: { type: Number, required: true }, // 0.0 – 1.0
      severity: { type: String, enum: ['Low', 'Medium', 'High', 'Critical'] },
      solution: { type: String },
      pesticide: { type: String },
      organic_alternative: { type: String },
    },
    location: {
      lat: Number,
      lon: Number,
    },
    modelUsed: { type: String, default: 'kisan-rule-engine-v1' },
    isConfirmedByExpert: { type: Boolean, default: false },
  },
  { timestamps: true }
);

diseaseLogSchema.index({ userId: 1, createdAt: -1 });
diseaseLogSchema.index({ 'detection.disease': 1 });

module.exports = mongoose.model('DiseaseLog', diseaseLogSchema);
