import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { localLocation } from '../../stores/getLocalLocation';
import { useState, useCallback, useRef, useEffect } from 'react';
import useLocationSearch from '../../hooks/useLocationSearch';

const containerStyle = {
  width: '100%',
  height: '100%',
};
const DEFAULT_COORDS = { lat: 22.719568, lng: 75.857727 };

const GoogleMapMarker = () => {
  const { location, setLocation } = localLocation();
  const initialLat = location?.lat || DEFAULT_COORDS.lat;
  const initialLng = location?.lon || DEFAULT_COORDS.lng;
  const [position, setPosition] = useState({ lat: initialLat, lng: initialLng });

  useEffect(() => {
    if (location?.lat && location?.lon) {
      setPosition({ lat: location.lat, lng: location.lon });
    }
  }, [location]);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: ['places'],
  });

  const { getLocationFromCoords } = useLocationSearch();

  // Refs for debouncing and latest coords
  const debounceTimer = useRef(null);
  const latRef = useRef(position.lat);
  const lngRef = useRef(position.lng);

  // Stable update location function
  const updateLocation = useCallback(
    async (lat, lng) => {
      try {
        const locationDetails = await getLocationFromCoords(lat, lng);
        setPosition({ lat, lng });
        setLocation(locationDetails.lat, locationDetails.lon, locationDetails.description);
      } catch (error) {
        console.error('Failed to reverse geocode clicked position', error);
      }
    },
    [getLocationFromCoords, setLocation]
  );

  // Debounced update function
  const debouncedUpdateLocation = useCallback(
    (lat, lng) => {
      latRef.current = lat;
      lngRef.current = lng;

      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }

      debounceTimer.current = setTimeout(() => {
        updateLocation(latRef.current, lngRef.current);
      }, 500);
    },
    [updateLocation]
  );

  const handleMarkerDragEnd = useCallback(
    (e) => {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      debouncedUpdateLocation(lat, lng);
    },
    [debouncedUpdateLocation]
  );

  const handleMapClick = useCallback(
    (e) => {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      updateLocation(lat, lng);
    },
    [updateLocation]
  );

  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={position}
      zoom={14}
      onClick={handleMapClick}
      options={{
        gestureHandling: 'greedy',
        fullscreenControl: false,
        mapTypeControl: false,
        streetViewControl: false,
      }}
    >
      <Marker position={position} draggable onDragEnd={handleMarkerDragEnd} />
    </GoogleMap>
  );
};

export default GoogleMapMarker;
