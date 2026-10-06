import { Router, Response } from 'express';
import { db } from '../db.ts';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth.ts';
import { EmergencyContact, ContactRelation } from '../types.ts';

export const contactRouter = Router();

// Protect all contact routes
contactRouter.use(requireAuth);

// GET /api/contacts
contactRouter.get('/', (req: AuthenticatedRequest, res: Response): void => {
  const userId = req.user!.id;
  const contacts = db.getContactsByUserId(userId);
  res.json({
    contacts,
    count: contacts.length,
    minRecommended: 2,
    hasMinimum: contacts.length >= 2,
  });
});

// POST /api/contacts
contactRouter.post('/', (req: AuthenticatedRequest, res: Response): void => {
  const userId = req.user!.id;
  const existingContacts = db.getContactsByUserId(userId);

  if (existingContacts.length >= 5) {
    res.status(400).json({ error: 'Maximum limit of 5 emergency contacts reached' });
    return;
  }

  const { name, phone, relation, isPrimary } = req.body;

  if (!name || !phone || !relation) {
    res.status(400).json({ error: 'Name, phone, and relation are required' });
    return;
  }

  const validRelations: ContactRelation[] = ['Parent', 'Sibling', 'Friend', 'Guardian', 'Spouse', 'Other'];
  if (!validRelations.includes(relation)) {
    res.status(400).json({ error: `Relation must be one of: ${validRelations.join(', ')}` });
    return;
  }

  // If this is the first contact, make it primary automatically
  const shouldBePrimary = existingContacts.length === 0 ? true : Boolean(isPrimary);

  const newContact: EmergencyContact = {
    id: `contact_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    userId,
    name: name.trim(),
    phone: phone.trim(),
    relation,
    isPrimary: shouldBePrimary,
    createdAt: new Date().toISOString(),
  };

  const added = db.addContact(newContact);
  res.status(201).json({
    message: 'Emergency contact added successfully',
    contact: added,
  });
});

// PUT /api/contacts/:id
contactRouter.put('/:id', (req: AuthenticatedRequest, res: Response): void => {
  const userId = req.user!.id;
  const { id } = req.params;

  const existing = db.getContactById(id);
  if (!existing || existing.userId !== userId) {
    res.status(404).json({ error: 'Emergency contact not found' });
    return;
  }

  const { name, phone, relation, isPrimary } = req.body;

  const validRelations: ContactRelation[] = ['Parent', 'Sibling', 'Friend', 'Guardian', 'Spouse', 'Other'];
  if (relation && !validRelations.includes(relation)) {
    res.status(400).json({ error: `Relation must be one of: ${validRelations.join(', ')}` });
    return;
  }

  const updated = db.updateContact(id, {
    ...(name ? { name: name.trim() } : {}),
    ...(phone ? { phone: phone.trim() } : {}),
    ...(relation ? { relation } : {}),
    ...(typeof isPrimary === 'boolean' ? { isPrimary } : {}),
  });

  res.json({
    message: 'Contact updated successfully',
    contact: updated,
  });
});

// DELETE /api/contacts/:id
contactRouter.delete('/:id', (req: AuthenticatedRequest, res: Response): void => {
  const userId = req.user!.id;
  const { id } = req.params;

  const existing = db.getContactById(id);
  if (!existing || existing.userId !== userId) {
    res.status(404).json({ error: 'Emergency contact not found' });
    return;
  }

  db.deleteContact(id);

  // If deleted was primary, promote another contact if available
  const remaining = db.getContactsByUserId(userId);
  if (existing.isPrimary && remaining.length > 0) {
    db.updateContact(remaining[0].id, { isPrimary: true });
  }

  res.json({
    message: 'Contact deleted successfully',
    deletedId: id,
  });
});
