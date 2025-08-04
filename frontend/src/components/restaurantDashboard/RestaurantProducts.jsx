import { ChevronDown, ChevronUp, Clock, ImageIcon, Package, Pencil, Tag } from 'lucide-react';
import { useState } from 'react';
import useProduct from '../../hooks/useProduct';
import { useAuthStore } from '../../stores/authStore';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/axios';
import toast from 'react-hot-toast';
import Spinner from '../ui/Spinner';
import RestaurantSkeleton from '../skeleton/RestaurantSkeleton';

// Single product card component
const ProductCard = ({ product }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const navigate = useNavigate();

  const toggleExpansion = () => {
    setIsExpanded(!isExpanded);
  };

  const { updateAvailabilityFn, isUpdateAvailabilty } = useProduct();

  const handleEditProduct = async (productId) => {
    try {
      const response = await api.get(`/restaurant/product/details/${productId}`);
      const productData = response.data.data;
      navigate('/restaurant/addProduct', { state: { product: productData } });
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('Failed to fetch product details');
    }
  };

  return (
    <div className="bg-white rounded-lg w-full shadow-lg hover:shadow-xl transition-all duration-300 h-fit">
      <div className="flex flex-col cursor-pointer rounded-lg overflow-hidden md:min-w-75  ">
        {/* Product Image */}
        <div className="w-full h-56 bg-gray-100 flex justify-center items-center overflow-hidden relative">
          {product.image ? (
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <div className="h-full w-full flex items-center justify-center bg-gray-200">
              <ImageIcon className="text-gray-400 h-12 w-12" />
            </div>
          )}
          {product.featured && (
            <div className="absolute top-2 right-2 bg-[#ff6900] text-white text-xs font-medium px-2 py-1 rounded-md">
              Featured
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="p-4 h-fit">
          {/* Always visible section */}
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-bold text-lg text-gray-900">{product.name}</h3>
            <div className="flex items-center space-x-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleEditProduct(product._id);
                }}
                className="p-1.5 bg-[#ff6900] hover:bg-orange-600 rounded-full transition cursor-pointer"
              >
                <Pencil className="h-4 w-4 text-white" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  updateAvailabilityFn(product._id, {
                    onSuccess: () => {
                      toast.success(
                        product?.isAvailable
                          ? 'Product disabled successfully'
                          : 'Product enabled successfully'
                      );
                    },
                  });
                }}
                className={`w-12 h-6 flex items-center rounded-full transition cursor-pointer ${
                  product?.isAvailable ? 'bg-[#ff6900]' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full shadow transform transition duration-200 ${
                    product?.isAvailable ? 'translate-x-7' : 'translate-x-1'
                  } flex items-center justify-center`}
                >
                  {isUpdateAvailabilty && <Spinner className="h-3 w-3" />}
                </div>
              </button>
            </div>
          </div>

          {/* Price Section - Always visible */}
          <div className="flex items-baseline mt-1 mb-3">
            <div className="text-lg font-bold text-[#ff6900]">
              ₹{product.discountedPrice ? product.discountedPrice : product.price}
            </div>
            {product.discountedPrice && (
              <>
                <div className="ml-2 text-xs text-gray-500 line-through">₹{product.price}</div>
              </>
            )}
          </div>

          {/* Description - Always visible */}
          <p
            className={`text-sm text-gray-600 mb-3  ${isExpanded ? 'h-auto line-clamp-none' : 'h-10 line-clamp-2'}`}
          >
            {product.description}
          </p>

          {/* Collapsible section for additional details */}
          {isExpanded && (
            <div className="border-t border-gray-100 pt-3 mt-2">
              {/* Status Tags */}
              <div className="flex flex-wrap gap-1.5 mb-3">
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${
                    product?.isVeg ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}
                >
                  {product.isVeg ? 'Veg' : 'Non-Veg'}
                </span>
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${
                    product.isAvailable
                      ? 'bg-[#fff0e6] text-[#ff6900]'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {product.isAvailable ? 'Available' : 'Unavailable'}
                </span>
                {product?.category && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
                    {product?.category?.name}
                  </span>
                )}
              </div>

              {/* Attributes */}
              {product?.attributes && product?.attributes.length > 0 && (
                <div className="mb-3">
                  <h4 className="text-sm font-medium text-gray-700 mb-1">Attributes</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {product.attributes[0]?.options.map(({ _id, name, price }) => (
                      <span
                        key={_id}
                        className="text-xs px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded-md"
                      >
                        {name} ₹{price}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Additional Details */}
              <div className="grid grid-cols-2 gap-2 text-xs text-gray-700 mb-3">
                {product.preparationTime && (
                  <div className="flex items-center">
                    <Clock className="h-3 w-3 mr-1 text-[#ff6900]" />
                    <span>Prep: {product.preparationTime} mins</span>
                  </div>
                )}
                {product.packagingCharge && (
                  <div className="flex items-center">
                    <Package className="h-3 w-3 mr-1 text-[#ff6900]" />
                    <span>Packaging: ₹{product.packagingCharge}</span>
                  </div>
                )}
                {product.taxRate && (
                  <div className="flex items-center">
                    <Tag className="h-3 w-3 mr-1 text-[#ff6900]" />
                    <span>Tax: {product.taxRate}%</span>
                  </div>
                )}
              </div>

              {/* Addons */}
              {product?.addons && product.addons?.length > 0 && (
                <div className="mb-3">
                  <h4 className="text-sm font-medium text-gray-700 mb-1">Addons</h4>
                  <div className="grid grid-cols-2 gap-1 text-xs">
                    {product.addons.map((addon, index) => (
                      <div
                        key={index}
                        className="flex justify-between border-b border-gray-100 py-0.5"
                      >
                        <span className="text-gray-700">{addon.name}</span>
                        <span className="font-medium text-[#ff6900]">₹{addon.price}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tags */}
              {product?.tags && product.tags.length > 0 && (
                <div className="mb-3">
                  <h4 className="text-sm font-medium text-gray-700 mb-1">Tags</h4>
                  <div className="flex flex-wrap gap-1">
                    {product.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="text-xs bg-[#fff0e6] text-[#ff6900] px-2 py-0.5 rounded-md"
                      >
                        {tag.startsWith('#') ? tag : `#${tag}`}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Toggle Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleExpansion();
            }}
            className="bg-[#ff6900] cursor-pointer hover:bg-orange-600 text-white font-medium rounded-lg py-2 mt-2 w-full flex items-center justify-center transition text-sm"
          >
            {isExpanded ? 'View Less' : 'View More'}
            {isExpanded ? (
              <ChevronUp size={16} className="ml-1" />
            ) : (
              <ChevronDown size={16} className="ml-1" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// Main component that directly uses sample data
const RestaurantProducts = () => {
  const user = useAuthStore((state) => state.user);
  const restaurantId = user?.id;

  const { products, isProduct } = useProduct(restaurantId);

  if (isProduct) {
    return <RestaurantSkeleton className="grid-cols-3" />;
  }

  if (products?.length <= 0) {
    return (
      <div className="h-full w-full flex justify-center items-center gap-2">
        <span className="size-2 rounded-full bg-green-400 "></span>
        <h1>No Products found</h1>
      </div>
    );
  }
  return (
    <div className="md:p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {products?.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
};

export default RestaurantProducts;
