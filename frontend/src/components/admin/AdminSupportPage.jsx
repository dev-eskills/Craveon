import { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import Spinner from '../ui/Spinner';
import { useSupport } from '../../hooks/useSupport';
import DisputesTable from './DisputesTable';
import ComplaintsTable from './ComplaintsTable';
import FeedbacksTable from './FeedbacksTable';
import DisputeModal from './DisputeModal';
import ComplaintModal from './ComplaintModal';

const AdminSupportPage = () => {
  const [activeTab, setActiveTab] = useState('disputes'); // 'disputes', 'complaints', 'feedback'

  // Hook for admin support operations
  const {
    disputes,
    isDisputesLoading,
    refetchDisputes,
    complaints,
    isComplaintsLoading,
    refetchComplaints,
    feedbacks,
    isFeedbacksLoading,
    refetchFeedbacks,
    updateComplaintFn,
    isComplaintUpdating,
    updateDisputeFn,
    isDisputeUpdating,
  } = useSupport(true);

  // Modal states
  const [selectedDispute, setSelectedDispute] = useState(null);
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  const loading = isDisputesLoading || isComplaintsLoading || isFeedbacksLoading;

  const handleRefresh = () => {
    refetchDisputes();
    refetchComplaints();
    refetchFeedbacks();
  };

  const openDisputeModal = (dispute) => {
    setSelectedDispute(dispute);
  };

  const openComplaintModal = (complaint) => {
    setSelectedComplaint(complaint);
  };

  return (
    <div className="p-6 bg-white min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Support & Disputes Management</h1>
          <p className="text-sm text-gray-500">Manage customer complaints, post-delivery disputes, and review general feedback.</p>
        </div>
        <button
          onClick={handleRefresh}
          className="flex items-center gap-1 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 cursor-pointer transition"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        {['disputes', 'complaints', 'feedback'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 font-semibold text-sm border-b-2 cursor-pointer transition capitalize ${
              activeTab === tab
                ? 'border-[#ff6900] text-[#ff6900]'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab === 'feedback' ? 'Feedbacks Log' : tab}
            <span className="ml-2 px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-600 text-xs font-normal">
              {tab === 'disputes' ? disputes.length : tab === 'complaints' ? complaints.length : feedbacks.length}
            </span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Spinner />
        </div>
      ) : (
        <div>
          {/* DISPUTES TAB */}
          {activeTab === 'disputes' && (
            <DisputesTable
              disputes={disputes}
              openDisputeModal={openDisputeModal}
            />
          )}

          {/* COMPLAINTS TAB */}
          {activeTab === 'complaints' && (
            <ComplaintsTable
              complaints={complaints}
              openComplaintModal={openComplaintModal}
            />
          )}

          {/* FEEDBACK TAB */}
          {activeTab === 'feedback' && (
            <FeedbacksTable
              feedbacks={feedbacks}
            />
          )}
        </div>
      )}

      {/* DISPUTE RESOLUTION MODAL */}
      {selectedDispute && (
        <DisputeModal
          dispute={selectedDispute}
          onClose={() => setSelectedDispute(null)}
          updateDisputeFn={updateDisputeFn}
          updating={isDisputeUpdating}
        />
      )}

      {/* COMPLAINT DETAIL/UPDATE MODAL */}
      {selectedComplaint && (
        <ComplaintModal
          complaint={selectedComplaint}
          onClose={() => setSelectedComplaint(null)}
          updateComplaintFn={updateComplaintFn}
          updating={isComplaintUpdating}
        />
      )}
    </div>
  );
};

export default AdminSupportPage;
