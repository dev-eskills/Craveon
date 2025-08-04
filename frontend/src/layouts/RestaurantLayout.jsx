import { Outlet } from 'react-router-dom';
import ErrorBoundary from '../utils/ErrorBoundary';
import Nav from '../components/navbar/Nav';
import RestaurantSidebar from '../components/restaurantDashboard/RestaurantSidebar';
import { Suspense } from 'react';
import Preloader from '../components/ui/Preloader';

function RestaurantLayout() {

  return (
    <section>
      <Nav />
      <section className="flex ">
        <RestaurantSidebar className={'lg:block hidden'}  />
        <div className="w-full flex p-4">
          <ErrorBoundary>
            <Suspense fallback={<Preloader />}>
              <Outlet />
            </Suspense>
          </ErrorBoundary>
        </div>
      </section>
    </section>
  );
}

export default RestaurantLayout;
