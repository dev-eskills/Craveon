import { create } from "zustand";
import {
    Category
} from "@/types/category.types";

interface CategoryStore {
    selectedCategory: Category | null;
    search: string;

    setSelectedCategory: (category: Category | null) => void;
    setSearch: (value: string) => void;
    reset: () => void;
}

export const useCategoryStore = create<CategoryStore>((set) => ({
    selectedCategory: null,
    search: "",

    setSelectedCategory: (category) =>
        set({ selectedCategory: category }),

    setSearch: (value) =>
        set({ search: value }),

    reset: () =>
        set({
            selectedCategory: null,
            search: "",
        }),
}));