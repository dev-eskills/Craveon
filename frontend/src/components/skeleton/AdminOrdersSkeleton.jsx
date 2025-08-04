const AdminOrdersSkeleton = () => {
  return (
    <div className="overflow-x-auto custom-scrollbar animate-pulse">
      <table className="min-w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            {Array(8)
              .fill(0)
              .map((_, idx) => (
                <th key={idx} className="py-2 px-4">
                  <div className="h-4 bg-gray-300 rounded w-1/2 mx-auto" />
                </th>
              ))}
          </tr>
        </thead>
        <tbody>
          {[...Array(5)].map((_, idx) => (
            <tr key={idx} className="border-b border-gray-200">
              {Array(8)
                .fill(0)
                .map((_, colIdx) => (
                  <td key={colIdx} className="py-3 px-4 whitespace-nowrap">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </td>
                ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminOrdersSkeleton
