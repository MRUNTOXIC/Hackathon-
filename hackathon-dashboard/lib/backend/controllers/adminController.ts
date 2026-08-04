import Admin from '../models/Admin';
import User from '../models/User';
import Team from '../models/Team';
import InternetCredential from '../models/InternetCredential';
import Announcement from '../models/Announcement';
import mongoose from 'mongoose';
import { generateAdminToken } from '../utils/token';

export const adminLogin = async (body: any) => {
  const { username, password } = body;
  const admin = await Admin.findOne({ username });
  if (!admin || !(await (admin as any).comparePassword(password)))
    throw new Error('Incorrect username or password');

  const token = generateAdminToken(admin._id);
  return { token, admin: { id: admin._id, username: admin.username } };
};

export const getStats = async () => {
  const Attendance = mongoose.models.Attendance || mongoose.model('Attendance');
  const [totalUsers, totalTeams, checkedIn] = await Promise.all([
    User.countDocuments(),
    Team.countDocuments(),
    Attendance.countDocuments({ round: 'Registration', status: 'present' }),
  ]);
  return {
    totalUsers,
    totalTeams,
    totalLeaders: await User.countDocuments({ role: 'leader' }),
    totalMembers: await User.countDocuments({ role: 'member' }),
    checkedIn,
    pending: totalUsers - checkedIn
  };
};

export const getAllParticipants = async () => {
  const users = await User.find({})
    .select('-password')
    .populate('teamId', 'teamName teamNumber projectTrack problemStatement');
  return users;
};

export const getAllTeams = async () => {
  const teams = await Team.find({})
    .populate('leaderId', 'name email registrationNumber')
    .populate('members', 'name email registrationNumber department')
    .sort({ createdAt: -1 });
  return teams;
};

export const getParticipantById = async (id: string) => {
  const user = await User.findById(id)
    .select('-password')
    .populate('teamId', 'teamName teamNumber projectTrack problemStatement');
  if (!user) throw new Error('Participant not found');

  const Attendance = mongoose.models.Attendance || mongoose.model('Attendance');
  const attendance = await Attendance.find({ user: id });

  return { user, attendance };
};

export const uploadPasswords = async (body: any) => {
  const { passwords } = body;
  if (!Array.isArray(passwords) || passwords.length === 0)
    throw new Error('No password data provided');

  let updated = 0;
  const notFound = [];

  for (const entry of passwords) {
    const { registrationNumber, internetId, internetPassword } = entry;
    if (!internetPassword) continue;
    const user = await User.findOne({ registrationNumber });
    if (!user) { notFound.push(registrationNumber); continue; }

    const cred = await InternetCredential.findOneAndUpdate(
      { userId: user._id },
      { internetId: internetId || registrationNumber, internetPassword },
      { upsert: true, new: true }
    );
    await User.findByIdAndUpdate(user._id, { internetCredentialId: cred._id });
    updated++;
  }

  return { updated, notFound, total: passwords.length };
};

export const createAnnouncement = async (body: any) => {
  const { title, content, priority } = body;
  if (!title || !content) throw new Error('Title and content required');
  const ann = await Announcement.create({ title, content, priority: priority || 'medium' });
  return ann;
};

export const getAnnouncements = async () => {
  const announcements = await Announcement.find().sort({ createdAt: -1 });
  return announcements;
};

export const deleteAnnouncement = async (id: string) => {
  await Announcement.findByIdAndDelete(id);
  return { message: 'Deleted' };
};

export const deleteReview = async (id: string) => {
  await (mongoose.models.JudgeScore || mongoose.model('JudgeScore')).findByIdAndDelete(id);
  return { message: 'Review deleted' };
};

export const deleteUser = async (id: string) => {
  const user = await User.findById(id);
  if (!user) throw new Error('User not found');
  await InternetCredential.deleteOne({ userId: user._id });
  if (user.teamId) {
    await Team.findByIdAndUpdate(user.teamId, { $pull: { members: user._id } });
  }
  await User.findByIdAndDelete(id);
  return { message: 'User deleted' };
};
