import { lazy } from 'react';
import { useCategories } from '../../hooks/useCategories';
import Heading from '../ui/Heading';
import searchStore from "../../stores/searchStore";
import ContentWrapper from '../ui/ContentWrapper';
const Category = lazy(() => import('./Category'));

function Categories() {
  const { categories } = useCategories();
  const { searchTerm } = searchStore();
  const filteredCategories = categories?.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <ContentWrapper className={'px-2 md:px-5 py-5 mt-5  bg-gray-50'}>
      <Heading text={'Categories'} />
      <div className="grid grid-cols-3 gap-x-5 sm:flex sm:gap-x-10 justify-start mt-3  sm:flex-wrap gap-y-4.5">
        {filteredCategories?.map((category) => (
          <Category
            key={category._id}
            img={category?.image?.logo}
            title={category.name}
            id={category._id}
            status={category.isActive}
          />
        ))}
      </div>
    </ContentWrapper>
  );
}

export default Categories;
