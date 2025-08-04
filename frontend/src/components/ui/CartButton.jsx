import { ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';

const CartButton = () => {
  const { cartItems } = useCart();

  return (
    <Link to={'cart'}>
      <button
        className="relative border border-gray-600 cursor-pointer 
        text-white px-2 sm:px-2.5 md:py-2.5 py-2 rounded-full bg-black transition-all duration-300 
        text-sm sm:text-base font-medium overflow-visible group"
      >
        {/* Blob Effect */}
        <span
          className="absolute inset-0 bg-white opacity-0 scale-50 
          group-hover:opacity-100 group-hover:scale-100 
          transition-all duration-500 rounded-full"
        ></span>

        {/* Cart Badge */}
        <span
          className="absolute -top-1 -right-2 bg-red-500 text-white 
          text-xs font-bold h-5 w-5 flex items-center justify-center rounded-full z-20"
        >
          {cartItems?.items?.length || 0}
        </span>

        {/* ShoppingCart Icon */}
        <ShoppingCart
          className="w-4 h-4 sm:w-5 sm:h-5 relative z-10 
          transition-colors duration-300 group-hover:text-black"
        />
      </button>
    </Link>
  );
};

export default CartButton;
