import { View, Text, FlatList, StyleSheet } from "react-native";

const orders = [
    {
        id: "1",
        customer: "Rahul Sharma",
        amount: "₹1200",
        status: "Delivered",
    },
    {
        id: "2",
        customer: "Aman Verma",
        amount: "₹850",
        status: "Pending",
    },
];

export default function Orders() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Orders</Text>

            <FlatList
                data={orders}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <Text style={styles.name}>
                            {item.customer}
                        </Text>
                        <Text>{item.amount}</Text>
                        <Text style={styles.status}>
                            {item.status}
                        </Text>
                    </View>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: "#F8FAFC" },
    title: { fontSize: 28, fontWeight: "700", marginBottom: 20 },
    card: {
        backgroundColor: "#fff",
        padding: 16,
        borderRadius: 15,
        marginBottom: 12,
    },
    name: { fontWeight: "700", fontSize: 16 },
    status: { color: "green", marginTop: 5 },
});