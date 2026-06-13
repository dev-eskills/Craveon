import { useState } from 'react';
import { X } from 'lucide-react';
import Spinner from '../ui/Spinner';
import toast from 'react-hot-toast';

const ComplaintModal = ({ complaint, onClose, updateComplaintFn, updating }) => {
  const [complaintStatus, setComplaintStatus] = useState(complaint.status);
  const [adminNotes, setAdminNotes] = useState(complaint.adminNotes || '');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!complaintStatus) {
      toast.error('Please select a status');
      return;
    }
    try {
      await updateComplaintFn({
        id: complaint._id,
        status: complaintStatus,
        adminNotes,
      });
      toast.success('Complaint updated successfully!');
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update complaint');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition cursor-pointer"
        >
          <X size={20} />
        </button>
        <h2 className="text-lg font-bold text-gray-800 mb-1">Update Complaint</h2>
        <p className="text-xs text-gray-500 mb-4">Category: {complaint.category}</p>

        <div className="space-y-4 text-sm text-gray-700">
          <div className="bg-gray-50 p-3 rounded-lg border">
            <p className="font-semibold text-gray-800">Customer Info:</p>
            <p className="text-xs">Name: {complaint.user?.name}</p>
            <p className="text-xs">Contact: {complaint.user?.number || complaint.user?.email}</p>
            {complaint.order && (
              <p className="text-xs font-medium text-[#ff6900] mt-1">
                Linked Order: #{complaint.order.orderNumber} (₹{complaint.order.finalTotal})
              </p>
            )}
          </div>

          <div>
            <p className="font-semibold text-gray-800">Subject: {complaint.subject}</p>
            <p className="text-xs text-gray-600 mt-1 bg-amber-50/50 p-3 rounded border border-amber-100">
              <span className="font-medium">Details: </span>
              {complaint.description}
            </p>
          </div>

          {/* Status form */}
          <form onSubmit={handleSubmit} className="space-y-3 pt-3 border-t">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Complaint Status</label>
              <select
                value={complaintStatus}
                onChange={(e) => setComplaintStatus(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-xs"
                required
              >
                <option value="PENDING">PENDING</option>
                <option value="INVESTIGATING">INVESTIGATING</option>
                <option value="RESOLVED">RESOLVED</option>
                <option value="REJECTED">REJECTED</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Admin Investigation Notes</label>
              <textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="Enter notes about investigation or resolution details..."
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
              {updating ? <Spinner /> : 'Save Complaint Status'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ComplaintModal;
