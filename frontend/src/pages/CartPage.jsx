import CartItem from '../components/cart/CartItem';
import DeliveryInfo from '../components/cart/DeliveryInfo';
import OrderSummary from '../components/cart/OrderSummary';
import { useCart } from '../hooks/useCart';
import BillingForm from '../components/cart/BillingForm';
import { useCartStore } from '../stores/cartStore';
import { Loader } from 'lucide-react';

const CartItemsSection = ({ cartStep, cartItems }) => {
  if (cartStep === 1) {
    return (
      <>
        {cartItems?.items.map((item) => (
          <CartItem key={item._id} item={item} />
        ))}
      </>
    );
  }

  if (cartStep === 2) {
    return <BillingForm />;
  }

  return null;
};

const CartPage = () => {
  const { cartItems , cartItemsLoading } = useCart();
  const { cartStep } = useCartStore((state) => state);

  if (cartItemsLoading) {
    return <Loader />;
  }
    return (
      <section className="max-w-6xl mx-auto px-4 py-6 bg-gray-50 min-h-screen flex flex-col lg:flex-row gap-8">
        {/* Left Side - Items / Billing / Delivery */}
        <div className="flex flex-col w-full lg:w-2/3 space-y-6">
          <CartItemsSection cartStep={cartStep} cartItems={cartItems} />
          <DeliveryInfo />
        </div>

        {/* Right Side - Summary */}
        <div className="w-full lg:w-1/2">
          <OrderSummary />
        </div>
      </section>
    );
};

export default CartPage;
