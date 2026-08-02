import Attendance from '../models/Attendance';
import User from '../models/User';

export const markAttendance = async (body: any) => {
  const { userId, round, status } = body;
  if (!userId || !round) throw new Error('Missing fields');

  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');

  const attendance = await Attendance.findOneAndUpdate(
    { user: userId, round },
    { status: status || 'present' },
    { upsert: true, new: true }
  );

  return { ok: true, message: `Marked ${user.name} as ${status || 'present'} for ${round}`, attendance };
};

export const getAllAttendance = async () => {
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
