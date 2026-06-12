import {
    useQuery,
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";

import { categoryService } from "@/app/services/category";
import {
    CreateCategoryDto,
    UpdateCategoryDto,
} from "@/types/category.types";

export const useCategories = () => {
    return useQuery({
        queryKey: ["categories"],
        queryFn: categoryService.getAll,

        // cache for 5 minutes
        staleTime: 5 * 60 * 1000,

        // keep in cache for 30 minutes after last use
        gcTime: 30 * 60 * 1000,

        // automatically refetch when window gets focus
        refetchOnWindowFocus: true,

        // refetch when network reconnects
        refetchOnReconnect: true,
    });
};

export const useCategory = (id: string) => {
    return useQuery({
        queryKey: ["category", id],
        queryFn: () => categoryService.getById(id),
        enabled: !!id,
    });
};

export const useCreateCategory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: categoryService.create,

        onSuccess: (newCategory) => {
            queryClient.setQueryData(
                ["categories"],
                (oldData: any) => {
                    if (!oldData) return [newCategory];

                    return [...oldData, newCategory];
                }
            );

            // optional safety refetch
            queryClient.invalidateQueries({
                queryKey: ["categories"],
            });
        },
    });
};

export const useUpdateCategory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            id,
            payload,
        }: {
            id: string;
            payload: UpdateCategoryDto;
        }) => categoryService.update(id, payload),

        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: ["categories"],
            });

            queryClient.invalidateQueries({
                queryKey: ["category", variables.id],
            });
        },
    });
};

export const useDeleteCategory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) =>
            categoryService.remove(id),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["categories"],
            });
        },
    });
};