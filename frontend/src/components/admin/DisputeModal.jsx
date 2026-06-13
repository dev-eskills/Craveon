import { useState } from 'react';
import { X } from 'lucide-react';
import Spinner from '../ui/Spinner';
import toast from 'react-hot-toast';

const DisputeModal = ({ dispute, onClose, updateDisputeFn, updating }) => {
  const [disputeStatus, setDisputeStatus] = useState(dispute.status);
  const [resolutionDetails, setResolutionDetails] = useState(dispute.resolutionDetails || '');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!disputeStatus) {
      toast.error('Please select a status');
      return;
    }
    try {
      await updateDisputeFn({
        id: dispute._id,
        status: disputeStatus,
        resolutionDetails,
      });
      toast.success('Dispute resolved successfully!');
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update dispute');
    }
  };

  console.log("dispute?.disputeItems: ",dispute?.disputeItems)
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition cursor-pointer"
        >
          <X size={20} />
        </button>
        <h2 className="text-lg font-bold text-gray-800 mb-1">Resolve Order Dispute</h2>
        <p className="text-xs text-gray-500 mb-4">Order #{dispute.order?.orderNumber}</p>

        <div className="space-y-4 text-sm text-gray-700">
          {/* Customer Details */}
          <div className="bg-gray-50 p-3 rounded-lg border">
            <p className="font-semibold text-gray-800">Customer Info:</p>
            <p className="text-xs">Name: {dispute.user?.name}</p>
            <p className="text-xs">Email: {dispute.user?.email}</p>
            <p className="text-xs">Mobile: {dispute.user?.number}</p>
          </div>

          {/* Dispute Reason */}
          <div>
            <p className="font-semibold text-gray-800">Dispute Reason: {dispute.disputeReason.replace('_', ' ')}</p>
            <p className="text-xs text-gray-600 mt-1 bg-red-50/50 p-2.5 rounded border border-red-100">
              <span className="font-medium">Details: </span>
              {dispute.description}
            </p>
          </div>

          {/* Items Disputed */}
          {dispute.disputeItems?.length > 0 && (
            <div>
              <p className="font-semibold text-gray-800 mb-1">Disputed Items:</p>
              <div className="border rounded-lg overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 text-gray-500 border-b">
                    <tr>
                      <th className="p-2">Product Name</th>
                      <th className="p-2">Disputed Qty</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {dispute?.disputeItems?.map((item, index) => (
                      <tr key={index}>
                        <td className="p-2 font-medium cursor-default">{item?.product?.name || item?.name || "Product"}</td>
                        <td className="p-2 text-red-600 font-semibold">{item?.quantity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Resolution Form */}
          <form onSubmit={handleSubmit} className="space-y-3 pt-3 border-t">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Action / Status</label>
              <select
                value={disputeStatus}
                onChange={(e) => setDisputeStatus(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-xs"
                required
              >
                <option value="PENDING">PENDING</option>
                <option value="UNDER_REVIEW">UNDER REVIEW</option>
                <option value="RESOLVED_REFUNDED">RESOLVED (REFUNDED)</option>
                <option value="RESOLVED_REPLACED">RESOLVED (REPLACED)</option>
                <option value="REJECTED">REJECTED</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Resolution Details / Notes</label>
              <textarea
                value={resolutionDetails}
                onChange={(e) => setResolutionDetails(e.target.value)}
                placeholder="Provide details of refund or rejection reason..."
                rows={3}
                className="w-full px-3 py-2 border rounded-lg text-xs resize-none"
                required
              />
            </div>

            <button
              type="submit"
              disabled={updating}
              className="w-full py-2 bg-[#ff6900] text-white text-xs font-semibold rounded-lg hover:bg-orange-600 transition flex justify-center items-center gap-2 cursor-pointer disabled:bg-gray-400"
            >
              {updating ? <Spinner /> : 'Save Dispute Resolution'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DisputeModal;
