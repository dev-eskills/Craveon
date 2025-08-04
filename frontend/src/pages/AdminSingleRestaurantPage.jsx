import { useState } from 'react';
import { useParams } from 'react-router-dom';
import RestaurantBasicInfo from '../components/admin/RestaurantBasicInfo';
import RestaurantStatusCard from '../components/admin/RestaurantStatusCard';
import RestaurantDelivery from '../components/admin/RestaurantDelivery';
import RestaurantMedia from '../components/admin/RestaurantMedia';
import RestaurantPayment from '../components/admin/RestaurantPayment';
import RestaurantSettings from '../components/admin/RestaurantSettings';
import { useSingleRestaurant } from '../hooks/useRestaurants';
import { useAuthStore } from '../stores/authStore';
import SingleRestaurantSkeleton from '../components/skeleton/SingleRestaurantSkeleton';

const AdminSingleRestaurantPage = () => {
  const user = useAuthStore((state) => state.user);
  const { id } = useParams();
  const { singleRestaurant , singleRestrauntLoading} = useSingleRestaurant(id);
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = ['overview', 'delivery', 'media', 'payment'];
  if (user?.role === 'admin') {
    tabs.push('settings');
  }

  return (
    <div className="min-h-screen w-full">
      {singleRestrauntLoading ? (
        <SingleRestaurantSkeleton />
      ) : (
        <>
          {/* Top Bar */}
          <div className="bg-white shadow">
            <div className="h-64 relative">
              <img
                src={singleRestaurant?.images?.cover || '/placeholder.svg'}
                alt={singleRestaurant?.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-6 flex items-end">
                <div className="bg-white rounded-xl p-2 mr-4 shadow-md">
                  <img
                    src={singleRestaurant?.images?.logo || '/placeholder.svg'}
                    alt={`${singleRestaurant?.name} logo`}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                </div>

                <div className="text-white">
                  <h1 className="text-3xl font-bold">{singleRestaurant?.name}</h1>
                  <p className="text-gray-200">{singleRestaurant?.description}</p>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="px-4 sm:px-6 lg:px-8 border-b border-gray-200">
              <nav className="flex space-x-4 overflow-x-auto no-scrollbar">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-3 py-4 border-b-2 font-medium text-sm whitespace-nowrap ${
                      activeTab === tab
                        ? 'border-orange-500 text-orange-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="py-6 w-full">
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <RestaurantBasicInfo singleRestaurant={singleRestaurant} />
                <RestaurantStatusCard singleRestaurant={singleRestaurant} />
              </div>
            )}

            {activeTab === 'delivery' && <RestaurantDelivery singleRestaurant={singleRestaurant} />}
            {activeTab === 'media' && <RestaurantMedia singleRestaurant={singleRestaurant} />}
            {activeTab === 'payment' && <RestaurantPayment singleRestaurant={singleRestaurant} />}
            {activeTab === 'settings' && user?.role === 'admin' && (
              <RestaurantSettings singleRestaurant={singleRestaurant} />
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default AdminSingleRestaurantPage;
