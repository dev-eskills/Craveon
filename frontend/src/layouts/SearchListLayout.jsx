import LocationList from '../components/ui/LocationList';
import SearchRestroLists from '../components/ui/SearchRestroLists';

function SearchListLayout({ isOpen, name, data }) {
  if (!isOpen || !name) return null;


  return (
    <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-50 w-full">
      {name === 'location' ? <LocationList data={data} /> : <SearchRestroLists data={data} />}
    </div>
  );
}

export default SearchListLayout;
