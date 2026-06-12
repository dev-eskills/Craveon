import QueryProvider from "@/providers/QueryProvider";
import { Stack } from "expo-router";

export default function RootLayout() {
    return (
        <QueryProvider>
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="login" />
                <Stack.Screen name="(tabs)" />
                <Stack.Screen name="add-product" />
                <Stack.Screen name="reports" />
                <Stack.Screen name="settings" />
            </Stack>
        </QueryProvider>
    );
}