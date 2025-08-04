export const StatCard = ({ icon, title, value, trend, trendUp , isLoading}) => (
  <div className="bg-white p-5 rounded-lg shadow-md flex items-center border border-gray-200">
    {icon}
    <div className="ml-4">
      <div className="text-sm text-gray-500 font-medium">{title}</div>
      {isLoading ? (
        <div className="h-6 w-20 bg-gray-200 rounded animate-pulse mt-1 mb-1" />
      ) : (
        <div className="text-2xl font-bold text-gray-800">{value}</div>
      )}
      <div className={`text-sm font-semibold ${trendUp ? 'text-green-500' : 'text-red-500'}`}>
        {trend}
      </div>
    </div>
  </div>
);

export default StatCard;
