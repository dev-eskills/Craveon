import { useQuery } from "@tanstack/react-query";
import { getProductsByRestaurant } from "../services/product";

export const useProducts = (restaurantId: string) => {
    return useQuery({
        queryKey: ["products", restaurantId],
        queryFn: () => getProductsByRestaurant(restaurantId),
    });
};