import banner from '/Restaurantimg.png';
const RestaurantMain = () => {
  return (
    <div
      className="flex justify-center items-center p-4 w-full h-90 bg-black bg-cover bg-center bg-no-repeat "
      style={{
        backgroundImage: `url(${banner})`,
      }}
    ></div>
  );
};

export default RestaurantMain;
