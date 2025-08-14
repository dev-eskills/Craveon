import { useState } from 'react';
import useRestaurantStore from '../stores/addRestaurantStore';
import useRestaurants from '../hooks/useRestaurants';
import { motion } from 'framer-motion';
import { useLocation, useSearchParams } from 'react-router-dom';
import GoogleMapMarker from '../components/categoryDetail/GoogleMapMarker';
import Location from '../components/navbar/Location';
import { localLocation } from '../stores/getLocalLocation';

const AdminAddRestaurant = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [errors, setErrors] = useState({});

  const {
    name,
    description,
    foodType,
    cuisine,
    password,
    priceRange,
    address,
    contactInfo,
    deliverySettings,
    paymentOptions,
    additionalSettings,
    updateField,
    updateAddress,
    updateContactInfo,
    updateDeliverySettings,
    updatePaymentOptions,
    updateAdditionalSettings,
  } = useRestaurantStore();

  const { addRestaurantFn, updateRestaurantDetailFn } = useRestaurants();
  const resetState = useRestaurantStore((state) => state.resetState);
  const { location } = localLocation();
  const [searchParams] = useSearchParams();
  const isEdit = searchParams.get('edit') === 'true';
  const paramslocation = useLocation();
  const queryParams = new URLSearchParams(paramslocation.search);
  const editId = queryParams.get('id');

  const tabs = [
    { label: 'Basic Information' },
    { label: 'Address' },
    { label: 'Contact Information' },
    { label: 'Delivery & Payment Options' },
    { label: 'Additional Settings' },
    { label: 'Bank Details' },
    { label: 'Tax Information' },
  ];

  const validateTab = (tabIndex) => {
    let newErrors = {};
    let isValid = true;

    if (tabIndex === 0) {
      if (!name.trim()) {
        newErrors.name = 'Restaurant name is required';
        isValid = false;
      }
      if (!description.trim()) {
        newErrors.description = 'Description is required';
        isValid = false;
      }
      if (!foodType) {
        newErrors.foodType = 'Food type is required';
        isValid = false;
      }
      if (!cuisine || cuisine.length === 0) {
        newErrors.cuisine = 'Cuisine type is required';
        isValid = false;
      }
      if (!isEdit && !password.trim()) {
        newErrors.password = 'Password is required';
        isValid = false;
      }
    } else if (tabIndex === 1) {
      if (!address.street.trim()) {
        newErrors.street = 'Street is required';
        isValid = false;
      }
      if (!address.city.trim()) {
        newErrors.city = 'City is required';
        isValid = false;
      }
      if (!address.state.trim()) {
        newErrors.state = 'State is required';
        isValid = false;
      }
      if (!address.zipCode.trim()) {
        newErrors.zipCode = 'ZIP Code is required';
        isValid = false;
      }
    } else if (tabIndex === 2) {
      const phonePattern = /^\d{10}$/;
      const emailPattern = /\S+@\S+\.\S+/;

      if (!contactInfo.phones[0]?.trim() || !phonePattern.test(contactInfo.phones[0])) {
        newErrors.phone = 'Valid 10-digit phone number is required';
        isValid = false;
      }

      if (contactInfo.email && !emailPattern.test(contactInfo.email)) {
        newErrors.email = 'Invalid email format';
        isValid = false;
      }
    } else if (tabIndex === 3) {
      if (!deliverySettings.isDeliveryAvailable) {
        newErrors.isDeliveryAvailable = 'Delivery availability is required';
        isValid = false;
      }
      if (!deliverySettings.deliveryRadius) {
        newErrors.deliveryRadius = 'Delivery radius is required';
        isValid = false;
      }
      if (!deliverySettings.minimumOrderAmount) {
        newErrors.minimumOrderAmount = 'Minimum order amount is required';
        isValid = false;
      }
      if (!deliverySettings.deliveryFee) {
        newErrors.deliveryFee = 'Delivery fee is required';
        isValid = false;
      }
      if (!paymentOptions.acceptsCash) {
        newErrors.acceptsCash = 'Cash payment option is required';
        isValid = false;
      }
    } else if (tabIndex === 4) {
      if (!additionalSettings.isActive) {
        newErrors.isActive = 'Restaurant should be active ';
        isValid = false;
      }
    } else if (tabIndex === 5) {
      // Account Name (basic required validation already present)
      if (!additionalSettings.bankDetails.accountName.trim()) {
        newErrors.accountName = 'Account Name is required';
        isValid = false;
      }

      // Account Number: 10, 11, 16 or 18 digits only
      const accNum = additionalSettings.bankDetails.accountNumber.trim();
      if (!accNum) {
        newErrors.accountNumber = 'Account Number is required';
        isValid = false;
      } else if (!/^\d{10}$|^\d{11}$|^\d{16}$|^\d{18}$/.test(accNum)) {
        newErrors.accountNumber = 'Account Number must be 10, 11, 16 or 18 digits';
        isValid = false;
      }

      // IFSC Code: exactly 11 alphanumeric characters
      const ifsc = additionalSettings.bankDetails.ifscCode.trim();
      if (!ifsc) {
        newErrors.ifscCode = 'IFSC Code is required';
        isValid = false;
      } else if (!/^[A-Za-z]{4}[0-9A-Za-z]{7}$/.test(ifsc)) {
        newErrors.ifscCode = 'Invalid IFSC Code format (must be 11 alphanumeric characters)';
        isValid = false;
      }

      // Bank Name: only alphabets and spaces, length 3–50
      const bankName = additionalSettings.bankDetails.bankName.trim();
      if (!bankName) {
        newErrors.bankName = 'Bank Name is required';
        isValid = false;
      } else if (!/^[A-Za-z\s]{3,50}$/.test(bankName)) {
        newErrors.bankName = 'Bank Name should be 3–50 letters only';
        isValid = false;
      }
    } else if (tabIndex === 6) {
      // GSTIN: Required + 15-character alphanumeric with format (e.g., 22ABCDE1234F1Z5)
      const gstin = additionalSettings.taxInfo.gstin.trim();
      if (!gstin) {
        newErrors.gstin = 'GSTIN is required';
        isValid = false;
      } else if (!/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}[Z]{1}[0-9A-Z]{1}$/.test(gstin)) {
        newErrors.gstin = 'Invalid GSTIN format';
        isValid = false;
      }

      // VAT Number: Required + alphanumeric, 8 to 15 characters
      const vat = additionalSettings.taxInfo.vatNumber.trim();
      if (!vat) {
        newErrors.vatNumber = 'VAT Number is required';
        isValid = false;
      } else if (!/^[A-Za-z0-9]{8,15}$/.test(vat)) {
        newErrors.vatNumber = 'VAT Number must be 8 to 15 alphanumeric characters';
        isValid = false;
      }

      // PAN Number: Required + valid format (e.g., ABCDE1234F)
      const pan = additionalSettings.taxInfo.panNumber.trim().toUpperCase();
      if (!pan) {
        newErrors.panNumber = 'PAN Number is required';
        isValid = false;
      } else if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan)) {
        newErrors.panNumber = 'Invalid PAN Number format';
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (validateTab(activeTab)) {
      setActiveTab((prev) => Math.min(prev + 1, tabs.length - 1));
    } else {
      document.querySelector('.error-message')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    setActiveTab((prev) => Math.max(prev - 1, 0));
  };

  const hasError = (field) => (errors[field] ? true : false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (activeTab < tabs.length - 1) {
      handleNext();
      return;
    }

    let isFormValid = true;
    for (let i = 0; i < tabs.length; i++) {
      if (!validateTab(i)) {
        setActiveTab(i);
        isFormValid = false;
        break;
      }
    }

    if (isFormValid) {
      const data = {
        name,
        email: contactInfo.email,
        number: contactInfo.phones[0],
        password,
        location: {
          type: 'Point',
          coordinates: [location.lon, location.lat],
          displayName: location.description,
        },
        description,
        foodType,
        priceRange,
        address,
        contactInfo,
        deliverySettings,
        cuisine,
        paymentOptions,
        bankDetails: additionalSettings.bankDetails,
        taxInfo: additionalSettings.taxInfo,
        commissionRate: additionalSettings.commissionRate,
        packagingCharge: additionalSettings.packagingCharge,
      };

      if (isEdit) {
        updateRestaurantDetailFn(
          { data, editId },
          {
            onSuccess: () => {
              resetState();
            },
          }
        );
      } else {
        addRestaurantFn(data);
      }
    } else {
      console.log('Form is not valid, active tab:', activeTab);
    }
  };
  return (
    <div className="w-full mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Create Restaurant</h2>

      {/* Tab Navigation */}
      <div className="flex space-x-4 mb-6 text-nowrap shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1)] overflow-x-auto">
        {tabs.map((tab, index) => (
          <button
            key={index}
            className={`px-4 py-2 ${activeTab === index ? 'border-b-2 text-gray-700 border-orange-600' : 'text-gray-400'}`}
            onClick={() => {
              if (validateTab(activeTab)) {
                setActiveTab(index);
              }
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <form onSubmit={handleSubmit} className="space-y-8 ">
        {activeTab === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="bg-white shadow-sm p-6 rounded-lg"
          >
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Restaurant Name*
              </label>
              <input
                type="text"
                className={`w-full px-3 py-2 border ${hasError('name') ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500`}
                value={name}
                onChange={(e) => updateField('name', e.target.value)}
                required
              />
              {hasError('name') && (
                <p className="mt-1 text-sm text-red-500 error-message">{errors.name}</p>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description*</label>
              <textarea
                rows="3"
                className={`w-full px-3 py-2 border ${hasError('description') ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500`}
                value={description}
                onChange={(e) => updateField('description', e.target.value)}
                required
              ></textarea>
              {hasError('description') && (
                <p className="mt-1 text-sm text-red-500 error-message">{errors.description}</p>
              )}
            </div>
            {!isEdit && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Password*</label>
                <input
                  type="password"
                  className={`w-full px-3 py-2 border ${hasError('password') ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500`}
                  value={password}
                  onChange={(e) => updateField('password', e.target.value)}
                  required
                />
                {hasError('password') && (
                  <p className="mt-1 text-sm text-red-500 error-message">{errors.password}</p>
                )}
              </div>
            )}

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Food Type*</label>
              <select
                className={`w-full px-3 py-2 border ${hasError('foodType') ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500`}
                value={foodType}
                onChange={(e) => updateField('foodType', e.target.value)}
                required
              >
                <option value="">Select Food Type</option>
                <option value="Veg">Vegetarian Only</option>
                <option value="Non-Veg">Non-Vegetarian Only</option>
                <option value="Both">Both Veg & Non-Veg</option>
              </select>
              {hasError('foodType') && (
                <p className="mt-1 text-sm text-red-500 error-message">{errors.foodType}</p>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Cuisine*</label>
              <input
                type="text"
                className={`w-full px-3 py-2 border ${hasError('cuisine') ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500`}
                value={cuisine.join(', ')}
                onChange={(e) => {
                  const newCuisine = e.target.value.split(',').map((item) => item.trim());
                  updateField('cuisine', newCuisine);
                }}
                required
              />
              {hasError('cuisine') && (
                <p className="mt-1 text-sm text-red-500 error-message">{errors.cuisine}</p>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                value={priceRange}
                onChange={(e) => updateField('priceRange', e.target.value)}
              >
                <option value="">Select Price Range</option>
                <option value="$">₹ Budget</option>
                <option value="$$">₹₹ Moderate</option>
                <option value="$$$">₹₹₹ Expensive</option>
                <option value="$$$$">₹₹₹₹ Very Expensive</option>
              </select>
            </div>
          </motion.div>
        )}

        {activeTab === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="bg-white shadow-sm p-6 rounded-lg"
          >
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Street*</label>
              <input
                type="text"
                className={`w-full px-3 py-2 border ${hasError('street') ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500`}
                value={address.street}
                onChange={(e) => updateAddress('street', e.target.value)}
                required
              />
              {hasError('street') && (
                <p className="mt-1 text-sm text-red-500 error-message">{errors.street}</p>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">City*</label>
              <input
                type="text"
                className={`w-full px-3 py-2 border ${hasError('city') ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500`}
                value={address.city}
                onChange={(e) => updateAddress('city', e.target.value)}
                required
              />
              {hasError('city') && (
                <p className="mt-1 text-sm text-red-500 error-message">{errors.city}</p>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">State*</label>
              <input
                type="text"
                className={`w-full px-3 py-2 border ${hasError('state') ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500`}
                value={address.state}
                onChange={(e) => updateAddress('state', e.target.value)}
                required
              />
              {hasError('state') && (
                <p className="mt-1 text-sm text-red-500 error-message">{errors.state}</p>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code*</label>
              <input
                type="text"
                className={`w-full px-3 py-2 border ${hasError('zipCode') ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500`}
                value={address.zipCode}
                onChange={(e) => updateAddress('zipCode', e.target.value)}
                required
              />
              {hasError('zipCode') && (
                <p className="mt-1 text-sm text-red-500 error-message">{errors.zipCode}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                value={address.country}
                onChange={(e) => updateAddress('country', e.target.value)}
                defaultValue="India"
              />
            </div>

            <>
              <div className="py-2 px-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-gray-800">Please Select Location</h2>
                </div>
              </div>

              {/* Map Container */}
              <div className="p-2">
                <div className="w-full md:h-72 h-62 rounded-lg overflow-hidden shadow-md">
                  <GoogleMapMarker />
                </div>
              </div>

              {/* Location Input Section */}
              <div className="p-4 flex-1">
                <div className="relative">
                  <Location />
                </div>
              </div>
            </>
          </motion.div>
        )}

        {activeTab === 2 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="bg-white shadow-sm p-6 rounded-lg"
          >
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Numbers*</label>
              <input
                type="text"
                className={`w-full px-3 py-2 border ${hasError('phone') ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500`}
                value={contactInfo.phones[0]}
                onChange={(e) => {
                  const newValue = e.target.value.replace(/\D/g, '').slice(0, 10); // Allow only digits and limit to 10 characters
                  const newPhones = [...contactInfo.phones];
                  newPhones[0] = newValue;
                  updateContactInfo('phones', newPhones);
                }}
                required
              />
              {hasError('phone') && (
                <p className="mt-1 text-sm text-red-500 error-message">{errors.phone}</p>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                className={`w-full px-3 py-2 border ${hasError('email') ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500`}
                value={contactInfo.email}
                onChange={(e) => updateContactInfo('email', e.target.value)}
              />
              {hasError('email') && (
                <p className="mt-1 text-sm text-red-500 error-message">{errors.email}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                value={contactInfo.website}
                onChange={(e) => updateContactInfo('website', e.target.value)}
              />
            </div>
          </motion.div>
        )}

        {activeTab === 3 && (
          <div className="bg-white shadow-sm p-6 rounded-lg">
            <div className="mb-4">
              <label className="flex items-center text-sm font-medium text-gray-700">
                <input
                  type="checkbox"
                  className="h-4 w-4 mr-2 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                  checked={deliverySettings.isDeliveryAvailable}
                  onChange={(e) => updateDeliverySettings('isDeliveryAvailable', e.target.checked)}
                />
                Delivery Available
              </label>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Delivery Radius (km)
              </label>
              <input
                type="number"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                value={deliverySettings.deliveryRadius}
                onChange={(e) => updateDeliverySettings('deliveryRadius', Number(e.target.value))}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Minimum Order Amount (₹)
              </label>
              <input
                type="number"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                value={deliverySettings.minimumOrderAmount || ''}
                onChange={(e) =>
                  updateDeliverySettings('minimumOrderAmount', Number(e.target.value))
                }
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Delivery Fee (₹)
              </label>
              <input
                type="number"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                value={deliverySettings.deliveryFee || ''}
                onChange={(e) => updateDeliverySettings('deliveryFee', Number(e.target.value))}
              />
            </div>
            <div className="mt-4">
              <label className="flex items-center text-sm font-medium text-gray-700">
                <input
                  type="checkbox"
                  className="h-4 w-4 mr-2 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                  checked={paymentOptions.acceptsCash}
                  onChange={(e) => updatePaymentOptions('acceptsCash', e.target.checked)}
                />
                Accepts Cash
              </label>
            </div>
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700">
                <input
                  type="checkbox"
                  className="h-4 w-4 mr-2 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                  checked={paymentOptions.acceptsOnlinePayment}
                  onChange={(e) => updatePaymentOptions('acceptsOnlinePayment', e.target.checked)}
                />
                Accepts Online Payment
              </label>
            </div>
          </div>
        )}

        {activeTab === 4 && (
          <div className="bg-white shadow-sm p-6 rounded-lg">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Commission Rate (%)
              </label>
              <input
                type="number"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                value={additionalSettings.commissionRate || ''}
                onChange={(e) => updateAdditionalSettings('commissionRate', Number(e.target.value))}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Packaging Charge (₹)
              </label>
              <input
                type="number"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                value={additionalSettings.packagingCharge || ''}
                onChange={(e) =>
                  updateAdditionalSettings('packagingCharge', Number(e.target.value))
                }
              />
            </div>
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700">
                <input
                  type="checkbox"
                  required
                  className="h-4 w-4 mr-2 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                  checked={additionalSettings.isActive}
                  onChange={(e) => updateAdditionalSettings('isActive', e.target.checked)}
                />
                Is Active
              </label>
            </div>
          </div>
        )}

        {activeTab === 5 && ( // Bank Details Tab
          <div className="bg-white shadow-sm p-6 rounded-lg">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Account Name</label>
              <input
                type="text"
                className={`w-full px-3 py-2 border ${hasError('accountName') ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500`}
                value={additionalSettings.bankDetails.accountName}
                onChange={(e) =>
                  updateAdditionalSettings('bankDetails', {
                    ...additionalSettings.bankDetails,
                    accountName: e.target.value,
                  })
                }
              />
              {hasError('accountName') && (
                <p className="mt-1 text-sm text-red-500 error-message">{errors.accountName}</p>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
              <input
                type="text"
                className={`w-full px-3 py-2 border ${hasError('accountNumber') ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500`}
                value={additionalSettings.bankDetails.accountNumber}
                onChange={(e) =>
                  updateAdditionalSettings('bankDetails', {
                    ...additionalSettings.bankDetails,
                    accountNumber: e.target.value,
                  })
                }
              />
              {hasError('accountNumber') && (
                <p className="mt-1 text-sm text-red-500 error-message">{errors.accountNumber}</p>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">IFSC Code</label>
              <input
                type="text"
                className={`w-full px-3 py-2 border ${hasError('ifscCode') ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500`}
                value={additionalSettings.bankDetails.ifscCode}
                onChange={(e) =>
                  updateAdditionalSettings('bankDetails', {
                    ...additionalSettings.bankDetails,
                    ifscCode: e.target.value,
                  })
                }
              />
              {hasError('ifscCode') && (
                <p className="mt-1 text-sm text-red-500 error-message">{errors.ifscCode}</p>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name</label>
              <input
                type="text"
                className={`w-full px-3 py-2 border ${hasError('bankName') ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500`}
                value={additionalSettings.bankDetails.bankName}
                onChange={(e) =>
                  updateAdditionalSettings('bankDetails', {
                    ...additionalSettings.bankDetails,
                    bankName: e.target.value,
                  })
                }
              />
              {hasError('bankName') && (
                <p className="mt-1 text-sm text-red-500 error-message">{errors.bankName}</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 6 && ( // Tax Information Tab
          <div className="bg-white shadow-sm p-6 rounded-lg">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">GSTIN</label>
              <input
                type="text"
                className={`w-full px-3 py-2 border ${hasError('gstin') ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500`}
                value={additionalSettings.taxInfo.gstin}
                onChange={(e) =>
                  updateAdditionalSettings('taxInfo', {
                    ...additionalSettings.taxInfo,
                    gstin: e.target.value,
                  })
                }
              />
              {hasError('gstin') && (
                <p className="mt-1 text-sm text-red-500 error-message">{errors.gstin}</p>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">VAT Number</label>
              <input
                type="text"
                className={`w-full px-3 py-2 border ${hasError('vatNumber') ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500`}
                value={additionalSettings.taxInfo.vatNumber}
                onChange={(e) =>
                  updateAdditionalSettings('taxInfo', {
                    ...additionalSettings.taxInfo,
                    vatNumber: e.target.value,
                  })
                }
              />
              {hasError('vatNumber') && (
                <p className="mt-1 text-sm text-red-500 error-message">{errors.vatNumber}</p>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">PAN Number</label>
              <input
                type="text"
                className={`w-full px-3 py-2 border ${hasError('panNumber') ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500`}
                value={additionalSettings.taxInfo.panNumber}
                onChange={(e) =>
                  updateAdditionalSettings('taxInfo', {
                    ...additionalSettings.taxInfo,
                    panNumber: e.target.value,
                  })
                }
              />
              {hasError('panNumber') && (
                <p className="mt-1 text-sm text-red-500 error-message">{errors.panNumber}</p>
              )}
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6">
          <button
            type="button"
            onClick={handlePrev}
            className={`px-4 cursor-pointer py-2 rounded-md ${activeTab === 0 ? 'hidden' : 'bg-white border border-gray-200 shadow-sm'}`}
          >
            Previous
          </button>
          {activeTab === tabs.length - 1 ? (
            // अंतिम टैब पर सबमिट/अपडेट बटन
            <button
              type="submit"
              className="px-4 py-2 bg-orange-600 text-white rounded-md cursor-pointer"
            >
              {isEdit ? 'Update' : 'Submit'}
            </button>
          ) : (
            // अन्य टैब पर नेक्स्ट बटन
            <button
              type="button"
              onClick={handleNext}
              className="px-4 py-2 bg-orange-600 text-white rounded-md cursor-pointer"
            >
              Next
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default AdminAddRestaurant;
