import { useState, useCallback } from 'react';

const OFFICE_LOCATION = {
  lat: 40.7128,
  lng: -74.0060,
  radius: 100 // meters
};

export const useLocation = () => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isOnPremises, setIsOnPremises] = useState(false);

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3;
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const getCurrentLocation = useCallback(() => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        const err = 'Geolocation is not supported';
        setError(err);
        reject(err);
        return;
      }

      setLoading(true);
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy
          };
          
          const distance = calculateDistance(
            userLocation.lat,
            userLocation.lng,
            OFFICE_LOCATION.lat,
            OFFICE_LOCATION.lng
          );
          
          const onPremises = distance <= OFFICE_LOCATION.radius;
          
          setLocation(userLocation);
          setIsOnPremises(onPremises);
          setLoading(false);
          
          resolve({
            ...userLocation,
            distance,
            onPremises,
            isWithinRadius: onPremises
          });
        },
        (err) => {
          setError(err.message);
          setLoading(false);
          reject(err.message);
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 0
        }
      );
    });
  }, []);

  return {
    location,
    error,
    loading,
    isOnPremises,
    getCurrentLocation,
    officeLocation: OFFICE_LOCATION
  };
};

export default useLocation;
