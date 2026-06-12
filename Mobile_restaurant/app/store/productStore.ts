import { create } from "zustand";
import { getProductsByRestaurant } from "../services/product";

interface ProductState {
    products: any[];
    loading: boolean;
    error: string | null;

    fetchProducts: (restaurantId: string) => Promise<void>;
    clearProducts: () => void;
}

export const useProductStore = create<ProductState>((set) => ({
    products: [],
    loading: false,
    error: null,

    fetchProducts: async (restaurantId: string) => {
        try {
            set({ loading: true, error: null });

            const res = await getProductsByRestaurant(restaurantId);

            set({
                products: res.data, // IMPORTANT: backend returns { data: [] }
                loading: false,
            });

        } catch (error: any) {
            console.log("PRODUCT STORE ERROR:", error?.response?.data || error.message);

            set({
                error: "Failed to load products",
                loading: false,
            });
        }
    },

    clearProducts: () =>
        set({
            products: [],
            loading: false,
            error: null,
        }),
}));