import { Router, Request, Response } from 'express';
import { aiService } from '../services/aiService.ts';

export const aiRouter = Router();

// POST /api/ai/query
aiRouter.post('/query', async (req: Request, res: Response): Promise<void> => {
  try {
    const { message, location } = req.body;

    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: 'Valid message string is required' });
      return;
    }

    const coords = {
      latitude: location?.latitude && !isNaN(Number(location.latitude)) ? Number(location.latitude) : 28.6139,
      longitude: location?.longitude && !isNaN(Number(location.longitude)) ? Number(location.longitude) : 77.2090,
    };

    const result = await aiService.processQuery(message.trim(), coords);

    res.json({
      success: true,
      ...result,
    });
  } catch (err) {
    console.error('AI Companion error:', err);
    res.status(500).json({
      error: 'AI Companion query processing failed',
      reply: 'I am here with you. If you are in urgent danger, please tap the Emergency SOS button immediately or call 112.',
      intent: 'SAFETY_ADVICE',
      groundedPlaces: [],
    });
  }
});
