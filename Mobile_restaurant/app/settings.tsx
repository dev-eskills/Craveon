import { View, Text, Switch, StyleSheet } from "react-native";
import { useState } from "react";

export default function Settings() {
    const [darkMode, setDarkMode] = useState(false);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>
                Settings
            </Text>

            <View style={styles.row}>
                <Text>Dark Mode</Text>

                <Switch
                    value={darkMode}
                    onValueChange={setDarkMode}
                />
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
    row: {
        backgroundColor: "#fff",
        padding: 18,
        borderRadius: 15,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
});