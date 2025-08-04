import { useCart } from '../../hooks/useCart';

const CartCount = ({ item }) => {
  const { quantity, product } = item || {};
  const { updateCartFn, isUpdateCartPending } = useCart();

  const updateCart = (newQuantity) => {
    updateCartFn({ quantity: newQuantity, productId: product._id });
  };

  const increment = () => {
    updateCart(quantity + 1);
  };

  const decrement = () => {

    updateCart(quantity - 1);
  };

  return (
    <div className="flex items-center">
      <button
        disabled={isUpdateCartPending}
        onClick={decrement}
        className="w-8 h-8 cursor-pointer flex items-center justify-center rounded-full border border-gray-300 text-gray-500 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-400"
      >
        -
      </button>
      <span className="mx-3 w-6 text-center">{quantity}</span>
      <button
        disabled={isUpdateCartPending}
        onClick={increment}
        className="w-8 h-8 cursor-pointer flex items-center justify-center rounded-full border border-gray-300 text-gray-500 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-400"
      >
        +
      </button>
    </div>
  );
};

export default CartCount;
