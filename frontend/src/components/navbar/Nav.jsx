import React from 'react';
const Logo = React.lazy(() => import('../ui/Logo'));
import SearchBar from './SearchBar';
import { useLocation } from 'react-router-dom';
import NavSideButtons from './NavSideButtons';
import Location from './Location';
import { useAuthStore } from '../../stores/authStore';

const Nav = () => {

  const user = useAuthStore((state) => state.user);


  const location = useLocation();
  const isNotHome = location.pathname !== '/user/category';

  return (
    <div className="bg-white w-full shadow sticky top-0 z-50 px-3  mx-auto">
      <nav className="flex items-center justify-between ">
        <div className="flex items-center w-full sm:w-[30rem] gap-15">
          <div className="flex">
            <Logo />
          </div>

          {user?.role === 'admin' || user?.role === "restaurant" ? (
            ''
          ) : (
            <div className="hidden sm:flex">
              <Location />
            </div>
          )}
        </div>
        <div className="flex">
          {user?.role === 'admin' || user?.role === '"restaurant"' ? (
            ''
          ) : (
            <div className="hidden lg:block">{isNotHome && <SearchBar />}</div>
          )}
          <NavSideButtons />
        </div>
      </nav>
    </div>
  );
};

export default Nav;
