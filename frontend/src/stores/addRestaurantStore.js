import { create } from 'zustand';

const useRestaurantStore = create((set) => ({
  // Basic Information
  name: '',
  description: '',
  foodType: '',
  priceRange: '',
  cuisine: [],
  password: '',
  address: {
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India',
    coordinates: {
      lat: 0,
      lng: 0,
    },
  },

  // Contact Information
  contactInfo: {
    phones: [],
    email: '',
    website: '',
  },

  // Delivery & Payment
  deliverySettings: {
    isDeliveryAvailable: false,
    deliveryRadius: '',
    minimumOrderAmount: '',
    deliveryFee: '',
    estimatedDeliveryTime: '',
    freeDeliveryThreshold: '',
  },

  paymentOptions: {
    acceptsCash: false,
    acceptsOnlinePayment: false,
    acceptsWalletPayment: false,
  },

  // Additional Settings
  additionalSettings: {
    commissionRate: '',
    packagingCharge: '',
    preparationTime: '',
    isActive: false,
    bankDetails: {
      accountName: '',
      accountNumber: '',
      ifscCode: '',
      bankName: '',
    },
    taxInfo: {
      gstin: '',
      vatNumber: '',
      panNumber: '',
    },
  },

  // Actions
  setRestaurantDetails: (details) => set(() => ({ ...details })),

  getFields: (state) => ({
    name: state.name,
    description: state.description,
    foodType: state.foodType,
    password: state.password,
    cuisine: state.cuisine,
    priceRange: state.priceRange,
    address: state.address,
    contactInfo: state.contactInfo,
    deliverySettings: state.deliverySettings,
    paymentOptions: state.paymentOptions,
    additionalSettings: state.additionalSettings,
  }),

  resetState: () =>
    set(() => ({
      name: '',
      description: '',
      foodType: '',
      cuisine: [],
      priceRange: '',
      address: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'India',
        coordinates: {
          lat: 0,
          lng: 0,
        },
      },
      contactInfo: {
        phones: [],
        email: '',
        website: '',
      },
      deliverySettings: {
        isDeliveryAvailable: false,
        deliveryRadius: '',
        minimumOrderAmount: '',
        deliveryFee: '',
        estimatedDeliveryTime: '',
        freeDeliveryThreshold: '',
      },
      paymentOptions: {
        acceptsCash: false,
        acceptsOnlinePayment: false,
        acceptsWalletPayment: false,
      },
      additionalSettings: {
        commissionRate: '',
        packagingCharge: '',
        preparationTime: '',
        isActive: false,
        bankDetails: {
          accountName: '',
          accountNumber: '',
          ifscCode: '',
          bankName: '',
        },
        taxInfo: {
          gstin: '',
          vatNumber: '',
          panNumber: '',
        },
      },
      password: '',
    })),

  updateAdditionalSettings: (field, value) =>
    set((state) => ({
      ...state,
      additionalSettings: {
        ...state.additionalSettings,
        [field]: value,
      },
    })),

  updateField: (field, value) =>
    set((state) => ({
      ...state,
      [field]: value,
    })),

  updateAddress: (field, value) =>
    set((state) => ({
      ...state,
      address: { ...state.address, [field]: value },
    })),

  updateContactInfo: (field, value) =>
    set((state) => ({
      ...state,
      contactInfo: { ...state.contactInfo, [field]: value },
    })),

  updateDeliverySettings: (field, value) =>
    set((state) => ({
      ...state,
      deliverySettings: { ...state.deliverySettings, [field]: value },
    })),

  updatePaymentOptions: (field, value) =>
    set((state) => ({
      ...state,
      paymentOptions: { ...state.paymentOptions, [field]: value },
    })),
}));

export default useRestaurantStore;
