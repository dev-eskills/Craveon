

const OrderOverview = ({ icon: Icon, color, bgColor, title, value, isLoading }) => {
  return (
    <div className="p-4 border border-gray-200 rounded-xl flex items-start  hover:shadow-sm transition-shadow duration-200">
      <div className={`p-3 flex items-center justify-center rounded-lg ${bgColor}`}>
        <Icon className={`w-5 h-5 ${color}`} />
      </div>
      <div className="ml-4">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        {isLoading ? (
          <div className="w-16 h-5 bg-gray-200 animate-pulse rounded-md mt-1" />
        ) : (
          <h3 className="text-lg font-semibold">{value}</h3>
        )}
      </div>
    </div>
  );
};

export default OrderOverview;
