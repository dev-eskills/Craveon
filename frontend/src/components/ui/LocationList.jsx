import { Navigation } from 'lucide-react';
import useLocationSearch from '../../hooks/useLocationSearch';
import { localLocation } from '../../stores/getLocalLocation';

const LocationList = ({ data = [] }) => {
  const { getLocationFromCoords } = useLocationSearch();
  const { setLocation, location } = localLocation((state) => state);
  // console.log(location, 'location');
  const fetchPlaceDetails = (placeId) => {
    const service = new window.google.maps.places.PlacesService(document.createElement('div'));
    service.getDetails({ placeId }, (place, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        setLocation(
          place.geometry.location.lat(),
          place.geometry.location.lng(),
          place.formatted_address
        );
      }
    });
  };

  const handleClick = (item) => {
    alert(`Clicked: ${item.description || 'No description'}`);

    // Your existing logic
    if (item.place_id) {
      fetchPlaceDetails(item.place_id);
    } else {
      console.error('No place_id found for this item');
    }
  };

  const handleUseMyLocation = () => {

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const place = await getLocationFromCoords(latitude, longitude);
          setLocation(place.lat, place.lon, place.description);
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };

  return (
    <>
      <div className=" border-b border-gray-200">
        <button
          onClick={handleUseMyLocation}
          className="w-full flex items-center gap-2 text-orange-500 hover:bg-orange-50 p-4 rounded-lg transition-colors"
        >
          <Navigation size={20} />
          <span>Use my current location</span>
        </button>
      </div>

      {data?.length > 0 && (
        <ul className="divide-y divide-gray-200 max-h-60 overflow-y-auto">
          {data.map((item, index) => {
            // console.log(item)
            return (
              <li
                key={index}
                className={`p-3 cursor-pointer text-sm 
                ${item.description === location.description ? 'text-orange-500 bg-orange-50' : 'text-gray-700 hover:bg-gray-100'}
              `}
                onClick={() => handleClick(item)}
              >
                {item.description || 'Unknown Location'}
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
};

export default LocationList;
