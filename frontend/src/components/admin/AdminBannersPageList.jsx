import { AlertCircle, Trash2 } from 'lucide-react';

function AdminBannersPageList({ allBanners, handleDeleteBanner }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {allBanners?.map((banner) => (
        <div
          key={banner._id}
          className="relative group rounded-lg overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300"
        >
          <img
            src={banner.imageUrl || '/slider1.png'}
            alt={`Banner ${banner._id}`}
            className="w-full h-auto aspect-[16/9] object-cover"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <button
              onClick={() => handleDeleteBanner(banner._id)}
              className="cursor-pointer p-2 bg-red-500 text-white rounded-full transform scale-90 hover:scale-100 transition-all duration-300"
              title="Delete banner"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      ))}

      {allBanners && allBanners.length === 0 && (
        <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg flex items-center text-gray-600 w-full">
          <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 text-gray-400" />
          <p className="text-sm">No banners have been uploaded yet.</p>
        </div>
      )}
    </div>
  );
}

export default AdminBannersPageList;
