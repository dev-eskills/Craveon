import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Location from '../navbar/Location';
import GoogleMapMarker from './GoogleMapMarker';

const LocationCanvas = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsOpen(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="">
      {/* Overlay with fade-in effect */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed top-0 inset-0 bg-black/30 backdrop-blur-sm z-30 "
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Side Panel with Fixed Height & Smooth Transition */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed  top-178px left-0 z-40 md:w-96 w-80 min-h-screen bg-white shadow-xl overflow-y-scroll"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            layout // Ensures height transitions smoothly
          >
            {/* Header */}
            <div className="py-2 px-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-800">Please Enter Your Location</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-full hover:bg-gray-100 transition"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            {/* Map Container */}
            <div className="p-2">
              <div className="w-full md:h-72 h-62 rounded-lg overflow-hidden shadow-md">
                <GoogleMapMarker />
              </div>
            </div>

            {/* Location Input Section */}
            <div className="p-4 flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter Your Delivery Location
              </label>
              <div className="relative ">
                <Location />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LocationCanvas;
