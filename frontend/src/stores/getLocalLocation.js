import { create } from "zustand";

export const localLocation = create((set) => {
  const storedLocation = JSON.parse(localStorage.getItem('user_location'));

  return {
    location: storedLocation || {
      lat: null,
      lon: null,
      description: null,
    },
    setLocation: (lat, lon, description) => {
      const newLocation = { lat, lon, description };
      localStorage.setItem('user_location', JSON.stringify(newLocation));
      set({ location: newLocation });
      // console.log('newlocation', newLocation);
    },
    resetLocation: () => {
      localStorage.removeItem('user_location');
      set({ location: { lat: null, lon: null, description: null } });
    },
    updateLocation: (location) => {
      localStorage.setItem('user_location', JSON.stringify(location));
      set({ location });
    },
  };
});
