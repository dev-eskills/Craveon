import { Menu} from 'lucide-react';
import CartButton from '../ui/CartButton';
import UserButton from '../ui/UserButton';
import SideNavWrapper from './SideNavWrapper';
import AdminSidebar from '../admin/AdminSidebar';
import SearchBar from './SearchBar';
import { useAuthStore } from '../../stores/authStore';
import { useState } from 'react';
import RestaurantSidebar from '../restaurantDashboard/RestaurantSidebar';
import Location from './Location';
import GoogleMapMarker from '../categoryDetail/GoogleMapMarker';
import { AnimatePresence } from 'framer-motion';

function NavSideButtons() {
  const user = useAuthStore((state) => state.user);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <div className="lg:hidden p-2 flex items-center justify-center gap-3">
        {user?.role === 'user' ? <CartButton /> : ' '}
        <UserButton />
        <div onClick={() => setIsMenuOpen(true)} className="cursor-pointer">
          <Menu size={28} />
        </div>
      </div>

      <div className="hidden lg:flex items-center space-x-4">
        {user?.role === 'user' ? <CartButton /> : ' '}
        <UserButton />
      </div>

      {isMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setIsMenuOpen(false)}></div>
      )}

      <SideNavWrapper isOpen={isMenuOpen} setIsOpen={setIsMenuOpen}>
        {user?.role === 'admin' ? (
          <AdminSidebar className={'block lg:hidden '} />
        ) : user?.role === 'restaurant' ? (
          <RestaurantSidebar className="block lg:hidden" />
        ) : (
          <div className="flex flex-col gap-2 ">
            {/* <Location /> */}

            <SearchBar />
            {/* <LocationCanvas /> */}
            <AnimatePresence>
              {/* Header */}
              <div className="py-2 px-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-gray-800">Please Enter Your Location</h2>
                  
                </div>
              </div>

              {/* Map Container */}
              <div className="px-2">
                <div className="w-full md:h-72 h-62 rounded-lg overflow-hidden shadow-md">
                  <GoogleMapMarker />
                </div>
              </div>

              {/* Location Input Section */}
              <div className="p-4 flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enter Your Delivery Location
                </label>
                <div className="relative">
                  <Location />
                </div>
              </div>
            </AnimatePresence>
          </div>
        )}
      </SideNavWrapper>
    </>
  );
}

export default NavSideButtons;
