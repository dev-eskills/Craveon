import { api } from "./api";

export const loginUser = async (
    number: string,
    password: string
) => {
    const response = await api.post("/auth/login", {
        number,
        password,
    });
    console.log(response.data);
    return response.data;
};