import Submission from '../models/Submission';

export const submitProject = async (teamId: string | null, body: any) => {
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
};

export const getSubmission = async (teamId: string | null) => {
  if (!teamId) throw new Error('Not in a team');
  const submission = await Submission.findOne({ teamId });
  return submission || null;
};
