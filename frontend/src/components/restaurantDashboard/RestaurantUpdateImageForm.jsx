import { useState } from 'react';
import { X } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import useRestaurants from '../../hooks/useRestaurants';

const RestaurantUpdateImageForm = () => {
  const user = useAuthStore((state) => state.user);
  const { updateImageFn, isUpdatingImage } = useRestaurants();

  const [imageFiles, setImageFiles] = useState({
    logo: null,
    cover: null,
    gallery: [],
  });

  const [imagePreview, setImagePreview] = useState({
    logo: '',
    cover: '',
    gallery: [],
  });

  const handleFileChange = (e, type) => {
    const files = type === 'gallery' ? Array.from(e.target.files) : e.target.files[0];
    if (!files) return;

    // Create URL previews
    const createUrls = (fileList) =>
      Array.isArray(fileList)
        ? fileList.map((file) => URL.createObjectURL(file))
        : URL.createObjectURL(fileList);

    // Store the actual files
    setImageFiles((prev) => ({
      ...prev,
      [type]:
        type === 'gallery' ? [...prev.gallery, ...Array.from(e.target.files)] : e.target.files[0],
    }));

    // Store the preview URLs
    setImagePreview((prev) => ({
      ...prev,
      [type]: type === 'gallery' ? [...prev.gallery, ...createUrls(files)] : createUrls(files),
    }));
  };

  const ImageUploadSection = ({ type, title, multiple }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{title}</label>
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
        <input
          type="file"
          accept="image/*"
          multiple={multiple}
          className="hidden"
          id={`${type}-upload`}
          onChange={(e) => handleFileChange(e, type)}
        />
        <label
          htmlFor={`${type}-upload`}
          className="cursor-pointer text-blue-600 hover:text-blue-800 inline-block"
        >
          {type === 'gallery'
            ? 'Upload Gallery Images'
            : imagePreview[type]
              ? `Change ${title}`
              : `Upload ${title}`}
        </label>

        {imagePreview[type] && (
          <div
            className={`flex ${type === 'gallery' ? 'flex-wrap gap-2 justify-center' : 'inline-block'} mt-2`}
          >
            {(type === 'gallery' ? imagePreview[type] : [imagePreview[type]]).map((url, index) => (
              <div key={index} className="relative">
                <img
                  src={url}
                  alt={`${title} ${index}`}
                  className={`object-cover rounded-lg ${
                    type === 'logo' ? 'w-24 h-24' : type === 'cover' ? 'w-full h-48' : 'w-24 h-24'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => removeImage(type, index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();

    if (imageFiles.logo) {
      formData.append('logo', imageFiles.logo);
    }

    if (imageFiles.cover) {
      formData.append('cover', imageFiles.cover);
    }

    if (imageFiles.gallery && imageFiles.gallery.length > 0) {
      imageFiles.gallery.forEach((file) => {
        formData.append('gallery', file);
      });
    }

    updateImageFn.mutate({ formData, id: user.id });
  };

  const removeImage = (type, index) => {
    if (type === 'gallery') {
      setImageFiles((prev) => ({
        ...prev,
        gallery: prev.gallery.filter((_, i) => i !== index),
      }));

      setImagePreview((prev) => ({
        ...prev,
        gallery: prev.gallery.filter((_, i) => i !== index),
      }));
    } else {
      setImageFiles((prev) => ({
        ...prev,
        [type]: null,
      }));

      setImagePreview((prev) => ({
        ...prev,
        [type]: '',
      }));
    }

    // Clean up the URL object to prevent memory leaks
    if (type === 'gallery' && imagePreview.gallery[index]) {
      URL.revokeObjectURL(imagePreview.gallery[index]);
    } else if (imagePreview[type]) {
      URL.revokeObjectURL(imagePreview[type]);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Restaurant Profile Images
        </h2>

        <ImageUploadSection type="logo" title="Restaurant Logo" />
        <ImageUploadSection type="cover" title="Cover Photo" />
        <ImageUploadSection type="gallery" title="Gallery Images" multiple />

        <div className="mt-6">
          <button
            type="submit"
            disabled={isUpdatingImage}
            className="w-full px-4 py-2 bg-[#ff6900] text-white rounded-lg hover:bg-orange-600 
                       disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            Save Profile Images
          </button>
        </div>
      </form>
    </div>
  );
};

export default RestaurantUpdateImageForm;
