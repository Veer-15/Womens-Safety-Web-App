import { Router, Request, Response } from 'express';
import { placesService } from '../services/placesService.ts';
import { AmenityType } from '../types.ts';

export const amenityRouter = Router();

// GET /api/amenities/nearby
amenityRouter.get('/nearby', async (req: Request, res: Response): Promise<void> => {
  try {
    const latStr = req.query.lat as string;
    const lngStr = req.query.lng as string;
    const type = (req.query.type as AmenityType | 'all') || 'all';

    // Default coordinates: Connaught Place, New Delhi if not passed
    const lat = latStr ? parseFloat(latStr) : 28.6139;
    const lng = lngStr ? parseFloat(lngStr) : 77.2090;

    if (isNaN(lat) || isNaN(lng)) {
      res.status(400).json({ error: 'Valid numerical lat and lng are required' });
      return;
    }

    const amenities = await placesService.getNearbyAmenities(lat, lng, type);

    res.json({
      success: true,
      query: { lat, lng, type },
      count: amenities.length,
      amenities,
    });
  } catch (err) {
    console.error('Amenity fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch nearby amenities' });
  }
});
