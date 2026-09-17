import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { authRouter } from './routes/authRoutes.ts';
import { contactRouter } from './routes/contactRoutes.ts';
import { sosRouter } from './routes/sosRoutes.ts';
import { amenityRouter } from './routes/amenityRoutes.ts';
import { aiRouter } from './routes/aiRoutes.ts';
import { incidentRouter } from './routes/incidentRoutes.ts';

export function createServerApp(): Express {
  const app = express();

  // Basic security & parsing middleware
  app.use(cors({ origin: true, credentials: true }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Basic security headers
  app.use((_req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    next();
  });

  // Health check endpoint
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({
      status: 'healthy',
      service: 'Sakhi Women Safety Platform API',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
    });
  });

  // Mount API modules
  app.use('/api/auth', authRouter);
  app.use('/api/contacts', contactRouter);
  app.use('/api/sos', sosRouter);
  app.use('/api/amenities', amenityRouter);
  app.use('/api/ai', aiRouter);
  app.use('/api/incidents', incidentRouter);

  // Global Error Handler
  app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.error('Unhandled API Server Error:', err);
    res.status(500).json({
      error: 'Internal Server Error',
      message: err.message || 'An unexpected error occurred',
    });
  });

  return app;
}

export const apiApp = createServerApp();
