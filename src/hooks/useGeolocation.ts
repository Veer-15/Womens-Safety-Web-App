import { useState, useEffect, useCallback } from 'react';

export interface GeolocationState {
  latitude: number;
  longitude: number;
  accuracy: number;
  status: 'active' | 'fallback' | 'denied' | 'loading';
  error: string | null;
  lastUpdated: Date | null;
  mapsUrl: string;
}

// Default benchmark center: Connaught Place, New Delhi (metro safety hub)
const DEFAULT_COORDINATES = {
  latitude: 28.6139,
  longitude: 77.2090,
  accuracy: 15,
  mapsUrl: 'https://www.google.com/maps?q=28.6139,77.2090',
};

export function useGeolocation() {
  const [geoState, setGeoState] = useState<GeolocationState>({
    ...DEFAULT_COORDINATES,
    status: 'loading',
    error: null,
    lastUpdated: null,
  });

  const updatePosition = useCallback((position: GeolocationPosition) => {
    setGeoState({
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      accuracy: Math.round(position.coords.accuracy),
      status: 'active',
      error: null,
      lastUpdated: new Date(position.timestamp),
      mapsUrl: `https://www.google.com/maps?q=${position.coords.latitude},${position.coords.longitude}`,
    });
  }, []);

  const handleError = useCallback((err: GeolocationPositionError) => {
    let message = 'Unable to retrieve your location';
    let status: GeolocationState['status'] = 'fallback';

    switch (err.code) {
      case err.PERMISSION_DENIED:
        message = 'Location permission denied. Using metropolitan benchmark coordinates.';
        status = 'denied';
        break;
      case err.POSITION_UNAVAILABLE:
        message = 'Location information unavailable. Using default safety coordinates.';
        status = 'fallback';
        break;
      case err.TIMEOUT:
        message = 'Location request timed out. Using default safety coordinates.';
        status = 'fallback';
        break;
    }

    setGeoState(prev => ({
      ...prev,
      status,
      error: message,
      lastUpdated: new Date(),
    }));
  }, []);

  const refreshLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setGeoState(prev => ({
        ...prev,
        status: 'fallback',
        error: 'Geolocation is not supported by your browser',
      }));
      return;
    }

    setGeoState(prev => ({ ...prev, status: 'loading' }));

    navigator.geolocation.getCurrentPosition(updatePosition, handleError, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 15000,
    });
  }, [updatePosition, handleError]);

  useEffect(() => {
    if (!navigator.geolocation) {
      setGeoState({
        ...DEFAULT_COORDINATES,
        status: 'fallback',
        error: 'Geolocation not supported',
        lastUpdated: new Date(),
      });
      return;
    }

    // Initial fetch
    navigator.geolocation.getCurrentPosition(updatePosition, handleError, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 30000,
    });

    // Continuous watch
    const watchId = navigator.geolocation.watchPosition(updatePosition, handleError, {
      enableHighAccuracy: true,
      maximumAge: 20000,
      timeout: 15000,
    });

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [updatePosition, handleError]);

  return {
    ...geoState,
    refreshLocation,
  };
}
