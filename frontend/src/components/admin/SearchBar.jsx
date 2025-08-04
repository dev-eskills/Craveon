import { Search } from 'lucide-react';
import  { useState } from 'react';
import useSearchStore from '../../stores/searchStore';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const setSearchTerm = useSearchStore((state) => state.setSearchTerm);

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    setSearchTerm(value);
  };
  return (
    <div className="flex items-center mb-6 w-full sm:w-[60%] lg:w-[30%] sm:rounded-lg border-gray-300 border-t sm:border-none bg-white text-black sm:shadow-sm px-3 py-3 transition-all focus-within:ring-2 focus-within:ring-indigo-500">
      <Search className="text-gray-500 mr-2" size={22} />
      <input
        type="text"
        placeholder="Search.."
        value={query}
        onChange={handleChange}
        className="w-full bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none focus:outline-none"
      />
    </div>
  );
};

export default SearchBar;
