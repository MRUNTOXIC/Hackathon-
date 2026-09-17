import mongoose from 'mongoose';

const otpSchema = new mongoose.Schema({
  email: { type: String, required: true, lowercase: true, trim: true },
  code: { type: String, required: true },
  // TTL index — MongoDB auto-deletes the document after 10 minutes
  expiresAt: { type: Date, required: true, index: { expires: 0 } },
  used: { type: Boolean, default: false },
}, { timestamps: true });

// Compound index so lookups by email are fast
otpSchema.index({ email: 1, createdAt: -1 });

export default mongoose.models.OTP || mongoose.model('OTP', otpSchema);
