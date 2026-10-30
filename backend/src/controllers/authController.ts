import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import { tripRepository } from '../services/db/DatabaseService.js';
import { AppError } from '../middleware/errorHandler.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

const JWT_SECRET = process.env.SECRET_KEY || 'voyex-production-secret-key-32-bytes-long';

export const createToken = (payload: { sub: string; email: string; name?: string }): string => {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const now = Math.floor(Date.now() / 1000);
  const body = Buffer.from(
    JSON.stringify({
      ...payload,
      iat: now,
      exp: now + 86400 * 7, // 7 days
    })
  ).toString('base64url');

  const signature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(`${header}.${body}`)
    .digest('base64url');

  return `${header}.${body}.${signature}`;
};

export const verifyToken = (token: string): any | null => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const [header, body, signature] = parts;

    const expectedSignature = crypto
      .createHmac('sha256', JWT_SECRET)
      .update(`${header}.${body}`)
      .digest('base64url');

    if (signature !== expectedSignature) return null;

    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf-8'));
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
};

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, display_name, preferred_currency = 'USD' } = req.body;
    const existing = await tripRepository.getUserByEmail(email);
    if (existing) {
      throw new AppError(`An account with email '${email}' already exists.`, 409);
    }

    const userId = uuidv4();
    const name = display_name || email.split('@')[0];
    const newUser = {
      id: userId,
      email: email.toLowerCase().trim(),
      password,
      display_name: name,
      preferred_currency,
      created_at: new Date().toISOString(),
    };

    await tripRepository.registerUser(newUser);
    const token = createToken({ sub: userId, email: newUser.email, name });

    res.status(201).json({
      access_token: token,
      token_type: 'bearer',
      expires_in: 86400 * 7,
      user: {
        id: userId,
        email: newUser.email,
        display_name: name,
        preferred_currency,
        created_at: newUser.created_at,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const user = await tripRepository.getUserByEmail(email);

    if (!user || user.password !== password) {
      throw new AppError('Invalid email or password. Please verify credentials.', 401);
    }

    const token = createToken({
      sub: user.id,
      email: user.email,
      name: user.display_name || user.email.split('@')[0],
    });

    res.json({
      access_token: token,
      token_type: 'bearer',
      expires_in: 86400 * 7,
      user: {
        id: user.id,
        email: user.email,
        display_name: user.display_name || user.email.split('@')[0],
        preferred_currency: user.preferred_currency || 'USD',
        created_at: user.created_at,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new AppError('Unauthorized', 401);
    }

    const user = await tripRepository.getUserById(userId);
    res.json({
      id: userId,
      email: req.user?.email || user?.email,
      display_name: req.user?.displayName || user?.display_name,
      preferred_currency: user?.preferred_currency || 'USD',
      created_at: user?.created_at || new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
};
