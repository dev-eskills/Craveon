import { TEMP_PRODUCTS } from '../../tempData/CartPageTempData';
import Heading from '../ui/Heading';
import ProductCard from '../restaurantitems/ProductCard';

function AdminRestaurantProducts() {
  return (
    <>
      <Heading text="All Dishes" />
      <section className=" flex flex-wrap gap-4 w-full ">
        {TEMP_PRODUCTS.map((product, index) => (
          <ProductCard product={product} key={index} idx={index} className={"md:w-85 w-full"}/>
        ))}
      </section>
    </>
  );
}

export default AdminRestaurantProducts;
