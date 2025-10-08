import { Link, Navigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { useCart } from '../hooks/useCart';
import emptyCart1 from '/emptyCart1.png';
import { useCartStore } from '../stores/cartStore';
import OrderConfirmation from '../components/cart/OrderConfirmation';
import { Loader } from 'lucide-react';

export const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const user = useAuthStore((state) => state.user);

  if (!allowedRoles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export const ProtectPayment = ({ children }) => {
  const item = [1];
  if (item.length >= 1) {
    return children;
  } else {
    return <Navigate to="/user/cart" replace />;
  }
};

export const ProtectCart = ({ children }) => {
  const { orderSuccess } = useCartStore((state) => state);
  const user = useAuthStore((state) => state.user);
  const { cartItems, cartItemsLoading } = useCart();

  // Check authentication first
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Show loading state while fetching cart data
  if (cartItemsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <Loader className="animate-spin h-8 w-8 text-[#ff6900]" />
      </div>
    );
  }

  // Show order confirmation if order was successful
  if (orderSuccess) {
    return <OrderConfirmation />;
  }

  // Check if cart is empty only after loading is complete
  if (!cartItems || !cartItems.items || cartItems.items.length === 0) {
    return (
      <div className="flex items-center justify-center gap-7 text-center flex-col py-3">
        <img src={emptyCart1} alt="Empty cart" className="w-full max-w-xs mx-auto opacity-90" />
        <div className="mt-2">
          <h1 className="md:text-2xl text-xl font-bold">Your cart is empty</h1>
          <p className="md:text-[15px] text-sm">You can go to home page to view more restaurants</p>
        </div>
        <Link
          to="/user"
          className="bg-[#ff6900] text-white md:p-2 md:px-3 p-1 px-2 md:text-md text-sm rounded-full hover:bg-[#e55a00] transition-colors"
        >
          Order Now
        </Link>
      </div>
    );
  }

  // Return children if cart has items
  return children;
};
