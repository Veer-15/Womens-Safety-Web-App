import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../db.ts';
import { JWT_SECRET, requireAuth, AuthenticatedRequest } from '../middleware/auth.ts';
import { User } from '../types.ts';

export const authRouter = Router();

// Helper to remove passwordHash from returned payload
function sanitizeUser(user: User) {
  const { passwordHash: _, ...safe } = user;
  return safe;
}

// POST /api/auth/signup
authRouter.post('/signup', async (req, res): Promise<void> => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !phone || !password) {
      res.status(400).json({ error: 'Name, email, phone, and password are required' });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({ error: 'Password must be at least 6 characters long' });
      return;
    }

    const existing = db.getUserByEmail(email);
    if (existing) {
      res.status(409).json({ error: 'An account with this email already exists' });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser: User = {
      id: `user_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      passwordHash,
      permissions: {
        locationGranted: true,
        smsAcknowledged: true,
      },
      createdAt: new Date().toISOString(),
    };

    db.createUser(newUser);

    const token = jwt.sign({ userId: newUser.id, email: newUser.email }, JWT_SECRET, {
      expiresIn: '7d',
    });

    res.status(201).json({
      message: 'Account created successfully',
      token,
      user: sanitizeUser(newUser),
    });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ error: 'Internal server error during registration' });
  }
});

// POST /api/auth/login
authRouter.post('/login', async (req, res): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required' });
      return;
    }

    const user = db.getUserByEmail(email);
    if (!user) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: '7d',
    });

    res.json({
      message: 'Logged in successfully',
      token,
      user: sanitizeUser(user),
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error during login' });
  }
});



// GET /api/auth/me
authRouter.get('/me', requireAuth, (req: AuthenticatedRequest, res: Response): void => {
  if (!req.user) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  res.json({ user: sanitizeUser(req.user) });
});

// PATCH /api/auth/permissions
authRouter.patch('/permissions', requireAuth, (req: AuthenticatedRequest, res: Response): void => {
  if (!req.user) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const { locationGranted, smsAcknowledged } = req.body;
  const updated = db.updateUserPermissions(req.user.id, {
    locationGranted: typeof locationGranted === 'boolean' ? locationGranted : req.user.permissions.locationGranted,
    smsAcknowledged: typeof smsAcknowledged === 'boolean' ? smsAcknowledged : req.user.permissions.smsAcknowledged,
  });

  if (!updated) {
    res.status(404).json({ error: 'User not found' });
    return;
  }

  res.json({ user: sanitizeUser(updated) });
});
