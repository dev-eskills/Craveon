import { useEffect, useState } from 'react';
import { Image, Clock, Tag, Trash2, Plus, Save } from 'lucide-react';
import useProduct from '../../hooks/useProduct';
import { useAuthStore } from '../../stores/authStore';
import Spinner from '../ui/Spinner';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCategories } from '../../hooks/useCategories';

const RestaurantAddProduct = () => {
  const user = useAuthStore((state) => state.user);
  const restaurantId = user.id;
  const { addProductFn, isProductAdding, updateProductFn, isProductUpdating } =
    useProduct(restaurantId);

  const { categories } = useCategories();

  const location = useLocation();
  const navigate = useNavigate();
  const editMode = location.state?.product ? true : false;
  const productToEdit = location.state?.product;
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    discountedPrice: '',
    isVeg: false,
    isAvailable: true,
    preparationTime: '',
    image: '',
    attributes: [],
    addons: [],
    tags: [],
    taxRate: '',
    packagingCharge: '',
    featured: false,
  });

  useEffect(() => {
    if (editMode && productToEdit) {

      setFormData({
        name: productToEdit.name || '',
        description: productToEdit.description || '',
        category: productToEdit.category || '',
        price: productToEdit.price || '',
        discountedPrice: productToEdit.discountedPrice || '',
        isVeg: productToEdit.isVeg || false,
        isAvailable: productToEdit.isAvailable || true,
        preparationTime: productToEdit.preparationTime || '',
        image: productToEdit.image || '',
        attributes: productToEdit.attributes || [],
        addons: productToEdit.addons || [],
        tags: productToEdit.tags || [],
        taxRate: productToEdit.taxRate || '',
        packagingCharge: productToEdit.packagingCharge || '',
        featured: productToEdit.featured || false,
      });
    }
  }, [editMode, productToEdit]);

  const [newAttribute, setNewAttribute] = useState({ name: '', options: [] });
  const [newOption, setNewOption] = useState({ name: '', price: 0 });
  const [newAddon, setNewAddon] = useState({ name: '', price: 0, isVeg: true });
  const [newTag, setNewTag] = useState('');
  const [showVariantModal, setShowVariantModal] = useState(true);
  // const [imageFile, setImageFile] = useState(null);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();

    Object.keys(formData).forEach((key) => {
      if (key === 'attributes' || key === 'addons' || key === 'tags') {
        data.append(key, JSON.stringify(formData[key]));
      } else {
        data.append(key, formData[key]);
      }
    });

    data.append('restaurant', restaurantId);

    if (editMode && productToEdit) {
      updateProductFn(
        {
          id: productToEdit._id,
          data: data,
        },
        {
          onSuccess: () => {
            navigate('/restaurant/products');
          },
          onError: (error) => {
            console.error('Error updating product:', error);
          },
        }
      );
    } else {
      addProductFn(data, {
        onSuccess: () => {
          setFormData({
            name: '',
            description: '',
            category: '',
            price: '',
            discountedPrice: '',
            isVeg: false,
            isAvailable: true,
            preparationTime: '',
            attributes: [],
            addons: [],
            tags: [],
            taxRate: '',
            packagingCharge: '',
            featured: false,
          });
          // setImageFile(null); // Reset the image file
        },
        onError: (error) => {
          console.error('Error adding product:', error);
          // Optionally show an error message to the user
        },
      });
    }
  };

  const addAttribute = () => {
    if (newAttribute.name.trim() === '') return;
    setFormData({
      ...formData,
      attributes: [...formData.attributes, { ...newAttribute, options: [] }],
    });
    setNewAttribute({ name: '', options: [] });
    setShowVariantModal(false);
  };

  const addOption = (attributeIndex) => {
    if (newOption.name.trim() === '') return;

    setFormData((prevData) => {
      const updatedAttributes = [...prevData.attributes];
      const attribute = updatedAttributes[attributeIndex];

      // Check if option name already exists
      const isDuplicate = attribute.options.some(
        (option) => option.name.toLowerCase() === newOption.name.toLowerCase()
      );

      if (isDuplicate) {
        alert('Option name must be unique.');
        return prevData; // Stop execution if duplicate
      }

      // Check if it's the first option
      const isFirstOption = attribute.options.length === 0;

      const optionToAdd = {
        name: newOption.name,
        price: isFirstOption && newOption.price === 0 ? prevData.discountedPrice : newOption.price,
      };

      attribute.options.push(optionToAdd);

      return { ...prevData, attributes: updatedAttributes };
    });

    // Reset newOption state
    setNewOption({ name: '', price: 0 });
  };

  const addAddon = () => {
    if (newAddon.name.trim() === '') return;
    setFormData({
      ...formData,
      addons: [...formData.addons, { ...newAddon }],
    });
    setNewAddon({ name: '', price: 0, isVeg: true });
  };

  const addTag = () => {
    if (newTag.trim() === '' || formData.tags.includes(newTag)) return;
    setFormData({
      ...formData,
      tags: [...formData.tags, newTag],
    });
    setNewTag('');
  };

  const removeTag = (index) => {
    const updatedTags = [...formData.tags];
    updatedTags.splice(index, 1);
    setFormData({
      ...formData,
      tags: updatedTags,
    });
  };

  const removeAddon = (index) => {
    const updatedAddons = [...formData.addons];
    updatedAddons.splice(index, 1);
    setFormData({
      ...formData,
      addons: updatedAddons,
    });
  };

  const removeAttribute = (index) => {
    const updatedAttributes = [...formData.attributes];
    updatedAttributes.splice(index, 1);
    setFormData({
      ...formData,
      attributes: updatedAttributes,
    });
    setShowVariantModal(true);
  };

  const removeOption = (attributeIndex, optionIndex) => {
    const updatedAttributes = [...formData.attributes];
    updatedAttributes[attributeIndex].options.splice(optionIndex, 1);
    setFormData({
      ...formData,
      attributes: updatedAttributes,
    });
  };
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // setImageFile(file); // Set the actual file object
      setFormData((prev) => ({
        ...prev,
        image: file, // Set the image preview
      }));
    }
  };

  const removeImage = () => {
    setFormData((prev) => ({
      ...prev,
      image: '',
    }));
    // setImageFile(null); // Reset the image file
  };

  return (
    <div className="bg-gray-50 min-h-screen w-full ">
      <div className="mx-auto bg-white  ">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          {' '}
          {editMode ? 'Edit Product' : 'Add Product'}
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="col-span-2 bg-gray-50 p-4 rounded-lg">
              <h2 className="text-lg font-semibold mb-4">Basic Information</h2>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  required
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md h-24"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    required
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md  cursor-pointer "
                  >
                    <option value="" className="cursor-pointer bg-gray-200">
                      Select Category
                    </option>
                    {categories.map((category) => (
                      <option
                        key={category._id}
                        value={category._id}
                        className="bg-[#fffff] text-black "
                      >
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Regular Price
                  </label>
                  <div className="relative">
                    <input
                      required
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      className="w-full p-2 pl-8 border border-gray-300 rounded-md"
                      min={formData.discountedPrice * 1 + 1}
                    />
                    <span className="absolute inset-y-0 left-0 flex items-center pl-2 text-gray-500">
                      &#8377;
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Discounted Price
                  </label>
                  <div className="relative">
                    <input
                      required
                      type="number"
                      name="discountedPrice"
                      value={formData.discountedPrice}
                      onChange={handleInputChange}
                      className="w-full p-2 pl-8 border border-gray-300 rounded-md"
                    />
                    <span className="absolute inset-y-0 left-0 flex items-center pl-2 text-gray-500">
                      &#8377;
                    </span>
                  </div>
                </div>
              </div>
              <span className="text-sm text-gray-600">
                * If a discounted price is available, it will be shown to the customer as starting
                price.
              </span>

              <div className="flex flex-wrap gap-4 mt-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isVeg"
                    name="isVeg"
                    checked={formData.isVeg}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-green-600 border-gray-300 rounded"
                  />
                  <label htmlFor="isVeg" className="ml-2 text-sm text-gray-700">
                    Vegetarian
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    // required
                    type="checkbox"
                    id="isAvailable"
                    name="isAvailable"
                    checked={formData.isAvailable}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-green-600 border-gray-300 rounded"
                  />
                  <label htmlFor="isAvailable" className="ml-2 text-sm text-gray-700">
                    Available
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="featured"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-green-600 border-gray-300 rounded"
                  />
                  <label htmlFor="featured" className="ml-2 text-sm text-gray-700">
                    Featured
                  </label>
                </div>

                <div className="flex items-center">
                  <Clock size={16} className="text-gray-500 mr-2" />
                  <label htmlFor="preparationTime" className="text-sm text-gray-700 mr-2">
                    Prep Time:
                  </label>
                  <input
                    required
                    type="number"
                    id="preparationTime"
                    name="preparationTime"
                    value={formData.preparationTime}
                    onChange={handleInputChange}
                    className="w-16 p-1 border border-gray-300 rounded-md"
                    min="0"
                    defaultValue={15}
                  />
                  <span className="ml-1 text-sm text-gray-700">min</span>
                </div>
              </div>
            </div>

            {/* image */}
            <div className="col-span-2 bg-gray-50 p-4 rounded-lg">
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <Image size={20} className="mr-2" />
                Image
              </h2>

              <div className="mb-4">
                <div className="flex flex-wrap gap-4">
                  {formData.image && (
                    <div className="relative group">
                      <div className="w-24 h-24 border border-gray-300 rounded-md overflow-hidden">
                        <img
                          src={
                            editMode
                              ? typeof formData.image === 'string'
                                ? formData.image
                                : formData.image
                                  ? URL.createObjectURL(formData.image)
                                  : ''
                              : formData.image
                                ? URL.createObjectURL(formData.image)
                                : ''
                          }
                          alt="uploaded"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  )}

                  {/* Upload Button (only visible if no image is uploaded) */}
                  {!formData.image && (
                    <label className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center bg-gray-50 cursor-pointer">
                      <Plus size={24} className="text-gray-500 hover:text-gray-700" />
                      <input
                        type="file"
                        className="hidden"
                        onChange={handleImageUpload}
                        accept="image/*"
                      />
                    </label>
                  )}
                </div>
              </div>
            </div>

            {/* Attributes and Options */}
            <div className="col-span-2 bg-gray-50 p-4 rounded-lg">
              <h2 className="text-lg font-semibold ">Variants or Sizes</h2>

              <span className="text-sm text-gray-600">
                * For better user experience Discounted price should be smallest variant
              </span>

              {formData.attributes.map((attr, attrIdx) => (
                <div key={attrIdx} className="my-6 p-4 bg-white rounded-md shadow-sm">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-medium">{attr.name}</h3>
                    <button
                      type="button"
                      onClick={() => removeAttribute(attrIdx)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="space-y-2">
                    {attr.options?.map((option, optIdx) => (
                      <div
                        key={optIdx}
                        className="flex items-center justify-between bg-gray-50 p-2 rounded"
                      >
                        <span>{option.name}</span>
                        <div className="flex items-center space-x-3">
                          <span className="text-gray-600">&#8377; {option.price}</span>
                          <button
                            type="button"
                            onClick={() => removeOption(attrIdx, optIdx)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-3 flex gap-2">
                    <input
                      // required
                      type="text"
                      placeholder="Option name"
                      value={newOption.name}
                      onChange={(e) => setNewOption({ ...newOption, name: e.target.value })}
                      className="flex-grow p-2 text-sm border border-gray-300 rounded-md"
                    />
                    <div className="relative w-24">
                      <input
                        type="number"
                        placeholder="Price"
                        value={
                          formData.attributes[attrIdx].options.length === 0 && newOption.price === 0
                            ? formData.discountedPrice
                            : newOption.price
                        }
                        onChange={(e) =>
                          setNewOption({ ...newOption, price: parseFloat(e.target.value) || '' })
                        }
                        className="w-full p-2 pl-6 text-sm border border-gray-300 rounded-md"
                        disabled={formData.attributes[attrIdx].options.length === 0} // Disable input if first option
                      />

                      <span className="absolute inset-y-0 left-0 flex items-center pl-2 text-gray-500">
                        &#8377;
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => addOption(attrIdx)}
                      className="p-2 bg-[#ff6900] text-white rounded-md hover:bg-orange-600"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              ))}

              {showVariantModal && (
                <div className="mt-4 flex gap-2">
                  <input
                    type="text"
                    placeholder="New variant or size..."
                    value={newAttribute.name || ''}
                    onChange={(e) => setNewAttribute({ ...newAttribute, name: e.target.value })}
                    className="flex-grow p-2 border border-gray-300 rounded-md"
                  />
                  <button
                    type="button"
                    onClick={addAttribute}
                    disabled={newAttribute.name.trim() === ''}
                    className="p-2 bg-[#ff6900] text-white rounded-md hover:bg-orange-600 disabled:bg-orange-300"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              )}
            </div>

            {/* Addons */}
            <div className="col-span-2 md:col-span-1 bg-gray-50 p-4 rounded-lg">
              <h2 className="text-lg font-semibold mb-4">Add-ons</h2>

              <div className="space-y-2 mb-4">
                {formData.addons.map((addon, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between bg-white p-2 rounded-md shadow-sm"
                  >
                    <div className="flex items-center">
                      <div
                        className="w-3 h-3 rounded-full mr-2"
                        style={{ backgroundColor: addon.isVeg ? 'green' : 'red' }}
                      ></div>
                      <span>{addon.name}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-gray-600">&#8377; {addon.price}</span>
                      <button
                        type="button"
                        onClick={() => removeAddon(idx)}
                        className="text-red-500 hover:text-orange-600"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add-on name"
                    value={newAddon.name}
                    onChange={(e) => setNewAddon({ ...newAddon, name: e.target.value })}
                    className="flex-grow p-2 text-sm border border-gray-300 rounded-md"
                  />
                  <div className="relative w-20">
                    <input
                      required
                      type="number"
                      placeholder="Price"
                      value={newAddon.price}
                      onChange={(e) =>
                        setNewAddon({ ...newAddon, price: parseInt(e.target.value) || '' })
                      }
                      className="w-full p-2 pl-6 text-sm border border-gray-300 rounded-md"
                      min="0"
                    />
                    <span className="absolute inset-y-0 left-0 flex items-center pl-2 text-gray-500">
                      &#8377;
                    </span>
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="addonIsVeg"
                    checked={newAddon.isVeg}
                    onChange={(e) => setNewAddon({ ...newAddon, isVeg: e.target.checked })}
                    className="h-4 w-4 text-green-600 border-gray-300 rounded"
                  />
                  <label htmlFor="addonIsVeg" className="ml-2 text-sm text-gray-700">
                    Vegetarian
                  </label>
                </div>

                <button
                  type="button"
                  onClick={addAddon}
                  className="w-full p-2 bg-[#ff6900] text-white rounded-md hover:bg-orange-600 flex items-center justify-center"
                >
                  <Plus size={16} className="mr-1" />
                  Add Item
                </button>
              </div>
            </div>

            {/* Tags and Additional Charges */}
            <div className="col-span-2 md:col-span-1 bg-gray-50 p-4 rounded-lg flex justify-between flex-col">
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center">
                  <Tag size={20} className="mr-2" />
                  Tags
                </h2>

                <div className="flex flex-wrap gap-2 mb-3">
                  {formData.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-black/10 text-black rounded-full flex items-center"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(idx)}
                        className="ml-2 text-black cursor-pointer"
                      >
                        <Trash2 size={14} />
                      </button>
                    </span>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add a tag"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    className="flex-grow p-2 border border-gray-300 rounded-md"
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    className="p-2 bg-[#ff6900] text-white rounded-md hover:bg-blue-600"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              <div className="mt-6 pt-6  flex items-end justify-end ">
                <button
                  type="button"
                  onClick={() => navigate('/restaurant/products')}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 mr-2 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-900 flex items-center cursor-pointer disabled:cursor-not-allowed disabled:bg-black/80"
                  disabled={isProductAdding || isProductUpdating}
                >
                  {isProductAdding || isProductUpdating ? (
                    <Spinner className={'mr-2 size-5'} />
                  ) : (
                    <Save size={18} className="mr-2" />
                  )}
                  {editMode ? 'Update Item' : 'Save Item'}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RestaurantAddProduct;
