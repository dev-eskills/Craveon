import { ChevronDown, MapPin, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import useLocationSearch from '../../hooks/useLocationSearch';
import SearchListLayout from '../../layouts/SearchListLayout';
import useRestaurants from '../../hooks/useRestaurants';
import { useQueryClient } from '@tanstack/react-query';
import { localLocation } from '../../stores/getLocalLocation';
import { useDebounce } from '../../hooks/useDebounce';

const Location = () => {
  const [focus, setFocus] = useState(false);
  const [whoOpens, setWhoOpens] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const queryClient = useQueryClient();

  const { setLocation, location, resetLocation } = localLocation((state) => state);
  const { allrestaurantRefetch } = useRestaurants(undefined, 1, 10);

  const debouncedInput = useDebounce(inputValue, 500);
  const { searchData } = useLocationSearch(debouncedInput);

  // Sync input with actual location input value
  useEffect(() => {
    if (location?.description && location.description !== inputValue) {
      setInputValue(location.description);
    }
  }, [location]);

  // Fetch restaurants only after debounced input
  useEffect(() => {
    if (debouncedInput) {
      setLocation(location.lat, location.lon, debouncedInput);
      allrestaurantRefetch();
      queryClient.invalidateQueries(['restaurants']);
    }
  }, [debouncedInput]);

  const handleFocus = (boolean, name) => {
    setFocus(boolean);
    setWhoOpens(name);
  };

  const handleBlur = () => {
    setTimeout(() => {
      setFocus(false);
      setWhoOpens('');
    }, 150);
  };

  return (
    <div className="relative w-full shadow rounded-lg">
      <div
        className={`flex items-center pt-2 sm:py-1 sm:pt-3 border-t sm:border-t-0 
        transition-all duration-300 sm:flex-1 
        ${focus ? 'border-orange-500 ' : 'border-gray-300'}
      `}
      >
        <div className="flex items-center px-2">
          <MapPin className="text-gray-400 flex-shrink-0" size={20} />
        </div>

        <input
          type="text"
          placeholder="Location"
          className="w-full truncate  outline-none text-gray-700 placeholder-gray-400 bg-transparent cursor-pointer"
          value={inputValue}
          onChange={(e) => {
            const val = e.target.value;
            setInputValue(val);
            if (val.trim() === '') {
              setLocation(null, null, '');
            }
          }}
          onFocus={() => handleFocus(true, 'location')}
          onBlur={handleBlur}
        />

        <button
          className="flex items-center px-2"
          onClick={() => {
            if (whoOpens === 'location') {
              setFocus(false);
              setWhoOpens('');
            } else {
              handleFocus(true, 'location');
            }
          }}
        >
          <ChevronDown
            className={`text-gray-400 flex-shrink-0 transition-transform duration-300 ${
              whoOpens === 'location' ? 'rotate-180' : ''
            }`}
            size={20}
          />
        </button>

        <button
          onClick={() => {
            resetLocation();
            setInputValue('');
            setFocus(false);
            setWhoOpens('');
            allrestaurantRefetch();
          }}
          className="flex items-center px-3"
        >
          <X className="text-gray-400" size={20} />
        </button>
      </div>

      <div className="w-full mt-2">
        <SearchListLayout isOpen={focus} name={whoOpens} data={searchData} />
      </div>
    </div>
  );
};

export default Location;
