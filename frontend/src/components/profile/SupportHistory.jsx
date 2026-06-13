import { Star, Clock, MessageSquare } from 'lucide-react';
import Spinner from '../ui/Spinner';

const SupportHistory = ({ historyLoading, history }) => {
  const feedbacks = history?.feedbacks || [];
  const complaints = history?.complaints || [];
  const disputes = history?.disputes || [];

  if (historyLoading) {
    return (
      <div className="flex justify-center py-10">
        <Spinner />
      </div>
    );
  }

  const hasNoHistory = feedbacks.length === 0 && complaints.length === 0 && disputes.length === 0;

  if (hasNoHistory) {
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <Clock size={22} className="text-[#ff6900]" />
          Your Support History
        </h2>
        <div className="text-center py-10 border border-dashed border-gray-300 rounded-xl bg-gray-50">
          <MessageSquare size={40} className="mx-auto text-gray-400 mb-2" />
          <p className="text-gray-500">No support requests or feedback found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
        <Clock size={22} className="text-[#ff6900]" />
        Your Support History
      </h2>

      <div className="space-y-6">
        {/* Disputes History */}
        {disputes.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400">Order Disputes</h3>
            <div className="space-y-3">
              {disputes.map((disp) => (
                <div key={disp._id} className="bg-white p-4 border border-red-100 rounded-xl shadow-xs">
                  <div className="flex flex-wrap justify-between items-start gap-2 mb-2">
                    <div>
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-100">
                        Dispute
                      </span>
                      <span className="text-sm text-gray-500 ml-2">Order #{disp.order?.orderNumber}</span>
                    </div>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                      disp.status === 'PENDING' ? 'bg-amber-100 text-amber-800' :
                      disp.status === 'UNDER_REVIEW' ? 'bg-blue-100 text-blue-800' :
                      disp.status.startsWith('RESOLVED') ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {disp.status.replace('_', ' ')}
                    </span>
                  </div>
                  <h4 className="font-semibold text-gray-800 text-sm">Reason: {disp.disputeReason.replace('_', ' ')}</h4>
                  <p className="text-xs text-gray-600 mt-1">{disp.description}</p>
                  {disp.disputeItems?.length > 0 && (
                    <div className="mt-2 text-xs bg-gray-50 p-2 rounded">
                      <p className="font-medium text-gray-700">Items Disputed:</p>
                      <ul className="list-disc pl-4 text-gray-600">
                        {disp.disputeItems.map((item, idx) => (
                          <li key={idx}>{item.name} (Qty: {item.quantity})</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {disp.resolutionDetails && (
                    <div className="mt-2 text-xs border-t pt-2 border-gray-100">
                      <p className="font-semibold text-green-700">Resolution:</p>
                      <p className="text-gray-600">{disp.resolutionDetails}</p>
                    </div>
                  )}
                  <span className="text-[10px] text-gray-400 block mt-2">
                    Filed on: {new Date(disp.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Complaints History */}
        {complaints.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400">Complaints</h3>
            <div className="space-y-3">
              {complaints.map((comp) => (
                <div key={comp._id} className="bg-white p-4 border border-gray-200 rounded-xl shadow-xs">
                  <div className="flex flex-wrap justify-between items-start gap-2 mb-2">
                    <div>
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-100">
                        {comp.category}
                      </span>
                      {comp.order && (
                        <span className="text-sm text-gray-500 ml-2">Order #{comp.order.orderNumber}</span>
                      )}
                    </div>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                      comp.status === 'PENDING' ? 'bg-amber-100 text-amber-800' :
                      comp.status === 'INVESTIGATING' ? 'bg-blue-100 text-blue-800' :
                      comp.status === 'RESOLVED' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {comp.status}
                    </span>
                  </div>
                  <h4 className="font-semibold text-gray-800 text-sm">{comp.subject}</h4>
                  <p className="text-xs text-gray-600 mt-1">{comp.description}</p>
                  {comp.adminNotes && (
                    <div className="mt-2 text-xs border-t pt-2 border-gray-100 bg-gray-50 p-2 rounded">
                      <p className="font-semibold text-gray-700">Admin Notes:</p>
                      <p className="text-gray-600">{comp.adminNotes}</p>
                    </div>
                  )}
                  <span className="text-[10px] text-gray-400 block mt-2">
                    Filed on: {new Date(comp.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Feedback History */}
        {feedbacks.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400">Feedbacks</h3>
            <div className="space-y-3">
              {feedbacks.map((fb) => (
                <div key={fb._id} className="bg-white p-4 border border-gray-200 rounded-xl shadow-xs">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={14}
                          className={star <= fb.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}
                        />
                      ))}
                      <span className="text-xs text-gray-500 ml-2">({fb.experience})</span>
                    </div>
                    <span className="text-[10px] text-gray-400">
                      {new Date(fb.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-xs text-gray-700 italic">"{fb.comment}"</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SupportHistory;
