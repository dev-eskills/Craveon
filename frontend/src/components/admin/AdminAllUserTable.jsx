import { useState } from 'react';
import { Phone, SquareArrowOutUpRight, User } from 'lucide-react';
import { useRiders } from '../../hooks/useRiders';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const USERS_PER_PAGE = 12;

const AdminAllUserTable = ({ users = [], isAllUsersPending = false }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const { toggleRider } = useRiders();
  // const totalPages = Math.ceil(users.length / USERS_PER_PAGE);
  const currentUsers = users.slice(
    (currentPage - 1) * USERS_PER_PAGE,
    currentPage * USERS_PER_PAGE
  );

  const handleToggle = (userId) => {
    toggleRider(userId, {
      onSuccess: () => {
        toast.success('Rider toggled successfully!');
      },
      onError: () => {
        toast.error('Failed to toggle rider');
      },
    });
  };
  return (
    <div className="py-2 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {isAllUsersPending
        ? Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="bg-white shadow-sm rounded-lg p-4 animate-pulse space-y-3">
              <div className="flex items-center gap-2 mb-3">
                <div className="h-10 w-10 rounded-full bg-gray-200" />
                <div className="space-y-1">
                  <div className="h-3 w-20 bg-gray-200 rounded" />
                  <div className="h-3 w-28 bg-gray-200 rounded" />
                </div>
              </div>
              <div className="h-3 w-24 bg-gray-200 rounded" />
              <div className="flex justify-between items-center mt-4">
                <div className="h-3 w-16 bg-gray-200 rounded" />
                <div className="h-5 w-10 bg-gray-300 rounded-full" />
              </div>
            </div>
          ))
        : currentUsers.map((user) => {
            const isDelivery = user?.role?.trim() === 'delivery';
            return (
              <div
                key={user?._id}
                className="bg-white shadow-sm rounded-lg p-4 hover:shadow-md transition w-auto"
              >
                <div className="flex items-center gap-1 mb-3">
                  <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                    <User className="h-6 w-6 text-gray-500" />
                  </div>
                  <div className="w-20">
                    <p className="text-xs  font-semibold text-gray-900 line-clamp-1 ">
                      {user?.name}
                    </p>
                    <p className="text-xs text-gray-900 line-clamp-1"> {user?.email}</p>
                  </div>
                </div>

                <p className="text-sm text-gray-700 mb-2 flex items-center gap-2">
                  <Phone size={15} />
                  <span>{user?.number}</span>
                </p>

                <div className="flex items-center mt-3">
                  {user?.role === 'user' && (
                    <Link
                      to={`/admin/order-history/${user._id}`}
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[#ff6900] hover:text-orange-400 text-xs font-medium"
                    >
                      View Orders <SquareArrowOutUpRight size={14} />
                    </Link>
                  )}
                  <button
                    onClick={() => handleToggle(user?._id)}
                    className={`group relative inline-flex items-center h-6 w-11 rounded-full transition-colors duration-300 ml-auto ${
                      isDelivery ? 'bg-[#ff6900]' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-300 ${
                        isDelivery ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 scale-0 group-hover:scale-100 transition-transform bg-black text-white text-xs px-2 py-1 rounded-md whitespace-nowrap z-10">
                      {isDelivery ? 'Create user' : 'Create rider'}
                    </span>
                  </button>
                </div>
              </div>
            );
          })}
    </div>
  );
  
};

export default AdminAllUserTable;
