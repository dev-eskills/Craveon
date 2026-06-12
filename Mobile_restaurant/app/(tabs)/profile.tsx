// import {
//     View,
//     Text,
//     StyleSheet,
//     TouchableOpacity,
// } from "react-native";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { router } from "expo-router";

// export default function Profile() {
//     const logout = async () => {
//         await AsyncStorage.removeItem("token");
//         router.replace("/login");
//     };

//     return (
//         <View style={styles.container}>
//             <View style={styles.profileCard}>
//                 <Text style={styles.name}>
//                     Akshay Nagdiya
//                 </Text>

//                 <Text style={styles.role}>
//                     Administrator
//                 </Text>
//             </View>

//             <TouchableOpacity
//                 style={styles.menu}
//                 onPress={() => router.push("/settings")}
//             >
//                 <Text>⚙️ Settings</Text>
//             </TouchableOpacity>

//             <TouchableOpacity
//                 style={styles.menu}
//                 onPress={logout}
//             >
//                 <Text>🚪 Logout</Text>
//             </TouchableOpacity>
//         </View>
//     );
// }

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: "#F8FAFC",
//         padding: 16,
//     },
//     profileCard: {
//         backgroundColor: "#fff",
//         padding: 25,
//         borderRadius: 20,
//         alignItems: "center",
//         marginBottom: 20,
//     },
//     name: {
//         fontSize: 24,
//         fontWeight: "700",
//     },
//     role: {
//         color: "#6B7280",
//         marginTop: 5,
//     },
//     menu: {
//         backgroundColor: "#fff",
//         padding: 18,
//         borderRadius: 15,
//         marginBottom: 12,
//     },
// });


import { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";

import { getUserById } from "../services/user";
import { useAuthStore } from "../store/authStore";

export default function Profile() {
    const authUser = useAuthStore((state) => state.user);

    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (authUser?._id) {
            loadUser(authUser._id);
        }
    }, [authUser?._id]);
    console.log("AUTH USER:", authUser);
    useEffect(() => {

        console.log("Auth User:", authUser);

        if (authUser?._id) {
            console.log("Calling loadUser...");
            loadUser(authUser._id);
        }
    }, [authUser?._id]);

    const loadUser = async (userId: string) => {
        try {
            setLoading(true);
            setError(null);

            const data = await getUserById(userId);

            setProfile(data);
        } catch (err: any) {
            console.log("Profile Error:", err?.response?.data || err.message);
            setError("Failed to load profile");
        } finally {
            setLoading(false);
        }
    };

    // LOADING UI
    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" />
                <Text>Loading profile...</Text>
            </View>
        );
    }

    // ERROR UI
    if (error) {
        return (
            <View style={styles.center}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

    // EMPTY STATE
    if (!profile) {
        return (
            <View style={styles.center}>
                <Text>No profile data found</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>My Profile</Text>

            <View style={styles.card}>
                <Text style={styles.label}>Name</Text>
                <Text style={styles.value}>{profile.name}</Text>
            </View>

            <View style={styles.card}>
                <Text style={styles.label}>Phone</Text>
                <Text style={styles.value}>{profile.phone}</Text>
            </View>

            <View style={styles.card}>
                <Text style={styles.label}>Email</Text>
                <Text style={styles.value}>{profile.email}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#fff",
    },
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
    },
    card: {
        padding: 15,
        borderRadius: 10,
        backgroundColor: "#f5f5f5",
        marginBottom: 10,
    },
    label: {
        fontSize: 12,
        color: "#888",
    },
    value: {
        fontSize: 16,
        fontWeight: "600",
    },
    errorText: {
        color: "red",
        fontSize: 16,
    },
});