import { Router } from 'express';
import {
  optimizeRoutes,
  scheduleRoutes,
  compareRoutes,
} from '../controllers/routesController.js';
import { authenticate } from '../middleware/auth.js';
import { validateBody } from '../middleware/validate.js';
import { routeOptimizeSchema } from '../schemas/index.js';

export const routesRoutes = Router();

routesRoutes.use(authenticate);

routesRoutes.post('/api/v1/routes/optimize', validateBody(routeOptimizeSchema), optimizeRoutes);
routesRoutes.post('/api/v1/routes/schedule', validateBody(routeOptimizeSchema), scheduleRoutes);
routesRoutes.post('/api/v1/routes/compare', compareRoutes);
