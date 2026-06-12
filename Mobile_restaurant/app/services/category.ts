import {
    CategoryResponse,
    SingleCategoryResponse,
    CreateCategoryDto,
    UpdateCategoryDto,
} from "@/types/category.types";
import { api } from "./api";

export const categoryService = {
    getAll: async (): Promise<CategoryResponse> => {
        const { data } = await api.get("/user/category/all");
        return data;
    },

    getById: async (
        id: string
    ): Promise<SingleCategoryResponse> => {
        const { data } = await api.get(`/categories/${id}`);
        return data;
    },

    create: async (
        payload: CreateCategoryDto
    ): Promise<SingleCategoryResponse> => {
        const { data } = await api.post("/categories", payload);
        return data;
    },

    update: async (
        id: string,
        payload: UpdateCategoryDto
    ): Promise<SingleCategoryResponse> => {
        const { data } = await api.put(`/categories/${id}`, payload);
        return data;
    },

    remove: async (id: string): Promise<void> => {
        await api.delete(`/categories/${id}`);
    },
};