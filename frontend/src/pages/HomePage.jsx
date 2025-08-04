import Footer from '../components/footer/Footer';
import Slider from '../components/home/Slider';
import ContentWrapper from '../components/ui/ContentWrapper';

import { lazy, Suspense } from 'react';
import CategorySkeleton from '../components/skeleton/CategorySkeleton';
import SpecialOfferCard from '../components/home/SpecialOfferCard';
import Meta from '../Meta';

const Categories = lazy(() => import('../components/home/Categories'));
const PopularRestaurants = lazy(() => import('../components/home/PopularRestaurants'));

function HomePage() {
  return (
    <>
      <Meta />
      <Slider />
      <Suspense fallback={<CategorySkeleton />}>
        <Categories />
      </Suspense>

      <ContentWrapper className={'px-2 md:px-5 pt-5'}>
        <PopularRestaurants />

        <SpecialOfferCard
          title={'Express Delivery'}
          description={'Get your food delivered to your doorstep within 30 minutes.'}
          bottomText={'Free Delivery'}
          className={'opp-red-gd max-w-full'}
        />
      </ContentWrapper>
      <Footer />
    </>
  );
}

export default HomePage;
