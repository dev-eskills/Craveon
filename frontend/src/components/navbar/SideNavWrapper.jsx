import { X } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';

function SideNavWrapper({ isOpen, setIsOpen, children }) {
  const user = useAuthStore((state) => state.user);
  const isAdmin = user?.role === 'admin';
  const isRestaurant = user?.role === 'restaurant';

  return (
    <div
      className={`fixed top-0 ${isAdmin || isRestaurant ? 'left-0' : 'right-0'} h-full 
                  ${isAdmin || isRestaurant ? 'w-64' : 'w-full'} bg-white transform transition-transform duration-300 
                  ${isOpen ? 'translate-x-0' : isAdmin || isRestaurant ? '-translate-x-full' : 'translate-x-full'}
                  shadow-lg z-50 flex flex-col p-4 md:hidden overflow-y-auto`}
    >
      <div className="flex justify-between items-center mb-4">
        <X size={28} onClick={() => setIsOpen(false)} className="cursor-pointer" />
      </div>
      {children}
    </div>
  );
}

export default SideNavWrapper;
