const AdminAllUserTableSkeleton = () => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            <th className="px-6 py-3">User Name</th>
            <th className="px-6 py-3">Email</th>
            <th className="px-6 py-3">Number</th>
            <th className="px-6 py-3">Profile Link</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {[...Array(5)].map((_, index) => (
            <tr key={index} className="hover:bg-gray-50 animate-pulse">
              <td className="px-6 py-4 flex items-center">
                <div className="h-10 w-10 rounded-full bg-gray-200"></div>
                <span className="ml-4 h-4 w-24 bg-gray-200 rounded"></span>
              </td>
              <td className="px-6 py-4 text-sm">
                <div className="h-4 w-32 bg-gray-200 rounded"></div>
              </td>
              <td className="px-6 py-4 text-sm">
                <div className="h-4 w-20 bg-gray-200 rounded"></div>
              </td>
              <td className="px-6 py-4 text-sm">
                <div className="h-4 w-24 bg-gray-200 rounded"></div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminAllUserTableSkeleton;
