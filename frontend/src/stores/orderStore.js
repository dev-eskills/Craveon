import { create } from 'zustand';

export const useOrderStore = create((set) => ({
  assignedOrder: null,
  setAssignedOrder: (order) => set({ assignedOrder: order }),
  clearAssignedOrder: () => set({ assignedOrder: null }),
}));
