import Heading from '../ui/Heading';

const CategorySkeleton = () => {
  return (
    <>
      <Heading text={'Categories'} />
      <div className="flex gap-x-10 mt-6 justify-center sm:justify-start flex-wrap gap-y-4.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="animate-pulse flex flex-col items-center gap-y-2.5">
            <div className="bg-gray-300 rounded-full size-16"></div>
            <div className="bg-gray-300 h-4 w-20 rounded"></div>
          </div>
        ))}
      </div>
    </>
  );
};

export default CategorySkeleton;
