import CategoryRestroCard from './CategoryRestroCard';
import { useLocation } from 'react-router-dom';
import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const CategoryCardSection = ({ products }) => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const category = queryParams.get('category');

  const [isFilterOpen, setIsFilterOpen] = useState(false);

  return (
    <div className="relative py-6 px-3 rounded-lg bg-white mt-6">
      {/* Layout with Sidebar & Full-Width Cards */}
      <div className="flex flex-col md:flex-row relative">
        {/* Filters Section */}
        {/* <div className="md:w-64 md:mr-6 mb-5 shrink-0h-fit sm:sticky top-0">
       
          <div className="flex justify-end mb-5 sm:mb-0">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="md:hidden px-3 py-2  border border-gray-400  rounded-lg flex items-center gap-2 shadow-md font-bold transition-all duration-300"
            >
              {isFilterOpen ? (
                <>
                  Filters <ChevronUp className="w-5 h-5" />
                </>
              ) : (
                <>
                  Filters <ChevronDown className="w-5 h-5" />
                </>
              )}
            </button>
          </div>

          <div
            className={`bg-white rounded-lg shadow-sm border border-gray-100 p-6 transition-all ${
              isFilterOpen ? 'block' : 'hidden'
            } md:block`}
          >
            <h2 className="text-xl font-bold mb-4">Filters</h2>

            <div className="mb-5">
              <h3 className="font-medium mb-2">Price Range</h3>
              <select className="w-full border border-gray-200 rounded-md p-2">
                <option>$10 - $15</option>
              </select>
            </div>

            <div className="mb-5">
              <h3 className="font-medium mb-2">Rating</h3>
              <select className="w-full border border-gray-200 rounded-md p-2">
                <option>All Ratings</option>
              </select>
            </div>

            <div>
              <h3 className="font-medium mb-2">Dietary</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input type="checkbox" id="vegetarian" className="mr-2" />
                  <label htmlFor="vegetarian">Vegetarian</label>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" id="vegan" className="mr-2" />
                  <label htmlFor="vegan">Vegan</label>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" id="gluten-free" className="mr-2" />
                  <label htmlFor="gluten-free">Gluten Free</label>
                </div>
              </div>
            </div>
          </div>
        </div> */}

        {/* Responsive Grid Layout for Restaurant Cards */}
        <div className="flex-1 ">
          <CategoryRestroCard products={products} query={category} />
        </div>
      </div>
    </div>
  );
};

export default CategoryCardSection;
