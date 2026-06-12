import { useEffect, useState } from "react";
import { Redirect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ActivityIndicator, View } from "react-native";
import QueryProvider from "@/providers/QueryProvider";

export default function Index() {
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        const checkLogin = async () => {
            const savedToken = await AsyncStorage.getItem("token");
            setToken(savedToken);
            setLoading(false);
        };

        checkLogin();
    }, []);

    if (loading) {
        return (
            <View
                style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <QueryProvider>
            <Redirect
                href={token ? "/(tabs)/dashboard" : "/login"}
            />
        </QueryProvider>
    );
}