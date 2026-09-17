import { Router, Response } from 'express';
import { db } from '../db.ts';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth.ts';
import { Incident, IncidentCategory } from '../types.ts';

export const incidentRouter = Router();

// GET /api/incidents - Publicly readable for community awareness
incidentRouter.get('/', (_req, res: Response): void => {
  const incidents = db.getIncidents();
  res.json({
    success: true,
    count: incidents.length,
    incidents,
  });
});

// POST /api/incidents - Report a safety incident
incidentRouter.post('/', (req: AuthenticatedRequest, res: Response): void => {
  try {
    const user = req.user;
    const { category, description, location } = req.body;

    if (!category || !description) {
      res.status(400).json({ error: 'Category and description are required' });
      return;
    }

    const validCategories: IncidentCategory[] = [
      'Harassment',
      'Suspicious Activity',
      'Poor Lighting',
      'Stalking',
      'Unsafe Transit',
      'Other',
    ];

    if (!validCategories.includes(category)) {
      res.status(400).json({ error: `Category must be one of: ${validCategories.join(', ')}` });
      return;
    }

    const newIncident: Incident = {
      id: `inc_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      userId: user ? user.id : 'anonymous_user',
      userName: user?.name ? `${user.name.split(' ')[0]} ${user.name.split(' ')[1]?.[0] || ''}.` : 'Anonymous Woman',
      category,
      description: description.trim(),
      location: {
        latitude: location?.latitude ? Number(location.latitude) : 28.6139,
        longitude: location?.longitude ? Number(location.longitude) : 77.2090,
        address: location?.address?.trim() || 'Reported from Live GPS Location',
      },
      timestamp: new Date().toISOString(),
    };

    const saved = db.addIncident(newIncident);

    res.status(201).json({
      message: 'Incident reported successfully to community safety registry',
      incident: saved,
    });
  } catch (err) {
    console.error('Incident creation error:', err);
    res.status(500).json({ error: 'Failed to record safety incident' });
  }
});
