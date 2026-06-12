import { View, Text, StyleSheet } from "react-native";

export default function Reports() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>
                Reports
            </Text>

            <View style={styles.card}>
                <Text>Today's Sales</Text>
                <Text style={styles.value}>
                    ₹15,000
                </Text>
            </View>

            <View style={styles.card}>
                <Text>Monthly Sales</Text>
                <Text style={styles.value}>
                    ₹3,20,000
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F8FAFC",
        padding: 16,
    },
    title: {
        fontSize: 28,
        fontWeight: "700",
        marginBottom: 20,
    },
    card: {
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 15,
        marginBottom: 15,
    },
    value: {
        fontSize: 24,
        fontWeight: "700",
        marginTop: 10,
    },
});