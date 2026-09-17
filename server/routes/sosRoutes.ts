import { Router, Response } from 'express';
import { db } from '../db.ts';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth.ts';
import { smsService } from '../services/smsService.ts';
import { SOSHistory } from '../types.ts';

export const sosRouter = Router();

sosRouter.use(requireAuth);

// POST /api/sos/trigger
sosRouter.post('/trigger', async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const user = req.user!;
    const { latitude, longitude, accuracy = 15, customMessage } = req.body;

    if (latitude === undefined || longitude === undefined) {
      res.status(400).json({ error: 'Latitude and longitude coordinates are required for SOS trigger' });
      return;
    }

    const contacts = db.getContactsByUserId(user.id);
    const mapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;

    // Prepare recipients list (fallback to National Helpline 112 / Self if no contacts configured yet)
    const recipients = contacts.length > 0
      ? contacts.map(c => ({
          name: `${c.name} (${c.relation})`,
          phone: c.phone,
        }))
      : [
          {
            name: 'Emergency Response Desk / Self Verification',
            phone: user.phone || '+91 112',
          },
        ];

    // Dispatch via SMS Service (Twilio or High-Fidelity Mock Logger)
    const smsResult = await smsService.sendAlert({
      userName: user.name,
      userPhone: user.phone,
      mapsUrl,
      accuracy: Math.round(accuracy),
      customMessage,
      recipients,
    });

    const timestamp = new Date().toISOString();
    const newSosRecord: SOSHistory = {
      id: `sos_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      userId: user.id,
      location: {
        latitude: Number(latitude),
        longitude: Number(longitude),
        accuracy: Math.round(accuracy),
        mapsUrl,
      },
      alertMessage: smsResult.rawMessage,
      recipientCount: smsResult.dispatchedRecipients.length,
      recipients: smsResult.dispatchedRecipients,
      status: 'TRIGGERED',
      timestamp,
    };

    db.addSOSHistory(newSosRecord);

    res.status(200).json({
      success: true,
      sosId: newSosRecord.id,
      dispatchedCount: newSosRecord.recipientCount,
      recipients: newSosRecord.recipients,
      mapsUrl: newSosRecord.location.mapsUrl,
      alertMessage: newSosRecord.alertMessage,
      isMock: smsResult.isMock,
      timestamp,
    });
  } catch (err) {
    console.error('SOS trigger error:', err);
    res.status(500).json({ error: 'Failed to process emergency SOS alert' });
  }
});

// GET /api/sos/history
sosRouter.get('/history', (req: AuthenticatedRequest, res: Response): void => {
  const userId = req.user!.id;
  const history = db.getSOSHistoryByUserId(userId);
  res.json({
    history,
    count: history.length,
  });
});

// PATCH /api/sos/:id/resolve
sosRouter.patch('/:id/status', (req: AuthenticatedRequest, res: Response): void => {
  const { id } = req.params;
  const { status } = req.body;

  if (!['TRIGGERED', 'RESOLVED', 'FALSE_ALARM'].includes(status)) {
    res.status(400).json({ error: 'Invalid status. Must be TRIGGERED, RESOLVED, or FALSE_ALARM' });
    return;
  }

  const updated = db.updateSOSStatus(id, status);
  if (!updated) {
    res.status(404).json({ error: 'SOS record not found' });
    return;
  }

  res.json({
    message: `SOS status updated to ${status}`,
    sos: updated,
  });
});
