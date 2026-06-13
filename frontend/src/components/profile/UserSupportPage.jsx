import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { useOrder } from '../../hooks/useOrder';
import { useSupport } from '../../hooks/useSupport';
import FeedbackForm from './FeedbackForm';
import ComplaintForm from './ComplaintForm';
import SupportHistory from './SupportHistory';

const UserSupportPage = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const { orders, isOrdersLoading } = useOrder(null, null, null, '', null, null, user?.id);

  // Hook for user support operations
  const {
    history,
    isHistoryLoading,
    submitFeedbackFn,
    isFeedbackSubmitting,
    submitComplaintFn,
    isComplaintSubmitting,
  } = useSupport(false);

  const [activeTab, setActiveTab] = useState('feedback'); // 'feedback' or 'complaint'

  // Filter completed/delivered orders
  const completedOrders = orders?.filter(o => o.status === 'DELIVERED') || [];

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 bg-white min-h-screen">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate('/user/profile')}
          className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center transition cursor-pointer"
        >
          <ArrowLeft size={18} className="text-[#ff6900]" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Support & Feedback</h1>
          <p className="text-sm text-gray-500">We would love to hear from you or help you resolve issues.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab('feedback')}
          className={`flex-1 py-3 text-center font-medium border-b-2 cursor-pointer transition ${
            activeTab === 'feedback'
              ? 'border-[#ff6900] text-[#ff6900]'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          General Feedback
        </button>
        <button
          onClick={() => setActiveTab('complaint')}
          className={`flex-1 py-3 text-center font-medium border-b-2 cursor-pointer transition ${
            activeTab === 'complaint'
              ? 'border-[#ff6900] text-[#ff6900]'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Lodge Complaint
        </button>
      </div>

      {/* Tab Contents */}
      <div className="bg-gray-50 rounded-xl p-5 border border-gray-100 shadow-sm mb-10">
        {activeTab === 'feedback' ? (
          <FeedbackForm
            submitFeedbackFn={submitFeedbackFn}
            submitting={isFeedbackSubmitting}
          />
        ) : (
          <ComplaintForm
            completedOrders={completedOrders}
            isOrdersLoading={isOrdersLoading}
            submitComplaintFn={submitComplaintFn}
            submitting={isComplaintSubmitting}
          />
        )}
      </div>

      {/* Support History Logs */}
      <SupportHistory
        historyLoading={isHistoryLoading}
        history={history}
      />
    </div>
  );
};

export default UserSupportPage;
