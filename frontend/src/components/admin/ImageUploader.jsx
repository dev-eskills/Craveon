import { useState, useEffect } from 'react';
import { UploadCloud, Trash2, AlertCircle, ImageIcon, X } from 'lucide-react';

function ImageUploader({ onUpload, isUploading }) {
  const [image, setImage] = useState(null);
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [dragActive, setDragActive] = useState(false);

  // Handle file selection
  const handleFile = (file) => {
    if (!file) return;

    const validTypes = ['image/png', 'image/jpeg', 'image/gif', 'image/jpg', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setError('Only PNG, JPG, and GIF files are allowed.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('File size should not exceed 5MB.');
      return;
    }

    setError('');
    setFile(file);
    setImage(URL.createObjectURL(file));
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragActive(false);
    const file = event.dataTransfer.files[0];
    handleFile(file);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    handleFile(file);
    event.target.value = '';
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select an image before uploading.');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);

    onUpload(formData, {
      onSuccess: () => {
        setFile(null);
        setImage(null);
        setError('');
      },
    });
  };

  const handleDelete = () => {
    setImage(null);
    setFile(null);
    setError('');
  };

  // Clean up object URLs when component unmounts
  useEffect(() => {
    return () => {
      if (image) URL.revokeObjectURL(image);
    };
  }, [image]);

  return (
    <>
      <div className=" rounded-xl pb-0 w-full text-center border border-gray-100">
        <div
          className={`group border-2 ${
            dragActive
              ? 'border-blue-500 bg-blue-50'
              : 'border-dashed border-gray-300 hover:border-blue-400'
          } rounded-xl p-10 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ease-in-out min-h-[200px]`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => document.getElementById('fileInput').click()}
        >
          <div
            className={`p-4 rounded-full ${dragActive ? 'bg-blue-100' : 'bg-gray-100'} mb-4 group-hover:bg-blue-100`}
          >
            <UploadCloud
              className={`w-12 h-12 ${dragActive ? 'text-blue-500' : 'text-gray-400'} group-hover:text-blue-400`}
            />
          </div>
          <p className="text-lg font-medium text-gray-700 group-hover:text-blue-500">
            Drag and drop your image here
          </p>
          <p className="text-sm text-gray-500 mt-2 ">
            PNG, JPG, and GIF files are allowed (Max: 5MB)
          </p>
          <button
            className="px-6 py-2.5 mt-6 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg shadow-sm 
              hover:bg-blue-500 hover:text-white hover:border-blue-500 transition-all duration-300 group-hover:text-blue-500 
              focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 cursor-pointer"
          >
            Browse Files
          </button>
        </div>

        <input
          type="file"
          accept="image/png, image/jpeg, image/gif"
          className="hidden"
          id="fileInput"
          onChange={handleFileSelect}
        />

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center text-red-600">
            <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}
      </div>

      {image && (
        <div className="mt-6 bg-white rounded-xl border border-gray-200 shadow-sm transition-all duration-300 ease-in-out hover:shadow-md">
          <div className="p-4 border-b border-gray-100 flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-800 flex items-center">
              <ImageIcon className="w-5 h-5 mr-2 text-blue-500" />
              Image Preview
            </h3>
            <button
              onClick={handleDelete}
              className="p-1.5 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors duration-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6">
            <div className="relative rounded-lg overflow-hidden bg-gray-50 border border-gray-100">
              <img
                src={image || '/placeholder.svg'}
                alt="Upload preview"
                className="w-full h-auto object-contain max-h-[300px]"
              />
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                className="px-5 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-lg 
                  hover:bg-gray-200 transition-all duration-300 flex items-center 
                  focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-1 cursor-pointer"
                onClick={handleDelete}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                <span>Discard</span>
              </button>

              <button
                type="button"
                className="px-5 py-2.5 bg-blue-500 text-white font-medium rounded-lg 
                  hover:bg-blue-600 transition-all duration-300 shadow-sm flex items-center 
                  focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-1
                  disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                onClick={handleUpload}
                disabled={isUploading}
              >
                {isUploading ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <UploadCloud className="w-4 h-4 mr-2" />
                    <span>Upload Banner</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ImageUploader;
