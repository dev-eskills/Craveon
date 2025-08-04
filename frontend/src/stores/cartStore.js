import { create } from 'zustand';

export const useCartStore = create((set) => ({
  selectedDelAddress: null,
  paymentMode: 'ONLINE',
  orderSuccess: false,
  cartStep: 1,
  setCartStep: (step) => set({ cartStep: step }),
  setOrderSuccess: (success) => set({ orderSuccess: success }),
  setSelectedDelAddress: (address) => set({ selectedDelAddress: address }),
  setPaymentMode: (mode) => set({ paymentMode: mode }),
}));
