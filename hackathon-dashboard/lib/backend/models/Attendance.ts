import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  round: {
    type: String,
    required: true,
    enum: ['Registration', 'Round 1', 'Round 2']
  },
  status: { type: String, enum: ['present', 'absent'], default: 'present' },
  markedBy: { type: String, default: 'Scanner App' },
}, { timestamps: true });

attendanceSchema.index({ user: 1, round: 1 }, { unique: true });

export default mongoose.models.Attendance || mongoose.model('Attendance', attendanceSchema);
