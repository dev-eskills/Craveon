import { useCartStore } from '../../stores/cartStore';
import { ArrowLeft } from 'lucide-react';

const BillingForm = () => {
  const { setPaymentMode, paymentMode, setCartStep } = useCartStore((state) => state);

  return (
    <section>
      <button
        onClick={() => setCartStep(1)}
        className=" text-xl flex items-center justify-center mt-5 px-5  text-gray-700"
      >
        <ArrowLeft size={16} className="mr-1" />
        Back to Menu
      </button>
      <div className="px-4 py-6 bg-gray-50  w-full flex flex-col lg:flex-row gap-6  rounded-sm">
        <div className="w-full lg:w-2/3 space-y-6">
          {/* Billing Address Section */}

          {/* Payment Method Section */}
          <div className="pt-6 border-t border-gray-200">
            <h2 className="text-xl font-bold mb-4">Payment Method</h2>

            <div className="space-y-4">
              {/* <div className="flex items-center">
              <input
                type="radio"
                id="creditCard"
                name="paymentMethod"
                value="creditCard"
                checked={paymentMethod === 'creditCard'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <label htmlFor="creditCard" className="ml-2 flex items-center">
                <span className="text-sm font-medium text-gray-700 mr-2">Credit Card</span>
                <div className="flex space-x-1">
                  <div className="w-8 h-5 bg-blue-600 rounded"></div>
                  <div className="w-8 h-5 bg-red-500 rounded"></div>
                  <div className="w-8 h-5 bg-blue-400 rounded"></div>
                </div>
              </label>
            </div>

            {paymentMethod === 'creditCard' && (
              <div className="pl-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Card Number
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="0000 0000 0000 0000"
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <CreditCard className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Expiration Date
                    </label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                    <input
                      type="text"
                      placeholder="123"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            )} */}

              <div className="flex items-center">
                <input
                  type="radio"
                  id="ONLINE"
                  name="paymentMethod"
                  value="ONLINE"
                  checked={paymentMode === 'ONLINE'}
                  onChange={(e) => setPaymentMode(e.target.value)}
                  className="h-4 w-4 accent-[black]"
                />
                <label
                  htmlFor="ONLINE"
                  className="ml-2 text-sm font-medium text-gray-700 cursor-pointer"
                >
                  Online
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="radio"
                  id="COD"
                  name="paymentMethod"
                  value="COD"
                  checked={paymentMode === 'COD'}
                  onChange={(e) => setPaymentMode(e.target.value)}
                  className="h-4 w-4 accent-[black] "
                />
                <label
                  htmlFor="COD"
                  className="ml-2 text-sm font-medium text-gray-700 cursor-pointer"
                >
                  Cash on Delivery
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BillingForm;
