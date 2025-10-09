import { useState, useEffect } from 'react';
import { X, Clock, Star, Tag, Truck } from 'lucide-react';
import { useCart } from '../../hooks/useCart';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import toast from 'react-hot-toast';

export default function ProductModal({ setIsPopup, product, cartItem = null, isEditing = false }) {
  const [stage, setStage] = useState(1);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const user = useAuthStore((state) => state.user);
  const { addCartFn, isAddCartPending } = useCart();
  const navigate = useNavigate();

  // Initialize selections from cart item if editing
  useEffect(() => {
    if (isEditing && cartItem) {
      // Set the selected size from cart item
      if (cartItem.product.attributes) {
        setSelectedSize(cartItem.selectedAttributes[0].selectedOption[0]);
      } else if (product?.attributes?.length > 0) {
        // Default to first size if none selected
        setSelectedSize(product.attributes[0]?.options[0]);
      }

      if (cartItem.product.addons && cartItem.selectedAddons) {
        const transformedAddons = cartItem.selectedAddons
          .map((selectedAddon) => {
            const matchingAddon = product.addons.find(
              (addon) => addon._id === selectedAddon.addon || addon._id === selectedAddon._id
            );
            return matchingAddon;
          })
          .filter((addon) => addon !== undefined);

        setSelectedAddons(transformedAddons);
      } else if (product?.addons?.length > 0) {
        setSelectedAddons([]);
      }

      // If editing, start at the addons stage
      setStage(2);
    } else if (product?.attributes?.length > 0) {
      // Default selection for new items
      setSelectedSize(product.attributes[0]?.options[0]);
    }
  }, [isEditing, cartItem, product]);

  const onClose = () => setIsPopup(false);

  const handleContinue = () => {
    setStage(2);
  };

  const handleChangeSize = () => {
    setStage(1);
  };

  const handleAddOrUpdateCart = () => {
    const cartData = {
      productId: product?._id,
      quantity: cartItem?.quantity || 1,
      selectedAttributes: [
        {
          name: product?.attributes[0]?.name,
          options: [selectedSize],
          _id: product?.attributes[0]?._id,
        },
      ],
      selectedAddons,
    };

    if (!user) {
      navigate('/login');
      toast('Please login to add items to cart');
      return;
    } else {
      addCartFn(cartData, {
        onSuccess: () => {
          navigate('/user/cart');
          onClose();
        },
      });
    }

  };

  // Calculate total price including size and addons
  const calculateTotalPrice = () => {
    const sizePrice = selectedSize?.price || 0;
    const addonPrice = selectedAddons.reduce((sum, addon) => sum + (addon.price || 0), 0);
    return sizePrice + addonPrice;
  };

  const handleAddonToggle = (addon) => {
    setSelectedAddons((prev) => {
      const exists = prev.some((item) => item._id === addon._id);
      if (exists) {
        return prev.filter((item) => item._id !== addon._id);
      } else {
        return [...prev, addon];
      }
    });
  };

  const isAddonSelected = (addonId) => {
    return selectedAddons.some((item) => item._id === addonId);
  };

  // Calculate discount percentage
  const calculateDiscountPercentage = () => {
    if (product?.price && product?.discountedPrice && product.price > product.discountedPrice) {
      return Math.round(((product.price - product.discountedPrice) / product.price) * 100);
    }
    return 0;
  };

  // Format the ratings
  const formatRatings = () => {
    if (product?.ratings?.count && product.ratings.count > 0) {
      return `${product.ratings.average?.toFixed(1)} ★ (${product.ratings.count} reviews)`;
    }
    return 'No ratings yet';
  };

  // Truncate description for initial display
  const truncateDescription = (text, maxLength = 100) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
  };

  // Product header section with image and basic info
  const renderProductHeader = () => (
    <div className="relative">
      {product?.image && (
        <div className="h-48 w-full overflow-hidden bg-gray-100">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          {calculateDiscountPercentage() > 0 && (
            <span className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 text-xs font-medium rounded">
              {calculateDiscountPercentage()}% OFF
            </span>
          )}
        </div>
      )}
      <div className="sm:p-4 p-2 bg-white rounded-b-xl shadow-md">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-md sm:text-xl font-bold">{product?.name}</h2>
            <p className="text-gray-600 text-sm">{product?.category?.name}</p>

            {product?.ratings?.count > 0 && (
              <div className="flex items-center mt-1 text-sm">
                <Star className="w-4 h-4 text-yellow-500 mr-1" fill="currentColor" />
                <span>{formatRatings()}</span>
              </div>
            )}
          </div>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-2">
          <div className="flex items-center gap-2">
            {product?.discountedPrice ? (
              <>
                <span className="sm:text-lg text-base font-bold">₹{product.discountedPrice}</span>
                <span className="text-gray-500 line-through sm:text-lg text-sm">
                  ₹{product.price}
                </span>
              </>
            ) : (
              <span className="sm:text-lg text-base font-bold">₹{product?.price}</span>
            )}
          </div>
        </div>
      </div>

    </div>
  );

  // Product Details Section
  const renderProductDetails = () => (
    <div className="px-4 py-3 ">
      {product?.description && (
        <div className="mb-3">
          <h3 className="text-sm font-medium text-gray-700 mb-1">About this dish</h3>
          <p className="text-sm text-gray-600">
            {showFullDescription ? product.description : truncateDescription(product.description)}
            {product.description && product.description.length > 100 && (
              <button
                onClick={() => setShowFullDescription(!showFullDescription)}
                className="text-orange-500 ml-1 text-sm font-medium"
              >
                {showFullDescription ? 'Read less' : 'Read more'}
              </button>
            )}
          </p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        {product?.preparationTime && (
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-500" />
            <span className="text-xs text-gray-600">{product.preparationTime} mins prep time</span>
          </div>
        )}

        {product?.packagingCharge != null && (
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-gray-500" />
            <span className="text-xs text-gray-600">₹{product.packagingCharge} packaging</span>
          </div>
        )}

        {product?.tags &&
          (() => {
            let tags = [];

            try {
              if (Array.isArray(product.tags)) {
                // If it's an array, check if the first item is a stringified array
                if (
                  typeof product.tags[0] === 'string' &&
                  product.tags.length === 1 &&
                  product.tags[0].includes('[')
                ) {
                  tags = JSON.parse(product.tags[0]); // Parse the first item
                } else {
                  tags = product.tags;
                }
              } else if (typeof product.tags === 'string') {
                // Parse the string
                tags = JSON.parse(product.tags);
              }
            } catch (e) {
              console.error('Error parsing tags:', product.tags, e);
            }

            return Array.isArray(tags) && tags.length ? (
              <div className="flex items-center gap-1 flex-wrap">
                <Tag className="w-4 h-4 text-gray-500" />
                {tags.map((tag, index) => (
                  <span
                    key={index}
                    className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            ) : null;
          })()}

        {product?.isVeg !== undefined && (
          <div className="flex items-center gap-2">
            <div
              className={`w-4 h-4 border ${product.isVeg ? 'border-green-500' : 'border-red-500'} flex items-center justify-center`}
            >
              <div
                className={`w-2 h-2 rounded-full ${product.isVeg ? 'bg-green-500' : 'bg-red-500'}`}
              ></div>
            </div>
            <span className="text-xs text-gray-600">
              {product.isVeg ? 'Vegetarian' : 'Non-vegetarian'}
            </span>
          </div>
        )}
      </div>
    </div>
  );

  const renderCustomizeSize = () => (
    <div className="flex-1  p-4">
      <h3 className="text-base font-medium mb-2">Customise as per your taste</h3>

      <div className="mb-6">
        <div className="text-md font-medium text-gray-700 my-3">{product?.attributes[0]?.name}</div>
        {product?.attributes[0].options?.map((attribute) => (
          <div
            key={attribute._id}
            className={`flex items-center justify-between py-3 px-3 border-b border-gray-100 ${selectedSize?._id === attribute._id ? 'bg-orange-50 rounded' : ''
              }`}
          >
            
            <div className="flex items-center gap-3">
              <input
                type="radio"
                id={`size-${attribute._id}`}
                name="size"
                checked={selectedSize?._id === attribute._id}
                onChange={() => setSelectedSize(attribute)}
                className="w-5 h-5 accent-orange-600 cursor-pointer"
              />

              <label htmlFor={`size-${attribute._id}`} className="text-sm font-medium">
                {attribute.name}
              </label>
            </div>
            <div className="text-sm font-semibold">₹ {attribute.price}</div>
          </div>
        ))}
      </div>
    </div>
  );

  // Render the size selection stage
  const renderSizeStage = () => (
    <>
      {renderProductHeader()}
      <div className="overflow-y-auto flex-1 divide-y-2 divide-gray-400/20">
        {renderProductDetails()}
        {renderCustomizeSize()}
      </div>

      <div className="p-3 border-t bg-gray-50">
        <button
          disabled={!selectedSize}
          onClick={handleContinue}
          className="w-full py-2 sm:py-3 bg-orange-600 disabled:bg-orange-200 text-white rounded-lg font-medium hover:bg-orange-700 transition flex items-center justify-center gap-2"
        >
          <span>Continue</span>
          {selectedSize && <span>• ₹{selectedSize.price}</span>}
        </button>
      </div>
    </>
  );

  const renderCustomAttributes = () => {
    return (
      <div className="flex-1 overflow-y-auto p-4">
        <h3 className="text-base font-medium mb-2">Customise as per your taste</h3>

        <div className="mb-4 bg-gray-50 p-3 rounded-lg">
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <span className="text-sm font-medium">{selectedSize?.name}</span>
              <span className="text-xs text-gray-500">₹{selectedSize?.price}</span>
            </div>
            <button onClick={handleChangeSize} className="text-sm text-orange-500 font-medium">
              Change
            </button>
          </div>
        </div>

        {product?.addons && product?.addons.length > 0 && (
          <div className="mb-6">
            <div className="flex justify-between items-center text-sm mb-2">
              <span className="font-medium">Addons ({selectedSize?.name?.toLowerCase()})</span>
              <span className="text-gray-500 text-xs">
                ({selectedAddons.length}/{product.addons.length})
              </span>
            </div>

            {product.addons.map((addon) => (
              <div
                key={addon._id}
                className={`flex items-center justify-between py-3 px-3 border-b border-gray-100 ${isAddonSelected(addon._id) ? 'bg-green-50 rounded' : ''
                  }`}
              >
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id={`addon-${addon._id}`}
                    checked={isAddonSelected(addon._id)}
                    onChange={() => handleAddonToggle(addon)}
                    className="w-5 h-5 accent-green-600"
                  />
                  <label htmlFor={`addon-${addon._id}`} className="text-sm">
                    {addon.name}
                    {addon.description && (
                      <p className="text-xs text-gray-500">{addon.description}</p>
                    )}
                  </label>
                </div>
                <div className="text-sm font-medium">+ ₹ {addon.price}</div>
              </div>
            ))}

            {product.addons.length > 5 && (
              <button className="text-sm text-green-600 mt-2 font-medium">+ 5 more</button>
            )}
          </div>
        )}
      </div>
    );
  };

  // Render the addons selection stage
  const renderAddonsStage = () => (
    <>
      {renderProductHeader()}
      <div className="overflow-y-auto flex-1 divide-y-2 divide-gray-400/20">
        {renderProductDetails()}
        {renderCustomAttributes()}
      </div>

      <div className="p-4 border-t bg-gray-50">
        <button
          disabled={isAddCartPending}
          onClick={handleAddOrUpdateCart}
          className="w-full py-3 bg-green-600 disabled:bg-gray-400 text-white rounded-lg font-semibold hover:bg-green-700 transition flex items-center justify-center gap-2"
        >
          {isAddCartPending ? (
            <span>Adding item to cart...</span>
          ) : (
            <>
              <span>{isEditing ? 'Update Item' : 'Add Item to cart'}</span>
              <span>• ₹{calculateTotalPrice().toFixed(2)}</span>
            </>
          )}
        </button>
      </div>
    </>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col">
        {stage === 1 ? renderSizeStage() : renderAddonsStage()}
      </div>
    </div>
  );
}

