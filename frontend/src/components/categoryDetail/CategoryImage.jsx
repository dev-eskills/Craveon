const CategoryImage = ({ category }) => {
  return (
    <div className="relative w-full h-80 rounded-2xl md:h-80 overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat w-full h-full"
        style={{
          backgroundImage: `url(${category.image.cover})`,
        }}
      >
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent"></div>
      </div>

      {/* text */}
      <div className="absolute bottom-10 flex flex-col justify-center px-8 md:px-16">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
          Delicious {category.name}
        </h1>
        <p className="text-white/90 text-md max-w-lg">{category.description}</p>
      </div>
    </div>
  );
};

export default CategoryImage;
