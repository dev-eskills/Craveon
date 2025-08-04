import { useState } from 'react';
import RestaurantBusinessHourForm from './RestaurantBusinessHourForm';
import RestaurantUpdateImageForm from './RestaurantUpdateImageForm';

export default function RestaurantProfileForm() {
  const [activeTab, setActiveTab] = useState('images');

  const tabs = [
    {
      key: 'images', 
      label: 'Profile Images',
      component: <RestaurantUpdateImageForm />,
    },
    {
      key: 'hours',
      label: 'Business Hours',
      component: <RestaurantBusinessHourForm />,
    },
  ];

  return (
    <div className="w-full p-4 bg-white shadow-lg rounded-xl">
      {/* NavTabs */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="flex space-x-4">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`
                pb-3 px-4 text-sm font-medium transition-all duration-300
                ${
                  activeTab === tab.key
                    ? 'text-[#ff6900] border-b-2 border-[#ff6900]'
                    : 'text-gray-500 hover:text-[#ff6900] hover:opacity-80'
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Active Tab Content */}
      <div>{tabs.find((tab) => tab.key === activeTab)?.component}</div>
    </div>
  );
}
