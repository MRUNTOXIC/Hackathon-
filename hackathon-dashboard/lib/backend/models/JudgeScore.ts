import mongoose from 'mongoose';

const judgeScoreSchema = new mongoose.Schema({
  team: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
  judgeName: { type: String, required: true },
  round: { type: String, enum: ['Round 1', 'Round 2'], default: 'Round 1' },
  scores: { type: Map, of: Number, required: true },
  comments: { type: String },
  suggestions: { type: String },
}, { timestamps: true });

export default mongoose.models.JudgeScore || mongoose.model('JudgeScore', judgeScoreSchema);
