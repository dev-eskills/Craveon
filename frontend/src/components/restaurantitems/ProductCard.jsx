import { useAuthStore } from '../../stores/authStore';
import Add2CartBtn from '../ui/Add2CartBtn';
import { Star } from 'lucide-react';

const ProductCard = ({ product, idx, className }) => {
  const user = useAuthStore((state) => state.user);

  const { name, price, imageSrc, restaurantName } = product;

  return (
    <div className={`w-72 rounded-lg overflow-hidden shadow-lg bg-white ${className}`}>
      <div className="relative">
        <img src={imageSrc} alt={name} className="w-full h-48 object-cover" />
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg">{name}</h3>
          <span className="text-lg font-bold">${price.toFixed(2)}</span>
        </div>

        <div className="flex items-center mb-2">
          <Star size={16} fill="#FFD700" color="#FFD700" />
          <Star size={16} fill="#FFD700" color="#FFD700" />
          <Star size={16} fill="#FFD700" color="#FFD700" />
          <Star size={16} fill="#FFD700" color="#FFD700" />
          <Star size={16} fill="none" color="#FFD700" />
          <span className="text-sm text-gray-500 ml-1">(142)</span>
        </div>

        <div className="text-sm text-gray-500 mb-4">{restaurantName}</div>

        {!user?.role === 'admin' && (
          <Add2CartBtn link="/cart" className={idx || 'bg-orange-600'} product={product} />
        )}
      </div>
    </div>
  );
};

export default ProductCard;
