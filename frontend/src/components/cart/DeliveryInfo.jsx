import { Link } from 'react-router-dom';
import UserSavedAddress from '../UserProfileAddress/UserSavedAddress';
import { MapPinPlusInside } from 'lucide-react';

const DeliveryInfo = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <span className="flex justify-between items-start ">
        <span>
          <h2 className="text-xl font-bold ">Delivery Information</h2>
          <p className="text-sm text-gray-600 mb-4">Please select a delivery address</p>
        </span>
        <Link
          to={'/user/profile/address'}
          className="flex gap-1 text-sm items-center text-orange-600"
        >
          <MapPinPlusInside className="size-4" /> New Address
        </Link>
      </span>
      <UserSavedAddress isOnPaymentPage={true} />
    </div>
  );
};

export default DeliveryInfo;
