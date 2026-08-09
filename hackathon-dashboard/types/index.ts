export interface User {
  _id: string;
  name: string;
  email: string;
  registrationNumber: string;
  phone: string;
  department: string;
  year: string;
  role: 'leader' | 'member';
  teamId: string | null;
  internetCredentialId: string | null;
  verified: boolean;
  createdAt: string;
}

export interface Team {
  _id: string;
  teamNumber: string;
  teamName: string;
  leaderId: { _id: string; name: string; email: string };
  members: { _id: string; name: string; email: string; registrationNumber: string; department: string }[];
  projectTrack: string;
  problemStatement: string;
  department: string;
  status: 'active' | 'submitted' | 'disqualified';
}

export interface Invitation {
  _id: string;
  teamId: { _id: string; teamName: string; teamNumber: string; projectTrack: string };
  sender: { _id: string; name: string; email: string };
  receiver: { _id: string; name: string; email: string; registrationNumber: string } | string;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: string;
}

export interface Announcement {
  _id: string;
  title: string;
  content: string;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
}

export interface Submission {
  _id: string;
  teamId: string;
  github: string;
  demo: string;
  presentation: string;
  description: string;
  submittedAt: string;
}

export interface JudgeScore {
  _id: string;
  team: string | { _id: string; teamName: string; teamNumber: string };
  judgeName: string;
  round: 'Round 1' | 'Round 2';
  scores: Record<string, number>;
  comments?: string;
  suggestions?: string;
  createdAt: string;
}
