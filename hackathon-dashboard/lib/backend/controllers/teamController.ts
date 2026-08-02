import Team from '../models/Team';
import User from '../models/User';
import Invitation from '../models/Invitation';

export const getTeam = async (teamId: string | null) => {
  if (!teamId) return null;
  const team = await Team.findById(teamId)
    .populate('leaderId', 'name email registrationNumber')
    .populate('members', 'name email registrationNumber department');
  return team;
};

export const inviteMember = async (userId: string, teamId: string, email: string) => {
  const team = await Team.findById(teamId);
  if (!team || team.leaderId.toString() !== userId.toString())
    throw new Error('Only team leader can invite');

  // Check team capacity (Limit: 4 members total including pending invitations)
  const pendingInvites = await Invitation.countDocuments({ teamId, status: 'pending' });
  if (team.members.length + pendingInvites >= 4) {
    throw new Error('Team limit reached (Max 4 members including pending invites)');
  }

  const receiver = await User.findOne({ email });
  if (!receiver) throw new Error('User not found');
  if (receiver.teamId) throw new Error('User already in a team');

  const existing = await Invitation.findOne({ teamId: team._id, receiver: receiver._id, status: 'pending' });
  if (existing) throw new Error('Invitation already sent');

  const invitation = await Invitation.create({ teamId: team._id, sender: userId, receiver: receiver._id });
  return invitation;
};

export const acceptInvitation = async (userId: string, invitationId: string) => {
  const invitation = await Invitation.findById(invitationId);
  if (!invitation || invitation.receiver.toString() !== userId.toString())
    throw new Error('Not authorized');
  if (invitation.status !== 'pending') throw new Error('Invitation already handled');

  invitation.status = 'accepted';
  await invitation.save();

  const team = await Team.findById(invitation.teamId);
  if (team && team.members.length >= 4) {
    throw new Error('Team is already full (Max 4 members)');
  }

  await Team.findByIdAndUpdate(invitation.teamId, { $addToSet: { members: userId } });
  await User.findByIdAndUpdate(userId, { teamId: invitation.teamId, role: 'member' });

  return { message: 'Invitation accepted' };
};

export const declineInvitation = async (userId: string, invitationId: string) => {
  const invitation = await Invitation.findById(invitationId);
  if (!invitation || invitation.receiver.toString() !== userId.toString())
    throw new Error('Not authorized');

  invitation.status = 'declined';
  await invitation.save();
  return { message: 'Invitation declined' };
};

export const getInvitations = async (userId: string) => {
  const invitations = await Invitation.find({ receiver: userId, status: 'pending' })
    .populate('teamId', 'teamName teamNumber projectTrack')
    .populate('sender', 'name email');
  return invitations;
};

export const removeMember = async (userId: string, teamId: string, memberId: string) => {
  const team = await Team.findById(teamId);
  if (!team || team.leaderId.toString() !== userId.toString())
    throw new Error('Only leader can remove members');

  await Team.findByIdAndUpdate(team._id, { $pull: { members: memberId } });
  await User.findByIdAndUpdate(memberId, { teamId: null, role: 'member' });
  return { message: 'Member removed' };
};
