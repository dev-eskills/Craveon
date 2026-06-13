import { useState } from 'react';
import {
  ShoppingBag,
  MapPin,
  ChevronRight,
  Mail,
  Phone,
  HelpCircle,
  Pencil,
  X,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { useUserDetail } from '../../hooks/useAddAddress';

const UserHomePage = ({ changeForm }) => {
  const user = useAuthStore((state) => state.user);
  const { data: userData , isPending } = useUserDetail(user.id);
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  const menuItems = [
    { icon: ShoppingBag, title: 'Orders', subtitle: 'Click to see orders', route: `order-history/${user.id}` },
    { icon: MapPin, title: 'Address', subtitle: 'Add new address', route: 'address' },
  ];

  const quickLinks = [
    { icon: ShoppingBag, label: 'My Order', route: `order-history/${user.id}` },
    { icon: HelpCircle, label: 'Support', route: 'support' },
  ];

  const handleQuickLinkClick = (label, route) => {
    navigate(route);
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm p-6 flex items-center gap-4">
        <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center border-2 border-gray-200">
          <Mail size={40} className="text-gray-400" />
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-800">
            {' '}
            {isPending ? (
              <div className="w-30 h-6 bg-gray-200 rounded-md"></div>
            ) : (
              <>{userData?.user?.name || 'No email available'}</>
            )}
          </h1>
          <p className="text-sm text-gray-600 flex items-center">
            <Mail size={16} className="mr-2 text-[#ff6900]" />
            {isPending ? (
              <div className="w-20 h-3 bg-gray-200 rounded-md"></div>
            ) : (
              <>{userData?.user?.email || 'No email available'}</>
            )}
          </p>
          <p className="text-sm text-gray-600 flex items-center">
            <Phone size={16} className="mr-2 text-[#ff6900]" />
            {isPending ? (
              <div className="w-20 h-3 bg-gray-200 rounded-md"></div>
            ) : (
              <>{userData?.user?.number || 'No phone available'}</>
            )}
          </p>
        </div>
        <button
          className="w-10 h-10 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center"
          onClick={() => changeForm('true')}
        >
          <Pencil size={18} className="text-[#ff6900]" />
        </button>
      </div>

      {/* Quick Links */}
      <div className="bg-white rounded-lg shadow-sm p-6 my-6 grid grid-cols-2 gap-4">
        {quickLinks.map(({ icon: Icon, label, route }) => (
          <button
            key={label}
            onClick={() => handleQuickLinkClick(label, route)}
            className="flex items-center justify-center flex-col"
          >
            <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center hover:bg-red-100">
              <Icon size={20} className="text-[#ff6900]" />
            </div>
            <span className="text-sm font-medium text-gray-700">{label}</span>
          </button>
        ))}
      </div>

      {/* Navigation Links */}
      <div className="bg-white rounded-lg shadow-sm divide-y divide-gray-100">
        {menuItems.map(({ icon: Icon, title, subtitle, route }) => (
          <Link to={route} key={title}>
            <div className="p-4 flex items-center hover:bg-gray-50 cursor-pointer">
              <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center mr-3">
                <Icon size={18} className="text-[#ff6900]" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-800">{title}</h3>
                <p className="text-sm text-gray-500">{subtitle}</p>
              </div>
              <ChevronRight className="text-gray-400" size={20} />
            </div>
          </Link>
        ))}
      </div>

      {/* Support Popup Modal */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-10 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Support Unavailable</h2>
              <button onClick={() => setShowPopup(false)}>
                <X className="text-gray-400 hover:text-gray-600" />
              </button>
            </div>
            <p className="text-sm text-gray-600">
              We are currently not available for support. Please try again later or reach out via
              email.
            </p>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setShowPopup(false)}
                className="px-4 py-2 text-sm font-medium text-white bg-[#ff6900] rounded hover:bg-orange-600"
              >
                Okay
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UserHomePage;
