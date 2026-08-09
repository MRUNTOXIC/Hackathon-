import mongoose from 'mongoose';

const teamSchema = new mongoose.Schema(
  {
    teamNumber: { type: String, required: true, unique: true },
    teamName: { type: String, required: true, trim: true },
    leaderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    projectTrack: { type: String, required: true },
    department: { type: String, default: '' },
    status: { type: String, enum: ['active', 'submitted', 'disqualified'], default: 'active' },
  },
  { timestamps: true }
);

export default mongoose.models.Team || mongoose.model('Team', teamSchema);
