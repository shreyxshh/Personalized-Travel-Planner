import { Router } from 'express';
import { getHealth, getAiHealth, getReadiness } from '../controllers/healthController.js';

export const healthRoutes = Router();

healthRoutes.get('/health', getHealth);
healthRoutes.get('/ready', getReadiness);
healthRoutes.get('/api/v1/health', getHealth);
healthRoutes.get('/api/v1/health/ai', getAiHealth);
healthRoutes.get('/api/v1/ready', getReadiness);
