const ComplaintsTable = ({ complaints, openComplaintModal }) => {
  return (
    <div className="overflow-x-auto border rounded-xl shadow-xs">
      <table className="w-full text-left text-sm border-collapse bg-white">
        <thead>
          <tr className="bg-gray-50 text-gray-500 font-semibold border-b border-gray-100">
            <th className="p-4">Customer</th>
            <th className="p-4">Category</th>
            <th className="p-4">Subject</th>
            <th className="p-4">Link Order</th>
            <th className="p-4">Status</th>
            <th className="p-4">Date Filed</th>
            <th className="p-4">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {complaints.length === 0 ? (
            <tr>
              <td colSpan="7" className="p-8 text-center text-gray-400">No complaints registered</td>
            </tr>
          ) : (
            complaints.map((complaint) => (
              <tr key={complaint._id} className="hover:bg-gray-50/50">
                <td className="p-4">
                  <p className="font-medium text-gray-800">{complaint.user?.name}</p>
                  <p className="text-xs text-gray-400">{complaint.user?.email}</p>
                </td>
                <td className="p-4">
                  <span className="px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700">
                    {complaint.category}
                  </span>
                </td>
                <td className="p-4 font-medium text-gray-800">{complaint.subject}</td>
                <td className="p-4 text-gray-500">
                  {complaint.order ? `#${complaint.order.orderNumber}` : 'None'}
                </td>
                <td className="p-4">
                  <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                    complaint.status === 'PENDING' ? 'bg-amber-100 text-amber-800' :
                    complaint.status === 'INVESTIGATING' ? 'bg-blue-100 text-blue-800' :
                    complaint.status === 'RESOLVED' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {complaint.status}
                  </span>
                </td>
                <td className="p-4 text-gray-500">{new Date(complaint.createdAt).toLocaleDateString()}</td>
                <td className="p-4">
                  <button
                    onClick={() => openComplaintModal(complaint)}
                    className="px-3 py-1.5 bg-[#FFF1E6] text-[#ff6900] rounded hover:bg-orange-100 text-xs font-semibold cursor-pointer transition"
                  >
                    Update
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

export default ComplaintsTable;
