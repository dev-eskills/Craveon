import ContentWrapper from '../components/ui/ContentWrapper';
import Categories from '../components/home/Categories';
import Footer from '../components/footer/Footer';
import RestaurantMain from '../components/restaurantitems/RestaurantMain';
import ShowMore from '../components/ui/ShowMore';
import PopularDishes from '../components/restaurantitems/PopularDishes';

const RestaurantItems = () => {
  return (
    <>
      <RestaurantMain />
      <ContentWrapper className={'px-5'}>
        <Categories />
        <PopularDishes />
        <ShowMore />
      </ContentWrapper>
      <Footer />
    </>
  );
};

export default RestaurantItems;
