import { LogOut, User, UserPen } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { useAuth } from '../../hooks/useAuth';

const UserButton = () => {
  const [open, setOpen] = useState(false);
  const user = useAuthStore((state) => state.user);
  const { logoutFn } = useAuth();
  const buttonRef = useRef(null);


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (buttonRef.current && !buttonRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [open]);

  return (
    <div className="relative">
      {!user ? (
        <Link to={'/login'}>
          <div
            className="border bg-white p-2 rounded-full cursor-pointer transition-all duration-300
             hover:scale-90 hover:text-yellow-500 hover:shadow-lg 
             w-8 h-8 md:w-10 md:h-10 flex items-center justify-center "
          >
            <User />
          </div>
        </Link>
      ) : (
        <div>
          <div
            ref={buttonRef}
            className="border bg-white p-2 rounded-full cursor-pointer transition-all duration-300
              hover:scale-90 hover:text-yellow-500 hover:shadow-lg 
              w-8 h-8 md:w-10 md:h-10 flex items-center justify-center"
            onClick={(e) => {
              e.stopPropagation();
              setOpen(!open);
            }}
          >
            <User />
          </div>

          {user && open && (
            <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-100 shadow-lg rounded-lg z-[60] overflow-hidden">
              <Link
                to={
                  user?.role === 'restaurant'
                    ? '/restaurant'
                    : user?.role === 'admin'
                      ? '/admin'
                      : 'profile'
                }
                className=" px-4 py-2 text-gray-800 hover:bg-gray-100 flex items-center space-x-2  border-b border-gray-100 cursor-pointer"
                onClick={() => setOpen(false)}
              >
                <UserPen size={15} />
                <h1 className="text-md">Profile</h1>
              </Link>
              <button
                className="flex items-center space-x-2 w-full text-left px-4 py-2 text-red-600 hover:bg-red-100 cursor-pointer"
                onClick={() => {
                  logoutFn();
                  setOpen(false);
                }}
              >
                <LogOut size={15} />
                <h1 className="text-md">Logout</h1>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UserButton;
