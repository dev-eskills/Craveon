import useRestaurantStore from '../stores/addRestaurantStore';

export default function useStoreUpdate() {
  const {
    updateField,
    updateAddress,
    updateContactInfo,
    updateDeliverySettings,
    updatePaymentOptions,
    updateAdditionalSettings,
    additionalSettings,
  } = useRestaurantStore();

  return (restaurant) => {
    if (!restaurant) return;


    // Basic fields
    updateField('name', restaurant?.name);
    updateField('description', restaurant?.description);
    updateField('foodType', restaurant?.foodType);
    updateField('cuisine', restaurant?.cuisine);
    updateField('priceRange', restaurant?.priceRange);

    // Address
    updateAddress('street', restaurant?.address?.street);
    updateAddress('city', restaurant?.address?.city);
    updateAddress('state', restaurant?.address?.state);
    updateAddress('zipCode', restaurant?.address?.zipCode);
    updateAddress('country', restaurant?.address?.country);

    // Contact Info
    updateContactInfo('phones', restaurant?.contactInfo?.phones);
    updateContactInfo('email', restaurant?.contactInfo?.email);
    updateContactInfo('website', restaurant?.contactInfo?.website);

    // Delivery Settings
    updateDeliverySettings(
      'isDeliveryAvailable',
      restaurant?.deliverySettings?.isDeliveryAvailable
    );
    updateDeliverySettings('deliveryRadius', restaurant?.deliverySettings?.deliveryRadius);
    updateDeliverySettings('minimumOrderAmount', restaurant?.deliverySettings?.minimumOrderAmount);
    updateDeliverySettings('deliveryFee', restaurant?.deliverySettings?.deliveryFee);

    // Payment Options
    updatePaymentOptions('acceptsCash', restaurant?.paymentOptions?.acceptsCash);
    updatePaymentOptions('acceptsOnlinePayment', restaurant?.paymentOptions?.acceptsOnlinePayment);

    // Additional Settings
    updateAdditionalSettings('commissionRate', restaurant?.commissionRate);
    updateAdditionalSettings('packagingCharge', restaurant?.packagingCharge);
    updateAdditionalSettings('preparationTime', restaurant?.additionalSettings?.preparationTime);

    updateAdditionalSettings('bankDetails', {
      ...additionalSettings?.bankDetails,
      accountName: restaurant?.bankDetails?.accountName,
      accountNumber: restaurant?.bankDetails?.accountNumber,
      ifscCode: restaurant?.bankDetails?.ifscCode,
      bankName: restaurant?.bankDetails?.bankName,
    });

    // Tax Info
    updateAdditionalSettings('taxInfo', {
      ...additionalSettings?.bankDetails,
      gstin: restaurant?.taxInfo?.gstin,
      vatNumber: restaurant?.taxInfo?.vatNumber,
      panNumber: restaurant?.taxInfo?.panNumber,
    });

    updateField('id', restaurant?._id);
  };
}
