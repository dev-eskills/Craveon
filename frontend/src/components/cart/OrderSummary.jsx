import { useState } from 'react';
import { Clock } from 'lucide-react';
import { useCartStore } from '../../stores/cartStore';
import { useCart } from '../../hooks/useCart';
import { useOrder } from '../../hooks/useOrder';

const OrderSummary = () => {
  const [termsAccepted, setTermsAccepted] = useState(false);
  const { cartItems } = useCart();
  const { selectedDelAddress, paymentMode, setCartStep, cartStep } = useCartStore((state) => state);
  const { createOrderFn, createOrderLoading } = useOrder();

  const onPlaceOrder = () => {
    if (cartStep === 1) {
      setCartStep(2);
      return;
    }

    if (cartStep === 2) {
      createOrderFn({
        paymentMode: paymentMode,
        deliveryAddressId: selectedDelAddress._id,
      });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 sticky top-5">
      <h2 className="text-xl font-bold mb-4">Order Summary</h2>
      <div className="space-y-4">
        {/* Order Items */}
        {cartItems?.items?.map((item) => (
          <div key={item._id} className="flex justify-between items-center">
            <div>
              <span className="text-gray-900">{item.product.name}</span>
              <span className="text-gray-500 text-sm ml-1">x{item.quantity}</span>
            </div>
            <span className="text-gray-900">₹{item?.itemTotal}</span>
          </div>
        ))}

        {/* Cost Breakdown */}
        <div className="space-y-3 pt-3 border-t border-gray-200">
          <div className="flex justify-between">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-medium">₹{cartItems?.subtotal}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Delivery Fee</span>
            <span className="font-medium">₹{cartItems?.deliveryFee}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Tax</span>
            <span className="font-medium">₹{cartItems?.taxAmount}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Packaging Charge</span>
            <span className="font-medium">₹{cartItems?.packagingCharge}</span>
          </div>
        </div>

        {/* Total */}
        <div className="flex justify-between items-center pt-4 border-t border-gray-200">
          <span className="font-bold text-gray-900">Total</span>
          <span className="font-bold text-gray-900">₹{cartItems?.finalTotal}</span>
        </div>

        {/* Delivery Time */}
        <div className="flex items-center text-gray-600 text-sm pt-2">
          <Clock size={16} className="mr-2" />
          <span>Estimated delivery time: 30-45 minutes</span>
        </div>

        {/* Terms Checkbox */}
        <div className="flex items-center pt-2">
          <input
            type="checkbox"
            id="terms"
            checked={termsAccepted}
            onChange={(e) => setTermsAccepted(e.target.checked)}
            className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded"
          />
          <label htmlFor="terms" className="ml-2 text-sm text-gray-600 cursor-pointer">
            I agree to the terms and conditions
          </label>
        </div>

        {/* Place Order Button */}

        <button
          className={`w-full py-3 px-4 rounded-md font-medium text-white mt-4  ${
            termsAccepted && selectedDelAddress && !createOrderLoading
              ? 'bg-[#ff6900] hover:bg-orange-600 cursor-pointer'
              : 'bg-[#ff6a0088] cursor-not-allowed'
          }`}
          disabled={!termsAccepted || !selectedDelAddress || createOrderLoading}
          onClick={onPlaceOrder}
        >
          Place Order · ₹ {cartItems?.finalTotal}
        </button>
      </div>
    </div>
  );
};

export default OrderSummary;
