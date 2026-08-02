import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import User from './models/User';
import connectDB from './db';
import { findFallbackUserById } from './controllers/authController';

export async function getAuthUser(req: NextRequest) {
  const JWT_SECRET = process.env.JWT_SECRET || 'atlas_only_secret_2026_hackathon';
  const token = req.cookies.get('token')?.value || req.headers.get('authorization')?.split(' ')[1];

  if (!token) return null;

  let decoded: { id: string } | null = null;

  try {
    decoded = jwt.verify(token, JWT_SECRET) as { id: string };
  } catch (err) {
    return null;
  }

  try {
    await connectDB();
  } catch (error: any) {
    console.warn('Database unavailable while resolving auth user, using fallback store:', error?.message || error);
    return findFallbackUserById(decoded.id);
  }

  try {
    const user = await User.findById(decoded.id).select('-password');
    return user;
  } catch (err) {
    return null;
  }
}

export async function getAuthAdmin(req: NextRequest) {
  const JWT_SECRET = process.env.JWT_SECRET || 'atlas_only_secret_2026_hackathon';
  const token = req.cookies.get('adminToken')?.value || req.headers.get('authorization')?.split(' ')[1];

  if (!token) return null;

  let decoded: { id: string, role: string } | null = null;

  try {
    decoded = jwt.verify(token, JWT_SECRET) as { id: string, role: string };
  } catch (err) {
    return null;
  }

  if (decoded.role !== 'admin') return null;

  try {
    await connectDB();
  } catch (error: any) {
    console.warn('Database unavailable while resolving admin auth, using fallback store:', error?.message || error);
    return decoded;
  }

  return decoded;
}
