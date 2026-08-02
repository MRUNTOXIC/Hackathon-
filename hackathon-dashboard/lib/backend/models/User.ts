import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    registrationNumber: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    department: { type: String, default: '' },
    year: { type: String, default: '' },
    role: { type: String, enum: ['leader', 'member'], default: 'member' },
    teamId: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', default: null },
    internetCredentialId: { type: mongoose.Schema.Types.ObjectId, ref: 'InternetCredential', default: null },
    verified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.comparePassword = async function (plain: string) {
  return bcrypt.compare(plain, this.password);
};

export default mongoose.models.User || mongoose.model('User', userSchema);
