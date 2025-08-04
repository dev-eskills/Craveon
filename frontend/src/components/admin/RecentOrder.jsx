const recentOrders = [
  {
    id: '#12345',
    customer: 'Sarah Wilson',
    restaurant: 'Burger King',
    status: 'Delivered',
    amount: 24.99,
    restaurantAmount: 24.99,
    date: '2024-02-20 14:30',
  },
  {
    id: '#12344',
    customer: 'Mike Johnson',
    restaurant: 'Pizza Hut',
    status: 'In Progress',
    amount: 35.5,
    restaurantAmount: 35.5,
    date: '2024-02-20 14:25',
  },
  {
    id: '#12343',
    customer: 'Emma Davis',
    restaurant: 'Subway',
    status: 'Processing',
    amount: 18.75,
    restaurantAmount: 18.75,
    date: '2024-02-20 14:20',
  },
];

const RecentOrder = () => {
  return (
    <div className="border border-gray-100 rounded-xl ">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="lg:text-2xl py-2 font-semibold text-orange-400 text-lg">Recent Orders</h3>
          <button className="text-orange-500">View all</button>
        </div>
        <div className="overflow-x-auto custom-scrollbar">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className=" text-left text-xs lg:text-md text-gray-500 bg-gray-100">
                <th className="py-2 px-4 min-w-[120px]">Order ID</th>
                <th className="py-2 px-4 min-w-[150px]">Customer</th>
                <th className="py-2 px-4 min-w-[150px]">Restaurant</th>
                <th className="py-2 px-4 min-w-[120px]">Status</th>
                <th className="py-2 px-4 min-w-[150px]">Restaurant Amount</th>
                <th className="py-2 px-4 min-w-[120px]">Amount</th>
                <th className="py-2 px-4 min-w-[150px]">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id} className="border-b text-xs lg:text-sm border-gray-200">
                  <td className="py-3 px-4 whitespace-nowrap">{order.id}</td>
                  <td className="py-3 px-4 whitespace-nowrap">{order.customer}</td>
                  <td className="py-3 px-4 whitespace-nowrap">{order.restaurant}</td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        order.status === 'Delivered'
                          ? 'bg-green-100 text-green-800'
                          : order.status === 'In Progress'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">${order.restaurantAmount}</td>
                  <td className="py-3 px-4 whitespace-nowrap">${order.amount}</td>
                  <td className="py-3 px-4 whitespace-nowrap">{order.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RecentOrder;
