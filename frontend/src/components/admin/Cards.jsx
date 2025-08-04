import { Banknote, Bike, ClipboardList, Clock, Package, Users, UtensilsCrossed, Wallet } from 'lucide-react';
import { useAdminDashboard } from '../../hooks/useAdminDashboard';

const Cards = () => {
  const { adminDashboard, adminDasboardLoading } = useAdminDashboard();
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 ">
        <div>
          <div className="p-6 border border-gray-200 rounded-xl">
            <div className="flex gap-5">
              <div className="p-2 flex items-center  bg-orange-50 rounded-lg">
                <Wallet className="w-6 h-6 text-orange-500" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-500">Total Income</p>
                {adminDasboardLoading ? (
                  <div className="h-6 w-24 bg-gray-200 animate-pulse rounded-md" />
                ) : (
                  <h3 className="text-2xl font-bold">₹{adminDashboard?.data?.totalIncome}</h3>
                )}
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="p-6 border border-gray-200 rounded-xl">
            <div className="flex gap-5">
              <div className="p-2 flex items-center  bg-green-50 rounded-lg">
                <Clock className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-500">Pending Income</p>
                {adminDasboardLoading ? (
                  <div className="h-6 w-24 bg-gray-200 animate-pulse rounded-md" />
                ) : (
                  <h3 className="text-2xl font-bold">₹{adminDashboard?.data?.pendingIncome}</h3>
                )}
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="p-6 border border-gray-200 rounded-xl">
            <div className="flex gap-5">
              <div className="p-2 flex items-center  bg-yellow-50 rounded-lg">
                <Banknote className="w-6 h-6 text-yellow-500" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-500">Received Amount</p>
                {adminDasboardLoading ? (
                  <div className="h-6 w-24 bg-gray-200 animate-pulse rounded-md" />
                ) : (
                  <h3 className="text-2xl font-bold">₹{adminDashboard?.data?.receivedAmount}</h3>
                )}
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="p-6 border border-gray-200 rounded-xl">
            <div className="flex gap-5">
              <div className="p-2 flex items-center  bg-red-50 rounded-lg">
                <UtensilsCrossed className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-500">Total Restaurants</p>
                {adminDasboardLoading ? (
                  <div className="h-6 w-24 bg-gray-200 animate-pulse rounded-md" />
                ) : (
                  <h3 className="text-2xl font-bold">₹{adminDashboard?.data?.totalRestaurants}</h3>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 ">
        <div>
          <div className="p-6 border border-gray-200 rounded-xl">
            <div className="flex gap-5">
              <div className="p-2 flex items-center  bg-orange-50 rounded-lg">
                <Package className="w-6 h-6 text-orange-500" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-500">Total Products</p>
                {adminDasboardLoading ? (
                  <div className="h-6 w-24 bg-gray-200 animate-pulse rounded-md" />
                ) : (
                  <h3 className="text-2xl font-bold">₹{adminDashboard?.data?.totalProducts}</h3>
                )}
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="p-6 border border-gray-200 rounded-xl">
            <div className="flex gap-5">
              <div className="p-2 flex items-center  bg-green-50 rounded-lg">
                <ClipboardList className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-500">Total Orders</p>
                {adminDasboardLoading ? (
                  <div className="h-6 w-24 bg-gray-200 animate-pulse rounded-md" />
                ) : (
                  <h3 className="text-2xl font-bold">₹{adminDashboard?.data?.totalOrders}</h3>
                )}
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="p-6 border border-gray-200 rounded-xl">
            <div className="flex gap-5">
              <div className="p-2 flex items-center  bg-yellow-50 rounded-lg">
                <Bike className="w-6 h-6 text-yellow-500" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-500">Total Riders</p>
                {adminDasboardLoading ? (
                  <div className="h-6 w-24 bg-gray-200 animate-pulse rounded-md" />
                ) : (
                  <h3 className="text-2xl font-bold">₹{adminDashboard?.data?.totalRiders}</h3>
                )}
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="p-6 border border-gray-200 rounded-xl">
            <div className="flex gap-5">
              <div className="p-2 flex items-center  bg-red-50 rounded-lg">
                <Users className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-500">Total Customers</p>
                {adminDasboardLoading ? (
                  <div className="h-6 w-24 bg-gray-200 animate-pulse rounded-md" />
                ) : (
                  <h3 className="text-2xl font-bold">₹{adminDashboard?.data?.totalCustomers}</h3>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Cards;
