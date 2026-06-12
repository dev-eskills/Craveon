import { api } from "./api";
import { useAuthStore } from "../store/authStore";


export const getProductsByRestaurant = async (
    restaurantId: string
) => {

    try {

        const response = await api.get(
            `/restaurant/product/${restaurantId}`
        );

        console.log(
            "PRODUCT RESPONSE:",
            response.data
        );

        return response.data;

    } catch (error: any) {

        console.log(
            "PRODUCT ERROR:",
            error?.response?.data ||
            error.message
        );

        throw error;
    }
};



// CREATE PRODUCT

export const createProduct = async (
    formData: FormData
) => {

    try {

        const token =
            useAuthStore.getState().token;


        if (!token) {
            throw new Error(
                "Token missing"
            );
        }


        const response =
            await api.post(
                "/restaurant/product",
                formData,
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`,

                        "Content-Type":
                            "multipart/form-data",
                    }
                }
            );


        return response.data;


    } catch (error: any) {

        console.log(
            "CREATE PRODUCT ERROR:",
            error?.response?.data ||
            error.message
        );

        throw error;
    }
};