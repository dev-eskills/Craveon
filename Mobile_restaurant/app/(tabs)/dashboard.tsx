import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useAuthStore } from "../store/authStore";
export default function DashboardScreen() {
    const user = useAuthStore((state) => state.user);


    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                    <Text style={styles.greeting}>👋 Good Morning</Text>
                    <Text style={styles.name}>{user?.name}</Text>
                </View>

                <View style={styles.grid}>
                    <View style={styles.card}>
                        <MaterialIcons name="payments" size={28} color="#2563EB" />
                        <Text style={styles.value}>₹25,000</Text>
                        <Text style={styles.label}>Sales</Text>
                    </View>

                    <View style={styles.card}>
                        <MaterialIcons name="shopping-bag" size={28} color="#2563EB" />
                        <Text style={styles.value}>150</Text>
                        <Text style={styles.label}>Orders</Text>
                    </View>

                    <View style={styles.card}>
                        <MaterialIcons name="inventory" size={28} color="#2563EB" />
                        <Text style={styles.value}>450</Text>
                        <Text style={styles.label}>Products</Text>
                    </View>

                    <View style={styles.card}>
                        <MaterialIcons name="warning" size={28} color="#EF4444" />
                        <Text style={styles.value}>12</Text>
                        <Text style={styles.label}>Low Stock</Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Recent Orders</Text>

                    <View style={styles.orderCard}>
                        <Text>#1001</Text>
                        <Text style={styles.delivered}>Delivered</Text>
                    </View>

                    <View style={styles.orderCard}>
                        <Text>#1002</Text>
                        <Text style={styles.pending}>Pending</Text>
                    </View>

                    <View style={styles.orderCard}>
                        <Text>#1003</Text>
                        <Text style={styles.processing}>Processing</Text>
                    </View>
                </View>

                <TouchableOpacity
                    style={styles.reportBtn}
                    onPress={() => router.push("/reports")}
                >
                    <Text style={styles.reportText}>View Reports</Text>
                </TouchableOpacity>
            </ScrollView>

            <TouchableOpacity
                style={styles.fab}
                onPress={() => router.push("/add-product")}
            >
                <MaterialIcons name="add" size={30} color="#FFF" />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F8FAFC",
    },

    header: {
        padding: 20,
        paddingTop: 60,
    },

    greeting: {
        color: "#64748B",
        fontSize: 16,
    },

    name: {
        fontSize: 28,
        fontWeight: "700",
        marginTop: 4,
    },

    grid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        paddingHorizontal: 20,
    },

    card: {
        width: "48%",
        backgroundColor: "#FFF",
        borderRadius: 16,
        padding: 18,
        marginBottom: 14,
    },

    value: {
        fontSize: 22,
        fontWeight: "700",
        marginTop: 10,
    },

    label: {
        color: "#64748B",
        marginTop: 4,
    },

    section: {
        padding: 20,
    },

    sectionTitle: {
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 12,
    },

    orderCard: {
        backgroundColor: "#FFF",
        borderRadius: 12,
        padding: 16,
        marginBottom: 10,
        flexDirection: "row",
        justifyContent: "space-between",
    },

    delivered: {
        color: "#22C55E",
        fontWeight: "600",
    },

    pending: {
        color: "#F59E0B",
        fontWeight: "600",
    },

    processing: {
        color: "#3B82F6",
        fontWeight: "600",
    },

    reportBtn: {
        marginHorizontal: 20,
        marginBottom: 100,
        backgroundColor: "#2563EB",
        height: 55,
        borderRadius: 14,
        justifyContent: "center",
        alignItems: "center",
    },

    reportText: {
        color: "#FFF",
        fontWeight: "600",
        fontSize: 16,
    },

    fab: {
        position: "absolute",
        right: 20,
        bottom: 25,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: "#2563EB",
        justifyContent: "center",
        alignItems: "center",
        elevation: 5,
    },
});