import { NextRequest, NextResponse } from 'next/server';
import { getAuthAdmin } from '@/lib/backend/auth';
import User from '@/lib/backend/models/User';

export async function GET(req: NextRequest) {
  const admin = await getAuthAdmin(req);
  if (!admin) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  try {
    const users = await User.find({})
      .select('-password')
      .populate('teamId', 'teamName teamNumber projectTrack');

    const csvContent = [
      ['Name', 'Email', 'Registration Number', 'Phone', 'Department', 'Role', 'Team Name', 'Team Number', 'Project Track'].join(','),
      ...users.map((u: any) => [
        `"${u.name}"`,
        `"${u.email}"`,
        `"${u.registrationNumber}"`,
        `"${u.phone}"`,
        `"${u.department || ''}"`,
        `"${u.role}"`,
        `"${u.teamId?.teamName || 'No Team'}"`,
        `"${u.teamId?.teamNumber || ''}"`,
        `"${u.teamId?.projectTrack || ''}"`,
      ].join(','))
    ].join('\n');

    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="participants.csv"',
      },
    });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
