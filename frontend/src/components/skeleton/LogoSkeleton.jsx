function LogoSkeleton() {
  return (
    <div className="relative flex flex-row-reverse">
      <div className="-translate-2 w-5 h-5 md:w-6 md:h-6 bg-gray-300 animate-pulse rounded-full"></div>
      {/* Blinking Lines */}
      <div>
        <div className="w-12 md:w-16 h-2 bg-gray-300 mt-1 rounded-md animate-pulse"></div>
        <div className="w-16 md:w-20 h-2 bg-gray-300 mt-2 rounded-md animate-pulse"></div>
      </div>
    </div>
  );
}

export default LogoSkeleton;
