import { TEMP_PRODUCTS } from "../../tempData/CartPageTempData";
import Heading from "../ui/Heading";
import ProductCard from "../restaurantitems/ProductCard";

function PopularDishes() {
  return (
    <>
      <Heading text="Popular Dishes" />
      <section className="grid grid-cols-1 gap-4 gap-y-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 place-items-center sm:place-items-start">
        {TEMP_PRODUCTS.map((product, index) => (
          <ProductCard product={product} key={index} idx={index} />
        ))}
      </section>
    </>
  );
}

export default PopularDishes;
