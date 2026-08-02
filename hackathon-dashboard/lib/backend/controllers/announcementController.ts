import Announcement from '../models/Announcement';

const isConnectionError = (error: any) => {
  const message = error?.message || error?.toString() || '';
  return /authentication|bad auth|ECONN|ENOTFOUND|topology|connect/i.test(message);
};

export const getAnnouncements = async () => {
  try {
    const announcements = await Announcement.find().sort({ createdAt: -1 }).limit(20);
    return announcements;
  } catch (error) {
    if (!isConnectionError(error)) throw error;
    return [];
  }
};
