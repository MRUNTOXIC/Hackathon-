import Attendance from '../models/Attendance';
import User from '../models/User';
import mongoose from 'mongoose';

export const markAttendance = async (body: any) => {
  const { userId, round, status } = body;
  if (!userId || !round) throw new Error('Missing fields');

  // Ensure database connection and model registration
  const UserModel = mongoose.models.User || User;
  const user = await UserModel.findById(userId);
  if (!user) throw new Error('User not found');

  const attendance = await Attendance.findOneAndUpdate(
    { user: userId, round },
    { status: status || 'present' },
    { upsert: true, new: true }
  );

  return { ok: true, message: `Marked ${user.name} as ${status || 'present'} for ${round}`, attendance };
};

export const getAllAttendance = async () => {
  // Ensure User model is registered before population
  const _ensureUser = mongoose.models.User || User;

  const records = await Attendance.find()
    .populate('user', 'name registrationNumber email department')
    .sort({ createdAt: -1 });
  return records;
};

export const getAttendanceStats = async () => {
  const stats = await Attendance.aggregate([
    { $group: { _id: "$round", count: { $sum: 1 } } }
  ]);
  return stats;
};
