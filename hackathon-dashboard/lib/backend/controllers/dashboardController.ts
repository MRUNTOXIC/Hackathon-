import User from '../models/User';
import Team from '../models/Team';
import JudgeScore from '../models/JudgeScore';
import Invitation from '../models/Invitation';

const isConnectionError = (error: any) => {
  const message = error?.message || error?.toString() || '';
  return /authentication|bad auth|ECONN|ENOTFOUND|topology|connect/i.test(message);
};

export const getDashboard = async (userId: string) => {
  try {
    const user = await User.findById(userId).select('-password');
    if (!user) throw new Error('User not found');

    let team = null;
    let judgeScores = [];
    let pendingInvitations = [];
    let incomingInvitations = [];

    if (user.teamId) {
      team = await Team.findById(user.teamId)
        .populate('leaderId', 'name email')
        .populate('members', 'name email registrationNumber department');

      judgeScores = await JudgeScore.find({ team: user.teamId }).sort({ createdAt: -1 });

      pendingInvitations = await Invitation.find({ teamId: user.teamId, status: 'pending' })
        .populate('receiver', 'name email registrationNumber');
    } else {
      incomingInvitations = await Invitation.find({ receiver: userId, status: 'pending' })
        .populate('teamId', 'teamName teamNumber projectTrack')
        .populate('sender', 'name email');
    }

    return { user, team, judgeScores, pendingInvitations, incomingInvitations };
  } catch (error) {
    if (!isConnectionError(error)) throw error;

    return {
      user: {
        _id: userId,
        id: userId,
        name: 'Local User',
        email: '',
        registrationNumber: '',
        phone: '',
        department: '',
        role: 'member',
        teamId: null,
        internetCredentialId: null,
      },
      team: null,
      judgeScores: [],
      pendingInvitations: [],
      incomingInvitations: [],
    };
  }
};

export const getProfile = async (userId: string) => {
  try {
    const user = await User.findById(userId).select('-password');
    return user;
  } catch (error) {
    if (!isConnectionError(error)) throw error;
    return {
      _id: userId,
      id: userId,
      name: 'Local User',
      email: '',
      registrationNumber: '',
      phone: '',
      department: '',
      role: 'member',
      teamId: null,
      internetCredentialId: null,
    };
  }
};

export const updateProfile = async (userId: string, body: any) => {
  try {
    const { name, phone, department, year } = body;
    const user = await User.findByIdAndUpdate(
      userId,
      { name, phone, department, year },
      { new: true }
    ).select('-password');
    return user;
  } catch (error) {
    if (!isConnectionError(error)) throw error;
    return {
      _id: userId,
      id: userId,
      name: body?.name || 'Local User',
      phone: body?.phone || '',
      department: body?.department || '',
      year: body?.year || '',
      role: 'member',
      teamId: null,
      internetCredentialId: null,
    };
  }
};
