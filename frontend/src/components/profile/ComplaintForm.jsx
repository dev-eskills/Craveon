import { useState } from 'react';
import Spinner from '../ui/Spinner';
import toast from 'react-hot-toast';

const ComplaintForm = ({ completedOrders, isOrdersLoading, submitComplaintFn, submitting }) => {
  const [complaintCategory, setComplaintCategory] = useState('Food Quality');
  const [complaintOrder, setComplaintOrder] = useState('');
  const [complaintSubject, setComplaintSubject] = useState('');
  const [complaintDescription, setComplaintDescription] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!complaintSubject.trim() || !complaintDescription.trim()) {
      toast.error('Subject and description are required');
      return;
    }
    try {
      await submitComplaintFn({
        order: complaintOrder || undefined,
        category: complaintCategory,
        subject: complaintSubject,
        description: complaintDescription,
      });
      toast.success('Complaint lodged successfully!');
      setComplaintSubject('');
      setComplaintDescription('');
      setComplaintOrder('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to lodge complaint');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-800">Lodge a Formal Complaint</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Category */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">Category</label>
          <select
            value={complaintCategory}
            onChange={(e) => setComplaintCategory(e.target.value)}
            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#ff6900] focus:outline-none text-sm cursor-pointer"
          >
            <option value="Food Quality">Food Quality</option>
            <option value="Delivery Service">Delivery Service</option>
            <option value="App Behavior">App Behavior</option>
            <option value="Billing Issues">Billing Issues</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Order Reference */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">Link Order (Optional)</label>
          {isOrdersLoading ? (
            <div className="w-full h-11 bg-gray-200 animate-pulse rounded-lg"></div>
          ) : (
            <select
              value={complaintOrder}
              onChange={(e) => setComplaintOrder(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#ff6900] focus:outline-none text-sm cursor-pointer"
            >
              <option value="">-- No Order Selected --</option>
              {completedOrders.map((ord) => (
                <option key={ord._id} value={ord._id}>
                  {ord.restaurant?.name} (#{ord.orderNumber}) - ₹{ord.finalTotal}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Subject */}
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">Subject</label>
        <input
          type="text"
          value={complaintSubject}
          onChange={(e) => setComplaintSubject(e.target.value)}
          placeholder="Brief summary of the issue"
          className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#ff6900] focus:outline-none text-sm"
          required
        />
      </div>

      {/* Description */}
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">Detailed Description</label>
        <textarea
          value={complaintDescription}
          onChange={(e) => setComplaintDescription(e.target.value)}
          placeholder="Explain the details of your complaint. Provide details that can help us investigate..."
          rows={4}
          className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#ff6900] focus:outline-none resize-none text-sm"
          required
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full py-3 bg-[#ff6900] text-white font-semibold rounded-lg hover:bg-orange-600 transition flex items-center justify-center gap-2 cursor-pointer disabled:bg-gray-400"
      >
        {submitting ? <Spinner /> : 'Lodge Complaint'}
      </button>
    </form>
  );
};

export default ComplaintForm;
