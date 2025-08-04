const ImageSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        className="relative w-full pb-9/16 bg-gray-300 animate-pulse rounded-2xl"
        style={{ height: '200px', width: '350px' }}
      >
        <div className="absolute inset-0 bg-gray-300 rounded-xl"></div>
      </div>
    </div>
  );
};

export default ImageSkeleton;
