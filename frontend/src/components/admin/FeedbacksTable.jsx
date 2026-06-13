import { Star, MessageSquare } from 'lucide-react';

const FeedbacksTable = ({ feedbacks }) => {
  const totalFeedback = feedbacks.length;
  const avgRating = totalFeedback > 0
    ? (feedbacks.reduce((sum, item) => sum + item.rating, 0) / totalFeedback).toFixed(1)
    : 0;

  const experienceCounts = feedbacks.reduce((acc, curr) => {
    acc[curr.experience] = (acc[curr.experience] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {/* Aggregate metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Scorecard */}
        <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center text-amber-500">
            <Star className="fill-amber-400 text-amber-400" size={24} />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-800">{avgRating}/5</h3>
            <p className="text-xs text-gray-500">Average Customer Rating</p>
          </div>
        </div>

        <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-500">
            <MessageSquare size={24} />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-800">{totalFeedback}</h3>
            <p className="text-xs text-gray-500">Total Feedback Received</p>
          </div>
        </div>

        <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 flex flex-col justify-center">
          <p className="text-xs text-gray-500 mb-2 font-medium">Customer Sentiment:</p>
          <div className="flex gap-2 text-xs">
            <span className="text-green-700 bg-green-50 px-2 py-0.5 rounded">
              Excellent: {experienceCounts['Excellent'] || 0}
            </span>
            <span className="text-[#ff6900] bg-orange-50 px-2 py-0.5 rounded">
              Good: {experienceCounts['Good'] || 0}
            </span>
            <span className="text-gray-600 bg-gray-100 px-2 py-0.5 rounded">
              Average: {experienceCounts['Average'] || 0}
            </span>
          </div>
        </div>
      </div>

      {/* Feedbacks list */}
      <div className="overflow-x-auto border rounded-xl shadow-xs">
        <table className="w-full text-left text-sm border-collapse bg-white">
          <thead>
            <tr className="bg-gray-50 text-gray-500 font-semibold border-b border-gray-100">
              <th className="p-4">Customer</th>
              <th className="p-4">Rating</th>
              <th className="p-4">Sentiment</th>
              <th className="p-4">Comment</th>
              <th className="p-4">Submitted Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {feedbacks.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-8 text-center text-gray-400">No customer feedback logs found</td>
              </tr>
            ) : (
              feedbacks.map((fb) => (
                <tr key={fb._id} className="hover:bg-gray-50/50">
                  <td className="p-4">
                    <p className="font-medium text-gray-800">{fb.user?.name || 'Anonymous'}</p>
                    <p className="text-xs text-gray-400">{fb.user?.number || 'N/A'}</p>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          size={14}
                          className={s <= fb.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}
                        />
                      ))}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                      fb.experience === 'Excellent' ? 'bg-green-50 text-green-700' :
                      fb.experience === 'Good' ? 'bg-amber-50 text-amber-700' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {fb.experience}
                    </span>
                  </td>
                  <td className="p-4 text-gray-700 italic">"{fb.comment}"</td>
                  <td className="p-4 text-gray-500">{new Date(fb.createdAt).toLocaleDateString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FeedbacksTable;
