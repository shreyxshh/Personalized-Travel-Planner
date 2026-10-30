import { Request, Response } from 'express';
import { aiService } from '../services/ai/AIService.js';
import { routingService } from '../services/routing/RoutingService.js';
import { dbService } from '../services/db/DatabaseService.js';

export const getHealth = (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    app: 'Voyex - Autonomous AI Travel Planner',
    timestamp: new Date().toISOString(),
    backend_mode: dbService.getBackendType(),
    active_ai_provider: aiService.getActiveProviderName(),
    active_routing_provider: routingService.getProviderName(),
  });
};

export const getReadiness = (req: Request, res: Response) => {
  res.json({
    status: 'ready',
    database: dbService.getBackendType(),
    ai_provider: aiService.getActiveProviderName(),
    routing: routingService.getProviderName(),
  });
};

export const getAiHealth = (req: Request, res: Response) => {
  res.json({
    active_provider: aiService.getActiveProviderName(),
    routing_provider: routingService.getProviderName(),
    features: {
      budget_estimation: true,
      route_optimization: true,
      day_regeneration: true,
      multi_format_export: true,
      free_tier_friendly: true,
    },
  });
};
