import { useEffect, useState } from 'react';
import { Star, Heart, ChevronRight, Loader } from 'lucide-react';
import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../../utils/axios';
import ProductModal from '../ui/ProductModal';
import { useCart } from '../../hooks/useCart';
import CategoryRestroSkeleton from '../skeleton/CategoryRestroSkeleton';

const SingleRestaurantPage = () => {
  const { id } = useParams();
  const [isPopup, setIsPopup] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isProductLoading, setIsProductLoading] = useState(false);
  const [activeTag, setActiveTag] = useState('Popular');
  const { addCartFn } = useCart();
  const handleAddOrUpdateCart = (item) => {
    const cartData = {
      productId: item._id,
      quantity: selectedProduct?.quantity || 1,
    };

    addCartFn(cartData);
  };

  const { data, refetch , isPending } = useQuery({
    queryKey: ['userRestaurant', id],
    queryFn: async () => {
      const categoryId = data?.categories?.find((cat) => cat.name === activeTag)?._id || '';
      const response = await api.get(`/restaurant/product/user/${id}?catId=${categoryId}`);
      return response.data.data;
    },
    enabled: !!id,
  });

  const { restaurant: restaurantData = [], products } = data ?? {};

  useEffect(() => {
    setIsProductLoading(true);
    refetch().finally(() => setIsProductLoading(false));
  }, [activeTag]);

  const openModal = (product) => {
    setIsPopup(true);
    setSelectedProduct(product);
  };

  if (isPending){
    return <CategoryRestroSkeleton/>
  }
    return (
      <div className="bg-gray-50 min-h-screen pb-20">
        {/* Restaurant Header */}
        <div className="relative h-64 md:h-72 overflow-hidden bg-gradient-to-b from-black/60 to-black/30">
          <img
            src={
              restaurantData.images?.cover ||
              'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1074&auto=format&fit=crop'
            }
            alt={restaurantData.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-full p-6 text-white">
            <h1 className="text-3xl font-bold mb-2">{restaurantData?.name}</h1>

            <div className="text-sm  text-gray-200 mb-3 max-w-2xl">
              <p>{restaurantData?.description}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {restaurantData.tags?.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-black/30 text-white border-white/20 backdrop-blur-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <button
            className="absolute top-4 right-4 bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 hover:text-white inline-flex items-center justify-center font-medium transition-colors focus:outline-none p-2 rounded-full"
            onClick={() => console.log('Favorited')}
          >
            <Heart className="h-5 w-5" />
          </button>
        </div>

        {/* Menu Categories */}
        <div className="sticky top-0 z-10 bg-white shadow-sm">
          <div className="px-4">
            <div className="overflow-x-auto py-4 flex gap-2 no-scrollbar">
              <button
                className={`inline-flex items-center justify-center font-medium transition-colors focus:outline-none rounded-full whitespace-nowrap px-4 py-2 ${activeTag === 'Popular' ? 'bg-orange-500 text-white hover:bg-orange-600' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                onClick={() => setActiveTag('Popular')}
              >
                {'Popular'}
              </button>

              {data?.categories?.map((cat) => (
                <button
                  key={cat._id}
                  className={`inline-flex items-center justify-center font-medium transition-colors focus:outline-none rounded-full whitespace-nowrap px-4 py-2 ${activeTag === cat.name ? 'bg-orange-500 text-white hover:bg-orange-600' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                  onClick={() => setActiveTag(cat.name)}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className=" mx-auto px-4 py-8">
          <h2 className="text-2xl font-bold mb-6">{activeTag}</h2>
          {isProductLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="animate-pulse bg-white rounded-lg p-4 shadow-sm space-y-4">
                  <div className="bg-gray-200 h-40 w-full rounded-md" />
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                  <div className="h-3 bg-gray-100 rounded w-5/6" />
                  <div className="flex space-x-2 pt-2">
                    <div className="h-8 bg-gray-200 rounded w-full" />
                    <div className="h-8 bg-gray-200 rounded w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 md:gap-10 lg:grid-cols-4 lg:gap-12 sm:space-y-0 space-y-3">
              <>
                {products?.map((item) => {
                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden h-full hover:shadow-md transition-shadow">
                        <div className="relative h-48 overflow-hidden bg-gray-100">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                          />
                          {/* <button
                      className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm hover:bg-white inline-flex items-center justify-center font-medium transition-colors focus:outline-none p-2 rounded-full"
                      onClick={() => console.log('Favorited item')}
                    >
                      <Heart className="h-4 w-4" />
                    </button> */}
                        </div>
                        <div className="p-4 ">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-bold text-lg line sm:w-30 sm:h-12 ">{item.name}</h3>
                            <span className="font-semibold text-orange-600 flex flex-col sm:flex-row items-center ">
                              ₹ {item.discountedPrice || item.price.toFixed(2)}
                              <span className="sm:ml-2 text-sm text-gray-500 line-through">
                                ₹{item.discountedPrice && item.price.toFixed(2)}
                              </span>
                            </span>
                          </div>
                          {/* {item.ratingCount > 0 && (
                      <div className="flex items-center mb-2 text-sm">
                        <Star className="w-3 h-3 text-yellow-500 fill-yellow-500 mr-1" />
                        <span className="font-medium mr-1">{item.ratings.average}</span>
                        <span className="text-gray-500">({item.ratings.count})</span>
                      </div>
                    )} */}
                          <p className="text-gray-600 text-sm mb-4 line-clamp-2 h-10">
                            {item.description}
                          </p>

                          <div className="flex gap-2">
                            {item.customizable && (
                              <button
                                className="flex-1 border border-orange-500 text-orange-500 hover:bg-orange-50 inline-flex items-center justify-center font-medium transition-colors focus:outline-none text-sm px-4 py-2 rounded-md"
                                onClick={() => console.log('Customize clicked')}
                              >
                                Customize
                                <ChevronRight className="h-4 w-4 ml-1" />
                              </button>
                            )}

                            <button
                              className="flex-1 bg-orange-500 text-white hover:bg-orange-600 inline-flex items-center justify-center font-medium transition-colors focus:outline-none text-sm px-4 py-2 rounded-md"
                              onClick={() => {
                                if (item?.attributes?.length > 0) {
                                  openModal(item);
                                } else {
                                  handleAddOrUpdateCart(item);
                                }
                              }}
                            >
                              Add to cart
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </>

              {isPopup && (
                <ProductModal isPopup={isPopup} setIsPopup={setIsPopup} product={selectedProduct} />
              )}
            </div>
          )}
        </div>
      </div>
    );
};

export default SingleRestaurantPage;
