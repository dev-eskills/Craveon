import { useEffect, useState } from 'react';

const useLocationSearch = (query) => {
  const [searchData, setSearchData] = useState([]);

  // Autocomplete Search with debounce and enhanced local search
  useEffect(() => {
    if (!window.google || !query) return;

    const service = new window.google.maps.places.AutocompleteService();

    const debounceTimer = setTimeout(() => {
      // Try multiple approaches for better local results
      const request = {
        input: query,

        // Option 1: Remove types entirely to get ALL results (streets, landmarks, establishments)
        // types: ['geocode'], // Comment this out to get more results

        // Option 2: Use location restriction instead of bias (more strict)
        // locationRestriction: {
        //   north: 22.8, // Adjust these bounds for your city
        //   south: 22.6,
        //   east: 76.0,
        //   west: 75.7,
        // },

        // Alternative: Location bias (less strict than restriction)
        // locationBias: {
        //   radius: 25000, // Try smaller radius
        //   center: { lat: 22.7196, lng: 75.8577 }
        // },

        // Component restrictions
        componentRestrictions: { country: 'in' }, // Use lowercase 'in'

        // Session token
        sessionToken: new window.google.maps.places.AutocompleteSessionToken(),
      };

      service?.getPlacePredictions(request, (predictions, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
          setSearchData(predictions);
        } else {
          setSearchData([]);
        }
      });
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [query]);

  const getLocationFromCoords = async (lat, lon) => {
    // Check if Google Maps API is loaded
    if (!window.google || !window.google.maps || !window.google.maps.Geocoder) {
      throw new Error('Google Maps API not loaded');
    }
    const geocoder = new window.google.maps.Geocoder();

    return new Promise((resolve, reject) => {
      geocoder.geocode(
        { location: { lat: parseFloat(lat), lng: parseFloat(lon) } },
        (results, status) => {
          // Validate geocoding results
          if (status !== window.google.maps.GeocoderStatus.OK || !results || results.length === 0) {
            reject(new Error(`Reverse geocoding failed. Status: ${status}`));
            return;
          }

          // Prioritize most specific and reliable location types
          const priorityTypes = [
            'street_address',
            'premise',
            'establishment',
            'point_of_interest',
            'neighborhood',
            'sublocality',
            'locality',
            'administrative_area_level_1',
            'country',
          ];

          // Find the most specific location result
          const mostSpecificResult =
            priorityTypes.reduce((best, type) => {
              if (best) return best;
              return results.find((result) =>
                result.types.some((resultType) => resultType === type)
              );
            }, null) || results[0];

          // Extract meaningful location details
          const locationDetails = {
            description: mostSpecificResult.formatted_address,
            lat: parseFloat(lat),
            lon: parseFloat(lon),
            placeId: mostSpecificResult.place_id,
            addressComponents: mostSpecificResult.address_components.reduce((acc, component) => {
              component.types.forEach((type) => {
                acc[type] = component.long_name;
              });
              return acc;
            }, {}),
          };

          resolve(locationDetails);
        }
      );
    });
  };

  return { searchData, getLocationFromCoords };
};

export default useLocationSearch;
