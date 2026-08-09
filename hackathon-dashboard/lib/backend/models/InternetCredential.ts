import mongoose from 'mongoose';

const internetCredentialSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    internetId: { type: String, required: true },
    internetPassword: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.InternetCredential || mongoose.model('InternetCredential', internetCredentialSchema);
