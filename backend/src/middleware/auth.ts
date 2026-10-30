import { Request, Response, NextFunction } from 'express';
import { config } from '../config/index.js';
import { createClient } from '@supabase/supabase-js';
import { verifyToken } from '../controllers/authController.js';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email?: string;
    displayName?: string;
  };
}

let supabaseClient: any = null;
if (config.supabase.isConfigured && config.supabase.url && config.supabase.anonKey) {
  supabaseClient = createClient(config.supabase.url, config.supabase.anonKey);
}

export const authenticate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;

  // Demo user fallback when testing or without active token
  const defaultDemoUser = {
    id: '00000000-0000-0000-0000-000000000001',
    email: 'traveler@voyex.app',
    displayName: 'Demo Explorer',
  };

  if (!token || token === 'demo-token') {
    req.user = defaultDemoUser;
    return next();
  }

  // 1. Check local JWT signature
  const localPayload = verifyToken(token);
  if (localPayload && localPayload.sub) {
    req.user = {
      id: localPayload.sub,
      email: localPayload.email,
      displayName: localPayload.name || localPayload.email?.split('@')[0],
    };
    return next();
  }

  // 2. Check Supabase token if Supabase is configured
  if (supabaseClient) {
    try {
      const { data: { user }, error } = await supabaseClient.auth.getUser(token);
      if (!error && user) {
        req.user = {
          id: user.id,
          email: user.email,
          displayName: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0],
        };
        return next();
      }
    } catch {
      // Fallback below
    }
  }

  req.user = defaultDemoUser;
  next();
};
