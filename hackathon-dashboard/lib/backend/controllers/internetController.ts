import InternetCredential from '../models/InternetCredential';
import User from '../models/User';

export const getInternetCredential = async (userId: string) => {
  const cred = await InternetCredential.findOne({ userId });
  if (!cred) throw new Error('No credentials found');
  return { internetId: cred.internetId };
};

export const revealPassword = async (userId: string, body: any) => {
  const { password } = body;
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');

  const valid = await (user as any).comparePassword(password);
  if (!valid) throw new Error('Incorrect password');

  const cred = await InternetCredential.findOne({ userId });
  if (!cred) throw new Error('No credentials found');
  return { internetPassword: cred.internetPassword };
};
