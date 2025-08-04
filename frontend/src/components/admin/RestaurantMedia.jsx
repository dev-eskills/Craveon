import { useState } from 'react';

const RestaurantMedia = ({ singleRestaurant }) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const allImages = [singleRestaurant?.images.cover, ...singleRestaurant.images.gallery];
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Restaurant Gallery</h2>

      {/* Main Image */}
      <div className="mb-4">
        <div className="h-96 rounded-lg overflow-hidden">
          <img
            src={allImages[activeImageIndex] || '/placeholder.svg'}
            alt={`${singleRestaurant?.name} gallery image ${activeImageIndex + 1}`}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://via.placeholder.com/800x600?text=Restaurant+Image';
            }}
          />
        </div>
      </div>

      {/* Thumbnails */}
      <div className="grid grid-cols-5 gap-2">
        {allImages.map((image, index) => (
          <button
            key={index}
            className={`h-24 rounded-lg overflow-hidden border-2 ${index === activeImageIndex ? 'border-orange-500' : 'border-transparent'}`}
            onClick={() => setActiveImageIndex(index)}
          >
            <img
              src={image || '/placeholder.svg'}
              alt={`${singleRestaurant?.name} thumbnail ${index + 1}`}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://via.placeholder.com/200x150?text=Thumbnail';
              }}
            />
          </button>
        ))}
      </div>
    </div>
    // <div className="bg-white overflow-hidden shadow rounded-lg">
    //         <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
    //           <h3 className="text-lg font-medium text-gray-900">Restaurant Media</h3>
    //         </div>
    //         <div className="px-4 py-5 sm:p-6">
    //           <div className="grid grid-cols-1 gap-6">
    //             <div>
    //               <h4 className="text-sm font-medium text-gray-500 mb-3">Logo</h4>
    //               <div className="relative h-32 w-32 rounded-lg overflow-hidden bg-gray-100">
    //                 <img
    //                   src={singleRestaurant?.?.images.logo || '/api/placeholder/128/128'}
    //                   alt="Restaurant Logo"
    //                   className="h-full w-full object-cover"
    //                 />
    //               </div>
    //             </div>

    //             <div>
    //               <h4 className="text-sm font-medium text-gray-500 mb-3">Cover Image</h4>
    //               <div className="relative h-48 rounded-lg overflow-hidden bg-gray-100">
    //                 <img
    //                   src={singleRestaurant?.?.images.cover || '/api/placeholder/400/200'}
    //                   alt="Restaurant Cover"
    //                   className="h-full w-full object-cover"
    //                 />
    //               </div>
    //             </div>
    //           </div>
    //         </div>
    //       </div>
  );
};

export default RestaurantMedia;
