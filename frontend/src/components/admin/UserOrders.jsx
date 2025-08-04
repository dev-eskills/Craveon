import { useState } from 'react';
import { CheckCircle, ChevronDown, ChevronUp, Bike, Loader } from 'lucide-react';
import ContentWrapper from '../../components/ui/ContentWrapper';
import BackButton from '../../components/ui/BackButton';
import { useOrder } from '../../hooks/useOrder';

const UserOrders = () => {
  const [expanded, setExpanded] = useState(null);
  const { orders , isOrdersLoading} = useOrder();
  
  console.log('isOrdersLoading:', isOrdersLoading);
  const toggleExpand = (id) => {
    setExpanded(expanded === id ? null : id);
  };

  return (
    <ContentWrapper className="bg-gray-100">
      <div className="mx-auto p-4 bg-gray-100 min-h-screen">
        <BackButton text={'Recent Orders'} />
        {isOrdersLoading ? (
          <><Loader/></>
        ) : (
          <>
            {orders?.map((order) => (
              <div key={order._id} className="bg-white p-4 rounded shadow mb-4">
                <div
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() => toggleExpand(order._id)}
                >
                  <div>
                    <h3 className="font-semibold">{order.restaurant.name}</h3>
                    <p className="text-sm text-gray-500">Order #{order.orderNumber}</p>
                    <p className="flex items-center text-green-600 font-medium">
                      <CheckCircle className="w-4 h-4 mr-1" /> {order.status}
                    </p>
                  </div>
                  <div className="flex items-center">
                    {expanded === order.id ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </div>
                </div>

                {expanded === order._id && (
                  <div className="mt-4 border-t border-gray-300">
                    {/* Status Timeline */}
                    <div className="flex gap-3 text-sm text-gray-700  border-b border-gray-300 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <span className="flex items-center justify-center bg-green-600 p-1 text-white rounded-full font-medium">
                          <CheckCircle />
                        </span>
                        <p className="font-bold">Confirmed </p>
                      </div>

                      <div className="flex items-center justify-center gap-2">
                        <span className="flex items-center justify-center bg-green-600 p-1 text-white rounded-full font-medium">
                          <Bike />
                        </span>
                        <p className="font-bold">Delivered </p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <h4 className="font-medium">Order Details</h4>

                      <div className="flex justify-between text-sm text-gray-600 py-1">
                        <span>{order.totalQuantity}</span>
                        <span>{order.finalTotal}</span>
                      </div>
                    </div>
                    <div className="mt-4">
                      <h4 className="font-medium">Delivery Information</h4>
                      <p className="text-sm text-gray-600">
                        {order.deliveryAddress.addressLine1}, {order.deliveryAddress.addressLine2},{' '}
                        {order.deliveryAddress.city}
                      </p>
                      <p className="text-sm text-gray-500">
                        {order.deliveryAddress.state}, {order.deliveryAddress.postalCode}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </>
        )}
      </div>
    </ContentWrapper>
  );
};

export default UserOrders;
