export interface Category {
    _id: string;
    name: string;
    description?: string;
    image?: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateCategoryDto {
    name: string;
    description?: string;
    image?: string;
}

export interface UpdateCategoryDto {
    name?: string;
    description?: string;
    image?: string;
}

export interface CategoryResponse {
    success: boolean;
    data: Category[];
}

export interface SingleCategoryResponse {
    success: boolean;
    data: Category;
}