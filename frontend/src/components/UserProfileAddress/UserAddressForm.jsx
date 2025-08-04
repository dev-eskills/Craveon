import UserSavedAddress from './UserSavedAddress';
import Input from '../ui/Input';
import useFormData from '../../hooks/useFormData';
import { useAddresses } from '../../hooks/useAddAddress';
import Spinner from '../ui/Spinner';
import { useState } from 'react';
import { addressFormData } from '../../tempData/CartPageTempData';
import BackButton from '../ui/BackButton';

const UserAddressForm = () => {
  const { formData, setFormData, handleChange, reset } = useFormData({
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    label: 'Home',
  });

  const [edit, setEdit] = useState({
    address: {},
    isEdit: false,
  });

  const { addAddressFn, isAddAddressPending, editAddressFn, isRemoveAddressPending } =
    useAddresses();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (edit.isEdit && edit.address._id) {
      const updateData = {
        ...formData,
        addressId: edit.address._id,
      };
    

      editAddressFn(updateData, {
        onSuccess: () => {
          reset();
          setEdit({ address: {}, isEdit: false });
        },
      });
    } else {
      addAddressFn(formData, {
        onSuccess: () => {
          reset();
        },
      });
    }
  };

  const handleAddressEdit = (address) => {
    setEdit({
      address,
      isEdit: true,
    });

    setFormData({
      addressLine1: address.addressLine1 || '',
      addressLine2: address.addressLine2 || '',
      city: address.city || '',
      state: address.state || '',
      zipCode: address.zipCode || '',
      country: address.country || '',
      label: address.label || 'Home',
    });
  };

  const handleCancelEdit = () => {
    setEdit({ address: {}, isEdit: false });
    reset();
  };

  return (
    <>
      <div className="md:col-span-2 bg-white p-6 rounded-xl shadow">
        <BackButton text={edit.isEdit ? 'Edit Address' : 'My Addresses'} />

        <form className="mt-4 space-y-3" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {addressFormData.map(({ label, name, type, placeholder }) => (
              <Input
                key={name}
                label={label}
                type={type}
                name={name}
                value={formData[name]}
                placeholder={placeholder}
                onChange={handleChange}
              />
            ))}
          </div>

          <div className="mt-4">
            <div className="flex gap-4">
              {['Home', 'Work', 'Other'].map((labelValue) => (
                <label key={labelValue} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="label"
                    value={labelValue}
                    checked={formData.label === labelValue}
                    onChange={handleChange}
                    className="w-5 h-5 accent-[black]"
                  />
                  <span>{labelValue}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-end mt-4 gap-2">
            {edit.isEdit && (
              <button
                type="button"
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md w-full cursor-pointer"
                onClick={handleCancelEdit}
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              className="px-4 py-2 bg-[#ff6900] text-white rounded-md w-full cursor-pointer"
              disabled={isAddAddressPending || isRemoveAddressPending}
            >
              {isAddAddressPending || (edit.isEdit && isRemoveAddressPending) ? (
                <>
                  <div className="flex items-center justify-center">
                    <h2>{edit.isEdit ? 'Updating' : 'Adding'}</h2>
                    <Spinner />
                  </div>
                </>
              ) : edit.isEdit ? (
                'Update Address'
              ) : (
                'Add Address'
              )}
            </button>
          </div>
        </form>

        {/* Saved Addresses */}
        <UserSavedAddress handleAddressEdit={handleAddressEdit} />
      </div>
    </>
  );
};

export default UserAddressForm;
