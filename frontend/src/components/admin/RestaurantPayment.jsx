import { BanknoteIcon, CreditCard } from 'lucide-react';

const RestaurantPayment = ({ singleRestaurant }) => {
  return (
    <div className=" p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Payment Options</h2>

      <div className="space-y-3">
        <div className="flex items-center p-3 rounded-md border border-gray-200 bg-white">
          <div
            className={`p-2 mr-3 rounded-full ${singleRestaurant.acceptsCash ? 'bg-gray-100 text-gray-600' : 'bg-green-100 text-green-400'}`}
          >
            <BanknoteIcon size={20} />
          </div>
          <div className="flex-1">
            <p className="font-medium">Cash Payment</p>
            <p className="text-sm text-gray-500">Pay with cash on delivery</p>
          </div>
          <div
            className={`px-3 py-1 rounded-full text-sm font-medium ${singleRestaurant.acceptsCash ? 'bg-gray-100 text-gray-600' : 'bg-green-100 text-green-500'}`}
          >
            {singleRestaurant.acceptsCash ? 'Unavailable' : 'Available'}
          </div>
        </div>

        <div className="flex items-center p-3 rounded-md border border-gray-200 bg-white">
          <div
            className={`p-2 mr-3 rounded-full ${singleRestaurant.acceptsOnlinePayment ? 'bg-gray-100 text-gray-600' : 'bg-green-100 text-green-400'}`}
          >
            <CreditCard size={20} />
          </div>
          <div className="flex-1">
            <p className="font-medium">Online Payment</p>
            <p className="text-sm text-gray-500">Pay with credit/debit card</p>
          </div>
          <div
            className={`px-3 py-1 rounded-full text-sm font-medium ${singleRestaurant.acceptsOnlinePayment ? 'bg-gray-100 text-gray-600' : 'bg-green-100 text-green-500'}`}
          >
            {singleRestaurant.acceptsOnlinePayment ? 'Unavailable' : 'Available'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantPayment;
