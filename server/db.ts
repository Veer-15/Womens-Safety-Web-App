import bcrypt from 'bcryptjs';
import { User, EmergencyContact, SOSHistory, Incident } from './types.ts';

// In-Memory Resilient DB Store for High Reliability
class ResilientDB {
  users: Map<string, User> = new Map();
  contacts: Map<string, EmergencyContact> = new Map();
  sosHistories: Map<string, SOSHistory> = new Map();
  incidents: Map<string, Incident> = new Map();

  constructor() {
    this.seedDefaults();
  }

  private seedDefaults() {
    const demoPasswordHash = bcrypt.hashSync('sakhi123', 10);
    const demoUserId = 'user_ananya_01';

    const demoUser: User = {
      id: demoUserId,
      name: 'Ananya Sharma',
      email: 'ananya@sakhi.org',
      phone: '+91 98765 43210',
      passwordHash: demoPasswordHash,
      permissions: {
        locationGranted: true,
        smsAcknowledged: true,
      },
      createdAt: new Date().toISOString(),
    };
    this.users.set(demoUser.id, demoUser);

    // Removed demo contacts to comply with security requirements

    // Seed an initial SOS history event (Resolved)
    const pastSos: SOSHistory = {
      id: 'sos_past_01',
      userId: demoUserId,
      location: {
        latitude: 28.6139,
        longitude: 77.2090,
        accuracy: 12,
        mapsUrl: 'https://www.google.com/maps?q=28.6139,77.2090',
      },
      alertMessage: 'EMERGENCY ALERT: Ananya Sharma triggered SOS! Location: https://www.google.com/maps?q=28.6139,77.2090. Accuracy: ~12m. Immediate help requested!',
      recipientCount: 2,
      recipients: [
        { name: 'Sunita Sharma (Parent)', phone: '+91 98111 22334', status: 'MOCK_SENT' },
        { name: 'Rohan Sharma (Sibling)', phone: '+91 98222 33445', status: 'MOCK_SENT' },
      ],
      status: 'RESOLVED',
      timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
    };
    this.sosHistories.set(pastSos.id, pastSos);

    // Seed initial community safety incidents
    const incident1: Incident = {
      id: 'inc_01',
      userId: demoUserId,
      userName: 'Ananya S.',
      category: 'Poor Lighting',
      description: 'Streetlights are completely out near the Sector 18 metro exit road, walking feels unsafe after 8 PM.',
      location: {
        latitude: 28.5700,
        longitude: 77.3200,
        address: 'Sector 18 Metro Access Road, Near Gate 2',
      },
      timestamp: new Date(Date.now() - 3600000 * 18).toISOString(),
    };
    const incident2: Incident = {
      id: 'inc_02',
      userId: 'user_anonymous',
      userName: 'Community Member',
      category: 'Suspicious Activity',
      description: 'A group of loiterers blocking the pedestrian bridge walkway and passing inappropriate remarks.',
      location: {
        latitude: 28.5680,
        longitude: 77.3250,
        address: 'Footover Bridge near Commercial Complex',
      },
      timestamp: new Date(Date.now() - 3600000 * 42).toISOString(),
    };
    this.incidents.set(incident1.id, incident1);
    this.incidents.set(incident2.id, incident2);
  }

  // User methods
  getUserById(id: string): User | undefined {
    return this.users.get(id);
  }

  getUserByEmail(email: string): User | undefined {
    const normalized = email.trim().toLowerCase();
    for (const user of this.users.values()) {
      if (user.email.toLowerCase() === normalized) {
        return user;
      }
    }
    return undefined;
  }

  createUser(user: User): User {
    this.users.set(user.id, user);
    return user;
  }

  updateUserPermissions(id: string, permissions: Partial<User['permissions']>): User | undefined {
    const user = this.users.get(id);
    if (!user) return undefined;
    user.permissions = { ...user.permissions, ...permissions };
    this.users.set(id, user);
    return user;
  }

  // Contact methods
  getContactsByUserId(userId: string): EmergencyContact[] {
    return Array.from(this.contacts.values())
      .filter(c => c.userId === userId)
      .sort((a, b) => a.priority - b.priority);
  }

  getContactById(id: string): EmergencyContact | undefined {
    return this.contacts.get(id);
  }

  addContact(contact: EmergencyContact): EmergencyContact {
    this.contacts.set(contact.id, contact);
    return contact;
  }

  updateContact(id: string, update: Partial<EmergencyContact>): EmergencyContact | undefined {
    const existing = this.contacts.get(id);
    if (!existing) return undefined;

    const updated = { ...existing, ...update, updatedAt: new Date().toISOString() };
    this.contacts.set(id, updated);
    return updated;
  }

  deleteContact(id: string): boolean {
    return this.contacts.delete(id);
  }

  // SOS methods
  addSOSHistory(sos: SOSHistory): SOSHistory {
    this.sosHistories.set(sos.id, sos);
    return sos;
  }

  getSOSHistoryByUserId(userId: string): SOSHistory[] {
    return Array.from(this.sosHistories.values())
      .filter(s => s.userId === userId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  updateSOSStatus(id: string, status: SOSHistory['status']): SOSHistory | undefined {
    const sos = this.sosHistories.get(id);
    if (!sos) return undefined;
    sos.status = status;
    this.sosHistories.set(id, sos);
    return sos;
  }

  // Incident methods
  addIncident(incident: Incident): Incident {
    this.incidents.set(incident.id, incident);
    return incident;
  }

  getIncidents(): Incident[] {
    return Array.from(this.incidents.values())
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }
}

export const db = new ResilientDB();
