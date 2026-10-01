import type { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import type { User, UserRole } from '../src/types/index.js';
import { getDatabase } from './db.js';

const JWT_SECRET = process.env.ADMIN_JWT_SECRET || 'digital-hashtag-secure-secret-token-key-2026';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    name: string;
    role: UserRole;
  };
}

export function hashPassword(pass: string): string {
  return crypto.createHash('sha256').update(pass + 'dh_salt_2026').digest('hex');
}

export function generateToken(user: User): string {
  const payload = {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 days
  };
  const data = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto.createHmac('sha256', JWT_SECRET).update(data).digest('base64url');
  return `${data}.${signature}`;
}

export function verifyToken(token: string): { id: string; email: string; name: string; role: UserRole } | null {
  try {
    const [data, signature] = token.split('.');
    if (!data || !signature) return null;

    const expectedSig = crypto.createHmac('sha256', JWT_SECRET).update(data).digest('base64url');
    if (signature !== expectedSig) return null;

    const payload = JSON.parse(Buffer.from(data, 'base64url').toString('utf-8'));
    if (payload.exp && Date.now() > payload.exp) {
      return null;
    }
    return {
      id: payload.id,
      email: payload.email,
      name: payload.name,
      role: payload.role
    };
  } catch {
    return null;
  }
}

export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Authentication required. Please sign in.' });
    return;
  }

  const token = authHeader.substring(7);
  const user = verifyToken(token);
  if (!user) {
    res.status(401).json({ error: 'Invalid or expired authentication session.' });
    return;
  }

  req.user = user;
  next();
}

export function requireRole(allowedRoles: UserRole[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required.' });
      return;
    }
    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({ error: `Forbidden. Role '${req.user.role}' lacks sufficient permissions.` });
      return;
    }
    next();
  };
}

export function verifyCredentials(email: string, pass: string): (User & { isDefaultPassword?: boolean }) | null {
  const db = getDatabase();
  const normalizedEmail = email.trim().toLowerCase();
  const user = db.users.find(u => u.email.toLowerCase() === normalizedEmail);

  if (!user) return null;

  // If user has a custom passwordHash stored in database
  if (user.passwordHash) {
    const candidateHash = hashPassword(pass);
    if (user.passwordHash === candidateHash) {
      return {
        ...user,
        isDefaultPassword: user.isDefaultPassword ?? false
      };
    }
    return null;
  }

  // Fallback to default seeded credentials
  if (normalizedEmail === 'admin@digitalhashtag.in' && pass === 'DigitalHashtag2026!') {
    return {
      ...user,
      isDefaultPassword: true
    };
  }
  if (normalizedEmail === 'editor@digitalhashtag.in' && pass === 'EditorPass2026!') {
    return {
      ...user,
      isDefaultPassword: true
    };
  }

  return null;
}
