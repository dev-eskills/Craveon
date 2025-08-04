import { useState } from 'react';
import { useAdminGst } from '../../hooks/useRestaurants';
import { AlertCircle, X } from 'lucide-react';

function AdminSettings() {
  const { GstQuery, updateGstFn } = useAdminGst();
  const [isOpen, setIsOpen] = useState(false);
  const [gstPercentage, setGstPercentage] = useState('');
  const [gstError, setGstError] = useState('');

  const validateGstPercentage = (percentage) => {
    const numPercentage = parseFloat(percentage);
    return !isNaN(numPercentage) && numPercentage >= 0 && numPercentage <= 100;
  };

  const updateGst = () => {
    setGstError('');
    const trimmedPercentage = gstPercentage.trim();

    if (!trimmedPercentage) {
      setGstError('GST percentage cannot be empty');
      return;
    }

    if (!validateGstPercentage(trimmedPercentage)) {
      setGstError('Invalid GST percentage (0-100)');
      return;
    }

    updateGstFn.mutate(
      { GST: parseFloat(trimmedPercentage) },
      {
        onSuccess: () => {
          setIsOpen(false);
        },
        onError: (error) => {
          setGstError(error.message || 'Failed to update GST percentage');
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className=" rounded-xl shadow-xl p-10 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-2">Admin Settings</h1>
        <p className="text-sm text-center text-gray-500 mb-6">
          Manage your GST configuration
        </p>

        <div className="flex justify-center">
          <button
            onClick={() => {
              setIsOpen(true);
              setGstPercentage(GstQuery?.GST ? GstQuery.GST.toString() : '');
            }}
            className="px-6 py-2 text-white bg-[#ff6900] rounded-lg hover:bg-orange-600 transition text-sm"
          >
            Update GST Percentage
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 ">
          <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Update GST Percentage</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>

            <div>
              <label htmlFor="gst-input" className="block text-sm font-medium text-gray-700 mb-2">
                GST Percentage
              </label>
              <div className="flex items-center">
                <input
                  id="gst-input"
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  value={gstPercentage}
                  onChange={(e) => {
                    setGstPercentage(e.target.value);
                    setGstError('');
                  }}
                  placeholder="Enter GST %"
                  className={`w-full p-2 rounded-md border focus:outline-none focus:ring-2 ${
                    gstError
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-[#ff6900]'
                  }`}
                />
                <span className="ml-2 text-gray-600">%</span>
              </div>
              {gstError && (
                <div className="mt-2 flex items-center text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  {gstError}
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={updateGst}
                className="px-4 py-2 bg-[#ff6900] text-white rounded-md hover:bg-orange-600 transition"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminSettings;
