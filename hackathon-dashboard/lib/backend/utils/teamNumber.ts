import Team from '../models/Team';

export const generateTeamNumber = async () => {
  const count = await Team.countDocuments();
  return `T${String(count + 1).padStart(3, '0')}`;
};
