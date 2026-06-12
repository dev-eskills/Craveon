import { loginUser } from "../services/auth";
import { useAuthStore } from "../store/authStore";

export const useAuth = () => {
    const setUser = useAuthStore((s) => s.setUser);
    const setToken = useAuthStore((s) => s.setToken);

    const login = async (
        number: string,
        password: string
    ) => {
        const data = await loginUser(
            number,
            password
        );

        setUser(data.user);
        setToken(data.accessToken);
        console.log("Login successful, user:", data.user);
        console.log("Login successful, user:", data.accessToken);

        return data;
    };

    return { login };
};