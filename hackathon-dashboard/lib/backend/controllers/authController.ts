import bcrypt from 'bcrypt';
import User from '../models/User';
import Team from '../models/Team';
import InternetCredential from '../models/InternetCredential';
import { generateTeamNumber } from '../utils/teamNumber';
import { generateToken } from '../utils/token';

const fallbackUsers = new Map<string, any>();
const fallbackTeams = new Map<string, any>();
const fallbackCredentials = new Map<string, any>();
let fallbackIdCounter = 0;

const createFallbackId = () => {
  fallbackIdCounter += 1;
  return `fallback-${Date.now()}-${fallbackIdCounter}`;
};

const isConnectionError = (error: any) => {
  const message = error?.message || error?.toString() || '';
  return /authentication|bad auth|ECONN|ENOTFOUND|topology|connect|buffering timed out|buffering|timed out|MONGO_URI|operation/i.test(message);
};

const toSafeUser = (user: any) => {
  if (!user) return null;
  // Convert Mongoose document to plain object and remove password
  const obj = user.toObject ? user.toObject() : { ...user };
  delete obj.password;
  delete obj.__v;
  return obj;
};

const registerLeaderFallback = async (body: any) => {
  const { name, email, password, registrationNumber, phone, teamName, projectTrack, problemStatement, department } = body;
  const normalizedEmail = email.toLowerCase().trim();
  const hashedPassword = await bcrypt.hash(password, 12);
  const normalizedRegistrationNumber = registrationNumber.trim();
  const existingEmailUser = Array.from(fallbackUsers.values()).find((user) => user.email === normalizedEmail);
  const existingRegistrationNumberUser = Array.from(fallbackUsers.values()).find((user) => user.registrationNumber === normalizedRegistrationNumber);
  const existingTeamName = Array.from(fallbackTeams.values()).some((team) => team.teamName?.toLowerCase() === teamName?.toLowerCase());

  if (existingEmailUser && existingRegistrationNumberUser) {
    const token = generateToken(existingEmailUser._id, toSafeUser(existingEmailUser));
    return { token, user: toSafeUser(existingEmailUser) };
  }
  if (existingEmailUser) throw new Error('Email already registered');
  if (existingRegistrationNumberUser) throw new Error('Registration number already registered');
  if (existingTeamName) throw new Error('Team name already taken');

  const teamNumber = `T${String(fallbackTeams.size + 1).padStart(3, '0')}`;
  const userId = createFallbackId();
  const teamId = createFallbackId();
  const credentialId = createFallbackId();

  const user = {
    _id: userId,
    id: userId,
    name,
    email: normalizedEmail,
    password: hashedPassword,
    registrationNumber: normalizedRegistrationNumber,
    phone,
    department: department || '',
    role: 'leader',
    teamId,
    internetCredentialId: credentialId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const team = {
    _id: teamId,
    id: teamId,
    teamNumber,
    teamName,
    leaderId: userId,
    members: [userId],
    projectTrack,
    problemStatement,
    department: department || '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const credential = {
    _id: credentialId,
    id: credentialId,
    userId,
    internetId: `HK_${normalizedRegistrationNumber}`,
    internetPassword: `Pass@${Math.random().toString(36).slice(2, 10)}`,
  };

  fallbackUsers.set(userId, user);
  fallbackTeams.set(teamId, team);
  fallbackCredentials.set(credentialId, credential);

  const token = generateToken(userId, toSafeUser(user));
  return { token, user: toSafeUser(user) };
};

const registerMemberFallback = async (body: any) => {
  const { name, email, password, registrationNumber, phone, department } = body;
  const normalizedEmail = email.toLowerCase().trim();
  const hashedPassword = await bcrypt.hash(password, 12);
  const normalizedRegistrationNumber = registrationNumber.trim();
  const existingEmailUser = Array.from(fallbackUsers.values()).find((user) => user.email === normalizedEmail);
  const existingRegistrationNumberUser = Array.from(fallbackUsers.values()).find((user) => user.registrationNumber === normalizedRegistrationNumber);

  if (existingEmailUser && existingRegistrationNumberUser) {
    const token = generateToken(existingEmailUser._id, toSafeUser(existingEmailUser));
    return { token, user: toSafeUser(existingEmailUser) };
  }
  if (existingEmailUser) throw new Error('Email already registered');
  if (existingRegistrationNumberUser) throw new Error('Registration number already registered');

  const userId = createFallbackId();
  const credentialId = createFallbackId();
  const user = {
    _id: userId,
    id: userId,
    name,
    email: normalizedEmail,
    password: hashedPassword,
    registrationNumber: normalizedRegistrationNumber,
    phone,
    department: department || '',
    role: 'member',
    teamId: null,
    internetCredentialId: credentialId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const credential = {
    _id: credentialId,
    id: credentialId,
    userId,
    internetId: `HK_${normalizedRegistrationNumber}`,
    internetPassword: `Pass@${Math.random().toString(36).slice(2, 10)}`,
  };

  fallbackUsers.set(userId, user);
  fallbackCredentials.set(credentialId, credential);

  const token = generateToken(userId, toSafeUser(user));
  return { token, user: toSafeUser(user) };
};

export const findFallbackUserById = (id: string) => {
  return fallbackUsers.get(id) ? toSafeUser(fallbackUsers.get(id)) : null;
};

export const findFallbackUserByEmail = (email: string) => {
  const normalizedEmail = email.toLowerCase().trim();
  return Array.from(fallbackUsers.values()).find((user) => user.email === normalizedEmail) || null;
};

export const registerLeader = async (body: any) => {
  try {
    const { name, email, password, registrationNumber, phone, teamName, projectTrack, problemStatement, department } = body;

    if (await User.findOne({ email })) throw new Error('Email already registered');
    if (await User.findOne({ registrationNumber })) throw new Error('Registration number already registered');
    if (await Team.findOne({ teamName: { $regex: new RegExp(`^${teamName}$`, 'i') } })) throw new Error('Team name already taken');

    const teamNumber = await generateTeamNumber();

    const user = new User({ name, email: email.toLowerCase().trim(), password, registrationNumber, phone, department, role: 'leader' });
    await user.save();

    const team = await Team.create({ teamNumber, teamName, leaderId: user._id, members: [user._id], projectTrack, problemStatement, department });

    const cred = await InternetCredential.create({
      userId: user._id,
      internetId: `HK_${registrationNumber}`,
      internetPassword: `Pass@${Math.random().toString(36).slice(2, 10)}`,
    });

    user.teamId = team._id;
    user.internetCredentialId = cred._id;
    await user.save();

    const token = generateToken(user._id, toSafeUser(user));
    const fullUser = await User.findById(user._id).select('-password');
    return { token, user: fullUser };
  } catch (error) {
    if (!isConnectionError(error)) throw error;
    return registerLeaderFallback(body);
  }
};

export const registerMember = async (body: any) => {
  try {
    const { name, email, password, registrationNumber, phone, department } = body;

    if (await User.findOne({ email })) throw new Error('Email already registered');
    if (await User.findOne({ registrationNumber })) throw new Error('Registration number already registered');

    const user = new User({ name, email: email.toLowerCase().trim(), password, registrationNumber, phone, department, role: 'member' });
    await user.save();

    const cred = await InternetCredential.create({
      userId: user._id,
      internetId: `HK_${registrationNumber}`,
      internetPassword: `Pass@${Math.random().toString(36).slice(2, 10)}`,
    });

    user.internetCredentialId = cred._id;
    await user.save();

    const token = generateToken(user._id, toSafeUser(user));
    const fullUser = await User.findById(user._id).select('-password');
    return { token, user: fullUser };
  } catch (error) {
    if (!isConnectionError(error)) throw error;
    return registerMemberFallback(body);
  }
};

export const login = async (body: any) => {
  try {
    const { email, password } = body;
    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');
    if (!user) throw new Error('Incorrect email or password');

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new Error('Incorrect email or password');

    const token = generateToken(user._id, toSafeUser(user));
    const fullUser = await User.findById(user._id).select('-password');
    return { token, user: fullUser };
  } catch (error) {
    if (!isConnectionError(error)) throw error;
    const user = findFallbackUserByEmail(body.email);
    if (!user) throw new Error('Incorrect email or password');
    const match = await bcrypt.compare(body.password, user.password);
    if (!match) throw new Error('Incorrect email or password');
    const token = generateToken(user._id, toSafeUser(user));
    return { token, user: toSafeUser(user) };
  }
};
