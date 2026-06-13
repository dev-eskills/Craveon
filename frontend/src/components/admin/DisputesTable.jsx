const DisputesTable = ({ disputes, openDisputeModal }) => {
  return (
    <div className="overflow-x-auto border rounded-xl shadow-xs">
      <table className="w-full text-left text-sm border-collapse bg-white">
        <thead>
          <tr className="bg-gray-50 text-gray-500 font-semibold border-b border-gray-100">
            <th className="p-4">Order Number</th>
            <th className="p-4">Restaurant</th>
            <th className="p-4">Customer</th>
            <th className="p-4">Dispute Reason</th>
            <th className="p-4">Status</th>
            <th className="p-4">Date Filed</th>
            <th className="p-4">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {disputes.length === 0 ? (
            <tr>
              <td colSpan="7" className="p-8 text-center text-gray-400">No disputes active</td>
            </tr>
          ) : (
            disputes.map((dispute) => (
              <tr key={dispute._id} className="hover:bg-gray-50/50">
                <td className="p-4 font-medium text-gray-800">#{dispute.order?.orderNumber || 'N/A'}</td>
                <td className="p-4 text-gray-600">{dispute.order?.restaurant?.name || 'N/A'}</td>
                <td className="p-4">
                  <p className="font-medium text-gray-800">{dispute.user?.name}</p>
                  <p className="text-xs text-gray-400">{dispute.user?.number}</p>
                </td>
                <td className="p-4">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-red-700">
                    {dispute.disputeReason.replace('_', ' ')}
                  </span>
                </td>
                <td className="p-4">
                  <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                    dispute.status === 'PENDING' ? 'bg-amber-100 text-amber-800' :
                    dispute.status === 'UNDER_REVIEW' ? 'bg-blue-100 text-blue-800' :
                    dispute.status.startsWith('RESOLVED') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {dispute.status.replace('_', ' ')}
                  </span>
                </td>
                <td className="p-4 text-gray-500">{new Date(dispute.createdAt).toLocaleDateString()}</td>
                <td className="p-4">
                  <button
                    onClick={() => openDisputeModal(dispute)}
                    className="px-3 py-1.5 bg-[#FFF1E6] text-[#ff6900] rounded hover:bg-orange-100 text-xs font-semibold cursor-pointer transition"
                  >
                    Resolve
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DisputesTable;
