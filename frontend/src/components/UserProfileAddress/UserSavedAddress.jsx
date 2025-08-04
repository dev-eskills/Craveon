import { Edit, Trash2 } from 'lucide-react';
import { useAddresses } from '../../hooks/useAddAddress';

import Spinner from '../ui/Spinner';
import { useCartStore } from '../../stores/cartStore';

const UserSavedAddress = ({ handleAddressEdit, isOnPaymentPage }) => {
  const { getAddress, isgetAddressPending, removeAddressFn, isRemoveAddressPending } =
    useAddresses();

  const { setSelectedDelAddress, selectedDelAddress } = useCartStore((state) => state);

  if (isgetAddressPending) {
    return (
      <div className="flex items-center justify-center mt-4">
        <h2>Please Wait</h2>
        <Spinner className={'ml-2'} />
      </div>
    );
  }

  return (
    <div className="mt-6 space-y-4">
      {getAddress?.addresses?.map((address) => (
        <div key={address?._id} className="bg-white  rounded-xl flex justify-between items-center">
          {isOnPaymentPage ? (
            <div className="flex items-center gap-4 w-full cursor-pointer">
              <input
                type="radio"
                id={address?._id}
                name="selectedAddress"
                checked={selectedDelAddress?._id === address?._id}
                onChange={() => setSelectedDelAddress(address)}
                className="w-5 h-5 accent-[black]"
              />
              <label htmlFor={address?._id} className="cursor-pointer">
                <p className="font-semibold flex items-center">{address?.label}</p>
                <p className="text-sm text-gray-600">{`${address?.addressLine1}  ${address?.addressLine2}  ${address?.city}  ${address?.zipCode} ,${address?.state}  ${address?.country}`}</p>
              </label>
            </div>
          ) : (
            <div>
              <p className="font-semibold flex items-center">{address?.label}</p>
              <p className="text-sm text-gray-600">{`${address?.addressLine1}  ${address?.addressLine2}  ${address?.city}  ${address?.zipCode} ,${address?.state}  ${address?.country}`}</p>
            </div>
          )}
          {!isOnPaymentPage && (
            <div className="flex gap-3">
              <Edit
                className="text-gray-600 cursor-pointer"
                size={18}
                onClick={() => handleAddressEdit(address)}
              />
              {isRemoveAddressPending && removeAddressFn.variables === address?._id ? (
                <Spinner />
              ) : (
                <Trash2
                  className="text-red-500 cursor-pointer"
                  size={18}
                  onClick={() => removeAddressFn.mutate(address?._id)}
                />
              )}
            </div>
          )}
        </div>
      ))}
      {getAddress?.addresses?.length === 0 && (
        <h1 className="text-center font-medium text-gray-600">No address found...</h1>
      )}
    </div>
  );
};

export default UserSavedAddress;
