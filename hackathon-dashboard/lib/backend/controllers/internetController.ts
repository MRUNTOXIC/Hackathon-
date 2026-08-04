import InternetCredential from '../models/InternetCredential';
import User from '../models/User';

const isConnectionError = (error: any) => {
  const message = error?.message || error?.toString() || '';
  return /authentication|bad auth|ECONN|ENOTFOUND|topology|connect|buffering timed out|buffering|timed out|MONGO_URI|operation/i.test(message);
};

export const getInternetCredential = async (userId: string) => {
  try {
    const cred = await InternetCredential.findOne({ userId });
    if (!cred) throw new Error('No credentials found');
    return { internetId: cred.internetId };
  } catch (error) {
    if (!isConnectionError(error)) throw error;
    return { internetId: `HK_${userId}` };
  }
};

export const revealPassword = async (userId: string, body: any) => {
  try {
    const { password } = body;
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');

    const valid = await (user as any).comparePassword(password);
    if (!valid) throw new Error('Incorrect password');

    const cred = await InternetCredential.findOne({ userId });
    if (!cred) throw new Error('No credentials found');
    return { internetPassword: cred.internetPassword };
  } catch (error) {
    if (!isConnectionError(error)) throw error;
    return { internetPassword: 'Unavailable while database auth is failing' };
  }
};
