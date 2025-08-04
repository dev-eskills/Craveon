import { useState } from 'react';
import { Plus, Trash2, X, Upload } from 'lucide-react';
import { useCategories } from '../../hooks/useCategories';
import CategoryTable from '../ui/CategoryTable';
import Spinner from '../ui/Spinner';

const AdminAddCategory = () => {
  const { addCategoriesFn, updateCategoryFn, categories, isUpdatingCategory, isAddCategory } =
    useCategories();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentCategoryId, setCurrentCategoryId] = useState(null);
  const [formData, setFormData] = useState({
    logo: null,
    name: '',
    isActive: true,
    cover: null,
    description: '',
  });

  // Preview URLs for existing images
  const [logoPreview, setLogoPreview] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);

  const handleEditCategory = (id) => {
    const categoryToEdit = categories.find((category) => category._id === id);

    if (categoryToEdit) {
      setCurrentCategoryId(id);
      setFormData({
        name: categoryToEdit.name || '',
        description: categoryToEdit.description || '',
        isActive: categoryToEdit.isActive || true,
        logo: null,
        cover: null,
      });

      if (categoryToEdit.image?.logo) {
        setLogoPreview(categoryToEdit.image.logo);
      } else {
        setLogoPreview(null);
      }

      if (categoryToEdit.image?.cover) {
        setCoverPreview(categoryToEdit.image.cover);
      } else {
        setCoverPreview(null);
      }

      setIsEditMode(true);
      setIsModalOpen(true);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLogoFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, logo: file });
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleCoverFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, cover: file });
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  const resetForm = () => {
    setFormData({ logo: null, name: '', isActive: true, cover: null, description: '' });
    setLogoPreview(null);
    setCoverPreview(null);
    setIsEditMode(false);
    setCurrentCategoryId(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert('Category name is required!');
      return;
    }

    const confirmMessage = isEditMode
      ? 'Are you sure you want to update this category?'
      : 'This is an irreversible process! Are you sure you want to create this category?';

    if (!window.confirm(confirmMessage)) {
      return;
    }

    const data = new FormData();
    data.append('name', formData.name);
    data.append('isActive', formData.isActive);
    data.append('description', formData.description);

    if (formData.logo) data.append('logo', formData.logo);
    if (formData.cover) data.append('cover', formData.cover);

    // If we're editing, call updateCategoryFn
    if (isEditMode && currentCategoryId) {
      updateCategoryFn(
        { id: currentCategoryId, data },
        {
          onSuccess: () => {
            setIsModalOpen(false);
            resetForm();
          },
          onError: (error) => {
            console.error('Failed to update category:', error);
            alert('Something went wrong! Please try again.');
          },
        }
      );
    } else {
      // Otherwise call addCategoriesFn
      addCategoriesFn(data, {
        onSuccess: () => {
          setIsModalOpen(false);
          resetForm();
        },
        onError: (error) => {
          console.error('Failed to create category:', error);
          alert('Something went wrong! Please try again.');
        },
      });
    }
  };

  const handleRemoveLogo = () => {
    setFormData({ ...formData, logo: null });
    setLogoPreview(null);
  };

  const handleRemoveCover = () => {
    setFormData({ ...formData, cover: null });
    setCoverPreview(null);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  return (
    <div className="w-full min-h-screen">
      <div className="flex justify-between items-center mb-6 ">
        <button
          className="bg-[#ff6900] flex items-center p-2 gap-1 cursor-pointer text-white rounded-lg text-sm hover:bg-orange-600 transition duration-200"
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
        >
          <Plus /> Add Category
        </button>
      </div>

      <CategoryTable handleEditCategory={handleEditCategory} />

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 overflow-y-auto">
          <div className="min-h-screen px-4 text-center flex items-center justify-center">
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
              &#8203;
            </span>

            <div
              className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center border-b border-gray-100 p-4">
                <h2 className="text-lg font-bold text-gray-800">
                  {isEditMode ? 'Edit Category' : 'Add Category'}
                </h2>
                <button
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700 transition duration-200 cursor-pointer"
                  aria-label="Close modal"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-4 sm:p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Logo preview */}
                  <div className="mb-4">
                    <label
                      htmlFor="logo-upload"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Category Logo
                    </label>
                    {logoPreview ? (
                      <div className="relative group">
                        <img
                          src={logoPreview}
                          alt="Logo Preview"
                          className="w-full h-32 sm:h-40 object-cover rounded-lg border border-gray-300"
                        />
                        <div
                          className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-lg transition-opacity cursor-pointer"
                          onClick={handleRemoveLogo}
                        >
                          <Trash2 className="text-white hover:text-red-500 transition-colors" />
                        </div>
                      </div>
                    ) : (
                      <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-3 transition-colors hover:border-orange-400">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleLogoFileChange}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                          id="logo-upload"
                        />

                        <div className="flex flex-col items-center justify-center space-y-2 text-center py-3 sm:py-4">
                          <Upload className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
                          <p className="text-sm font-medium text-gray-700">Upload category logo</p>
                          <p className="text-xs text-gray-500">Click to browse or drag and drop</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Cover preview */}
                  <div className="mb-4">
                    <label
                      htmlFor="cover-upload"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Category Cover
                    </label>
                    {coverPreview ? (
                      <div className="relative group">
                        <img
                          src={coverPreview}
                          alt="Cover Preview"
                          className="w-full h-32 sm:h-40 object-cover rounded-lg border border-gray-300"
                        />
                        <div
                          className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-lg transition-opacity cursor-pointer"
                          onClick={handleRemoveCover}
                        >
                          <Trash2 className="text-white hover:text-red-500 transition-colors" />
                        </div>
                      </div>
                    ) : (
                      <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-3 transition-colors hover:border-orange-400">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleCoverFileChange}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                          id="cover-upload"
                        />

                        <div className="flex flex-col items-center justify-center space-y-2 text-center py-3 sm:py-4">
                          <Upload className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
                          <p className="text-sm font-medium text-gray-700">Upload category cover</p>
                          <p className="text-xs text-gray-500">Click to browse or drag and drop</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mb-4">
                    <label
                      htmlFor="category-name"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Category Name
                    </label>
                    <input
                      type="text"
                      id="category-name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Category Name"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6900] transition duration-200"
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label
                      htmlFor="category-description"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Category Description
                    </label>
                    <textarea
                      id="category-description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Category Description"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6900] transition duration-200"
                      rows="3"
                      required
                    ></textarea>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="w-full sm:w-1/2 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="w-full sm:w-1/2 bg-[#ff6900] text-white py-3 rounded-lg hover:bg-orange-600 transition duration-200 shadow-md hover:shadow-lg flex items-center justify-center"
                    >
                      {isUpdatingCategory || isAddCategory ? (
                        <Spinner />
                      ) : isEditMode ? (
                        'Update'
                      ) : (
                        'Save'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAddCategory;
