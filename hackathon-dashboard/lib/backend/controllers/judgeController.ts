import JudgeScore from '../models/JudgeScore';
import Team from '../models/Team';

export const submitScore = async (body: any) => {
  const { teamId, judgeName, scores, comments, suggestions, round } = body;
  if (!teamId || !judgeName || !scores) throw new Error('Missing required fields');

  const team = await Team.findById(teamId);
  if (!team) throw new Error('Team not found');

  const scoreDoc = await JudgeScore.create({
    team: teamId,
    judgeName,
    scores,
    comments,
    suggestions,
    round: round || 'Round 1'
  });
  return { ok: true, id: scoreDoc._id };
};

export const getJudgeTeams = async (judgeName?: string) => {
  let query: any = {};
  if (judgeName) {
    const scoredTeams = await JudgeScore.find({ judgeName }).distinct('team');
    query = { _id: { $nin: scoredTeams } };
  }
  const teams = await Team.find(query, 'teamName teamNumber').sort({ teamName: 1 });
  return teams;
};

export const getAllScores = async () => {
  const docs = await JudgeScore.find().sort({ createdAt: -1 }).populate('team', 'teamName teamNumber');
  return docs;
};
