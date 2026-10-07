import axios from 'axios';
import {
  EmergencyContact,
  SOSHistory,
  Amenity,
  Incident,
  AIQueryResponse,
  User,
} from '../types.ts';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Attach JWT Token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('sakhi_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for clear errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Don't auto-redirect if checking auth or on login page
      const path = window.location.pathname;
      if (!path.includes('/login') && !path.includes('/landing')) {
        console.warn('Session expired or unauthorized');
      }
    }
    return Promise.reject(error);
  }
);

export const authService = {
  async signup(data: { name: string; email: string; phone: string; password: string }) {
    const res = await api.post<{ token: string; user: User }>('/auth/signup', data);
    return res.data;
  },

  async login(data: { email: string; password: string }) {
    const res = await api.post<{ token: string; user: User }>('/auth/login', data);
    return res.data;
  },

  async getMe() {
    const res = await api.get<{ user: User }>('/auth/me');
    return res.data.user;
  },

  async updatePermissions(permissions: { locationGranted?: boolean; smsAcknowledged?: boolean }) {
    const res = await api.patch<{ user: User }>('/auth/permissions', permissions);
    return res.data.user;
  },
};

export const contactService = {
  async getContacts() {
    const res = await api.get<{
      contacts: EmergencyContact[];
      count: number;
      minRecommended: number;
      hasMinimum: boolean;
    }>('/contacts');
    return res.data;
  },

  async addContact(data: {
    name: string;
    phone: string;
    relation: string;
    priority?: number;
    isActive?: boolean;
  }) {
    const res = await api.post<{ message: string; contact: EmergencyContact }>('/contacts', data);
    return res.data.contact;
  },

  async updateContact(
    id: string,
    data: {
      name?: string;
      phone?: string;
      relation?: string;
      priority?: number;
      isActive?: boolean;
    }
  ) {
    const res = await api.put<{ message: string; contact: EmergencyContact }>(`/contacts/${id}`, data);
    return res.data.contact;
  },

  async deleteContact(id: string) {
    const res = await api.delete<{ message: string; deletedId: string }>(`/contacts/${id}`);
    return res.data;
  },

  async updateStatus(id: string, isActive: boolean) {
    const res = await api.patch<{ message: string; contact: EmergencyContact }>(`/contacts/${id}/status`, { isActive });
    return res.data.contact;
  },
};

export const sosService = {
  async triggerSOS(data: {
    latitude: number;
    longitude: number;
    accuracy?: number;
    customMessage?: string;
  }) {
    const res = await api.post<{
      success: boolean;
      sosId: string;
      dispatchedCount: number;
      recipients: Array<{ name: string; phone: string; status: string }>;
      mapsUrl: string;
      alertMessage: string;
      isMock: boolean;
      timestamp: string;
    }>('/sos/trigger', data);
    return res.data;
  },

  async getHistory() {
    const res = await api.get<{ history: SOSHistory[]; count: number }>('/sos/history');
    return res.data.history;
  },

  async updateStatus(id: string, status: 'TRIGGERED' | 'RESOLVED' | 'FALSE_ALARM') {
    const res = await api.patch<{ message: string; sos: SOSHistory }>(`/sos/${id}/status`, { status });
    return res.data.sos;
  },
};

export const amenityService = {
  async getNearby(lat: number, lng: number, type: string = 'all') {
    const res = await api.get<{
      success: boolean;
      amenities: Amenity[];
      count: number;
    }>('/amenities/nearby', {
      params: { lat, lng, type },
    });
    return res.data.amenities;
  },
};

export const aiService = {
  async query(message: string, location?: { latitude: number; longitude: number }) {
    const res = await api.post<AIQueryResponse>('/ai/query', {
      message,
      location,
    });
    return res.data;
  },
};

export const incidentService = {
  async getIncidents() {
    const res = await api.get<{ success: boolean; incidents: Incident[]; count: number }>('/incidents');
    return res.data.incidents;
  },

  async reportIncident(data: {
    category: string;
    description: string;
    location: {
      latitude: number;
      longitude: number;
      address?: string;
    };
  }) {
    const res = await api.post<{ message: string; incident: Incident }>('/incidents', data);
    return res.data.incident;
  },
};

export default api;
