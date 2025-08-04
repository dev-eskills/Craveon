import { AlarmClockCheck, ClockArrowUp, Tags } from 'lucide-react';

import { StatCard } from '../ui/StatCard';
import RestaurantOrders from './RestaurantOrder';
import useRestaurantDashboard from '../../hooks/useRestaurantDashboard';
import RestaurantRevenue from './RestaurantRevenue';
import useRestaurants from '../../hooks/useRestaurants';

const RestaurantDashboard = () => {

  const { restaurantReport, restaurantReportLoading } = useRestaurants();
  const { restaurantDash, restaurnatDashLoading } = useRestaurantDashboard();

  return (
    <div className=" w-full text-sm  min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <StatCard
          isLoading={restaurnatDashLoading}
          title={'Total Orders'}
          value={restaurantDash?.totalOrders}
          icon={<Tags className="text-[#ff6900]" />}
        />
        <StatCard
          isLoading={restaurnatDashLoading}
          title={'Pending Orders'}
          value={restaurantDash?.pendingOrders}
          icon={<ClockArrowUp size={21} className="text-yellow-400" />}
        />
        <StatCard
          isLoading={restaurnatDashLoading}
          title={'Complete Orders'}
          value={restaurantDash?.completedOrders}
          icon={<AlarmClockCheck className="text-green-500" />}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <RestaurantRevenue />

        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-bold text-lg mb-4">Top Products</h3>
          <table className="w-full table-auto">
            <thead>
              <tr className="text-left text-gray-500">
                <th className="pb-2">Product</th>
                <th className="pb-2">Orders</th>
              </tr>
            </thead>
            <tbody>
              {restaurantReport?.popularItems?.length > 0 ? (
                restaurantReport.popularItems.map((item, index) => (
                  <tr key={index}>
                    <td className="py-3">{item.name}</td>
                    <td className="py-3">
                      <span className="inline-block rounded-full bg-orange-50 text-center text-sm text-orange-600 w-8 h-8 leading-8">
                        {item.timesOrdered}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="2" className="text-center text-gray-400 py-4">
                    No popular items found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-medium ">Recent Orders</h2>
        <RestaurantOrders isDashboard={true} />
      </div>
    </div>
  );
};

export default RestaurantDashboard;
