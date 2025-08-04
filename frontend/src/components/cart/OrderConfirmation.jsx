import { useEffect } from 'react';
import Confetti from 'react-confetti';
import PaymentAnimation from '/PaymentAnimation.gif';
import { useCartStore } from '../../stores/cartStore';
import { Home, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';

const OrderConfirmation = () => {
      const user = useAuthStore((state) => state.user);
  
  const { setOrderSuccess, setCartStep } = useCartStore((state) => state);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setOrderSuccess(false);
      setCartStep(1);
    }, 10000);
    return () => clearTimeout(timer);
  }, [setOrderSuccess, setCartStep]);

  const handleGoBack = () => {
    setOrderSuccess(false);
    setCartStep(1);
  };

  const handleGoToOrders = () => {
    setOrderSuccess(false);
    setCartStep(1);
    navigate(`/user/profile/order-history/${user.id}`);
  };

  return (
    <div className="flex justify-center items-center   px-4 relative">
      <Confetti width={window.innerWidth} height={window.innerHeight} />

      <div className="w-full max-w-xl p-8 rounded-2xl l relative overflow-hidden">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <img src={PaymentAnimation} alt="Payment Success" className="w-32 md:w-40" />
          </div>
          <h2 className="text-2xl font-bold text-green-600">Order Successfully Placed!</h2>
          <p className="text-gray-600">
            Thank you for your order. We&apos;ll notify you when your delicious food is on its way.
          </p>
        </div>

        {/* divider */}
        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="bg-white px-4 text-sm text-gray-500">Your food is being prepared</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={handleGoBack}
            className="group px-6 py-3 rounded-full border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700 font-medium transition flex items-center justify-center gap-2"
          >
            <Home size={18} className="transition duration-300 group-hover:scale-110" />
            <span>Back to Home</span>
          </button>
          <button
            onClick={handleGoToOrders}
            className="group px-6 py-3 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-red-700 text-white font-medium transition flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
          >
            <span>View My Orders</span>
            <ShoppingBag size={18} className="transition duration-300 group-hover:scale-110" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
