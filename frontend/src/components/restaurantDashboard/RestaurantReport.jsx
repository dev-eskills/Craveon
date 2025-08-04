import { useState } from 'react';
import useRestaurants from '../../hooks/useRestaurants';
import RestaurantRevenue from './RestaurantRevenue';
import {
  CartesianGrid,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  LineChart,
} from 'recharts';
import RestaurantReportskeleton from '../skeleton/RestaurantReportskeleton';

const STATUS_COLORS = {
  totalOrders: '#8884d8',
  DELIVERED: '#00C851',
  CANCELLED: '#ff4444',
  PENDING: '#ffbb33',
  PREPARING: '#33b5e5',
  ACCEPTED: '#AA66CC',
  READY_FOR_PICKUP: '#FF8800',
  ASSIGNED: '#0099CC',
  PICKED_UP: '#669900',
  OUT_FOR_DELIVERY: '#9933CC',
  REJECTED: '#CC0000',
};

// Report Component
const RestaurantReport = () => {
  const { restaurantReport, restaurantReportLoading } = useRestaurants();
  // console.log(restaurantReport, 'restaurant report');
  const [activeChart, setActiveChart] = useState('daily');
  const [selectedStatuses, setSelectedStatuses] = useState({
    totalOrders: true,
    DELIVERED: true,
    CANCELLED: true,
    PENDING: true,
  });

  const getChartData = () => {
    if (!restaurantReport?.charts) return [];

    return activeChart === 'daily'
      ? restaurantReport.charts.dailyTrends?.data || []
      : restaurantReport.charts.weeklyTrends?.data || [];
  };

  const toggleStatus = (status) => {
    setSelectedStatuses((prev) => ({
      ...prev,
      [status]: !prev[status],
    }));
  };

  // Format date for display
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // custom tooltip for line chart
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-sm">{formatDate(label)}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.dataKey === 'totalOrders' ? 'Total Orders' : entry.dataKey}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if(restaurantReportLoading){
    return <RestaurantReportskeleton/>
  }

  return (
    <div className="p-3 w-full space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-1 ">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-bold text-lg mb-4">Order Statistics</h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-orange-50 p-3 rounded">
              <p className="text-gray-500">Total Orders</p>
              <h4 className="text-xl font-bold">{restaurantReport?.stats?.totalOrders}</h4>
            </div>
            <div className="bg-green-50 p-3 rounded">
              <p className="text-gray-500">Delivered</p>
              <h4 className="text-xl font-bold">{restaurantReport?.stats?.deliveredOrders}</h4>
            </div>
            <div className="bg-red-50 p-3 rounded">
              <p className="text-gray-500">Cancelled</p>
              <h4 className="text-xl font-bold">{restaurantReport?.stats?.cancelledOrders}</h4>
            </div>
            <div className="bg-blue-50 p-3 rounded">
              <p className="text-gray-500">Average Order</p>
              <h4 className="text-xl font-bold">{restaurantReport?.stats?.averageIncome}</h4>
            </div>
          </div>
          <div className="bg-white p-2 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg text-gray-800">Order Trends</h3>
              <div className="flex space-x-2">
                <button
                  onClick={() => setActiveChart('daily')}
                  className={`px-3 py-1 rounded text-sm ${
                    activeChart === 'daily'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Daily
                </button>
                <button
                  onClick={() => setActiveChart('weekly')}
                  className={`px-3 py-1 rounded text-sm ${
                    activeChart === 'weekly'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Weekly
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {Object.entries(selectedStatuses).map(([status, isSelected]) => (
                <button
                  key={status}
                  onClick={() => toggleStatus(status)}
                  className={`px-3 py-1 rounded text-xs border ${
                    isSelected
                      ? 'bg-blue-100 border-blue-300 text-blue-700'
                      : 'bg-gray-100 border-gray-300 text-gray-600'
                  }`}
                  style={{
                    borderColor: isSelected ? STATUS_COLORS[status] : undefined,
                    backgroundColor: isSelected ? `${STATUS_COLORS[status]}20` : undefined,
                  }}
                >
                  {status === 'totalOrders' ? 'Total Orders' : status}
                </button>
              ))}
            </div>

            <div className="h-50">
              {restaurantReport?.charts && getChartData().length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={getChartData()}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="2 2" stroke="#f0f0f0" />
                    <XAxis
                      dataKey={activeChart === 'daily' ? 'date' : 'weekStart'}
                      tickFormatter={formatDate}
                      stroke="#666"
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis allowDecimals={false} stroke="#666" tick={{ fontSize: 12 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />

                    {Object.entries(selectedStatuses).map(
                      ([status, isSelected]) =>
                        isSelected && (
                          <Line
                            key={status}
                            type="monotone"
                            dataKey={status}
                            stroke={STATUS_COLORS[status]}
                            strokeWidth={status === 'totalOrders'}
                            dot={{ fill: STATUS_COLORS[status], strokeWidth: 1, r: 2 }}
                            activeDot={{ r: 4, stroke: STATUS_COLORS[status], strokeWidth: 1 }}
                          />
                        )
                    )}
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-500">
                  <p>No chart data available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-bold text-lg mb-4">Sales Overview</h3>
          <div className="flex justify-between mb-4">
            <div>
              <p className="text-gray-500">This Month</p>
              <h4 className="text-xl font-bold">₹{restaurantReport?.currentMonth?.totalIncome}</h4>
            </div>
            <div>
              <p className="text-gray-500">Last Month</p>
              <h4 className="text-xl font-bold">₹{restaurantReport?.previousMonth?.totalIncome}</h4>
              {/* <span className="text-green-500 text-sm">+6.3%</span> */}
            </div>
          </div>
          <div>
            {/* <p className="text-gray-500">Monthly Revenue Chart Placeholder</p> */}
            <RestaurantRevenue />
          </div>
        </div>

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
        {/* <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-bold text-lg mb-4">Order Statistics</h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-orange-50 p-3 rounded">
              <p className="text-gray-500">Total Orders</p>
              <h4 className="text-xl font-bold">{restaurantReport?.stats?.totalOrders}</h4>
            </div>
            <div className="bg-green-50 p-3 rounded">
              <p className="text-gray-500">Delivered</p>
              <h4 className="text-xl font-bold">{restaurantReport?.stats?.deliveredOrders}</h4>
            </div>
            <div className="bg-red-50 p-3 rounded">
              <p className="text-gray-500">Cancelled</p>
              <h4 className="text-xl font-bold">{restaurantReport?.stats?.cancelledOrders}</h4>
            </div>
            <div className="bg-blue-50 p-3 rounded">
              <p className="text-gray-500">Average Order</p>
              <h4 className="text-xl font-bold">{restaurantReport?.stats?.averageIncome}</h4>
            </div>
          </div>
          <div className="bg-white p-2 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg text-gray-800">Order Trends</h3>
              <div className="flex space-x-2">
                <button
                  onClick={() => setActiveChart('daily')}
                  className={`px-3 py-1 rounded text-sm ${
                    activeChart === 'daily'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Daily
                </button>
                <button
                  onClick={() => setActiveChart('weekly')}
                  className={`px-3 py-1 rounded text-sm ${
                    activeChart === 'weekly'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Weekly
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {Object.entries(selectedStatuses).map(([status, isSelected]) => (
                <button
                  key={status}
                  onClick={() => toggleStatus(status)}
                  className={`px-3 py-1 rounded text-xs border ${
                    isSelected
                      ? 'bg-blue-100 border-blue-300 text-blue-700'
                      : 'bg-gray-100 border-gray-300 text-gray-600'
                  }`}
                  style={{
                    borderColor: isSelected ? STATUS_COLORS[status] : undefined,
                    backgroundColor: isSelected ? `${STATUS_COLORS[status]}20` : undefined,
                  }}
                >
                  {status === 'totalOrders' ? 'Total Orders' : status}
                </button>
              ))}
            </div>

            <div className="h-50">
              {restaurantReport?.charts && getChartData().length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={getChartData()}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="2 2" stroke="#f0f0f0" />
                    <XAxis
                      dataKey={activeChart === 'daily' ? 'date' : 'weekStart'}
                      tickFormatter={formatDate}
                      stroke="#666"
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis allowDecimals={false} stroke="#666"  tick={{ fontSize: 12 }}/>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />

                    {Object.entries(selectedStatuses).map(
                      ([status, isSelected]) =>
                        isSelected && (
                          <Line
                            key={status}
                            type="monotone"
                            dataKey={status}
                            stroke={STATUS_COLORS[status]}
                            strokeWidth={status === 'totalOrders'}
                            dot={{ fill: STATUS_COLORS[status], strokeWidth: 1, r: 2 }}
                            activeDot={{ r: 4, stroke: STATUS_COLORS[status], strokeWidth: 1 }}
                          />
                        )
                    )}
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-500">
                  <p>No chart data available</p>
                </div>
              )}
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default RestaurantReport;