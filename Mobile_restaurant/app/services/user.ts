import { api } from "./api";

export const getUserById = async (userId: string) => {
    try {
        const response = await api.get(`/user/${userId}`);

        console.log("Get User Response:", response.data);

        return response.data;
    } catch (error: any) {
        console.log("Get User Error:", error?.response?.data);
        throw error;
    }
};