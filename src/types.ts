export type ContactRelation = 'Parent' | 'Sibling' | 'Friend' | 'Guardian' | 'Spouse' | 'Other';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  permissions: {
    locationGranted: boolean;
    smsAcknowledged: boolean;
  };
  createdAt?: string;
}

export interface EmergencyContact {
  id: string;
  userId: string;
  name: string;
  phone: string;
  relation: ContactRelation;
  priority: number;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

export type SOSStatus = 'TRIGGERED' | 'RESOLVED' | 'FALSE_ALARM';

export interface SOSRecipient {
  name: string;
  phone: string;
  status: 'MOCK_SENT' | 'SENT' | 'DELIVERED' | 'FAILED';
}

export interface SOSHistory {
  id: string;
  userId: string;
  location: {
    latitude: number;
    longitude: number;
    accuracy: number;
    mapsUrl: string;
  };
  alertMessage: string;
  recipientCount: number;
  recipients: SOSRecipient[];
  status: SOSStatus;
  timestamp: string;
}

export type IncidentCategory =
  | 'Harassment'
  | 'Suspicious Activity'
  | 'Poor Lighting'
  | 'Stalking'
  | 'Unsafe Transit'
  | 'Other';

export interface Incident {
  id: string;
  userId: string;
  userName?: string;
  category: IncidentCategory;
  description: string;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  timestamp: string;
}

export type AmenityType = 'police' | 'hospital' | 'pharmacy' | 'hostel' | 'transport';

export interface Amenity {
  id: string;
  name: string;
  type: AmenityType;
  subType?: string;
  address: string;
  distanceKm: number;
  rating: number;
  isOpen: boolean;
  phone: string;
  lat: number;
  lng: number;
  safetyScore?: number;
  verified: boolean;
  notes?: string;
}

export interface AIQueryResponse {
  reply: string;
  intent: 'AMENITY_SEARCH' | 'SAFETY_ADVICE' | 'GENERAL';
  groundedPlaces: Amenity[];
}

export interface Helpline {
  number: string;
  name: string;
  description: string;
  category: 'national' | 'women' | 'police' | 'medical' | 'cyber';
  badge: string;
  color: string;
  available24x7: boolean;
}
