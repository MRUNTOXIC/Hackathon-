import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema(
  {
    teamId: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true, unique: true },
    github: { type: String, required: true },
    demo: { type: String, default: '' },
    presentation: { type: String, default: '' },
    description: { type: String, required: true },
    submittedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.models.Submission || mongoose.model('Submission', submissionSchema);
