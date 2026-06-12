import { create } from "zustand";

interface AuthState {
    token: string | null;
    user: any;
    setUser: (user: any) => void;
    setToken: (token: string) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    token: null,
    user: null,

    setUser: (user) => set({ user }),

    setToken: (token) => set({ token }),
    logout: () =>
        set({
            token: null,
            user: null,
        }),
}));