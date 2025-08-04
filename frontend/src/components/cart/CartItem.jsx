import { useState } from 'react';
import CartCount from '../ui/CartCount';
import ProductModal from '../ui/ProductModal';
import { ChevronRight, Ellipsis } from 'lucide-react';
import { useCart } from '../../hooks/useCart';

const CartItem = ({ item }) => {
  const [isPopup, setIsPopup] = useState(false);
  const openModal = () => {
    setIsPopup(true);
  };
  const { removeCartFn, removeCartPending } = useCart();

  const handleRemove = () => {
    removeCartFn({ productId: item.product._id });
  };

  console.log(item , "item")
  return (
    <div className="flex items-start py-4 border-b border-gray-200 last:border-0">
      <div className="w-20 h-20 flex-shrink-0 rounded overflow-hidden mr-4 ">
        <img src={item?.product?.image} alt={item?.name} className="w-full h-full object-cover" />
      </div>
      <div className="flex-grow">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-gray-900">{item?.product?.name}</h3>

          <button
            className="relative flex items-center justify-center py-1 group mt-2 text-sm text-[#ff6900]"
            onClick={openModal}
          >
            customize
            <ChevronRight className="text-[#ff6900] ml-1" size={18} />
            {/* Animated Border */}
            <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#ff6900] transition-all duration-300 group-hover:w-full"></span>
          </button>
        </div>
        <p className="text-sm text-gray-600 line-clamp-2">{item?.product?.description}</p>
        <div className="flex items-center mt-2 justify-between">
          <CartCount item={item} />
          <div className="flex space-x-5 items-center">
            <button
              disabled={removeCartPending}
              onClick={handleRemove}
              className="text-red-600 flex items-center text-sm space-x-4 disabled:border-none border-b disabled:text-gray-500 disabled:cursor-not-allowed"
            >
              {removeCartPending ? <Ellipsis /> : 'Remove'}
            </button>
            <span className="ml-auto font-bold">₹{item?.itemTotal}</span>
          </div>
        </div>
        <div className="py-2"></div>
      </div>

      {/* Popup */}
      {isPopup && (
        <ProductModal
          setIsPopup={setIsPopup}
          product={item.product}
          cartItem={item}
          isEditing={true}
        />
      )}
    </div>
  );
};

export default CartItem;
