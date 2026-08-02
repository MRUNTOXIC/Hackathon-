import jwt from 'jsonwebtoken';

export const generateToken = (id: any) => {
  const JWT_SECRET = process.env.JWT_SECRET || 'atlas_only_secret_2026_hackathon';
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: '7d' });
};

export const generateAdminToken = (id: any) => {
  const JWT_SECRET = process.env.JWT_SECRET || 'atlas_only_secret_2026_hackathon';
  return jwt.sign({ id, role: 'admin' }, JWT_SECRET, { expiresIn: '7d' });
};
