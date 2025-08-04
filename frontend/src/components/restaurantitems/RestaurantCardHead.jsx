const RestaurantCardHead = ({ isOpen, foodType, name }) => {
  return (
    <div className="flex justify-between items-center mb-2">
      <span className="flex items-center justify-center gap-2">
        <h3 className="font-semibold text-lg line-clamp-1">{name}</h3>

        {(foodType === 'Both' || foodType === 'Veg') && (
          <svg width="15" height="15" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
            <rect x="5" y="5" width="50" height="50" stroke="green" strokeWidth="5" fill="none" />
            <circle cx="30" cy="30" r="12" fill="green" />
          </svg>
        )}
        {(foodType === 'Both' || foodType === 'Non-Veg') && (
          <svg width="15" height="15" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
            <rect x="5" y="5" width="50" height="50" stroke="red" strokeWidth="5" fill="none" />
            <polygon points="30,15 15,40 45,40" fill="red" />
          </svg>
        )}
      </span>
      <span
        className={`text-xs font-medium px-2 py-1 rounded-full ${
          isOpen ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
        }`}
      >
        {isOpen ? 'OPEN' : 'CLOSED'}
      </span>
    </div>
  );
};

export default RestaurantCardHead;
