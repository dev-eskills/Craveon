import { useParams } from 'react-router-dom';
import { useOrder } from '../../hooks/useOrder';
import SingleOrderSkeleton from '../skeleton/SingleOrderSkeleton';

const SingleOrder = () => {
  const { id } = useParams();

  const { singleOrder, singleOrderLoading } = useOrder(null, null, null, '', null, null, null, id);

  if (singleOrderLoading) return <SingleOrderSkeleton />;
  // if (!singleOrder) return <div className="p-6">No order found.</div>;

  const {
    orderNumber,
    status,
    user,
    finalTotal,
    deliveryAddress,
    paymentDetails,
    items,
    subtotal,
    taxAmount,
    packagingCharge,
    deliveryFee,
    paymentMode,
    paymentProvider,
    paymentStatus,
    estimatedDeliveryTime,
    restaurant,
    createdAt,
  } = singleOrder.order;

  return (
    <div className="w-full space-y-2 bg-white min-h-screen">
      {/* Order Header */}
      <div className="bg-white rounded-xl shadow-sm p-6 ">
        <h2 className="text-2xl font-bold text-gray-800">Order #{orderNumber}</h2>
        <p className="text-sm text-gray-500">Placed on {new Date(createdAt).toLocaleString()}</p>
        <span
          className={`inline-block mt-2 px-3 py-1 text-sm rounded-full font-medium ${
            status === 'REJECTED'
              ? 'bg-red-100 text-red-600'
              : status === 'PENDING'
                ? 'bg-yellow-100 text-yellow-700'
                : 'bg-green-100 text-green-700'
          }`}
        >
          {status}
        </span>
      </div>

      {/* Grid Layout */}
      <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-2">
        {/* Payment Details */}
        {paymentDetails && (
          <div className="bg-white rounded-xl shadow-sm p-6 ">
            <h3 className="text-sm font-semibold mb-2 text-gray-700">Payment Details</h3>
            <p className="text-sm text-gray-800">Order ID: {paymentDetails?.orderId}</p>
            <p className="text-sm text-gray-800">Payment ID: {paymentDetails?.paymentId}</p>
            <p className="text-sm text-gray-800">
              Date: {new Date(paymentDetails?.paymentDate).toLocaleString()}
            </p>
          </div>
        )}

        {/* Restaurant Info */}
        <div className="bg-white rounded-xl shadow-sm p-6 text-sm">
          <h3 className="font-semibold mb-2 text-gray-700">Restaurant & Delivery</h3>
          <p className="text-gray-900 font-medium text-sm">Restaurant: {restaurant?.name}</p>
          <p className="text-sm text-gray-600">
            Address: {restaurant?.address?.street}, {restaurant?.address?.city},{' '}
            {restaurant?.address?.state}
          </p>
          <p className="text-sm text-gray-600">
            Estimated Delivery: {new Date(estimatedDeliveryTime).toLocaleString()}
          </p>
        </div>

        {/* Customer Info */}
        <div className="bg-white rounded-xl shadow-sm p-6 ">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Customer</h3>
          <p className="text-gray-900 text-sm">{user?.name}</p>
          <p className="text-sm text-gray-600 text-sm">{user?.email}</p>
        </div>

        {/* Delivery Address */}
        <div className="bg-white rounded-xl shadow-sm p-6 ">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Delivery Address</h3>
          <div className="text-gray-800 space-y-1 text-sm">
            <p>{deliveryAddress?.fullName || 'N/A'}</p>
            <p>
              {deliveryAddress?.addressLine1}, {deliveryAddress?.addressLine2}
            </p>
            <p>
              {deliveryAddress?.city}, {deliveryAddress?.state} - {deliveryAddress?.postalCode}
            </p>
            <p>Type: {deliveryAddress?.addressType}</p>
            {deliveryAddress?.phoneNumber && <p>Phone: {deliveryAddress?.phoneNumber}</p>}
          </div>
        </div>

        {/* Charges & Payment */}
        <div className="bg-white rounded-xl shadow-sm p-6 ">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Charges & Payment</h3>
          <div className="space-y-1 text-sm text-gray-700 ">
            <p>Subtotal: ₹{subtotal}</p>
            <p>Tax: ₹{taxAmount}</p>
            <p>Packaging: ₹{packagingCharge}</p>
            <p>Delivery Fee: ₹{deliveryFee}</p>
            <p className="font-semibold text-sm mt-2">Total Paid: ₹{finalTotal}</p>
            <p className="mt-1">
              Mode: {paymentMode} via {paymentProvider}
            </p>
            <p>
              Payment Status:{' '}
              <span
                className={`font-semibold ${
                  paymentStatus === 'PAID' ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {paymentStatus}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Ordered Items - Full Width Below */}
      <div className="bg-white rounded-xl shadow-sm p-6 ">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">Ordered Items</h3>
        <ul className="divide-y divide-gray-200">
          {items?.map((item, index) => {
            const selectedAttributes = item?.selectedAttributes || [];
            const parsedAttributes = selectedAttributes.map((attr) => {
              let option = {};
              try {
                option = JSON.parse(attr.selectedOption)?.[0] || {};
              } catch (e) {
                console.error('Invalid selectedOption JSON', attr.selectedOption);
              }
              return {
                name: attr.attributeName,
                optionName: option.name,
                additionalPrice: attr.additionalPrice,
              };
            });

            const product = item?.product;

            return (
              <li key={index} className="py-6 space-y-2">
                <div className="flex flex-col md:flex-row gap-4">
                  <img
                    src={product?.image}
                    alt={product?.name}
                    className="w-28 h-28 object-cover rounded-md "
                  />
                  <div className="flex-1 space-y-1">
                    <p className="text-lg font-semibold text-gray-800">
                      {product?.name} × {item?.quantity}
                    </p>
                    <p className="text-sm text-gray-600">{product?.description}</p>
                    <p className="text-sm text-gray-500">
                      Price: ₹{product?.discountedPrice ?? product?.price}
                    </p>

                    {/* Attributes */}
                    {parsedAttributes.length > 0 && (
                      <div className="text-sm text-gray-700 mt-2">
                        <p className="font-medium">Attributes:</p>
                        <ul className="list-disc list-inside">
                          {parsedAttributes.map((attr, i) => (
                            <li key={i}>
                              {attr.name}: {attr.optionName} (+₹{attr.additionalPrice})
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Addons */}
                    {item?.selectedAddons?.length > 0 && (
                      <div className="text-sm text-gray-700 mt-2">
                        <p className="font-medium">Addons:</p>
                        <ul className="list-disc list-inside">
                          {item.selectedAddons.map((addon, i) => (
                            <li key={i}>
                              {addon.name} (+₹{addon.price})
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Special Instructions */}
                    {/* {item?.specialInstructions?.trim() !== '' && (
                      <div className="text-sm text-gray-600 mt-2">
                        <p className="font-medium text-gray-700">Special Instructions:</p>
                        <p className="italic">{item.specialInstructions}</p>
                      </div>
                    )} */}

                    {/* Item Total */}
                    <p className="text-sm font-semibold text-gray-800 mt-2">
                      Item Total: ₹{item?.itemTotal}
                    </p>
                  </div>
                </div>
              </li>
            );
          })}

          <div>
            <h1 className="font-bold py-2 text-sm">FInal Total : {finalTotal}</h1>
          </div>
        </ul>
      </div>
    </div>
  );
};

export default SingleOrder;
