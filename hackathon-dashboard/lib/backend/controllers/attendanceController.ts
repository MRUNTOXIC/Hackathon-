import Attendance from '../models/Attendance';
import User from '../models/User';
import mongoose from 'mongoose';

export const markAttendance = async (body: any) => {
  const { userId, round, status } = body;
  if (!userId || !round) throw new Error('Missing fields');

  const UserModel = mongoose.models.User || User;
  const user = await UserModel.findById(userId);
  if (!user) throw new Error('User not found');

  const attendance = await Attendance.findOneAndUpdate(
    { user: userId, round },
    { user: userId, userId, status: status || 'present' },
    { upsert: true, new: true }
  );
  return {
    ok: true,
    message: `Marked ${user.name} as ${status || 'present'} for ${round}`,
    attendance,
  };
};

export const getAllAttendance = async () => {
  const UserModel = mongoose.models.User || User;

  // Fetch all raw attendance docs from the collection directly
  const db = mongoose.connection.db;
  if (!db) throw new Error('No DB connection');

  const rawDocs = await db.collection('attendances').find({}).sort({ createdAt: -1 }).toArray();

  // Collect all unique userId values (may be ObjectId or registrationNumber string)
  const userIdValues = [...new Set(rawDocs.map((d: any) => d.userId || d.user).filter(Boolean))];

  // Separate ObjectId-like values from registration number strings
  const objectIdValues: mongoose.Types.ObjectId[] = [];
  const regNumbers: string[] = [];

  for (const v of userIdValues) {
    const str = v.toString();
    if (mongoose.Types.ObjectId.isValid(str) && str.length === 24) {
      objectIdValues.push(new mongoose.Types.ObjectId(str));
    } else {
      regNumbers.push(str);
    }
  }

  // Fetch matching users in one query
  const users = await UserModel.find({
    $or: [
      ...(objectIdValues.length ? [{ _id: { $in: objectIdValues } }] : []),
      ...(regNumbers.length ? [{ registrationNumber: { $in: regNumbers } }] : []),
    ],
  }).select('name email registrationNumber department').lean();

  // Build lookup maps
  const byId: Record<string, any> = {};
  const byReg: Record<string, any> = {};
  for (const u of users) {
    byId[(u._id as any).toString()] = u;
    if (u.registrationNumber) byReg[u.registrationNumber] = u;
  }

  // Attach user info to each attendance record
  const enriched = rawDocs.map((doc: any) => {
    const rawUserId = (doc.userId || doc.user || '').toString();
    const userDoc =
      byId[rawUserId] ||
      byReg[rawUserId] ||
      null;

    return {
      _id: doc._id,
      user: userDoc,
      round: doc.round,
      status: doc.status || 'present',
      markedBy: doc.volunteer || doc.markedBy || 'Scanner App',
      createdAt: doc.timestamp || doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  });

  return enriched;
};

export const getAttendanceStats = async () => {
  const db = mongoose.connection.db;
  if (!db) throw new Error('No DB connection');

  const stats = await db.collection('attendances').aggregate([
    { $group: { _id: '$round', count: { $sum: 1 } } },
  ]).toArray();

  return stats;
};
