import { Clock, Star } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import ProductModal from '../ui/ProductModal';
import { useCart } from '../../hooks/useCart';
import { useAuthStore } from '../../stores/authStore';
import { useState } from 'react';

const CategoryRestroCard = ({ products }) => {

  const [isPopup, setIsPopup] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const { addCartFn } = useCart();
  const navigate = useNavigate();
  const { user } = useAuthStore((state) => state?.user) ?? {};

  const openModal = (product) => {
    setIsPopup(true);
    setSelectedProduct(product);
  };

  const handleAddCart = (id) => {
    if (!user) {
      navigate('/login');
      return;
    }
    const product = {
      productId: id,
      quantity: 1,
      selectedAttributes: [],
      selectedAddons: [],
    };
    addCartFn(product);
  };

  return (
    <div className="flex flex-col gap-8">
      {products.map((product) => (
        <div
          key={product._id}
          className="bg-white rounded-lg overflow-hidden border-0 shadow-sm hover:shadow-md transition-all duration-300"
        >
          <div className="flex flex-col md:flex-row">
            {/* Image Section */}
            <div className="relative w-full md:w-1/3 h-60">
              <img
                src={product.image}
                alt={product.name}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-70"></div>

              {/* Restaurant badge positioned on image */}
              <Link
                to={`/user/restaurant/${product.restaurant?._id}`}
                className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-gray-800 px-3 py-1.5 rounded-md text-sm font-medium shadow-sm hover:bg-white transition-all duration-200"
                onClick={(e) => e.stopPropagation()}
              >
                {product.restaurant?.name}
              </Link>

              {/* Rating badge */}
              {product.ratings?.count > 0 && (
                <div className="absolute top-4 right-4 flex items-center bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-md shadow-sm">
                  <Star size={16} className="text-yellow-500 fill-yellow-500" />
                  <span className="ml-1 font-semibold text-gray-800">{product.ratings.count}</span>
                </div>
              )}
            </div>

            {/* Content Section */}
            <div className="w-full md:w-2/3 p-5 md:p-6 flex flex-col">
              <div className="mb-4">
                <h2 className="text-xl font-bold text-gray-900 mb-2">{product.name}</h2>
                <p className="text-gray-600 text-sm line-clamp-2 mb-4">{product.description}</p>

                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center text-gray-500">
                    <Clock size={16} className="mr-1.5" />
                    <span>{product?.preparationTime} min</span>
                  </div>
                </div>
              </div>

              <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between items-center">
                <div className="flex-col flex sm:flex-row space-x-2 sm:items-center ">
                  <div className="text-xl font-bold text-black">
                    ₹{parseFloat(product.discountedPrice).toFixed(2)}
                  </div>
                  <div className="text-base font-semibold text-gray-500 line-through">
                    ₹{parseFloat(product.price).toFixed(2)}
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (product.attributes.length > 0) {
                      openModal(product);
                    } else {
                      handleAddCart(product._id);
                    }
                  }}
                  className="bg-[#ff6900] hover:bg-orange-700 text-white px-6 py-2 rounded-md font-medium transition-colors duration-200"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Popup */}
      {isPopup && (
        <ProductModal isPopup={isPopup} setIsPopup={setIsPopup} product={selectedProduct} />
      )}
    </div>
  );
};

export default CategoryRestroCard;
