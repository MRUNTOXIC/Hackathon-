import Submission from '../models/Submission';

const isConnectionError = (error: any) => {
  const message = error?.message || error?.toString() || '';
  return /authentication|bad auth|ECONN|ENOTFOUND|topology|connect|buffering timed out|buffering|timed out|MONGO_URI|operation/i.test(message);
};

export const submitProject = async (teamId: string | null, body: any) => {
  try {
    const { github, demo, presentation, description } = body;
    if (!teamId) throw new Error('You are not in a team');

    const existing = await Submission.findOne({ teamId });
    if (existing) {
      existing.github = github;
      existing.demo = demo;
      existing.presentation = presentation;
      existing.description = description;
      existing.submittedAt = new Date();
      await existing.save();
      return existing;
    }

    const submission = await Submission.create({ teamId, github, demo, presentation, description });
    return submission;
  } catch (error) {
    if (!isConnectionError(error)) throw error;
    return null;
  }
};

export const getSubmission = async (teamId: string | null) => {
  try {
    if (!teamId) throw new Error('Not in a team');
    const submission = await Submission.findOne({ teamId });
    return submission || null;
  } catch (error) {
    if (!isConnectionError(error)) throw error;
    return null;
  }
};
