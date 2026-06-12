import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
} from "react-native";

import { useState } from "react";
import { router } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { useAuth } from "./hooks/useAuth";

export default function Login() {
    const [number, setNumber] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);

    const { login } = useAuth();


    const handleLogin = async () => {
        try {
            setLoading(true);

            await login(number, password);

            router.replace("/(tabs)/dashboard");
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.top}>
                <Text style={styles.title}>
                    Welcome Back 👋
                </Text>

                <Text style={styles.subtitle}>
                    Login to continue
                </Text>
            </View>

            <View style={styles.form}>
                <Text style={styles.label}>
                    Phone Number
                </Text>

                <View style={styles.inputBox}>
                    <MaterialIcons
                        name="phone"
                        size={22}
                        color="#777"
                    />

                    <TextInput
                        placeholder="Enter phone number"
                        keyboardType="phone-pad"
                        value={number}
                        onChangeText={setNumber}
                        style={styles.input}
                    />
                </View>

                <Text style={styles.label}>
                    Password
                </Text>

                <View style={styles.inputBox}>
                    <MaterialIcons
                        name="lock"
                        size={22}
                        color="#777"
                    />

                    <TextInput
                        placeholder="Enter password"
                        secureTextEntry
                        value={password}
                        onChangeText={setPassword}
                        style={styles.input}
                    />
                </View>

                <TouchableOpacity
                    style={styles.loginBtn}
                    onPress={handleLogin}
                    disabled={loading}
                >
                    <Text style={styles.loginText}>
                        {loading ? "Logging in..." : "Login"}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity>
                    <Text style={styles.forgot}>
                        Forgot Password?
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F8FAFC",
        padding: 24,
        justifyContent: "center",
    },

    top: {
        marginBottom: 40,
    },

    title: {
        fontSize: 32,
        fontWeight: "700",
        color: "#111827",
    },

    subtitle: {
        marginTop: 8,
        color: "#6B7280",
        fontSize: 16,
    },

    form: {
        gap: 14,
    },

    label: {
        fontWeight: "600",
    },

    inputBox: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        height: 60,
        borderRadius: 16,
        paddingHorizontal: 16,
        borderWidth: 1,
        borderColor: "#E5E7EB",
    },

    input: {
        flex: 1,
        marginLeft: 10,
        fontSize: 16,
    },

    loginBtn: {
        marginTop: 16,
        height: 58,
        backgroundColor: "#F8B688",
        borderRadius: 16,
        justifyContent: "center",
        alignItems: "center",
    },

    loginText: {
        color: "#fff",
        fontWeight: "700",
        fontSize: 18,
    },

    forgot: {
        textAlign: "center",
        marginTop: 18,
        color: "#2563EB",
    },
});