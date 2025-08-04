import { useState } from 'react';
import { Search, ChevronRight, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCategories } from '../../hooks/useCategories';

const SearchBar = () => {
  const [input, setInput] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const { categories } = useCategories();

  const handleInputFocus = () => {
    setShowDropdown(true);
  };

  const handleBlur = () => {
    setTimeout(() => setShowDropdown(false), 200);
  };

  const handleCategorySelect = (category) => {
    navigate(`/user/category/${category?._id}?category=${encodeURIComponent(category?.name)}`);
    setInput('');
    setShowDropdown(false);
  };

  const handleChevronClick = () => {
    setShowDropdown((prev) => !prev);
  };

  const filteredCategories = categories?.filter((cat) =>
    cat.name.toLowerCase().includes(input.toLowerCase())
  );

  return (
    <div className="relative w-full max-w-xl mx-auto px-2 sm:px-4 py-4">
      <div
        className={`flex items-center gap-2 border rounded-full px-4 py-2 bg-white shadow-sm hover:shadow-md transition-shadow ${
          showDropdown ? 'ring-2 ring-yellow-400 border-transparent' : 'border-gray-300'
        }`}
      >
        <Search className="text-gray-400" size={20} />
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onFocus={handleInputFocus}
          onBlur={handleBlur}
          placeholder="Search categories..."
          className="w-full bg-transparent outline-none text-gray-700 placeholder-gray-400"
        />
        <button
          onClick={handleChevronClick}
          className="bg-orange-500 hover:bg-orange-600 transition-colors rounded-full p-1 focus:outline-none"
        >
          {showDropdown ? (
            <ChevronDown size={18} className="text-white" />
          ) : (
            <ChevronRight size={18} className="text-white" />
          )}
        </button>
      </div>

      {showDropdown && filteredCategories?.length > 0 && (
        <div className="absolute z-50 mt-2 w-full bg-white border border-gray-200 rounded-md shadow-md max-h-60 overflow-y-auto">
          {filteredCategories?.map((category) => (
            <div
              key={category?._id}
              onMouseDown={() => handleCategorySelect(category)}
              className="px-4 py-2 hover:bg-orange-50 cursor-pointer text-sm text-gray-700"
            >
              {category?.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
