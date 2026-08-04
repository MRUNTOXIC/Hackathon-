import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/backend/auth';
import { getProfile, updateProfile } from '@/lib/backend/controllers/dashboardController';

export async function GET(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  try {
    const data = await getProfile(user._id);
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({
      _id: user._id,
      id: user._id,
      name: user.name || 'User',
      email: user.email || '',
      registrationNumber: user.registrationNumber || '',
      phone: '',
      department: user.department || '',
      year: '',
      role: user.role || 'member',
      teamId: user.teamId || null,
      internetCredentialId: user.internetCredentialId || null,
      verified: false,
      createdAt: new Date().toISOString(),
    });
  }
}

export async function PUT(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  let body: any = {};

  try {
    body = await req.json();
    const data = await updateProfile(user._id, body);
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({
      _id: user._id,
      id: user._id,
      name: body?.name || user.name || 'User',
      email: user.email || '',
      registrationNumber: user.registrationNumber || '',
      phone: body?.phone || '',
      department: body?.department || user.department || '',
      year: body?.year || '',
      role: user.role || 'member',
      teamId: user.teamId || null,
      internetCredentialId: user.internetCredentialId || null,
      verified: false,
      createdAt: new Date().toISOString(),
    });
  }
}
