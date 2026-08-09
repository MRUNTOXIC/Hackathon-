import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'atlas_only_secret_2026_hackathon';

export const generateToken = (id: any, user?: Record<string, unknown>) => {
  return jwt.sign({ id, user }, JWT_SECRET, { expiresIn: '7d' });
};

export const generateAdminToken = (id: any, user?: Record<string, unknown>) => {
  return jwt.sign({ id, role: 'admin', user }, JWT_SECRET, { expiresIn: '7d' });
};
